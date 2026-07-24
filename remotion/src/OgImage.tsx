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

const Check: React.FC = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
    <path d="M5 13l4 4L19 7" stroke={BRAND.accent2} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
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
        right: -240,
        top: -280,
        width: 800,
        height: 800,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${BRAND.accentSoft} 0%, transparent 70%)`,
      }}
    />
    <div style={{ position: "absolute", inset: 0, border: `1px solid ${BRAND.line}` }} />

    <div style={{ position: "relative", display: "flex", alignItems: "center", height: "100%", padding: "0 64px", gap: 54 }}>
      {/* IZQUIERDA · logo + copy */}
      <div style={{ flex: "0 0 550px", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 32 }}>
          <Hexagon size={42} />
          <span style={{ fontSize: 23, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>
            2TR<span style={{ color: BRAND.accent2 }}>AI</span>N
          </span>
        </div>

        <div style={{ fontSize: 52, fontWeight: 800, color: "#fff", lineHeight: 1.08, letterSpacing: "-0.02em" }}>
          Tu coach con IA que <span style={{ color: BRAND.accent2 }}>razona</span> cada decisión.
        </div>

        <div style={{ fontSize: 21, fontWeight: 400, color: BRAND.muted, marginTop: 22, lineHeight: 1.5, maxWidth: 480 }}>
          Nunca a ciegas. Cada cambio en tu plan, justificado con tus datos.
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 14, marginTop: 36 }}>
          <span
            style={{
              background: BRAND.accentSoft,
              border: `1px solid rgba(42, 111, 219, 0.45)`,
              color: BRAND.accent2,
              fontSize: 15,
              fontWeight: 700,
              padding: "8px 18px",
              borderRadius: 999,
            }}
          >
            Beta gratuita · Primeros 100 de por vida
          </span>
          <span style={{ color: "#5f5f5f", fontSize: 17, fontWeight: 600, letterSpacing: "0.01em" }}>2trainapp.com</span>
        </div>
      </div>

      {/* DERECHA · mockup del chat "Míralo pensar" */}
      <div style={{ flex: "1 1 auto", display: "flex", justifyContent: "center" }}>
        <div
          style={{
            width: 400,
            background: "#111214",
            border: `1px solid ${BRAND.line2}`,
            borderRadius: 24,
            padding: 22,
            boxShadow: "0 40px 90px rgba(0,0,0,0.55)",
            display: "flex",
            flexDirection: "column",
            gap: 13,
          }}
        >
          {/* header */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, paddingBottom: 13, borderBottom: `1px solid ${BRAND.line}` }}>
            <div style={{ width: 32, height: 32, borderRadius: 999, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Hexagon size={19} />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>2trAIn</div>
              <div style={{ fontSize: 11.5, color: BRAND.accent2, display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{ width: 6, height: 6, borderRadius: 999, background: BRAND.accent }} />
                Razonando con tus datos
              </div>
            </div>
          </div>

          {/* burbuja usuario */}
          <div
            style={{
              alignSelf: "flex-end",
              maxWidth: "85%",
              background: BRAND.accent,
              color: "#fff",
              fontSize: 13.5,
              lineHeight: 1.4,
              borderRadius: 16,
              borderBottomRightRadius: 5,
              padding: "10px 14px",
            }}
          >
            ¿Por qué hoy toca menos volumen?
          </div>

          {/* tarjeta de razonamiento */}
          <div
            style={{
              background: "rgba(42,111,219,0.06)",
              border: "1px solid rgba(42,111,219,0.22)",
              borderRadius: 16,
              borderBottomLeftRadius: 5,
              padding: "13px 15px",
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: BRAND.accent2 }}>
              Razonado · 3 pasos
            </div>
            {[
              "Tu fatiga acumulada es alta esta semana.",
              "Dormiste poco los últimos 2 días.",
              "Ajusto el volumen -20%, misma intensidad.",
            ].map((line) => (
              <div key={line} style={{ display: "flex", gap: 8, fontSize: 12, color: "#c9c9c9", lineHeight: 1.4 }}>
                <Check />
                <span>{line}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </AbsoluteFill>
);
