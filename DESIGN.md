---
name: 2trAIn
description: La landing oscura del coach con IA que razona — tipografía propia, un solo azul y un carrusel de sesión real como argumento de venta.
colors:
  bg: "#0A0A0A"
  bg-2: "#0d0d0d"
  bg-3: "#111111"
  fg: "#FAFAFA"
  accent: "#2A6FDB"
  accent-2: "#5A8FE3"
  accent-soft: "rgba(42, 111, 219, 0.12)"
  muted: "#8A8A8A"
  muted-2: "#808080"
  line: "#1F1F1F"
  line-2: "#2A2A2A"
  danger: "#FF5555"
  modal-green: "#22C55E"
  modal-amber: "#F5B62A"
  modal-mute: "#9AA0A8"
  modal-dim: "#5C616A"
  modal-line: "#2A2D32"
  modal-line-2: "#33363C"
  modal-surface: "#1D1F22"
  modal-dim-2: "#3A3D42"
  wave-active: "#2359AD"
  ink-black: "#000000"
  hero-warm: "rgba(255, 140, 40, 0.08)"
typography:
  display:
    fontFamily: "TT Firs Neue, system-ui, sans-serif"
    fontSize: "clamp(25px, 8vw, 80px)"
    fontWeight: 800
    lineHeight: 0.96
    letterSpacing: "-0.02em"
  display-tight:
    fontFamily: "{typography.display.fontFamily}"
    fontWeight: 800
    lineHeight: 0.86
    letterSpacing: "-0.02em"
  hero:
    fontFamily: "{typography.display.fontFamily}"
    fontSize: "84px"
    fontWeight: 800
    lineHeight: 0.96
  section:
    fontFamily: "{typography.display.fontFamily}"
    fontSize: "52px"
    fontWeight: 800
    lineHeight: 1.0
  headline:
    fontFamily: "{typography.display.fontFamily}"
    fontSize: "38px"
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: "-0.01em"
  title:
    fontFamily: "{typography.display.fontFamily}"
    fontSize: "26px"
    fontWeight: 800
    lineHeight: 1.2
  subtitle:
    fontFamily: "{typography.display.fontFamily}"
    fontSize: "18px"
    fontWeight: 700
    lineHeight: 1.35
  body:
    fontFamily: "{typography.display.fontFamily}"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.5
  body-sm:
    fontFamily: "{typography.display.fontFamily}"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.5
  caption:
    fontFamily: "{typography.display.fontFamily}"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.45
  goal:
    fontFamily: "{typography.display.fontFamily}"
    fontSize: "21.6px"
    fontWeight: 800
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  micro:
    fontFamily: "{typography.display.fontFamily}"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.4
  label:
    fontFamily: "{typography.display.fontFamily}"
    fontSize: "11px"
    fontWeight: 700
    letterSpacing: "0.15em"
  mono:
    fontFamily: "ui-monospace, monospace"
rounded:
  xs: "2px"
  sm: "6px"
  md: "12px"
  lg: "16px"
  card: "14px"
  panel: "22px"
  pill-sm: "10px"
  xl: "32px"
  full: "999px"
  circle: "50%"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.fg}"
    rounded: "{rounded.full}"
    padding: "14px 28px"
  button-primary-hover:
    backgroundColor: "{colors.accent-2}"
    textColor: "{colors.bg}"
    rounded: "{rounded.full}"
  card:
    backgroundColor: "{colors.bg-2}"
    textColor: "{colors.fg}"
    rounded: "{rounded.lg}"
    padding: "20px"
  input-email:
    backgroundColor: "{colors.bg-3}"
    textColor: "{colors.fg}"
    rounded: "{rounded.full}"
    padding: "14px 20px"
  label-eyebrow:
    textColor: "{colors.muted}"
    typography: "{typography.label}"
  chip-objetivo:
    backgroundColor: "{colors.accent-soft}"
    textColor: "{colors.accent-2}"
    rounded: "{rounded.full}"
    padding: "4px 12px"
---

# Design System: 2trAIn

## Overview

**Creative North Star: "La Sala de Control"** *(propuesto — dilo y lo cambio)*

Negro de instrumento, un solo azul de señal y tipografía propia apretada hasta
que las palabras se tocan. La página no vende entusiasmo, vende lectura de
datos: el visitante entra a un puesto de mando donde cada decisión aparece
explicada, no celebrada. Es lo contrario del gimnasio iluminado y sonriente que
usa la categoría — el rechazo es explícito y es el posicionamiento.

