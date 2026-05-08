# Guía para construir la landing de la beta

> Documento de referencia para diseñar y montar la landing page de captación de waitlist. Incluye estructura, copy completo, decisiones de diseño, integraciones técnicas y checklist de lanzamiento.

---

## 0. Principios antes de empezar

Antes de pensar en colores o tipografías, fija estos principios. Son la diferencia entre una landing que convierte y una que no.

### La landing tiene UN único trabajo

Capturar el email para entrar en la waitlist. Nada más. No vende la app, no explica todas las features, no muestra el roadmap, no incluye precios. **Si el visitante puede hacer cualquier cosa que no sea apuntarse a la waitlist, has fallado.**

### Mobile-first siempre

El 70-80% del tráfico va a venir de Twitter, Reddit y mensajes de WhatsApp, todos ellos consumidos en móvil. Si la landing no se ve perfecta en pantalla de 375px de ancho, no se ve. Diseña primero móvil, después desktop.

### Velocidad de carga: <2 segundos

Cada segundo extra de carga reduce la conversión un 7-10%. Sin imágenes pesadas, sin vídeos autoplay de 5MB, sin embeds innecesarios. El objetivo: que el headline aparezca antes de 1 segundo en 4G.

### Honestidad radical

El posicionamiento es "anti-app de fitness". Eso obliga a un copy honesto, sin promesas vacías. Nada de "transforma tu vida en 30 días". Sí: "decisiones técnicas explicadas, sin motivación infantil".

---

## 1. Estructura de la landing (mobile-first)

La landing tiene **6 secciones** en este orden exacto. No añadas más. No cambies el orden.

```
┌─────────────────────────────────┐
│  1. HERO                        │  ← Headline + CTA email
├─────────────────────────────────┤
│  2. EL PROBLEMA                 │  ← "Por qué las apps actuales fallan"
├─────────────────────────────────┤
│  3. LA SOLUCIÓN (3 pilares)     │  ← Lo que hace tu app distinto
├─────────────────────────────────┤
│  4. EL EXPERIMENTO              │  ← Prueba pública en marcha
├─────────────────────────────────┤
│  5. WAITLIST + REFERIDOS        │  ← Segundo CTA con sistema de referidos
├─────────────────────────────────┤
│  6. FOOTER                      │  ← Legal, contacto, redes
└─────────────────────────────────┘
```

**Justificación del orden:**
- Hero: engancha en 3 segundos o se va
- Problema antes que solución: necesita reconocer el dolor antes de aceptar la cura
- Solución en 3 pilares: 3 es el número mágico, ni más ni menos
- Experimento: prueba social y diferenciación
- Segundo CTA: cuando ha leído todo, segunda oportunidad de captura
- Footer: legal y contacto

---

## 2. Copy completo, sección por sección

### Sección 1: HERO

**Estructura:**

```
[LOGO o WORDMARK pequeño, esquina superior izquierda]

╔═══════════════════════════════════════════════╗
║                                               ║
║   La única app de fitness que te explica      ║
║   POR QUÉ te manda lo que te manda.           ║
║                                               ║
║   Decisiones técnicas. Sin motivación         ║
║   infantil. Sin gamificación cutre.           ║
║                                               ║
║   ┌───────────────────────────────┐           ║
║   │  tu@email.com                 │           ║
║   └───────────────────────────────┘           ║
║   [ Quiero entrar a la beta → ]               ║
║                                               ║
║   Plazas limitadas · Lanzamiento septiembre   ║
║                                               ║
╚═══════════════════════════════════════════════╝
```

**Copy alternativo a probar (A/B testing):**

| Versión A (la principal) | Versión B (más directa) | Versión C (más técnica) |
|---|---|---|
| "La única app de fitness que te explica POR QUÉ te manda lo que te manda." | "Tu próxima app de fitness no debería tratarte como a un principiante." | "Bandits contextuales + ciencia del entrenamiento. Tu coach algorítmico." |

**Subheadline (común):**
> "Decisiones técnicas. Sin motivación infantil. Sin gamificación cutre."

**CTA primario:**
> "Quiero entrar a la beta →"

**No usar:** "Suscríbete", "Apúntate ya", "Únete a la lista". Demasiado genérico.

**Microcopy debajo del CTA:**
> "Plazas limitadas · Lanzamiento septiembre 2026"

