import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { BRAND } from "./theme";
import { clamp } from "./ui";
import { loadFonts } from "./fonts";

// Fondo + viñeta + fundido en los extremos (bucle perfecto dentro del móvil).
export const Shell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  loadFonts();
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const edge = 10;
  const loopFade = interpolate(
    frame,
    [0, edge, durationInFrames - edge, durationInFrames - 1],
    [0, 1, 1, 0],
    clamp
  );
  return (
    <AbsoluteFill style={{ backgroundColor: BRAND.bg }}>
      {/* glow de marca de fondo */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(120% 60% at 50% 0%, rgba(42,111,219,0.16), transparent 60%)`,
        }}
      />
      <AbsoluteFill style={{ opacity: loopFade }}>{children}</AbsoluteFill>
      <AbsoluteFill style={{ pointerEvents: "none", boxShadow: "inset 0 0 240px rgba(0,0,0,0.6)" }} />
    </AbsoluteFill>
  );
};
