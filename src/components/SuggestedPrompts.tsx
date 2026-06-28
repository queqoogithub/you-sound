"use client";

import { useI18n } from "@/i18n/I18nProvider";
import { SUGGESTED_PROMPTS } from "@/i18n/translations";

interface SuggestedPromptsProps {
  onSelect: (prompt: string) => void;
  disabled?: boolean;
}

export default function SuggestedPrompts({
  onSelect,
  disabled,
}: SuggestedPromptsProps) {
  const { locale, t } = useI18n();

  return (
    <div>
      <h2 className="text-sm font-semibold text-ink-700 mb-2">
        {t("suggestionsTitle")}
      </h2>
      <div className="flex flex-wrap gap-2">
        {SUGGESTED_PROMPTS.map((p) => (
          <button
            key={p.id}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(p.prompt)}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/60 bg-white/40 px-3 py-1.5 text-sm text-ink-700 backdrop-blur-sm transition-colors hover:border-dream-periwinkle hover:bg-white/65 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span aria-hidden>{p.emoji}</span>
            {p.label[locale]}
          </button>
        ))}
      </div>
    </div>
  );
}
