import React from "react";
import { Sequence, interpolate, spring, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { C, FONT, FPS, clamp, Scene, Header, Hook, LoopWrap, Eyebrow, BigTitle, useSpringPop, useFadeUp } from "./kit";

export const MEJORA_EN_FPS = FPS;
export const MEJORA_EN_DURATION = 602;

const Bar: React.FC<{ to: number; delay: number; label: string; strong?: boolean }> = ({ to, delay, label, strong }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 14, stiffness: 80 }, durationInFrames: 48 });
  const p = s * to;
  return (
    <div style={{ flex: 1 }}>
      <div style={{ background: "#1c1c1c", borderRadius: 18, height: 46, overflow: "hidden" }}>
        <div
          style={{
            width: `${p * 100}%`,
            height: "100%",
            borderRadius: 18,
            background: strong ? `linear-gradient(90deg, ${C.accent}, ${C.accent2})` : "#3a3a3a",
            boxShadow: strong ? `0 0 26px ${C.glow}` : "none",
          }}
        />
      </div>
      <div style={{ fontFamily: FONT, fontWeight: strong ? 800 : 600, fontSize: 36, color: strong ? C.accent2 : C.sub, marginTop: 16 }}>
        {label}
      </div>
    </div>
  );
};

const Num: React.FC<{ to: number; delay: number; suffix?: string; prefix?: string; style?: React.CSSProperties }> = ({
  to,
  delay,
  suffix = "",
  prefix = "",
  style,
}) => {
  const frame = useCurrentFrame();
  const v = interpolate(frame, [delay, delay + 32], [0, to], { ...clamp, easing: Easing.out(Easing.cubic) });
  return (
    <span style={{ fontFamily: FONT, fontVariantNumeric: "tabular-nums", ...style }}>
      {prefix}
      {Math.round(v)}
      {suffix}
    </span>
  );
};

const WeekChip: React.FC<{ n: number; delay: number; active?: boolean }> = ({ n, delay, active }) => {
  const s = useSpringPop(delay, 24);
  return (
    <div
      style={{
        transform: `scale(${s})`,
        background: active ? C.accent : "#161616",
        border: `2px solid ${active ? "transparent" : "#262626"}`,
        color: active ? "#fff" : C.sub,
        borderRadius: 22,
        padding: "26px 0",
        flex: 1,
        textAlign: "center",
        fontFamily: FONT,
        fontWeight: 800,
        fontSize: 48,
        boxShadow: active ? `0 0 44px ${C.glow}` : "none",
      }}
    >
      W{n}
    </div>
  );
};

const SceneFactor: React.FC = () => (
  <Scene dur={182}>
    <div style={{ display: "flex", flexDirection: "column", gap: 52 }}>
      <Header badge="02" title="Improves with you" />
      <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 50, color: C.accent2 }}>
        Your response factor is UNIQUE.
      </div>
      <div style={{ display: "flex", gap: 44 }}>
        <Bar to={0.85} delay={40} label="Your body · +10%/wk" strong />
        <Bar to={0.5} delay={54} label="Other body · +5%/wk" />
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 16, color: C.accent2, fontFamily: FONT, fontWeight: 700, fontSize: 42, ...useFadeUp(70, 18) }}>
        <svg width="46" height="46" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9" stroke={C.accent2} strokeWidth="2" />
          <path d="M12 7v5l3.5 2" stroke={C.accent2} strokeWidth="2" strokeLinecap="round" />
        </svg>
        Learned in 4 weeks
      </div>
    </div>
  </Scene>
);

const SceneEvolve: React.FC = () => (
  <Scene dur={182}>
    <div style={{ display: "flex", flexDirection: "column", gap: 50 }}>
      <div>
        <Eyebrow>The plan evolves</Eyebrow>
        <BigTitle>Sharper every week.</BigTitle>
      </div>
      <div style={{ display: "flex", gap: 20 }}>
        <WeekChip n={1} delay={28} />
        <WeekChip n={4} delay={38} />
        <WeekChip n={8} delay={48} />
        <WeekChip n={9} delay={58} active />
      </div>
      <div
        style={{
          background: C.cardBg,
          border: `3px solid ${C.cardBorder}`,
          borderRadius: 30,
          padding: 50,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          ...useFadeUp(64, 18),
        }}
      >
        <span style={{ fontFamily: FONT, fontWeight: 600, fontSize: 52, color: C.text }}>Load adjusted</span>
        <Num to={18} delay={74} prefix="+" suffix="%" style={{ fontWeight: 800, fontSize: 96, color: C.accent2 }} />
      </div>
    </div>
  </Scene>
);

const Ring: React.FC<{ to: number; delay: number }> = ({ to, delay }) => {
  const frame = useCurrentFrame();
  const size = 560;
  const stroke = 46;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const p = interpolate(frame, [delay, delay + 40], [0, to], { ...clamp, easing: Easing.out(Easing.cubic) });
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} stroke="#1c1c1c" strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={C.accent}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - p)}
          style={{ filter: `drop-shadow(0 0 18px ${C.accent})` }}
        />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <Num to={to * 100} delay={delay} suffix="%" style={{ fontWeight: 800, fontSize: 170, color: C.text }} />
        <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 44, color: C.sub }}>adherence</span>
      </div>
    </div>
  );
};

const SceneAdherence: React.FC = () => (
  <Scene dur={170}>
    <div style={{ display: "flex", flexDirection: "column", gap: 56, alignItems: "flex-start" }}>
      <div>
        <Eyebrow>Real consistency</Eyebrow>
        <BigTitle>And you feel it.</BigTitle>
      </div>
      <div style={{ alignSelf: "center" }}>
        <Ring to={0.87} delay={24} />
      </div>
    </div>
  </Scene>
);

export const MejoraReelEN: React.FC = () => (
  <LoopWrap lang="en">
    <Sequence from={0} durationInFrames={96}>
      <Hook lines={["No two bodies", "are the same."]} dur={96} />
    </Sequence>
    <Sequence from={88} durationInFrames={182}>
      <SceneFactor />
    </Sequence>
    <Sequence from={260} durationInFrames={182}>
      <SceneEvolve />
    </Sequence>
    <Sequence from={432} durationInFrames={170}>
      <SceneAdherence />
    </Sequence>
  </LoopWrap>
);
