"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/i18n/I18nProvider";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISSED_KEY = "yousound.installDismissed";

export default function InstallModal() {
  const { t } = useI18n();
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Don't show again if user already dismissed in this session
    if (sessionStorage.getItem(DISMISSED_KEY)) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Show modal after a short delay so the page finishes loading first
      setTimeout(() => setVisible(true), 1500);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setVisible(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setVisible(false);
    sessionStorage.setItem(DISMISSED_KEY, "1");
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={handleDismiss}
      />
      {/* Modal */}
      <div className="relative w-full max-w-sm animate-[slideUp_0.35s_ease-out] rounded-3xl border border-dream-purple/20 bg-white p-6 shadow-soft">
        <div className="flex flex-col items-center text-center">
          {/* PWA icon */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/icons/yousound-pwa-icon.png"
            alt="YouSound"
            width={100}
            height={100}
            className="mb-4 h-24 w-24 object-contain drop-shadow-md"
          />
          <h2 className="text-lg font-bold text-ink-900">
            {t("installModalTitle")}
          </h2>
          <p className="mt-2 text-sm text-ink-500">
            {t("installModalDesc")}
          </p>
          {/* Buttons */}
          <button
            type="button"
            onClick={handleInstall}
            className="mt-5 w-full rounded-2xl bg-gradient-to-r from-[#9b87f5] via-[#8b9cff] to-[#b39ddb] py-3 text-sm font-semibold text-white shadow-soft transition hover:brightness-[1.07] active:brightness-95"
          >
            {t("installModalAction")}
          </button>
          <button
            type="button"
            onClick={handleDismiss}
            className="mt-2 w-full rounded-2xl py-2.5 text-sm font-medium text-ink-400 transition hover:text-ink-700"
          >
            {t("installModalLater")}
          </button>
        </div>
      </div>
    </div>
  );
}
