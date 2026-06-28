"use client";

import { useI18n } from "@/i18n/I18nProvider";
import { LOCALES } from "@/i18n/translations";

export default function LanguageToggle() {
  const { locale, setLocale } = useI18n();

  return (
    <div className="inline-flex rounded-full border border-dream-purple/25 bg-white p-1 shadow-sm">
      {LOCALES.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLocale(l)}
          aria-pressed={locale === l}
          className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
            locale === l
              ? "bg-gradient-to-r from-[#9b87f5] to-[#8b9cff] text-white shadow-sm"
              : "text-ink-700 hover:bg-dream-mist"
          }`}
        >
          {l === "th" ? "ไทย" : "EN"}
        </button>
      ))}
    </div>
  );
}
