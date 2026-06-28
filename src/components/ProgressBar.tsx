"use client";

interface ProgressBarProps {
  progress: number; // 0..100
  label?: string;
}

export default function ProgressBar({ progress, label }: ProgressBarProps) {
  const pct = Math.round(Math.min(100, Math.max(0, progress)));
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1.5">
        {label && <span className="text-sm text-ink-700">{label}</span>}
        <span className="text-sm font-semibold text-ink-900 tabular-nums">
          {pct}%
        </span>
      </div>
      <div
        className="h-2.5 w-full rounded-full bg-cream-200 overflow-hidden"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-sand-400 to-sand-600 transition-[width] duration-300 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