**Reglas del Hero:**
- Headline: **máximo 12 palabras**, fuente grande (48-64px desktop, 32-40px mobile)
- El email + botón deben estar **above the fold** (visible sin hacer scroll)
- Sin imagen de héroe en la primera versión. Solo texto. Reduce peso y obliga a que el copy sea bueno.

---

### Sección 2: EL PROBLEMA

**Título:**
> "Las apps de fitness te tratan como a un usuario promedio que no existe"

**Cuerpo (3 puntos en formato lista visual):**

```
✕  Te dan el mismo plan a ti, a tu pareja y a tu abuela.
   Solo cambian la cantidad de descansos.

✕  Llaman "IA" a un if-else con marketing.
   Ningún algoritmo real, solo plantillas.

✕  Te motivan con notificaciones infantiles.
   Cuando lo que necesitas es saber por qué hoy
   te toca entrenar más o menos.
```

**Cierre de sección:**
> "Si llevas más de un año entrenando en serio, ya lo sabes. Por eso estamos construyendo otra cosa."

---

### Sección 3: LA SOLUCIÓN — 3 pilares

**Título:**
> "Tres cosas que ninguna otra app hace"

**Layout:** 3 columnas en desktop, 3 bloques apilados en mobile.

**Pilar 1:**
```
🎯 DECISIONES EXPLICADAS

Cada vez que la app te sube el peso, te baja
el volumen o te cambia el ejercicio, te dice
exactamente por qué. Con datos tuyos.
Sin cajas negras.
```

**Pilar 2:**
```
🧠 IA QUE APRENDE DE TI

Bandits contextuales entrenados con 50.000
usuarios virtuales antes de tocarte a ti.
No "IA" de marketing: matemáticas reales que
mejoran cada semana.
```

**Pilar 3:**
```
🔬 RESPALDADO POR CIENCIA

Más de 800 ejercicios catalogados con la
literatura científica detrás de cada decisión.
Citamos los papers. Verificable.
```

**Nota de diseño:** los emojis pueden sustituirse por iconos minimalistas si el branding lo pide. Pero **un solo símbolo por pilar**, no más.

---

### Sección 4: EL EXPERIMENTO PÚBLICO

Esta sección es tu diferenciador clave. **Es la sección que los demás no pueden copiar.**

**Título:**
> "Estamos comparando nuestra IA contra un coach humano. En público."

**Cuerpo:**
> "Durante 8 semanas, 8 voluntarios reales entrenan con nuestro sistema o con un coach profesional. Medimos 1RM, adherencia, satisfacción y composición corporal. Publicamos los resultados cada semana. Ganen quien ganen."

**Sub-bloque (caja destacada):**
```
┌────────────────────────────────────────┐
│  Sigue el experimento en directo       │
│                                        │
│  → Twitter: @[handle]                  │
│  → Última actualización: [fecha]       │
└────────────────────────────────────────┘
```

**Microcopy:**
> "Si la IA pierde, lo publicaremos igual. Esta es la única promesa que importa."

---

### Sección 5: WAITLIST + REFERIDOS

**Título:**
> "Plazas limitadas. Los primeros tienen ventaja."

**Cuerpo:**
> "La beta abre por oleadas. Los primeros 100 reciben acceso de por vida y figuran como Founding Members en los créditos de la app. Cada amigo al que invites te sube puestos en la cola."

**Tabla visual de recompensas:**

```
┌─────────────────────┬──────────────────────────────────┐
│  1 amigo invitado   │  Subes 50 puestos                │
├─────────────────────┼──────────────────────────────────┤
│  3 amigos invitados │  Acceso garantizado a la Wave 1  │
├─────────────────────┼──────────────────────────────────┤
│  5 amigos invitados │  Founding 100: acceso de por vida│
├─────────────────────┼──────────────────────────────────┤
│  10 amigos invitados│  Founding Plus + créditos en app │
└─────────────────────┴──────────────────────────────────┘
```

**CTA secundario:**
```
┌───────────────────────────────┐
│  tu@email.com                 │
└───────────────────────────────┘
[ Reservar mi plaza → ]

Tu puesto será visible en cuanto te apuntes.
```

---

### Sección 6: FOOTER

**Estructura mínima:**

```
─────────────────────────────────────────────
[LOGO]

Construyendo en público desde mayo 2026.
→ Twitter   → Telegram   → contacto@dominio.com

Política de privacidad · Aviso legal · Cookies

© 2026 [Nombre del producto]
─────────────────────────────────────────────
```

