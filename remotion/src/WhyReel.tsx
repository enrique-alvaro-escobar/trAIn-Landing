import React from "react";
import { Sequence, interpolate, useCurrentFrame, Easing } from "remotion";
import { C, FONT, FPS, clamp, Scene, Header, Hook, LoopWrap, Eyebrow, BigTitle, useSpringPop } from "./kit";

/* Reel 01 · "Te explica el porqué" */
export const WHY_FPS = FPS;
export const WHY_DURATION = 602;

const SceneClaim: React.FC = () => {
  const card = useSpringPop(40, 28);
  const cardSlide = interpolate(card, [0, 1], [80, 0]);
  return (
    <Scene dur={182}>
      <div style={{ display: "flex", flexDirection: "column", gap: 48 }}>
        <Header badge="01" title="Te explica el porqué" />
        <div style={{ fontFamily: FONT, fontWeight: 400, fontSize: 48, color: C.sub }}>
          Cada decisión, justificada con tus datos.
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
            <span style={{ color: C.accent2 }}>→ </span>“Volumen alto porque tu adherencia fue del{" "}
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
      <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 42, color: C.accent2, marginTop: 8 }}>porque {reason}</div>
    </div>
  );
};

const SceneReasons: React.FC = () => (
  <Scene dur={182}>
    <div style={{ display: "flex", flexDirection: "column", gap: 60 }}>
      <div>
        <Eyebrow>Nunca a ciegas</Eyebrow>
        <BigTitle>Siempre con un porqué.</BigTitle>
      </div>
      <ReasonRow decision="Hoy descansas" reason="tu fatiga es alta" delay={28} />
      <ReasonRow decision="Una serie más" reason="completaste todas las series" delay={46} />
      <ReasonRow decision="Menos volumen" reason="dormiste poco" delay={64} />
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
        <Eyebrow>Lo justifica todo</Eyebrow>
        <BigTitle>Como un entrenador de verdad.</BigTitle>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
        <FactorCard name="Volumen" desc="cuánto trabajo necesitas" delay={26} />
        <FactorCard name="Intensidad" desc="cuánto esfuerzo por serie" delay={40} />
        <FactorCard name="Progresión" desc="cuándo subir la carga" delay={54} />
      </div>
    </div>
  </Scene>
);

export const WhyReel: React.FC = () => (
  <LoopWrap>
    <Sequence from={0} durationInFrames={96}>
      <Hook lines={["La mayoría de apps", "no te explican nada."]} dur={96} />
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
