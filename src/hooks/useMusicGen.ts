"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type GenStatus =
  | "idle"
  | "loading"
  | "ready"
  | "generating"
  | "error";

export type Backend = "webgpu" | "wasm" | null;

export interface GenerateOptions {
  prompt: string;
  guidanceScale: number;
  durationSec: number;
}

export interface MusicGenState {
  status: GenStatus;
  progress: number; // 0..100 download progress
  backend: Backend;
  webgpuSupported: boolean;
  error: string | null;
  audioUrl: string | null;
  load: () => void;
  generate: (opts: GenerateOptions) => void;
}

export function useMusicGen(): MusicGenState {
  const workerRef = useRef<Worker | null>(null);
  const audioUrlRef = useRef<string | null>(null);

  const [status, setStatus] = useState<GenStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [backend, setBackend] = useState<Backend>(null);
  const [webgpuSupported, setWebgpuSupported] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  useEffect(() => {
    const worker = new Worker("/workers/musicgen-worker.js", {
      type: "module",
    });
    workerRef.current = worker;

    worker.addEventListener("message", (event: MessageEvent) => {
      const data = event.data;
      switch (data.type) {
        case "progress":
          setProgress(data.progress);
          break;
        case "ready":
          setBackend(data.backend);
          setStatus("ready");
          break;
        case "webgpu-unsupported":
          setWebgpuSupported(false);
          break;
        case "generating":
          setStatus("generating");
          break;
        case "result": {
          const blob = data.blob as Blob;
          if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current);
          const url = URL.createObjectURL(blob);
          audioUrlRef.current = url;
          setAudioUrl(url);
          setStatus("ready");
          break;
        }
        case "error":
          setError(data.message);
          setStatus("error");
          break;
      }
    });

    // Surface worker script / module-load failures that would otherwise be
    // completely silent (e.g. the worker bundle failing to parse or import).
    worker.addEventListener("error", (event: ErrorEvent) => {
      setError(
        event.message ||
          "ไม่สามารถเริ่มต้นตัวประมวลผลเสียงได้ / Failed to start the audio engine",
      );
      setStatus("error");
    });
    worker.addEventListener("messageerror", () => {
      setError("การสื่อสารกับตัวประมวลผลผิดพลาด / Worker message error");
      setStatus("error");
    });

    return () => {
      worker.terminate();
      if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current);
    };
  }, []);

  const load = useCallback(() => {
    if (status !== "idle" && status !== "error") return;
    setError(null);
    setStatus("loading");
    setProgress(0);
    workerRef.current?.postMessage({ type: "load" });
  }, [status]);

  const generate = useCallback((opts: GenerateOptions) => {
    setError(null);
    if (status === "idle" || status === "error") {
      setStatus("loading");
      setProgress(0);
    }
    workerRef.current?.postMessage({ type: "generate", ...opts });
  }, [status]);

  return {
    status,
    progress,
    backend,
    webgpuSupported,
    error,
    audioUrl,
    load,
    generate,
  };
}
