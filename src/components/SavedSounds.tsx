"use client";

import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/i18n/I18nProvider";
import {
  getAllSounds,
  deleteSound,
  type SavedSound,
} from "@/lib/savedSoundsDB";

export default function SavedSounds() {
  const { t, locale } = useI18n();
  const [sounds, setSounds] = useState<SavedSound[]>([]);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    getAllSounds().then(setSounds).catch(() => {});
  }, []);

  // Listen for custom event dispatched after saving a new sound
  useEffect(() => {
    const handler = () => {
      getAllSounds().then(setSounds).catch(() => {});
    };
    window.addEventListener("yousound:saved", handler);
    return () => window.removeEventListener("yousound:saved", handler);
  }, []);

  const handlePlay = (sound: SavedSound) => {
    if (playingId === sound.id) {
      audioRef.current?.pause();
      setPlayingId(null);
      return;
    }
    if (audioRef.current) {
      audioRef.current.pause();
    }
    const url = URL.createObjectURL(sound.blob);
    const audio = new Audio(url);
    audio.onended = () => {
      setPlayingId(null);
      URL.revokeObjectURL(url);
    };
    audio.play();
    audioRef.current = audio;
    setPlayingId(sound.id);
  };

  const handleDelete = async (id: string) => {
    await deleteSound(id);
    setSounds((prev) => prev.filter((s) => s.id !== id));
    if (playingId === id) {
      audioRef.current?.pause();
      setPlayingId(null);
    }
  };

  const handleDownload = (sound: SavedSound) => {
    const url = URL.createObjectURL(sound.blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `yousound-${sound.id.slice(0, 8)}.wav`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatDate = (ts: number) => {
    return new Date(ts).toLocaleString(locale === "th" ? "th-TH" : "en-US", {
      dateStyle: "short",
      timeStyle: "short",
    });
  };

  if (sounds.length === 0) {
    return (
      <div className="mt-6">
        <h2 className="text-sm font-semibold text-ink-700">
          {t("savedSounds")}
        </h2>
        <p className="mt-2 text-sm text-ink-400">{t("noSavedSounds")}</p>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <h2 className="text-sm font-semibold text-ink-700">
        {t("savedSounds")}
      </h2>
      <div className="mt-2 space-y-2">
        {sounds.map((sound) => (
          <div
            key={sound.id}
            className="rounded-2xl border border-white/60 bg-white/55 p-3 backdrop-blur-sm"
          >
            <p className="text-sm text-ink-700 line-clamp-1 font-medium">
              {sound.prompt}
            </p>
            <p className="mt-0.5 text-xs text-ink-400">
              {sound.durationSec}s · {formatDate(sound.createdAt)}
            </p>
            <div className="mt-2 flex items-center gap-2">
              {/* Play / Pause */}
              <button
                type="button"
                onClick={() => handlePlay(sound)}
                className="inline-flex items-center gap-1 rounded-full border border-white/60 bg-white/40 px-3 py-1 text-xs font-medium text-ink-700 hover:bg-white/60 transition-colors"
                aria-label={playingId === sound.id ? "Pause" : "Play"}
              >
                {playingId === sound.id ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <rect x="6" y="4" width="4" height="16" rx="1" />
                    <rect x="14" y="4" width="4" height="16" rx="1" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <polygon points="5,3 19,12 5,21" />
                  </svg>
                )}
                {playingId === sound.id ? "Pause" : "Play"}
              </button>

              {/* Download */}
              <button
                type="button"
                onClick={() => handleDownload(sound)}
                className="inline-flex items-center gap-1 rounded-full border border-white/60 bg-white/40 px-3 py-1 text-xs font-medium text-ink-700 hover:bg-white/60 transition-colors"
              >
                ⬇ {t("download")}
              </button>

              {/* Delete */}
              <button
                type="button"
                onClick={() => handleDelete(sound.id)}
                className="inline-flex items-center gap-1 rounded-full border border-rose-200/60 bg-rose-50/40 px-3 py-1 text-xs font-medium text-rose-600 hover:bg-rose-100/60 transition-colors"
              >
                {t("deleteSaved")}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
