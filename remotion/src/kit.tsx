import React from "react";
import {
  AbsoluteFill,
  Img,
  staticFile,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";
import { BRAND } from "./theme";

/* ===== Kit visual compartido (paleta azul de marca, 60fps, marco estilo Instagram Reels) ===== */

export const FPS = 60;

export const C = {
  bg: BRAND.bg,
  accent: BRAND.accent,
  accent2: BRAND.accent2,
  text: "#FFFFFF",
  sub: "#A3A3A3",
  glow: "rgba(42, 111, 219, 0.4)",
  cardBg: "rgba(42, 111, 219, 0.10)",
  cardBorder: "rgba(42, 111, 219, 0.55)",
  bad: "#e0564f",
};
export const FONT = BRAND.fontBody; // Archivo (≈ DM Sans)

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// Insets del "marco" de Instagram: el contenido vive centrado en este hueco.
const INSET = { top: 210, bottom: 410, left: 80, right: 170 };

export const useSpringPop = (delay: number, dur = 30) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({
    frame: frame - delay,
    fps,
    config: { damping: 11, mass: 0.8, stiffness: 90 },
    durationInFrames: dur,
    overshootClamping: false,
  });
};

export const useFadeUp = (delay: number, dist = 20, dur = 16) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [delay, delay + dur], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  return { opacity: p, transform: `translateY(${(1 - p) * dist}px)` };
};

// Marco de escena: contenido centrado dentro del hueco del chrome de Instagram.
export const Scene: React.FC<{ dur: number; children: React.ReactNode }> = ({ dur, children }) => {
  const f = useCurrentFrame();
  const opacity = interpolate(f, [0, 12, dur - 16, dur], [0, 1, 1, 0], clamp);
  return (
    <AbsoluteFill
      style={{
        opacity,
        paddingTop: INSET.top,
        paddingBottom: INSET.bottom,
        paddingLeft: INSET.left,
        paddingRight: INSET.right,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

export const Badge: React.FC<{ children: React.ReactNode; delay: number }> = ({ children, delay }) => {
  const s = useSpringPop(delay, 30);
  return (
    <div
      style={{
        width: 160,
        height: 160,
        borderRadius: 999,
        background: C.accent,
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: FONT,
        fontWeight: 800,
        fontSize: 78,
        transform: `scale(${s})`,
        boxShadow: `0 0 70px ${C.glow}`,
        flexShrink: 0,
      }}
    >
      {children}
    </div>
  );
};

export const Header: React.FC<{ badge: React.ReactNode; title: string }> = ({ badge, title }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 36 }}>
    <Badge delay={4}>{badge}</Badge>
    <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 78, color: C.text, lineHeight: 1.02, whiteSpace: "pre-line", ...useFadeUp(14, 20) }}>
      {title}
    </div>
  </div>
);

export const Eyebrow: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => (
  <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 34, letterSpacing: "0.18em", textTransform: "uppercase", color: C.accent2, ...useFadeUp(delay, 14) }}>
    {children}
  </div>
);

export const BigTitle: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 6 }) => (
  <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 88, color: C.text, marginTop: 18, lineHeight: 1.0, ...useFadeUp(delay, 18) }}>
    {children}
  </div>
);

export const Mark: React.FC<{ kind: "x" | "check"; size?: number }> = ({ kind, size = 60 }) => (
  <span
    style={{
      width: size,
      height: size,
      borderRadius: 999,
      background: kind === "x" ? "rgba(224,86,79,0.16)" : C.accent,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      boxShadow: kind === "check" ? `0 0 24px ${C.glow}` : "none",
    }}
  >
    <svg width={size * 0.5} height={size * 0.5} viewBox="0 0 24 24" fill="none">
      {kind === "x" ? (
        <path d="M6 6l12 12M18 6L6 18" stroke={C.bad} strokeWidth="3" strokeLinecap="round" />
      ) : (
        <path d="M5 13l4 4L19 7" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      )}
    </svg>
  </span>
);

export const Hook: React.FC<{ lines: string[]; dur: number }> = ({ lines, dur }) => {
  const frame = useCurrentFrame();
  const lineW = interpolate(frame, [0, dur - 8], [0, 100], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  return (
    <Scene dur={dur}>
      <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 102, color: C.text, lineHeight: 1.04, ...useFadeUp(6, 26, 18) }}>
        {lines.map((l, i) => (
          <React.Fragment key={i}>
            {l}
            {i < lines.length - 1 && <br />}
          </React.Fragment>
        ))}
      </div>
      <div style={{ height: 7, marginTop: 44, width: `${lineW}%`, background: C.accent, borderRadius: 999, boxShadow: `0 0 30px ${C.glow}` }} />
    </Scene>
  );
};

/* ===== Chrome estilo Instagram Reels (fijo en todos los reels) ===== */

const RailIcon: React.FC<{ count: string; children: React.ReactNode }> = ({ count, children }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
    <svg width="68" height="68" viewBox="0 0 24 24" fill="none" style={{ filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.6))" }}>
      {children}
    </svg>
    <span style={{ fontFamily: FONT, fontWeight: 600, fontSize: 28, color: "#fff", textShadow: "0 2px 6px rgba(0,0,0,0.6)" }}>{count}</span>
  </div>
);

