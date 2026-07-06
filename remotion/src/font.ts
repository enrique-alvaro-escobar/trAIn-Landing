import { staticFile, delayRender, continueRender } from "remotion";

/*
 * Carga la fuente de marca (TT Firs Neue, variable 100-900) en el navegador de
 * render de Remotion. Sin esto, el texto caería a la sans por defecto de Chromium.
 * delayRender asegura que el render espere a que la fuente esté disponible.
 */
export const FONT_FAMILY = "TT Firs Neue";

if (typeof document !== "undefined") {
  const handle = delayRender("Cargando TT Firs Neue");
  const font = new FontFace(
    FONT_FAMILY,
    `url(${staticFile("fonts/tt-firs-neue-latin-normal.woff2")}) format('woff2')`,
    { weight: "100 900", style: "normal", display: "swap" }
  );
  font
    .load()
    .then((loaded) => {
      document.fonts.add(loaded);
      continueRender(handle);
    })
    .catch((err) => {
      console.error("No se pudo cargar TT Firs Neue:", err);
      continueRender(handle);
    });
}
