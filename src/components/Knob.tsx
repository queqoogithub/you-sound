"use client";

import { useCallback, useEffect, useRef } from "react";

interface KnobProps {
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  label?: string;
  size?: number;
  disabled?: boolean;
  ariaLabel?: string;
}

// Knob sweeps from -135deg to +135deg (270deg total).
const MIN_ANGLE = -135;
const MAX_ANGLE = 135;

export default function Knob({
  value,
  min,
  max,
  step = 0.1,
  onChange,
  label,
  size = 120,
  disabled = false,
  ariaLabel,
}: KnobProps) {
  const dragging = useRef(false);
  const lastY = useRef(0);

  const ratio = (value - min) / (max - min);
  const angle = MIN_ANGLE + ratio * (MAX_ANGLE - MIN_ANGLE);

  const clamp = useCallback(
    (v: number) => Math.min(max, Math.max(min, v)),
    [min, max],
  );

  const applyDelta = useCallback(
    (deltaPx: number) => {
      // Dragging up increases the value. Full range over ~200px of travel.
      const range = max - min;
      const next = clamp(value + (deltaPx / 200) * range);
      const snapped = Math.round(next / step) * step;
      onChange(Number(clamp(snapped).toFixed(4)));
    },
    [value, min, max, step, clamp, onChange],
  );

  useEffect(() => {
    if (disabled) return;

    const handleMove = (clientY: number) => {
      if (!dragging.current) return;
      const delta = lastY.current - clientY; // up = positive
      lastY.current = clientY;
      applyDelta(delta);
    };

    const onMouseMove = (e: MouseEvent) => handleMove(e.clientY);
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length) handleMove(e.touches[0].clientY);
    };
    const onUp = () => {
      dragging.current = false;
      document.body.style.cursor = "";
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onUp);
    };
  }, [applyDelta, disabled]);

  const startDrag = (clientY: number) => {
    if (disabled) return;
    dragging.current = true;
    lastY.current = clientY;
    document.body.style.cursor = "ns-resize";
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (e.key === "ArrowUp" || e.key === "ArrowRight") {
      e.preventDefault();
      onChange(Number(clamp(value + step).toFixed(4)));
    } else if (e.key === "ArrowDown" || e.key === "ArrowLeft") {
      e.preventDefault();
      onChange(Number(clamp(value - step).toFixed(4)));
    }
  };

  return (
    <div className="flex flex-col items-center gap-2 select-none">
      <div
        role="slider"
        tabIndex={disabled ? -1 : 0}
        aria-label={ariaLabel ?? label}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={Number(value.toFixed(2))}
        aria-disabled={disabled}
        onMouseDown={(e) => startDrag(e.clientY)}
        onTouchStart={(e) => startDrag(e.touches[0].clientY)}
        onKeyDown={onKeyDown}
        onWheel={(e) => {
          if (disabled) return;
          applyDelta(-e.deltaY * 0.5);
        }}
        className={`relative rounded-full outline-none transition-shadow ${
          disabled
            ? "opacity-50 cursor-not-allowed"
            : "cursor-ns-resize focus-visible:ring-4 focus-visible:ring-sand-400/40"
        }`}
        style={{ width: size, height: size }}
      >
        {/* Outer track */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-b from-cream-50 to-cream-200 shadow-soft border border-cream-300" />
        {/* Inner dial */}
        <div
          className="absolute rounded-full bg-gradient-to-br from-white to-cream-100 border border-cream-300 shadow-inner"
          style={{ inset: size * 0.16 }}
        />
        {/* Pointer */}
        <div
          className="absolute left-1/2 top-1/2 origin-bottom"
          style={{
            width: 4,
            height: size * 0.3,
            marginLeft: -2,
            marginTop: -(size * 0.3),
            transform: `rotate(${angle}deg)`,
            transformOrigin: "50% 100%",
          }}
        >
          <div className="w-full h-full rounded-full bg-sand-500" />
        </div>
        {/* Center cap */}
        <div
          className="absolute left-1/2 top-1/2 rounded-full bg-sand-400 -translate-x-1/2 -translate-y-1/2"
          style={{ width: size * 0.12, height: size * 0.12 }}
        />
      </div>
      {label && (
        <span className="text-sm font-medium text-ink-700">{label}</span>
      )}
    </div>
  );
}