La pieza que sostiene todo es el **carrusel de la sesión**: la IA razona en el
chat y escupe una sesión real, ejercicio a ejercicio, con su foto y su
prescripción. No es una promesa de producto, es el producto resolviendo un caso
delante del visitante.

Hay un segundo mundo de color, más pequeño y con reglas propias: el **modal de
éxito** posterior al alta (los tokens `--ms-*`, de *modal success*), donde viven
la escalera de waves, la barra de escasez y los botones de compartir. Es la única
superficie de la página que llega después de convertir, y por eso puede permitirse
verde de confirmación y ámbar de aviso que el resto del sitio no usa.

Lo demás se aparta: sin fotos de stock, sin gradientes decorativos, sin
gamificación, sin testimonios inventados. La densidad es alta en el hero y se
abre hacia abajo.

**Key Characteristics:**
- Fondo negro casi absoluto con tres niveles de superficie muy próximos
- Un único azul de señal, más su versión clara para texto
- Tipografía propia y variable, con tracking negativo agresivo en display
- Paleta separada y acotada para el modal posterior al alta
- Todo en pill: la forma por defecto es completamente redondeada

## Colors

Casi todo es negro y gris; el azul aparece donde hay que actuar o donde el
sistema está razonando.

### Primary
- **Azul Señal** (`#2A6FDB`): CTA, foco, selección, y el hilo conductor de todo
  el razonamiento del producto. Sobre negro es el único color que reclama.
- **Azul Legible** (`#5A8FE3`): la versión que sí se puede leer como texto sobre
  el fondo oscuro. El azul señal se reserva para rellenos y halos; en texto se
  usa este.
- **Azul Velo** (`rgba(42,111,219,0.12)`): fondo de chips, filas destacadas de la
  comparativa y estados seleccionados.

### Secondary
- **Verde Confirmación** (`#22C55E`): las marcas ✓ de la comparativa y el botón
  de WhatsApp del modal de éxito. No es un color de marca, es un semáforo.
- **Ámbar Aviso** (`#F5B62A`): avisos dentro del modal de éxito.
- **Rojo Error** (`#FF5555`): errores de formulario y nada más.

### Neutral
- **Negro Instrumento** (`#0A0A0A`): el fondo de página.
- **Negro Panel** (`#0D0D0D`) y **Negro Elevado** (`#111111`): las dos
  superficies por encima del fondo. La distancia entre los tres es
  deliberadamente pequeña.
- **Blanco Papel** (`#FAFAFA`): todo el texto principal.
- **Gris Apagado** (`#8A8A8A`) y **Gris Sordo** (`#808080`): texto secundario,
  labels y microcopy.
- **Línea** (`#1F1F1F`) y **Línea Fuerte** (`#2A2A2A`): divisores y bordes.

### Named Rules

**La Regla del Azul que se Lee.** El azul de relleno (`#2A6FDB`) y el azul de
texto (`#5A8FE3`) no son intercambiables. Poner texto en el azul de relleno
sobre negro es el fallo de contraste más fácil de cometer en este sistema.

**La Regla del Después.** Los tokens `--ms-*` pertenecen al modal de éxito y no
salen de él. Son el vocabulario de lo que pasa *después* de convertir —
confirmación, cola, compartir— y sacarlos a la página de venta gasta antes de
tiempo señales que solo significan algo una vez dentro.

**La Regla de la Paleta Única.** Las páginas secundarias (legales, eliminar
cuenta, `/app/`) heredan la paleta de la principal; no redefinen tokens por su
cuenta. Cada bloque `:root` duplicado es una deriva esperando a pasar: así fue
como `--muted-2` acabó en `#5A5A5A` (2,9:1) en ocho ficheros mientras la
principal usaba `#808080` (5,0:1).

**La Regla del Semáforo Mudo.** Verde, ámbar y rojo solo comunican estado. Nunca
decoran, nunca son acento, nunca aparecen en un titular.

## Typography

**Display Font:** TT Firs Neue (variable 100–900, self-hosted, con `system-ui`, sans-serif)
**Body Font:** TT Firs Neue — la misma
**Label/Mono Font:** `ui-monospace` para cifras y datos del modal de éxito