**Imprescindibles legales (RGPD):**
- Política de privacidad (plantilla gratis en termsfeed.com)
- Aviso legal con tus datos (nombre, NIF/DNI, dirección de contacto)
- Banner de cookies si usas analytics (Cookiebot tiene plan gratis hasta 100 sub-páginas)

---

## 3. Decisiones de diseño

### Tipografía

**Recomendación principal:**
- **Headlines:** Inter Bold o Manrope ExtraBold (gratis en Google Fonts)
- **Cuerpo:** Inter Regular o Manrope Regular
- **Tamaños:** Headlines 48-64px desktop / 32-40px mobile. Cuerpo 16-18px.

**Por qué:** son fuentes técnicas, neutras, modernas. Refuerzan el posicionamiento "ingeniero serio", no "influencer fitness".

**Alternativas si quieres carácter:**
- Headlines en **JetBrains Mono** o **IBM Plex Mono** para look hyper-técnico
- Combinar serif (headline) + sans (cuerpo) si quieres tono editorial

### Paleta de colores

**Opción A — Tech sobrio (recomendada):**
```
Fondo:        #fafafa  (casi blanco)
Texto:        #1a1a1a  (casi negro)
Acento:       #0c447c  (azul oscuro)
Secundario:   #f4f1ea  (crema)
```

**Opción B — Atrevida si quieres destacar:**
```
Fondo:        #0a0a0a  (negro)
Texto:        #ffffff
Acento:       #00ff88  (verde neón)  ← solo para CTAs
```

