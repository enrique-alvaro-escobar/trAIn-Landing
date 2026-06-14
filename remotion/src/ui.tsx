import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";
import { BRAND } from "./theme";

/* ============ helpers de animación ============ */

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// Aparición tipo "pop" con muelle (entrada + salida opcional).
export const usePop = (delay = 0, dur = 16) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({
    frame: frame - delay,
    fps,
    config: { damping: 16, mass: 0.7, stiffness: 140 },
    durationInFrames: dur,
  });
};

export const useFadeUp = (delay = 0, dist = 36, dur = 14) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [delay, delay + dur], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  return { opacity: p, transform: `translateY(${(1 - p) * dist}px)` };
};

/* ============ marco de pantalla ============ */

export const SceneWrap: React.FC<{
  durationInFrames: number;
  children: React.ReactNode;
  pad?: number;
}> = ({ durationInFrames, children, pad = 72 }) => {
  const f = useCurrentFrame();
  const opacity = interpolate(
    f,
    [0, 9, durationInFrames - 9, durationInFrames],
    [0, 1, 1, 0],
    clamp
  );
  const scale = interpolate(f, [0, durationInFrames], [1.0, 1.03], clamp);
  return (
    <AbsoluteFill
      style={{
        opacity,
        backgroundColor: BRAND.bg,
        padding: pad,
        paddingTop: 130,
        transform: `scale(${scale})`,
      }}
    >
      <StatusBar />
      {children}
    </AbsoluteFill>
  );
};

export const StatusBar: React.FC = () => (
  <div
    style={{
      position: "absolute",
      top: 46,
      left: 72,
      right: 72,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      color: BRAND.fg,
      fontFamily: BRAND.fontBody,
      fontWeight: 700,
      fontSize: 30,
      opacity: 0.85,
    }}
  >
    <span>9:41</span>
    <span style={{ letterSpacing: 3, fontSize: 26 }}>5G ▮▮▮ ▰</span>
  </div>
);

export const Eyebrow: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({
  children,
  style,
}) => (
  <div
    style={{
      fontFamily: BRAND.fontBody,
      fontWeight: 700,
      fontSize: 26,
      letterSpacing: "0.18em",
      textTransform: "uppercase",
      color: BRAND.accentText,
      ...style,
    }}
  >
    {children}
  </div>
);

export const Title: React.FC<{ children: React.ReactNode; size?: number; style?: React.CSSProperties }> = ({
  children,
  size = 88,
  style,
}) => (
  <div
    style={{
      fontFamily: BRAND.fontDisplay,
      fontSize: size,
      lineHeight: 0.98,
      letterSpacing: "-0.01em",
      color: BRAND.fg,
      ...style,
    }}
  >
    {children}
  </div>
);

export const Card: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
  accent?: boolean;
}> = ({ children, style, accent }) => (
  <div
    style={{
      background: accent ? BRAND.accentSoft : "#121212",
      border: `1.5px solid ${accent ? "rgba(42,111,219,0.4)" : BRAND.line}`,
      borderRadius: 34,
      padding: 40,
      ...style,
    }}
  >
    {children}
  </div>
);

export const Pill: React.FC<{ children: React.ReactNode; accent?: boolean; style?: React.CSSProperties }> = ({
  children,
  accent,
  style,
}) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 10,
      background: accent ? BRAND.accent : "#1c1c1c",
      color: accent ? "#fff" : BRAND.muted,
      fontFamily: BRAND.fontBody,
      fontWeight: 700,
      fontSize: 28,
      padding: "12px 24px",
      borderRadius: 999,
      ...style,
    }}
  >
    {children}
  </span>
);

/* ============ primitivas animadas ============ */

export const AnimatedNumber: React.FC<{
  to: number;
  delay?: number;
  dur?: number;
  suffix?: string;
  decimals?: number;
  style?: React.CSSProperties;
}> = ({ to, delay = 0, dur = 26, suffix = "", decimals = 0, style }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [delay, delay + dur], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  const v = (to * p).toFixed(decimals);
  return (
    <span style={{ fontFamily: BRAND.fontDisplay, fontVariantNumeric: "tabular-nums", ...style }}>
      {v}
      {suffix}
    </span>
  );
};