**Character:** una grotesca contemporánea, propia y de peso alto, que en display
se aprieta hasta `-0.02em` de tracking y `0.96` de interlineado — las líneas se
apilan como un bloque compacto. Es la única señal de personalidad tipográfica
del sitio, y es la razón por la que la fuente se sirve local y no por CDN.

### Hierarchy
- **Display** (800, `clamp(25px, 8vw, 80px)`, 0.96, `-0.02em`): titulares de
  hero y de sección; sus extremos reales son 84px y 52px.
- **Display Tight** (800, 0.86, `-0.02em`): la variante de bloque, cuando dos o
  tres líneas tienen que leerse como una masa.
- **Headline** (800, 38px, 1.1, `-0.01em`) y **Title** (800, 26px, 1.2): titulares
  intermedios. En la FAQ el tracking se relaja a propósito cuando el texto es
  largo y pequeño; apretarlo lo haría ilegible.
- **Subtitle** (700, 18px, 1.35): entradillas y titulares de tarjeta.
- **Body** (400, 16px, 1.5) y **Body sm** (400, 14px): todo el texto de lectura.
- **Caption** (400, 13px) y **Micro** (400, 12px): microcopy y datos densos.
- **Goal** (800, 21,6px, 1.15, `-0.02em`, mayúsculas): exclusivo de los títulos
  de las cuatro tarjetas de objetivo (Fuerza · Cardio · Prueba · Mantener).
  Está fuera de la progresión a propósito: es el único paso que existe para
  que esas cuatro palabras llenen su tarjeta sin partirse.
- **Label** (700, 11px, `0.15em`, mayúsculas): eyebrows y etiquetas, en gris
  apagado. **11px es el suelo**: por debajo, el texto funcional deja de leerse.

### Named Rules

**La Regla del Tracking que Cede.** El tracking negativo es para tamaños
grandes. Por debajo de ~24px se relaja o se elimina: la compacidad es un efecto
de display, no un rasgo de la fuente.

**La Regla de la Escala Corta.** La escala de arriba es la que documenta este
sistema, pero **no es la que el código usa hoy**: `index.html` carga 24 tamaños
de fuente distintos y 17 radios, con pasos de medio píxel (11,5 / 12,5 / 13,5 /
14,5 / 15,5px) que delatan ajuste a ojo, no escala. Cada valor que el detector
marque como fuera de rampa es uno de esos one-offs. Consolidarlos es trabajo
pendiente y deliberadamente no hecho en el refinamiento de 2026-09-02: tocaba
todas las secciones a la vez. Mientras tanto, **una pieza nueva se ciñe a los
pasos de arriba** y no añade uno más.

**La Regla de la Fuente Local.** TT Firs Neue se sirve desde `/assets/fonts/`
con `font-display: swap` y precarga. No se sustituye por una de Google Fonts ni
se carga por CDN: es identidad y es rendimiento a la vez.

## Layout

Composición de una sola columna centrada con secciones de altura generosa,
encadenadas por scroll: siete bloques con ancla (`hero`, `objetivos`, `why`,
`demo`, `fundador`, `faq`, `beta`). El hero es el único que va a pantalla
completa y coloca texto y formulario por encima del pliegue.

Mobile-first de verdad, no de discurso: por debajo de 768px el orden se
reescribe para que el texto y el formulario queden arriba del todo sin scroll, y
el teléfono del hero baja. El resto del sitio se apoya en las utilidades de
Tailwind compiladas en `dist/tailwind.css`, no en clases inventadas.

La animación de scroll está construida sobre GSAP + ScrollTrigger servidos en
local (ver `GSAP_SCROLL.md`), no sobre CSS puro. Todo cambio de estructura tiene
que revisar los triggers, no solo la maquetación.

## Elevation & Depth

No hay una escala de sombras neutra: la profundidad se consigue con **capas de
negro muy próximas** y con **halos azules**. Una tarjeta se separa del fondo por
un salto de superficie de dos o tres puntos de luminosidad más una hairline, no
por una sombra.

### Shadow Vocabulary
- **Halo de foco** (`box-shadow: 0 0 0 4px rgba(42, 111, 219, 0.1)`): anillo de
  foco en inputs y controles.
- **Halo de CTA** (`box-shadow: 0 12px 28px -10px rgba(42, 111, 219, 0.6)`): el
  botón primario proyecta su propio color hacia abajo.
- **Profundidad de escena** (`box-shadow: 0 24px 60px -28px rgba(0, 0, 0, 0.85)`):
  la carcasa del teléfono del hero y las piezas que deben flotar sobre la página.

