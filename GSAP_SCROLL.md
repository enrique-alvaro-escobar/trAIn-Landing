# Efecto "Phone Scroll" (móvil fijo con contenido que se desplaza)

Réplica del efecto de la web de Amrap AI: un mockup de móvil que se queda **fijo (pinned)** en el centro de la pantalla mientras haces scroll, y dentro de él va apareciendo contenido nuevo (videos de ejercicios) y los textos laterales hacen fade-in. Todo está **ligado al progreso del scroll**, no hay scroll interno real.

## Concepto

El efecto se compone de 3 capas:

1. **Pista de scroll (track):** un contenedor alto (≈ 4.4× la altura del viewport) que da "recorrido" para que la animación dure mientras scrolleas.
2. **Pin (sticky):** el móvil se mantiene fijo en pantalla durante todo ese recorrido. Lo hace ScrollTrigger con `pin: true`.
3. **Animación con scrub:** el contenido interno del teléfono se mueve con `translateY` y los textos cambian de opacidad. El valor de la animación = progreso del scroll (`scrub: true`).

> Clave: nada se mueve solo. Todo es función de "cuánto has scrolleado dentro de la pista".

## Estructura HTML

```html
<section class="phone-scroll">
  <!-- Pista alta que define la duración del scroll -->
  <div class="phone-scroll__track">

    <!-- Lo que se queda fijo (pinned) -->
    <div class="phone-scroll__pin">

      <!-- Texto lateral izquierdo -->
      <div class="phone-scroll__copy">
        <h2 class="reveal">Adjusts workouts for you</h2>
        <p class="reveal">Machine taken? No benches? Just say so. La app ajusta el programa al instante.</p>
      </div>

      <!-- Mockup del móvil -->
      <div class="phone">
        <div class="phone__screen">
          <!-- Esta lista es la que se desplaza con translateY -->
          <div class="phone__feed">
            <article class="exercise">
              <video src="/videos/ex1.mp4" autoplay loop muted playsinline></video>
              <div class="exercise__info">Exercise 01 · Leg Press</div>
            </article>
            <article class="exercise">
              <video src="/videos/ex2.mp4" autoplay loop muted playsinline></video>
              <div class="exercise__info">Exercise 02 · Romanian Deadlift</div>
            </article>
            <article class="exercise">
              <video src="/videos/ex3.mp4" autoplay loop muted playsinline></video>
              <div class="exercise__info">Exercise 03 · Leg Extension</div>
            </article>
            <article class="exercise">
              <video src="/videos/ex4.mp4" autoplay loop muted playsinline></video>
              <div class="exercise__info">Exercise 04 · Seated Leg Curl</div>
            </article>
          </div>
        </div>
      </div>

    </div>
  </div>
</section>
```

> **Importante en los videos:** `autoplay loop muted playsinline` son obligatorios. Sin `muted` y `playsinline` el autoplay no funciona en móviles.

## CSS

```css
.phone-scroll__track {
  /* Da el "recorrido". 440vh ≈ ratio 4.4 medido en la web original. Ajusta a gusto. */
  height: 440vh;
  position: relative;
}

.phone-scroll__pin {
  height: 100vh;            /* exactamente el viewport */
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6rem;
  overflow: hidden;
}

.phone-scroll__copy {
  max-width: 360px;
}

/* Mockup del teléfono */
.phone {
  width: 300px;
  height: 620px;
  border-radius: 44px;
  border: 10px solid #111;
  background: #000;
  overflow: hidden;          /* recorta lo que se sale del marco (clip) */
  box-shadow: 0 30px 80px rgba(0,0,0,.45);
  flex: none;
}

.phone__screen {
  height: 100%;
  overflow: hidden;          /* NO scroll real: el movimiento es por transform */
}

.phone__feed {
  will-change: transform;    /* optimización: se va a animar con translateY */
}

.exercise video {
  width: 100%;
  display: block;
}

/* Estado inicial de los textos para el fade-in */
.reveal {
  opacity: 0;
  transform: translateY(20px);
}
```

## JavaScript (GSAP + ScrollTrigger)

```js
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const feed = document.querySelector(".phone__feed");
const screen = document.querySelector(".phone__screen");

// Cuánto hay que desplazar el feed: su altura total menos lo que cabe en pantalla
const distance = feed.scrollHeight - screen.clientHeight;

// 1) Desplazamiento del contenido interno ligado al scroll (scrub)
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: ".phone-scroll__track",
    start: "top top",
    end: "bottom bottom",
    pin: ".phone-scroll__pin",   // el móvil se queda fijo
    scrub: true,                 // la animación sigue al scroll
    // markers: true,            // descomenta para depurar
  },
});

tl.to(feed, {
  y: -distance,
  ease: "none",
});

// 2) Fade-in de los textos laterales (cada uno con su propio trigger)
gsap.utils.toArray(".reveal").forEach((el) => {
  gsap.to(el, {
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: "power2.out",
    scrollTrigger: {
      trigger: el,
      start: "top 80%",
      // toggleActions: "play none none reverse", // si quieres que se oculte al subir
    },
  });
});

// Recalcular si cambia el tamaño de los videos al cargar
window.addEventListener("load", () => ScrollTrigger.refresh());
```

## Variante: aparición carácter por carácter

La web original anima los títulos **letra a letra** según el scroll. Si quieres ese detalle, usa el plugin `SplitText` (de GSAP) y ligalo al scroll con `stagger`:

```js
import { SplitText } from "gsap/SplitText";
gsap.registerPlugin(SplitText);

const split = new SplitText("h2.reveal", { type: "chars" });

gsap.from(split.chars, {
  opacity: 0,
  y: 12,
  stagger: 0.04,
  ease: "none",
  scrollTrigger: {
    trigger: "h2.reveal",
    start: "top 85%",
    end: "top 50%",
    scrub: true,   // las letras aparecen conforme scrolleas
  },
});
```

## Smooth scroll (opcional pero recomendado)

La web original usa **Lenis** para suavizar el scroll. Combínalo con ScrollTrigger así:

```js
import Lenis from "lenis";

const lenis = new Lenis();
lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);
```

## Parámetros para ajustar el feeling

| Quieres... | Cambia... |
|---|---|
| Que el scroll dure más/menos | La altura de `.phone-scroll__track` (ej. `300vh`–`500vh`) |
| Movimiento más "directo" | `scrub: true` → `scrub: 1` (añade suavizado/inercia) |
| Que el feed avance distinto | El `ease` del `tl.to` (déjalo en `"none"` para lineal con el scroll) |
| Depurar dónde empieza/acaba | `markers: true` en el ScrollTrigger |

## Checklist de rendimiento

- Usa `will-change: transform` solo en el elemento que se anima (`.phone__feed`).
- Videos comprimidos y cortos en loop; añade `preload="auto"` si pesan poco.
- Llama a `ScrollTrigger.refresh()` tras cargar fuentes/videos para recalcular medidas.
- En móvil real, considera reducir la altura del track para que el efecto no sea demasiado largo.