export const ProgressBar: React.FC<{
  to: number; // 0..1
  delay?: number;
  dur?: number;
  height?: number;
  color?: string;
}> = ({ to, delay = 0, dur = 28, height = 22, color = BRAND.accent }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [delay, delay + dur], [0, to], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  return (
    <div style={{ background: "#1c1c1c", borderRadius: 999, height, width: "100%", overflow: "hidden" }}>
      <div
        style={{
          width: `${p * 100}%`,
          height: "100%",
          background: `linear-gradient(90deg, ${BRAND.accent}, ${BRAND.accent2})`,
          borderRadius: 999,
          boxShadow: `0 0 30px ${color}`,
        }}
      />
    </div>
  );
};

export const Ring: React.FC<{
  to: number; // 0..1
  size?: number;
  stroke?: number;
  delay?: number;
  dur?: number;
  children?: React.ReactNode;
}> = ({ to, size = 360, stroke = 30, delay = 0, dur = 34, children }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [delay, delay + dur], [0, to], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} stroke="#1c1c1c" strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={BRAND.accent}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - p)}
          style={{ filter: `drop-shadow(0 0 16px ${BRAND.accent})` }}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {children}
      </div>
    </div>
  );
};

export const Check: React.FC<{ delay?: number; size?: number }> = ({ delay = 0, size = 56 }) => {
  const s = usePop(delay, 14);
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 999,
        background: BRAND.accent,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transform: `scale(${s})`,
        boxShadow: `0 0 24px rgba(42,111,219,0.6)`,
        flexShrink: 0,
      }}
    >
      <svg width={size * 0.56} height={size * 0.56} viewBox="0 0 24 24" fill="none">
        <path d="M5 13l4 4L19 7" stroke="#fff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
};

// Texto que aparece palabra a palabra (efecto "razonando / escribiendo").
export const WordReveal: React.FC<{
  text: string;
  delay?: number;
  per?: number; // frames por palabra
  style?: React.CSSProperties;
  highlight?: string[]; // palabras a pintar en acento
}> = ({ text, delay = 0, per = 2.2, style, highlight = [] }) => {
  const frame = useCurrentFrame();
  const words = text.split(" ");
  const hl = highlight.map((h) => h.toLowerCase().replace(/[.,]/g, ""));
  return (
    <div style={{ fontFamily: BRAND.fontBody, ...style }}>
      {words.map((w, i) => {
        const op = interpolate(frame, [delay + i * per, delay + i * per + 6], [0, 1], clamp);
        const isHl = hl.includes(w.toLowerCase().replace(/[.,]/g, ""));
        return (
          <span
            key={i}
            style={{ opacity: op, color: isHl ? BRAND.accentText : "inherit", fontWeight: isHl ? 700 : "inherit" }}
          >
            {w}{" "}
          </span>
        );
      })}
    </div>
  );
};

// Barras verticales que crecen una a una (mini gráfico dopamínico).
export const GrowBars: React.FC<{
  values: number[]; // 0..1
  delay?: number;
  step?: number;
  width?: number;
  height?: number;
  active?: number; // índice resaltado
}> = ({ values, delay = 0, step = 4, width = 56, height = 220, active = -1 }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 22, height }}>
      {values.map((v, i) => {
        const p = interpolate(frame, [delay + i * step, delay + i * step + 14], [0, v], {
          ...clamp,
          easing: Easing.out(Easing.cubic),
        });
        const on = i <= active || active < 0;
        return (
          <div
            key={i}
            style={{
              width,
              height: `${p * 100}%`,
              borderRadius: 14,
              background: on
                ? `linear-gradient(180deg, ${BRAND.accent2}, ${BRAND.accent})`
                : "#262626",
              boxShadow: on ? `0 0 24px rgba(42,111,219,0.45)` : "none",
            }}
          />
        );
      })}
    </div>
  );
};
