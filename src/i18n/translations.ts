export type Locale = "th" | "en";

export const LOCALES: Locale[] = ["th", "en"];
export const DEFAULT_LOCALE: Locale = "th";

export interface SuggestedPrompt {
  id: string;
  label: { th: string; en: string };
  prompt: string; // The actual prompt sent to the model (English works best)
  emoji: string;
}

// Curated prompts focused on stress relief / relaxing soundscapes.
export const SUGGESTED_PROMPTS: SuggestedPrompt[] = [
  {
    id: "calm-piano",
    emoji: "🎹",
    label: { th: "เปียโนผ่อนคลาย", en: "Calm Piano" },
    prompt:
      "soft calming solo piano, slow tempo, gentle and warm, ambient reverb, for deep relaxation and stress relief",
  },
  {
    id: "ocean-ambient",
    emoji: "🌊",
    label: { th: "คลื่นทะเลสงบ", en: "Ocean Ambient" },
    prompt:
      "peaceful ambient pad with soft ocean waves, dreamy and spacious, meditative, healing soundscape",
  },
  {
    id: "rain-lofi",
    emoji: "🌧️",
    label: { th: "สายฝนโลไฟ", en: "Rainy Lo-fi" },
    prompt:
      "relaxing lo-fi music with gentle rain, mellow warm chords, slow beat, cozy and soothing for sleep",
  },
  {
    id: "forest-meditation",
    emoji: "🌲",
    label: { th: "สมาธิในป่า", en: "Forest Meditation" },
    prompt:
      "serene meditation music with soft flute and nature ambience, tranquil, slow and breathing, mindfulness",
  },
  {
    id: "tibetan-bowls",
    emoji: "🔔",
    label: { th: "ระฆังบำบัด", en: "Healing Bowls" },
    prompt:
      "tibetan singing bowls and gentle drones, deep healing resonance, slow meditative ambient, stress relief",
  },
  {
    id: "warm-strings",
    emoji: "🎻",
    label: { th: "เครื่องสายอบอุ่น", en: "Warm Strings" },
    prompt:
      "warm soft ambient strings, cinematic and emotional, slow and peaceful, calming therapeutic atmosphere",
  },
];

type Dict = Record<string, { th: string; en: string }>;

export const T: Dict = {
  appName: { th: "YouSound", en: "YouSound" },
  tagline: {
    th: "สร้างเสียงบำบัดความเครียดด้วย AI ในเบราว์เซอร์ของคุณ",
    en: "Generate calming therapeutic sound with AI, right in your browser",
  },
  promptLabel: { th: "อธิบายเสียงที่คุณต้องการ", en: "Describe the sound you want" },
  promptPlaceholder: {
    th: "เช่น เปียโนนุ่มนวลพร้อมเสียงฝนเบา ๆ สำหรับผ่อนคลาย",
    en: "e.g. soft piano with gentle rain for relaxation",
  },
  suggestionsTitle: { th: "พรอมต์แนะนำ", en: "Suggested prompts" },
  generate: { th: "สร้างเสียง", en: "Generate" },
  generating: { th: "กำลังสร้างเสียง...", en: "Generating..." },
  loadingModel: { th: "กำลังโหลดโมเดล", en: "Loading model" },
  preparing: { th: "กำลังเตรียมระบบ...", en: "Preparing..." },
  modelReady: { th: "โมเดลพร้อมใช้งาน", en: "Model ready" },
  toneTitle: { th: "ปรับโทนเสียง", en: "Sound tone" },
  toneSoft: { th: "นุ่มนวล", en: "Soft" },
  toneBright: { th: "สดใส", en: "Bright" },
  toneHint: {
    th: "หมุนเพื่อปรับความชัดเจนของโทนเสียงตามพรอมต์",
    en: "Turn to adjust how strongly the sound follows your prompt",
  },
  durationTitle: { th: "ความยาว", en: "Duration" },
  seconds: { th: "วินาที", en: "sec" },
  download: { th: "ดาวน์โหลด", en: "Download" },
  result: { th: "เสียงที่สร้างได้", en: "Generated sound" },
  noResult: {
    th: "ยังไม่มีเสียง ลองพิมพ์พรอมต์แล้วกดสร้างเสียง",
    en: "No sound yet. Write a prompt and press Generate.",
  },
  backendWebgpu: { th: "กำลังใช้ WebGPU", en: "Using WebGPU" },
  backendWasm: { th: "กำลังใช้ CPU (WASM)", en: "Using CPU (WASM)" },
  webgpuUnsupported: {
    th: "เบราว์เซอร์นี้ไม่รองรับ WebGPU จะใช้ CPU แทน (ช้ากว่า)",
    en: "WebGPU is not supported here. Falling back to CPU (slower).",
  },
  errorTitle: { th: "เกิดข้อผิดพลาด", en: "Something went wrong" },
  retry: { th: "ลองใหม่", en: "Retry" },
  langLabel: { th: "ภาษา", en: "Language" },
  footer: {
    th: "ทำงานบนเครื่องของคุณทั้งหมด ไม่มีการส่งข้อมูลออกไปที่เซิร์ฟเวอร์",
    en: "Runs fully on your device. Nothing is sent to a server.",
  },
  firstLoadNote: {
    th: "ครั้งแรกจะดาวน์โหลดโมเดล (~150MB) และจะถูกแคชไว้ใช้ครั้งต่อไป",
    en: "First run downloads the model (~150MB) and caches it for next time.",
  },
  installApp: { th: "ติดตั้งแอป", en: "Install app" },
  emptyPromptHint: {
    th: "กรุณาพิมพ์พรอมต์ หรือเลือกพรอมต์แนะนำก่อนสร้างเสียง",
    en: "Type a prompt or pick a suggestion before generating.",
  },
};
