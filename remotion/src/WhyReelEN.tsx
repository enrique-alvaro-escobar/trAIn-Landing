import React from "react";
import { Sequence, interpolate, useCurrentFrame, Easing } from "remotion";
import { C, FONT, FPS, clamp, Scene, Header, Hook, LoopWrap, Eyebrow, BigTitle, useSpringPop } from "./kit";

/* Reel 01 (EN) · "It explains the why" */
export const WHY_EN_FPS = FPS;
export const WHY_EN_DURATION = 602;

const SceneClaim: React.FC = () => {
  const card = useSpringPop(40, 28);
  const cardSlide = interpolate(card, [0, 1], [80, 0]);
  return (
    <Scene dur={182}>
      <div style={{ display: "flex", flexDirection: "column", gap: 48 }}>
        <Header badge="01" title="It explains the why" />
        <div style={{ fontFamily: FONT, fontWeight: 400, fontSize: 48, color: C.sub }}>
          Every decision, backed by your data.
        </div>
        <div
          style={{
            background: C.cardBg,
            border: `3px solid ${C.cardBorder}`,
            borderRadius: 32,
            padding: 52,
            opacity: card,
            transform: `translateX(${cardSlide}px) scale(${interpolate(card, [0, 1], [0.9, 1])})`,
            boxShadow: `0 20px 60px ${C.glow}`,
          }}
        >
          <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 56, color: C.text, lineHeight: 1.3 }}>
            <span style={{ color: C.accent2 }}>→ </span>“High volume because your adherence was{" "}
            <span style={{ color: C.accent2, fontWeight: 800 }}>95%</span>.”
          </div>
        </div>
      </div>
    </Scene>
  );
};

const ReasonRow: React.FC<{ decision: string; reason: string; delay: number }> = ({ decision, reason, delay }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [delay, delay + 14], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const x = (1 - p) * -70;
  return (
    <div style={{ opacity: p, transform: `translateX(${x}px)`, borderLeft: `7px solid ${C.accent}`, paddingLeft: 34 }}>
      <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 60, color: C.text }}>{decision}</div>
      <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 42, color: C.accent2, marginTop: 8 }}>because {reason}</div>
    </div>
  );
};

const SceneReasons: React.FC = () => (
  <Scene dur={182}>
    <div style={{ display: "flex", flexDirection: "column", gap: 60 }}>
      <div>
        <Eyebrow>Never blind</Eyebrow>
        <BigTitle>Always with a reason.</BigTitle>
      </div>
      <ReasonRow decision="You rest today" reason="your fatigue is high" delay={28} />
      <ReasonRow decision="One more set" reason="you hit every set" delay={46} />
      <ReasonRow decision="Less volume" reason="you slept little" delay={64} />
    </div>
  </Scene>
);

const FactorCard: React.FC<{ name: string; desc: string; delay: number }> = ({ name, desc, delay }) => {
  const pop = useSpringPop(delay, 24);
  return (
    <div
      style={{
        transform: `scale(${pop})`,
        background: "#121212",
        border: `2px solid #1f1f1f`,
        borderRadius: 26,
        padding: "38px 44px",
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 56, color: C.accent2 }}>{name}</div>
      <div style={{ fontFamily: FONT, fontWeight: 500, fontSize: 40, color: C.sub }}>{desc}</div>
    </div>
  );
};

const SceneFactors: React.FC = () => (
  <Scene dur={170}>
    <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
      <div>
        <Eyebrow>It justifies everything</Eyebrow>
        <BigTitle>Like a real coach.</BigTitle>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
        <FactorCard name="Volume" desc="how much work you need" delay={26} />
        <FactorCard name="Intensity" desc="how hard each set is" delay={40} />
        <FactorCard name="Progression" desc="when to add load" delay={54} />
      </div>
    </div>
  </Scene>
);

export const WhyReelEN: React.FC = () => (
  <LoopWrap lang="en">
    <Sequence from={0} durationInFrames={96}>
      <Hook lines={["Most apps", "don't explain anything."]} dur={96} />
    </Sequence>
    <Sequence from={88} durationInFrames={182}>
      <SceneClaim />
    </Sequence>
    <Sequence from={260} durationInFrames={182}>
      <SceneReasons />
    </Sequence>
    <Sequence from={432} durationInFrames={170}>
      <SceneFactors />
    </Sequence>
  </LoopWrap>
);
