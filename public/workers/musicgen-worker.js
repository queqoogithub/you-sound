// Module worker that runs MusicGen (Xenova/musicgen-small) with transformers.js.
// transformers.js is self-hosted from /public/transformers (copied from
// node_modules at build time) so it loads from the same origin — no CDN, works
// offline, and avoids the app bundler mishandling the onnxruntime ESM.
//
// We use the MusicGen model API directly (tokenizer + generate) rather than the
// generic "text-to-audio" pipeline: that pipeline routes MusicGen through the
// SpeechT5 spectrogram path, which incorrectly requires speaker embeddings.
import {
  AutoTokenizer,
  MusicgenForConditionalGeneration,
  RawAudio,
  env,
} from "/transformers/transformers.js";

// Load onnxruntime-web's wasm binary from our own origin too.
env.backends.onnx.wasm.wasmPaths = "/transformers/";

// Always fetch model files from the Hugging Face hub and cache them in the
// browser's Cache Storage for subsequent runs / offline use.
env.allowLocalModels = false;
env.useBrowserCache = true;

const MODEL_ID = "Xenova/musicgen-small";
// MusicGen produces audio tokens at ~50 Hz; used to map seconds -> tokens.
const TOKENS_PER_SECOND = 50;
// MusicGen-small output sample rate.
const DEFAULT_SAMPLE_RATE = 32000;

let tokenizer = null;
let model = null;
let backend = "wasm";
const fileProgress = new Map();

function postOverallProgress() {
  let loaded = 0;
  let total = 0;
  for (const f of fileProgress.values()) {
    loaded += f.loaded;
    total += f.total;
  }
  const progress = total > 0 ? Math.min(100, (loaded / total) * 100) : 0;
  self.postMessage({ type: "progress", progress });
}

async function hasWebGPU() {
  try {
    if (!navigator.gpu) return false;
    const adapter = await navigator.gpu.requestAdapter();
    return !!adapter;
  } catch {
    return false;
  }
}

function makeProgressCallback() {
  return (data) => {
    if (data.status === "progress" && data.file) {
      fileProgress.set(data.file, {
        loaded: data.loaded ?? 0,
        total: data.total ?? 0,
      });
      postOverallProgress();
    } else if (data.status === "done" && data.file) {
      const f = fileProgress.get(data.file);
      if (f) f.loaded = f.total;
      postOverallProgress();
    }
  };
}

async function loadModel() {
  if (model && tokenizer) {
    self.postMessage({ type: "ready", backend });
    return;
  }

  const progress_callback = makeProgressCallback();

  if (!tokenizer) {
    tokenizer = await AutoTokenizer.from_pretrained(MODEL_ID, {
      progress_callback,
    });
  }

  const webgpu = await hasWebGPU();
  if (!webgpu) {
    self.postMessage({ type: "webgpu-unsupported" });
  }

  // NOTE on backends: MusicGen's autoregressive decoder produces incorrect
  // tokens when run on WebGPU via onnxruntime-web (the result is a constant
  // tone / buzz rather than music). EnCodec decode is also broken on WebGPU.
  // The only configuration that yields correct audio in-browser today is the
  // WASM (CPU) path with quantized decoder weights — this matches the official
  // transformers.js MusicGen web demo. We therefore generate on WASM.
  //
  // `ALLOW_WEBGPU` is kept as an experimental escape hatch; leave it off for
  // correct output.
  const ALLOW_WEBGPU = false;

  if (ALLOW_WEBGPU && webgpu) {
    try {
      model = await MusicgenForConditionalGeneration.from_pretrained(MODEL_ID, {
        device: {
          text_encoder: "wasm",
          decoder_model_merged: "webgpu",
          encodec_decode: "wasm",
        },
        dtype: {
          text_encoder: "q8",
          decoder_model_merged: "fp32",
          encodec_decode: "fp32",
        },
        progress_callback,
      });
      backend = "webgpu";
    } catch (err) {
      console.warn("WebGPU load failed, falling back to WASM:", err);
      model = null;
      fileProgress.clear();
    }
  }

  if (!model) {
    model = await MusicgenForConditionalGeneration.from_pretrained(MODEL_ID, {
      device: "wasm",
      // Quantized decoder keeps the CPU path responsive; EnCodec stays fp32 so
      // the decoded waveform is correct.
      dtype: {
        text_encoder: "q8",
        decoder_model_merged: "q8",
        encodec_decode: "fp32",
      },
      progress_callback,
    });
    backend = "wasm";
  }

  self.postMessage({ type: "progress", progress: 100 });
  self.postMessage({ type: "ready", backend });
}

function getSampleRate() {
  return (
    model?.config?.audio_encoder?.sampling_rate ??
    model?.generation_config?.sampling_rate ??
    DEFAULT_SAMPLE_RATE
  );
}

async function generate({ prompt, guidanceScale, durationSec }) {
  if (!model || !tokenizer) {
    await loadModel();
  }
  if (!model || !tokenizer) throw new Error("Model failed to load");

  self.postMessage({ type: "generating" });

  const maxNewTokens = Math.max(64, Math.round(durationSec * TOKENS_PER_SECOND));
  const inputs = tokenizer(prompt);

  const audioValues = await model.generate({
    ...inputs,
    max_new_tokens: maxNewTokens,
    do_sample: true,
    guidance_scale: guidanceScale,
    temperature: 1.0,
  });

  // Encode to a WAV blob using transformers.js' own RawAudio helper so the
  // output exactly matches the reference implementation.
  const sampleRate = getSampleRate();
  const rawAudio = new RawAudio(audioValues.data, sampleRate);
  const blob = rawAudio.toBlob();

  self.postMessage({
    type: "result",
    blob,
    samplingRate: sampleRate,
  });
}

self.addEventListener("message", async (event) => {
  const { type } = event.data ?? {};
  try {
    if (type === "load") {
      await loadModel();
    } else if (type === "generate") {
      await generate(event.data);
    }
  } catch (err) {
    self.postMessage({
      type: "error",
      message: err instanceof Error ? err.message : String(err),
    });
  }
});
