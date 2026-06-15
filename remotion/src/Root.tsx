import React from "react";
import { Composition } from "remotion";
import { REEL } from "./theme";
import { WhyReel, WHY_DURATION, WHY_FPS } from "./WhyReel";
import { MejoraReel, MEJORA_DURATION, MEJORA_FPS } from "./MejoraReel";
import { SustReel, SUST_DURATION, SUST_FPS } from "./SustReel";
import { WhyReelEN, WHY_EN_DURATION, WHY_EN_FPS } from "./WhyReelEN";
import { MejoraReelEN, MEJORA_EN_DURATION, MEJORA_EN_FPS } from "./MejoraReelEN";
import { SustReelEN, SUST_EN_DURATION, SUST_EN_FPS } from "./SustReelEN";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="ReelWhy"
        component={WhyReel}
        durationInFrames={WHY_DURATION}
        fps={WHY_FPS}
        width={REEL.width}
        height={REEL.height}
      />
      <Composition
        id="ReelMejora"
        component={MejoraReel}
        durationInFrames={MEJORA_DURATION}
        fps={MEJORA_FPS}
        width={REEL.width}
        height={REEL.height}
      />
      <Composition
        id="ReelSustituciones"
        component={SustReel}
        durationInFrames={SUST_DURATION}
        fps={SUST_FPS}
        width={REEL.width}
        height={REEL.height}
      />
      <Composition
        id="ReelWhyEN"
        component={WhyReelEN}
        durationInFrames={WHY_EN_DURATION}
        fps={WHY_EN_FPS}
        width={REEL.width}
        height={REEL.height}
      />
      <Composition
        id="ReelMejoraEN"
        component={MejoraReelEN}
        durationInFrames={MEJORA_EN_DURATION}
        fps={MEJORA_EN_FPS}
        width={REEL.width}
        height={REEL.height}
      />
      <Composition
        id="ReelSustitucionesEN"
        component={SustReelEN}
        durationInFrames={SUST_EN_DURATION}
        fps={SUST_EN_FPS}
        width={REEL.width}
        height={REEL.height}
      />
    </>
  );
};