**Evita:**
- Verde "tipo gym" (#4caf50). Demasiado genérico.
- Naranja motivacional. Refuerza lo que estás criticando.
- Gradientes. Anticuados y enmascarados como modernos.

### Espaciado y layout

- **Ancho máximo:** 1200px en desktop, centrado
- **Padding lateral:** 24px en mobile, 80px en desktop
- **Espacio entre secciones:** 80-120px desktop, 60-80px mobile
- **Cada sección debe respirar.** Si dudas, añade más espacio en blanco.

### Imágenes

**En la primera versión: ninguna.** Solo texto y un par de iconos.

**En la versión 2 (a partir de junio):**
- Una captura de pantalla de la app mostrando la "explicación de la decisión"
- Un screenshot de un thread de Twitter del experimento
- Cero stock photos. Cero gente sonriendo en gimnasios. Cero.

---

## 4. Stack técnico recomendado

### Opción 1: Carrd Pro (la más simple, ~19€/año)

**Pros:**
- Setup en 1-2 horas
- Plantillas decentes para landing de waitlist
- Dominio personalizado incluido
- Integración nativa con Mailchimp, ConvertKit
- Hosting incluido, sin mantenimiento

**Contras:**
- Limitaciones de personalización avanzada
- No SEO técnico avanzado

**Cuándo elegirlo:** si quieres la landing online en menos de un día.

### Opción 2: Framer (más flexible, ~10€/mes plan Mini)

**Pros:**
- Diseño visual avanzado, animaciones suaves
- Mejor SEO técnico
- A/B testing nativo
- Más fácil iterar diseño después

**Contras:**
- Curva de aprendizaje de 2-3 días
- Más caro a medio plazo

**Cuándo elegirlo:** si quieres que la landing tenga "wow factor" de diseño.

### Opción 3: HTML estático custom (gratis, control total)

**Pros:**
- Cero coste de hosting (Vercel, Netlify, GitHub Pages gratis)
- Velocidad máxima
- Control absoluto

**Contras:**
- Tiempo de desarrollo: 1-2 días
- Necesitas integrar tu propio sistema de captación de emails

**Cuándo elegirlo:** si tienes el tiempo y quieres optimizar al máximo.

### Recomendación honesta

**Carrd Pro.** En tu situación (cero presupuesto, prisa, sin diseñador), 19€/año por una landing decente y sin mantenimiento es el ROI más alto de todas las decisiones de stack.

---

## 5. Captura de emails y waitlist con referidos

### Herramienta recomendada: Getwaitlist.com

**Plan gratuito hasta 5.000 suscriptores.** Incluye:
- Sistema de puestos en la cola visible
- Tracking de referidos por enlace único
- Recompensas escalonadas configurables
- Página de "tu puesto en la cola" automática
- Integración con Carrd, Framer, HTML

### Setup paso a paso (30 minutos)

1. Crea cuenta en getwaitlist.com
2. Configura el waitlist con nombre del producto y dominio
3. Define las 4 recompensas escalonadas (1, 3, 5, 10 referidos)
4. Copia el snippet HTML del formulario
5. Pégalo en Carrd/Framer en la sección Hero y en la sección Waitlist
6. Personaliza la página de confirmación con tu copy

### Página de confirmación (post-suscripción)

Cuando alguien se apunta, aparece en una página así:

```
✓ Estás dentro

Tu puesto en la cola: #847 de 1.234

Sube puestos invitando a amigos:
[Copiar mi enlace de invitación]

→ Síguenos en Twitter para ver el experimento
→ Únete al Telegram para hablar con el equipo
```

**Importante:** después de la suscripción, el siguiente CTA debe ser **unirse al Telegram**. Esto es lo que convierte un email frío en una persona involucrada en el proyecto.

---

## 6. Checklist técnico de lanzamiento

Antes de hacer público el dominio, verifica todo esto.

### Performance

- [ ] Lighthouse score > 90 en mobile
- [ ] Tiempo de carga < 2s en 4G
- [ ] Sin errores en consola del navegador
- [ ] Imágenes en formato WebP, máximo 200KB cada una
- [ ] Sin librerías JS innecesarias

### SEO básico

- [ ] Title tag: "[Nombre] · La app de fitness que te explica por qué"
- [ ] Meta description: 150-160 caracteres con keyword "app fitness IA"
- [ ] Open Graph image: 1200x630px (la imagen que aparece al compartir en redes)
- [ ] Open Graph title y description configurados
- [ ] Favicon en todos los tamaños (16, 32, 192, 512px)

### Legal (RGPD obligatorio en España)

- [ ] Política de privacidad enlazada en footer
- [ ] Aviso legal con datos identificativos del responsable
- [ ] Banner de cookies si hay analytics
- [ ] Consentimiento explícito en el formulario ("Acepto recibir comunicaciones...")
- [ ] Doble opt-in en el email de confirmación

### Funcional

- [ ] Formulario de email funciona en mobile y desktop
- [ ] Validación de email frontend (rechaza emails malformados)
- [ ] Página de confirmación se muestra correctamente
- [ ] Email de bienvenida llega en menos de 30 segundos
- [ ] Enlace de referido funciona y trackea correctamente
- [ ] Telegram link funciona desde mobile (abre la app)

### Tracking

- [ ] Google Analytics 4 instalado o Plausible (más simple, sin cookies)
- [ ] Eventos de conversión configurados:
  - Click en CTA primario
  - Email enviado correctamente
  - Click en enlace de Telegram
  - Click en enlace de Twitter
- [ ] UTM parameters preparados para campañas

### Cross-browser

- [ ] Probado en Chrome, Safari, Firefox
- [ ] Probado en iOS Safari y Chrome Android
- [ ] Probado en pantallas pequeñas (iPhone SE, 375px)
- [ ] Probado en tablet (iPad, 768px)

---

## 7. Email de bienvenida (post-suscripción)

El primer email que llega al suscriptor es **crítico**. Si es genérico, los pierdes. Si es bueno, los conviertes en seguidores.

**Asunto:**
> "Bienvenido. Aquí tienes el contexto que necesitas."

**Cuerpo:**

```
Hola [nombre o "atleta"],

Acabas de apuntarte a la beta de [nombre]. Antes
de nada: gracias. En serio.

Esto es lo que va a pasar a partir de ahora:

1. Cada 7-10 días recibirás un email con avances
   reales del producto y del experimento público.
   Sin spam, sin "tips de fitness", sin humo.

2. Tu puesto en la cola es: #[número]. Si invitas a
   amigos con tu enlace, subes puestos. Los
   primeros 100 reciben acceso de por vida y entran
   como Founding Members.

3. La beta abre en oleadas a partir de julio. Te
   avisaremos cuando te toque.

4. Si te interesa el detrás del código, únete al
   Telegram. Allí publicamos decisiones técnicas,
   resultados del simulador y respondemos preguntas
   en directo:
   → [enlace al Telegram]

5. Si no te interesa esto, simplemente no abras los
   próximos emails. No te vamos a perseguir.

Una pregunta para ti: ¿cuál es la cosa que más
odias de las apps de fitness que has usado?
Responde a este email, lo leo todo personalmente.

Hasta pronto,
[tu nombre]
Founder de [nombre del producto]

PS: aquí está el último thread del experimento
público IA vs coach humano:
→ [enlace al thread]
```

**Por qué funciona este email:**
- Tono honesto, no "marketinero"
- Explica qué pasa después (reduce ansiedad del usuario)
- Pide una respuesta abierta (genera engagement real)
- Da una salida clara (no sentirse atrapado)
- El PS al final es lo más leído de todo el email

---

## 8. Iteración después del lanzamiento

La landing no se queda quieta. Una vez online, mide y ajusta.

### Métricas clave a vigilar

| Métrica | Objetivo razonable | Acción si no llega |
|---|---|---|
| Conversion rate (visita → email) | 15-25% | Revisar headline (es lo primero) |
| Bounce rate | < 60% | Mejorar velocidad o claridad del hero |
| Tiempo medio en página | > 30s | Hacer el copy más interesante |
| Click en Telegram tras suscripción | > 25% | Hacer el CTA más visible |
| Ratio de referidos | 0.3-0.5 emails extra/suscriptor | Revisar incentivos del programa |

### Test A/B prioritarios (en este orden)

1. **Headline del hero** (impacto: 30-50% de la conversión)
2. **CTA del botón** (impacto: 10-20%)
3. **Subheadline del hero** (impacto: 5-15%)
4. **Estructura de los 3 pilares** (impacto: 5-10%)
5. **Sección del experimento** (impacto: 5-10% en interés general)

**Regla:** un solo test a la vez, con al menos 200 visitantes por variante antes de decidir.

### Versión 2 (a partir de junio)

Cuando tengas el primer mes de datos del experimento público, añade:
- Sección con **resultados parciales** del experimento (gráficas reales)
- Sección con **testimoniales en vídeo** de los Wave 0 (a partir de julio)
- **Contador en directo** del número de suscriptores ("847 atletas ya están dentro")
- **Captura de pantalla** real de la app mostrando una decisión explicada

---

## 9. Errores comunes a evitar

| Error | Por qué falla | Qué hacer en su lugar |
|---|---|---|
| Hero con vídeo autoplay | Carga lenta, mal en mobile, distrae del CTA | Texto puro o imagen estática |
| "Únete a la revolución del fitness" | Genérico, sin contenido | Headline específico con tu diferencial |
| Lista de 10 features | Nadie lee 10 cosas | Máximo 3 pilares |
| Stock photos de gente en gimnasio | Irrelevante, fake, todos las usan | Cero imágenes o capturas reales |
| "Próximamente" sin fecha | No genera urgencia | Fecha concreta de lanzamiento |
| Formulario con 5 campos | Cada campo extra reduce conversión 7% | Solo email, nada más |
| CTA "Enviar" o "Suscribirse" | Genérico, no vende | Acción específica: "Reservar mi plaza" |
| Footer con 20 enlaces | Distrae del objetivo | Footer mínimo: legal + contacto + redes |
| Pop-ups de salida | Irrita en mobile, ilegal sin consentimiento RGPD | No usar |
| Testimonios falsos o sin nombre | Detectables, destruyen credibilidad | No usar testimonios hasta tener Wave 0 |

---

## 10. Resumen ejecutivo: lo mínimo viable

Si solo tienes un fin de semana para montar la landing, hazlo así:

**Sábado mañana:**
- Compra dominio (.com, 25€)
- Crea cuenta Carrd Pro (19€/año)
- Crea cuenta Getwaitlist.com (gratis)

**Sábado tarde:**
- Diseña hero + sección de problema en Carrd
- Integra el formulario de Getwaitlist en el hero

**Domingo mañana:**
- Diseña sección de 3 pilares + experimento + waitlist con referidos
- Footer con legal básico

**Domingo tarde:**
- Configura el email de bienvenida
- Tests cross-browser
- Publica

**Lunes:**
- Twitter: anuncio de que la landing está online
- Pides a 5 amigos que la prueben y te den feedback
- Iteras lo que se haya roto

Total: 12-15 horas de trabajo, ~50€ de inversión, landing operativa.

---

## Anexo: variables a personalizar en este documento

Cuando tengas decidido el branding, sustituye estas variables:

- `[Nombre del producto]` → tu nombre comercial
- `[handle]` → tu @ de Twitter
- `[dominio]` → tu .com
- `[fecha]` → fecha real de la última actualización
- `[tu nombre]` → tu nombre real (founder)
- `[número]` → en automático desde Getwaitlist

---

**Última nota:** la landing es tu cara pública desde mayo hasta septiembre. Cada visitante que rebote sin convertir es un potencial beta tester perdido. Pero también: cada hora que pases puliendo la landing en lugar de produciendo contenido en Twitter es una hora que no compensa. **Lánzala mediocre el día 1. Itera con datos reales después.**