const CHROME = {
  es: { caption: "La IA que razona tu entrenamiento 🧠", comment: "Añade un comentario…", like: "24,5 mil", comments: "1.337", repost: "512", send: "Enviar" },
  en: { caption: "The AI that reasons your training 🧠", comment: "Add a comment…", like: "24.5K", comments: "1,337", repost: "512", send: "Share" },
};

const ReelsChrome: React.FC<{ lang?: "es" | "en" }> = ({ lang = "es" }) => {
  const t = CHROME[lang];
  return (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    {/* degradados de legibilidad arriba y abajo */}
    <AbsoluteFill style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.55), transparent 16%, transparent 78%, rgba(0,0,0,0.65))" }} />

    {/* Top bar: avatar + usuario */}
    <div style={{ position: "absolute", top: 64, left: 70, right: 70, display: "flex", alignItems: "center", gap: 24 }}>
      <div style={{ width: 92, height: 92, borderRadius: 999, overflow: "hidden", border: `3px solid #fff`, flexShrink: 0 }}>
        <Img src={staticFile("icon.svg")} style={{ width: "100%", height: "100%", display: "block" }} />
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 40, color: "#fff", textShadow: "0 2px 6px rgba(0,0,0,0.6)" }}>2trainapp</span>
        <svg width="34" height="34" viewBox="0 0 24 24" fill={C.accent}>
          <path d="M12 1l2.6 1.9 3.2-.2 1 3 2.6 1.9-1 3 1 3-2.6 1.9-1 3-3.2-.2L12 23l-2.6-1.9-3.2.2-1-3L2.6 16.5l1-3-1-3 2.6-1.9 1-3 3.2.2z" />
          <path d="M8.5 12l2.3 2.3 4.7-4.8" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>

    {/* Rail derecho: like / comentar / compartir / guardar */}
    <div style={{ position: "absolute", right: 44, bottom: 470, display: "flex", flexDirection: "column", alignItems: "center", gap: 54 }}>
      <RailIcon count={t.like}>
        <path d="M12 21s-7-4.5-9.5-9C1 9 2.5 5.5 6 5.5c2 0 3 1.2 4 2.5 1-1.3 2-2.5 4-2.5 3.5 0 5 3.5 3.5 6.5C19 16.5 12 21 12 21z" fill="#fff" />
      </RailIcon>
      <RailIcon count={t.comments}>
        <path d="M21 11.5a8.5 8.5 0 0 1-12.3 7.6L3 21l1.9-5.7A8.5 8.5 0 1 1 21 11.5z" stroke="#fff" strokeWidth="2" />
      </RailIcon>
      <RailIcon count={t.repost}>
        <path d="M17 2l4 4-4 4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M21 6H8a4 4 0 0 0-4 4v2" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M7 22l-4-4 4-4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M3 18h13a4 4 0 0 0 4-4v-2" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </RailIcon>
      <RailIcon count={t.send}>
        <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="#fff" strokeWidth="2" strokeLinejoin="round" />
      </RailIcon>
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" style={{ filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.6))" }}>
        <circle cx="5" cy="12" r="1.6" fill="#fff" />
        <circle cx="12" cy="12" r="1.6" fill="#fff" />
        <circle cx="19" cy="12" r="1.6" fill="#fff" />
      </svg>
    </div>

    {/* Caption abajo-izquierda */}
    <div style={{ position: "absolute", left: 72, right: 200, bottom: 230 }}>
      <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 36, color: "#fff", textShadow: "0 2px 6px rgba(0,0,0,0.6)" }}>2train</div>
      <div style={{ fontFamily: FONT, fontWeight: 400, fontSize: 34, color: "#ededed", marginTop: 8, textShadow: "0 2px 6px rgba(0,0,0,0.6)" }}>
        {t.caption}
      </div>
    </div>

    {/* Barra de comentario abajo */}
    <div style={{ position: "absolute", left: 64, right: 64, bottom: 64, height: 128, display: "flex", alignItems: "center", gap: 24, border: "2px solid rgba(255,255,255,0.4)", borderRadius: 999, padding: "0 44px" }}>
      <span style={{ fontFamily: FONT, fontWeight: 500, fontSize: 38, color: "#cfcfcf" }}>{t.comment}</span>
      <span style={{ marginLeft: "auto", fontSize: 42 }}>❤️</span>
      <span style={{ fontSize: 42 }}>🙌</span>
    </div>
  </AbsoluteFill>
  );
};

// Envoltorio: fondo + escenas centradas + chrome de Instagram fijo + fundido de bucle.
export const LoopWrap: React.FC<{ children: React.ReactNode; lang?: "es" | "en" }> = ({ children, lang = "es" }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const loop = interpolate(frame, [0, 8, durationInFrames - 8, durationInFrames - 1], [0, 1, 1, 0], clamp);
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <AbsoluteFill style={{ opacity: loop }}>
        {children}
        <ReelsChrome lang={lang} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
