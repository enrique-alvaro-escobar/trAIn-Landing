import React from "react";
import { Sequence, interpolate, useCurrentFrame, Easing } from "remotion";
import { C, FONT, FPS, clamp, Scene, Header, Hook, LoopWrap, Mark, Eyebrow, BigTitle, useSpringPop, useFadeUp } from "./kit";

export const SUST_EN_FPS = FPS;
export const SUST_EN_DURATION = 602;

const SwapRow: React.FC<{ bad: string; good: string; delay: number }> = ({ bad, good, delay }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [delay, delay + 14], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const x = (1 - p) * -70;
  const pulse = 0.85 + 0.15 * (0.5 + 0.5 * Math.sin((frame - delay) / 9));
  return (
    <div style={{ opacity: p, transform: `translateX(${x}px)`, display: "flex", alignItems: "center", gap: 26 }}>
      <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 48, color: C.bad, display: "flex", alignItems: "center", gap: 14 }}>
        <Mark kind="x" /> {bad}
      </span>
      <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 48, color: C.accent2, opacity: pulse, display: "flex", alignItems: "center", gap: 14 }}>
        <Mark kind="check" /> {good}
      </span>
    </div>
  );
};

const SceneSwaps: React.FC = () => (
  <Scene dur={182}>
    <div style={{ display: "flex", flexDirection: "column", gap: 56 }}>
      <Header badge="03" title={"Smart\nsubstitutions"} />
      <div style={{ display: "flex", flexDirection: "column", gap: 50 }}>
        <SwapRow bad="No barbell?" good="Goblet squat" delay={30} />
        <SwapRow bad="Injured?" good="Smith machine" delay={48} />
        <SwapRow bad="Bored?" good="Similar variation" delay={66} />
      </div>
    </div>
  </Scene>
);

const AltRow: React.FC<{ name: string; tag: string; delay: number; top?: boolean }> = ({ name, tag, delay, top }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [delay, delay + 14], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const pop = useSpringPop(delay + 6, 22);
  return (
    <div
      style={{
        opacity: p,
        transform: `translateY(${(1 - p) * 50}px)`,
        background: top ? C.cardBg : "#121212",
        border: `2px solid ${top ? C.cardBorder : "#1f1f1f"}`,
        borderRadius: 28,
        padding: "38px 44px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow: top ? `0 16px 50px ${C.glow}` : "none",
      }}
    >
      <div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 54, color: C.text }}>{name}</div>
        <div style={{ fontFamily: FONT, fontWeight: 500, fontSize: 34, color: C.sub, marginTop: 8 }}>{tag}</div>
      </div>
      {top && (
        <span
          style={{
            transform: `scale(${pop})`,
            background: C.accent,
            color: "#fff",
            fontFamily: FONT,
            fontWeight: 800,
            fontSize: 32,
            padding: "12px 26px",
            borderRadius: 999,
            boxShadow: `0 0 24px ${C.glow}`,
          }}
        >
          TOP
        </span>
      )}
    </div>
  );
};

const SceneAlternatives: React.FC = () => (
  <Scene dur={182}>
    <div style={{ display: "flex", flexDirection: "column", gap: 46 }}>
      <div>
        <Eyebrow>Same goal</Eyebrow>
        <BigTitle>Another way, same goal.</BigTitle>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
        <AltRow name="Triceps Pushdown" tag="Same group · no barbell" delay={26} top />
        <AltRow name="Cable Overhead Ext." tag="Triceps · cable" delay={42} />
        <AltRow name="Assisted dips" tag="Triceps · bodyweight" delay={58} />
      </div>
    </div>
  </Scene>
);

const SceneDone: React.FC = () => {
  const card = useSpringPop(16, 24);
  return (
    <Scene dur={170}>
      <div style={{ display: "flex", flexDirection: "column", gap: 50 }}>
        <div>
          <Eyebrow>Swapped</Eyebrow>
          <BigTitle>Without losing the goal.</BigTitle>
        </div>
        <div
          style={{
            background: C.cardBg,
            border: `3px solid ${C.cardBorder}`,
            borderRadius: 30,
            padding: 48,
            transform: `scale(${card})`,
            boxShadow: `0 20px 60px ${C.glow}`,
            display: "flex",
            alignItems: "center",
            gap: 30,
          }}
        >
          <Mark kind="check" size={90} />
          <div>
            <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 56, color: C.text }}>Triceps Pushdown</div>
            <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 36, color: C.accent2, marginTop: 8 }}>
              same muscle group
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 18, ...useFadeUp(48, 16) }}>
          {["2 × 8", "High intensity", "No barbell"].map((t) => (
            <span
              key={t}
              style={{
                fontFamily: FONT,
                fontWeight: 700,
                fontSize: 34,
                color: C.sub,
                background: "#161616",
                border: "1.5px solid #262626",
                borderRadius: 999,
                padding: "14px 26px",
              }}
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </Scene>
  );
};

export const SustReelEN: React.FC = () => (
  <LoopWrap lang="en">
    <Sequence from={0} durationInFrames={96}>
      <Hook lines={["No barbell?", "Injured? No problem."]} dur={96} />
    </Sequence>
    <Sequence from={88} durationInFrames={182}>
      <SceneSwaps />
    </Sequence>
    <Sequence from={260} durationInFrames={182}>
      <SceneAlternatives />
    </Sequence>
    <Sequence from={432} durationInFrames={170}>
      <SceneDone />
    </Sequence>
  </LoopWrap>
);
