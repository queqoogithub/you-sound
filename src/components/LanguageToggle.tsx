"use client";

import { useI18n } from "@/i18n/I18nProvider";
import { LOCALES } from "@/i18n/translations";

export default function LanguageToggle() {
  const { locale, setLocale } = useI18n();

  return (
    <div className="inline-flex rounded-full border border-cream-300 bg-cream-50 p-1 shadow-sm">
      {LOCALES.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLocale(l)}
          aria-pressed={locale === l}
          className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${
            locale === l
              ? "bg-sand-500 text-white shadow-sm"
              : "text-ink-700 hover:bg-cream-200"
          }`}
        >
          {l === "th" ? "ไทย" : "EN"}
        </button>
      ))}
    </div>
  );
}
