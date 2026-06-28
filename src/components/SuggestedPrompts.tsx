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
            className="inline-flex items-center gap-1.5 rounded-full border border-cream-300 bg-cream-50 px-3 py-1.5 text-sm text-ink-700 transition-colors hover:bg-cream-200 hover:border-sand-400 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span aria-hidden>{p.emoji}</span>
            {p.label[locale]}
          </button>
        ))}
      </div>
    </div>
  );
}
