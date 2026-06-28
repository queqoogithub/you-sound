// Decorative dreamy backdrop rendered INSIDE the main card: a soft pastel
// gradient, volumetric glows, twinkling stars, glowing particles and
// glassmorphism flowing waves. The area outside the card stays plain white.
// Pure CSS/SVG, no client state — safe to render on the server.

// Deterministic star positions (percent) so SSR and client markup match.
const STARS: { x: number; y: number; s: number; d: number }[] = [
  { x: 8, y: 12, s: 2, d: 0 },
  { x: 18, y: 30, s: 1.5, d: 1.2 },
  { x: 27, y: 8, s: 2.5, d: 0.6 },
  { x: 35, y: 22, s: 1.5, d: 2.1 },
  { x: 44, y: 14, s: 2, d: 1.5 },
  { x: 52, y: 6, s: 1.5, d: 0.3 },
  { x: 61, y: 18, s: 2.5, d: 2.4 },
  { x: 69, y: 10, s: 1.5, d: 1.0 },
  { x: 78, y: 24, s: 2, d: 0.9 },
  { x: 86, y: 9, s: 1.5, d: 1.8 },
  { x: 92, y: 28, s: 2.5, d: 0.4 },
  { x: 14, y: 46, s: 1.5, d: 2.7 },
  { x: 31, y: 52, s: 2, d: 1.3 },
  { x: 48, y: 40, s: 1.5, d: 0.7 },
  { x: 66, y: 48, s: 2, d: 2.0 },
  { x: 83, y: 44, s: 1.5, d: 1.1 },
  { x: 95, y: 54, s: 2, d: 0.5 },
  { x: 5, y: 60, s: 1.5, d: 1.6 },
  { x: 40, y: 64, s: 2, d: 2.3 },
  { x: 74, y: 62, s: 1.5, d: 0.8 },
];

const PARTICLES = [
  { x: 20, delay: 0, dur: 9, size: 10 },
  { x: 38, delay: 2.5, dur: 11, size: 7 },
  { x: 55, delay: 1.2, dur: 10, size: 12 },
  { x: 72, delay: 3.4, dur: 12, size: 8 },
  { x: 88, delay: 0.8, dur: 9.5, size: 9 },
];

export default function Background() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Pastel gradient base */}
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: "#efeafd",
          backgroundImage: [
            "radial-gradient(600px 420px at 12% 6%, rgba(205,189,242,0.9), transparent 60%)",
            "radial-gradient(560px 460px at 90% 2%, rgba(189,224,254,0.85), transparent 58%)",
            "radial-gradient(520px 420px at 82% 96%, rgba(255,200,221,0.75), transparent 60%)",
            "radial-gradient(520px 420px at 12% 98%, rgba(255,216,190,0.65), transparent 60%)",
            "radial-gradient(700px 520px at 50% 50%, rgba(184,192,255,0.5), transparent 72%)",
            "linear-gradient(180deg, #f3eefe 0%, #ece6fb 45%, #f4e9f6 100%)",
          ].join(", "),
        }}
      />

      {/* Volumetric light glows */}
      <div className="absolute -left-10 -top-10 h-48 w-48 rounded-full bg-dream-purple/40 blur-3xl" />
      <div className="absolute -right-8 top-6 h-44 w-44 rounded-full bg-dream-babyblue/40 blur-3xl" />
      <div className="absolute left-1/3 top-1/4 h-40 w-40 rounded-full bg-dream-blush/30 blur-3xl animate-float" />

      {/* Twinkling stars */}
      {STARS.map((star, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-white animate-twinkle"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.s,
            height: star.s,
            animationDelay: `${star.d}s`,
            boxShadow: "0 0 6px rgba(255,255,255,0.9)",
          }}
        />
      ))}

      {/* Soft glowing particles drifting upward */}
      {PARTICLES.map((p, i) => (
        <span
          key={`p-${i}`}
          className="absolute bottom-[22%] rounded-full bg-white/70 blur-[2px]"
          style={{
            left: `${p.x}%`,
            width: p.size,
            height: p.size,
            boxShadow: "0 0 14px rgba(255,255,255,0.8)",
            animation: `drift ${p.dur}s ease-in ${p.delay}s infinite`,
          }}
        />
      ))}

      {/* Glassmorphism flowing waves at the bottom */}
      <div className="absolute inset-x-0 bottom-0 h-2/5">
        <svg
          className="absolute bottom-0 h-full w-[200%] animate-[waveDrift_22s_linear_infinite]"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="rgba(184,192,255,0.28)"
            d="M0,160 C240,80 480,240 720,176 C960,112 1200,224 1440,160 L1440,320 L0,320 Z"
          />
        </svg>
        <svg
          className="absolute bottom-0 h-full w-[200%] animate-[waveDrift_30s_linear_infinite]"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="rgba(255,200,221,0.24)"
            d="M0,224 C220,160 460,272 720,224 C980,176 1220,272 1440,208 L1440,320 L0,320 Z"
          />
        </svg>
        <svg
          className="absolute bottom-0 h-full w-[200%] animate-[waveDrift_40s_linear_infinite]"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="rgba(255,255,255,0.4)"
            d="M0,256 C260,208 520,300 760,260 C1000,220 1240,300 1440,256 L1440,320 L0,320 Z"
          />
        </svg>
      </div>
    </div>
  );
}
