import React from "react";
import { AbsoluteFill } from "remotion";
import { BRAND } from "./theme";

const Hexagon: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 2000 2000" style={{ flexShrink: 0 }}>
    <g transform="matrix(1.33609,-0.00055,0.000533,1.293904,-335.898989,-46.853899)">
      <path
        d="M587.617,969.869L711.088,898.739L711.088,630.325L1000,466.592L1285.494,628.983L1285.494,963.159L1000,1132.26L866.768,1055.761L1164.708,881.292L1164.708,686.692L1000,594.089L830.532,692.06L830.532,822.241L1000,725.612L1045.263,756.48L1046.606,823.583L622.511,1077.235L1000,1300.018L1411.649,1059.788L1412.991,561.879L1000,318.965L586.275,563.221L587.617,969.869"
        fill={BRAND.accent}
      />
    </g>
  </svg>
);

export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;

export const OgImage: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: BRAND.bg, fontFamily: BRAND.fontBody }}>
    {/* Glow de marca, esquina superior derecha */}
    <div
      style={{
        position: "absolute",
        right: -220,
        top: -260,
        width: 760,
        height: 760,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${BRAND.accentSoft} 0%, transparent 70%)`,
      }}
    />
    <div
      style={{
        position: "absolute",
        inset: 0,
        border: `1px solid ${BRAND.line}`,
      }}
    />

    <div style={{ position: "relative", display: "flex", flexDirection: "column", justifyContent: "center", height: "100%", padding: "0 88px" }}>
      {/* Lockup del logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 40 }}>
        <Hexagon size={56} />
        <span style={{ fontSize: 30, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>
          2TR<span style={{ color: BRAND.accent2 }}>AI</span>N
        </span>
      </div>

      {/* Titular */}
      <div style={{ fontSize: 66, fontWeight: 800, color: "#fff", lineHeight: 1.05, letterSpacing: "-0.02em", maxWidth: 980 }}>
        La IA que razona tu <span style={{ color: BRAND.accent2 }}>entrenamiento.</span>
      </div>

      {/* Subtítulo */}
      <div style={{ fontSize: 26, fontWeight: 400, color: BRAND.muted, marginTop: 26, maxWidth: 820, lineHeight: 1.45 }}>
        La única app de fitness que te explica por qué te manda lo que te manda.
      </div>

      {/* Pie: badge + dominio */}
      <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 48 }}>
        <span
          style={{
            background: BRAND.accentSoft,
            border: `1px solid rgba(42, 111, 219, 0.45)`,
            color: BRAND.accent2,
            fontSize: 16,
            fontWeight: 700,
            padding: "9px 20px",
            borderRadius: 999,
          }}
        >
          Beta gratuita · Primeros 100 de por vida
        </span>
        <span style={{ color: "#5f5f5f", fontSize: 19, fontWeight: 600, letterSpacing: "0.01em" }}>2trainapp.com</span>
      </div>
    </div>
  </AbsoluteFill>
);