### Named Rules

**La Regla de la Hairline.** Sobre negro, un borde de 1px en `#1F1F1F` separa
mejor que cualquier sombra. Si una tarjeta no se distingue, se sube la línea
antes que añadir sombra.

## Shapes

El panel de la demo usa `22px`, su propio paso: es la superficie más grande
del sitio con esquina redondeada y a `16px` se leía como una tarjeta más.
Fuera de él, el pill (`999px`) es la forma por defecto: botones, inputs, chips, badges y
etiquetas. Las superficies mayores usan `16px`, los bloques envolventes `32px`,
y los detalles pequeños `6px`. Los avatares y puntos de estado van a `50%`. No
hay esquinas vivas.

## Components

### Buttons
- **Shape:** pill completo (`999px`).
- **Primary:** relleno en azul señal, texto en blanco papel, con el halo azul
  proyectado hacia abajo.
- **Hover / Focus:** pasa al azul legible; el foco añade el anillo de
  `rgba(42,111,219,0.1)`.

### Inputs / Fields
- **Style:** fondo en negro elevado, hairline, pill completo.
- **Focus:** anillo azul de 4px, sin desplazamiento del layout.
- **Error:** borde y mensaje en rojo error; el campo de email del hero es el
  único control crítico de toda la página.

### Cards / Containers
- **Corner Style:** `16px`.
- **Background:** negro panel sobre negro instrumento.
- **Border:** hairline en línea; línea fuerte cuando la tarjeta es interactiva.
- **Internal Padding:** 20px de base.

### Chips (objetivos)
Pastillas numeradas (01–04: Fuerza, Cardio, Prueba, Mantener) sobre azul velo,
texto en azul legible. Son el mapa de entrada al producto: cada una promete el
mismo razonamiento aplicado a una meta distinta.

### Navigation
Nav que se compacta al hacer scroll y se despliega en un menú a pantalla
completa en móvil, con la marca en `logo-texto.png` precargado.

### Carrusel de sesión (componente distintivo)
Tarjetas de 150×208 con foto real del ejercicio, nombre y prescripción
(`2×15 · banda elástica`), encadenadas después del razonamiento del chat. Es el
activo de venta central de la página: sustituye a la captura de pantalla y a la
ilustración, y es lo que convierte «te explica el porqué» en algo verificable.
Cualquier cambio en el catálogo que lo desactualice convierte el mejor argumento
del sitio en el peor.

### Modal de éxito (segundo mundo)
La superficie posterior al alta: escalera de waves, barra de escasez y botones de
compartir, con la paleta `--ms-*` y su propia escala de líneas. Su trabajo no es
convertir —eso ya pasó— sino convertir un email en alguien implicado, así que es
el único sitio donde el semáforo de estado y el verde de WhatsApp tienen sentido.

## Do's and Don'ts

### Do:
- **Do** usar el azul legible (`#5A8FE3`) para texto y el azul señal (`#2A6FDB`)
  para rellenos, halos y foco.
- **Do** separar superficies con una hairline antes que con una sombra.
- **Do** relajar el tracking negativo en cuanto el texto baja de tamaño de
  display.
- **Do** mantener la paleta `--ms-*` dentro del modal de éxito.
- **Do** heredar la paleta de la página principal en las secundarias, en vez de
  redeclarar `:root` en cada una.
- **Do** aplicar cualquier cambio de estructura o copy a `/` y a `/en/` en el
  mismo commit.
- **Do** mantener todo texto funcional en 11px o más.
- **Do** servir fuentes y librerías en local, como ya se hace con TT Firs Neue,
  GSAP y ScrollTrigger.

### Don't:
- **Don't** poner texto en `#2A6FDB` sobre el fondo negro.
- **Don't** usar el verde, el ámbar o el rojo como color de marca o de titular.
- **Don't** volver a cargar Tailwind desde el CDN de desarrollo:
  `dist/tailwind.css` está compilado y commiteado a propósito.
- **Don't** añadir gradientes decorativos ni fotos de stock de gimnasio.
- **Don't** introducir una segunda familia tipográfica.
- **Don't** vender con una fecha. La escasez de esta página es de plazas
  (100, contadas en vivo), no de calendario: una fecha caduca sola y deja la
  frase rota, que es exactamente lo que pasó con la cuenta atrás al 1-sep-2026.
- **Don't** bajar texto funcional de 11px.
