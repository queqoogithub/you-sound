"use client";

import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/i18n/I18nProvider";
import { useMusicGen } from "@/hooks/useMusicGen";
import Knob from "@/components/Knob";
import ProgressBar from "@/components/ProgressBar";
import LanguageToggle from "@/components/LanguageToggle";
import SuggestedPrompts from "@/components/SuggestedPrompts";

// Tone knob range maps to guidance_scale (prompt adherence / character).
const TONE_MIN = 1.5;
const TONE_MAX = 6;

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function Home() {
  const { t } = useI18n();
  const {
    status,
    progress,
    backend,
    webgpuSupported,
    error,
    audioUrl,
    generate,
  } = useMusicGen();

  const [prompt, setPrompt] = useState("");
  const [tone, setTone] = useState(3);
  const [duration, setDuration] = useState(8);
  const [showPromptHint, setShowPromptHint] = useState(false);
  const [installEvent, setInstallEvent] =
    useState<BeforeInstallPromptEvent | null>(null);
  const promptRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallEvent(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const isBusy = status === "loading" || status === "generating";

  const handleGenerate = () => {
    if (isBusy) return;
    if (prompt.trim().length === 0) {
      setShowPromptHint(true);
      promptRef.current?.focus();
      return;
    }
    setShowPromptHint(false);
    generate({
      prompt: prompt.trim(),
      guidanceScale: tone,
      durationSec: duration,
    });
  };

  const handleInstall = async () => {
    if (!installEvent) return;
    await installEvent.prompt();
    await installEvent.userChoice;
    setInstallEvent(null);
  };

  return (
    <main className="mx-auto max-w-3xl px-5 py-8 sm:py-12">
      {/* Header */}
      <header className="mb-8 flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-sand-400 to-sand-600 text-xl shadow-soft"
              aria-hidden
            >
              🎵
            </span>
            <h1 className="text-2xl font-bold text-ink-900">{t("appName")}</h1>
          </div>
          <p className="mt-2 text-sm text-ink-500 max-w-md">{t("tagline")}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <LanguageToggle />
          {installEvent && (
            <button
              type="button"
              onClick={handleInstall}
              className="rounded-full border border-sand-400 px-3 py-1 text-xs font-medium text-ink-700 hover:bg-cream-200"
            >
              ⬇ {t("installApp")}
            </button>
          )}
        </div>
      </header>

      {/* Main card */}
      <section className="rounded-3xl border border-cream-300 bg-cream-50/80 p-5 shadow-soft backdrop-blur-sm sm:p-7">
        {/* Prompt */}
        <label
          htmlFor="prompt"
          className="block text-sm font-semibold text-ink-700"
        >
          {t("promptLabel")}
        </label>
        <textarea
          id="prompt"
          ref={promptRef}
          value={prompt}
          onChange={(e) => {
            setPrompt(e.target.value);
            if (showPromptHint && e.target.value.trim().length > 0) {
              setShowPromptHint(false);
            }
          }}
          placeholder={t("promptPlaceholder")}
          rows={3}
          className="mt-2 w-full resize-none rounded-2xl border border-cream-300 bg-white/80 p-3.5 text-ink-900 placeholder:text-ink-500/60 outline-none transition focus:border-sand-400 focus:ring-4 focus:ring-sand-400/20"
        />

        <div className="mt-4">
          <SuggestedPrompts onSelect={setPrompt} disabled={isBusy} />
        </div>

        {/* Controls */}
        <div className="mt-7 flex flex-col items-center gap-8 sm:flex-row sm:items-center sm:justify-around">
          <div className="flex flex-col items-center gap-1">
            <Knob
              value={tone}
              min={TONE_MIN}
              max={TONE_MAX}
              step={0.1}
              onChange={setTone}
              disabled={isBusy}
              ariaLabel={t("toneTitle")}
            />
            <span className="text-sm font-semibold text-ink-700">
              {t("toneTitle")}
            </span>
            <div className="flex w-40 justify-between text-xs text-ink-500">
              <span>{t("toneSoft")}</span>
              <span>{t("toneBright")}</span>
            </div>
          </div>

          <div className="flex w-full max-w-xs flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-ink-700">
                {t("durationTitle")}
              </span>
              <span className="text-sm font-semibold text-ink-900 tabular-nums">
                {duration} {t("seconds")}
              </span>
            </div>
            <input
              type="range"
              min={5}
              max={20}
              step={1}
              value={duration}
              disabled={isBusy}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full"
            />
            <p className="text-xs text-ink-500">{t("toneHint")}</p>
          </div>
        </div>

        {/* Generate button */}
        <button
          type="button"
          onClick={handleGenerate}
          disabled={isBusy}
          aria-disabled={isBusy}
          className="mt-7 w-full rounded-2xl bg-gradient-to-r from-sand-500 to-sand-600 py-3.5 text-base font-semibold text-white shadow-soft transition hover:brightness-105 active:brightness-95 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {status === "generating"
            ? t("generating")
            : status === "loading"
              ? t("loadingModel")
              : t("generate")}
        </button>

        {showPromptHint && (
          <p className="mt-2 text-center text-sm text-amber-700">
            {t("emptyPromptHint")}
          </p>
        )}

        {/* Status / progress */}
        <div className="mt-5 space-y-3">
          {status === "loading" && (
            <div className="rounded-2xl border border-cream-300 bg-white/60 p-4">
              <ProgressBar progress={progress} label={t("loadingModel")} />
              <p className="mt-2 text-xs text-ink-500">{t("firstLoadNote")}</p>
            </div>
          )}

          {status === "generating" && (
            <div className="flex items-center gap-3 rounded-2xl border border-cream-300 bg-white/60 p-4">
              <span className="h-3 w-3 animate-pulse-soft rounded-full bg-sand-500" />
              <span className="text-sm text-ink-700">{t("generating")}</span>
            </div>
          )}

          {!webgpuSupported && status !== "idle" && (
            <p className="text-xs text-ink-500">{t("webgpuUnsupported")}</p>
          )}

          {backend && (status === "ready" || status === "generating") && (
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                backend === "webgpu"
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-amber-50 text-amber-700"
              }`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-current" />
              {backend === "webgpu" ? t("backendWebgpu") : t("backendWasm")}
            </span>
          )}

          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
              <p className="text-sm font-semibold text-red-700">
                {t("errorTitle")}
              </p>
              <p className="mt-1 text-xs text-red-600 break-words">{error}</p>
            </div>
          )}
        </div>

        {/* Result */}
        <div className="mt-6">
          <h2 className="text-sm font-semibold text-ink-700">{t("result")}</h2>
          {audioUrl ? (
            <div className="mt-2 rounded-2xl border border-cream-300 bg-white/70 p-4">
              <audio controls src={audioUrl} className="w-full" />
              <a
                href={audioUrl}
                download="yousound.wav"
                className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-sand-400 px-4 py-1.5 text-sm font-medium text-ink-700 hover:bg-cream-200"
              >
                ⬇ {t("download")}
              </a>
            </div>
          ) : (
            <p className="mt-2 text-sm text-ink-500">{t("noResult")}</p>
          )}
        </div>
      </section>

      <footer className="mt-8 text-center text-xs text-ink-500">
        {t("footer")}
      </footer>
    </main>
  );
}
