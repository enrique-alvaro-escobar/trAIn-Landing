import { staticFile, continueRender, delayRender } from "remotion";

// Carga las fuentes de marca (mismas woff2 que usa la landing).
let loaded = false;
export const loadFonts = () => {
  if (loaded || typeof document === "undefined") return;
  loaded = true;
  const handle = delayRender("Cargando fuentes de marca");
  const css = `
    @font-face {
      font-family: 'Vitoria';
      font-weight: 400;
      font-display: block;
      src: url('${staticFile("fonts/vitoria-400-normal.woff2")}') format('woff2');
    }
    @font-face {
      font-family: 'Archivo';
      font-weight: 100 900;
      font-display: block;
      src: url('${staticFile("fonts/archivo-latin-wght-normal.woff2")}') format('woff2');
    }`;
  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);
  Promise.all([
    (document as any).fonts.load("400 64px Vitoria"),
    (document as any).fonts.load("700 32px Archivo"),
  ])
    .then(() => continueRender(handle))
    .catch(() => continueRender(handle));
};
