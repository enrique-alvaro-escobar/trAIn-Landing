# Mejoras pendientes — 2trainapp.com

> **DOCUMENTO HISTORICO — NO ES UN BACKLOG VIVO.**
> Auditoria del 16/05/2026. Revisado el 02/09/2026: sus tres bloqueantes de
> rendimiento estan resueltos (el favicon ya es un archivo, TT Firs Neue se
> sirve local, GSAP y ScrollTrigger son locales y Tailwind esta compilado en
> `dist/`), y su duda abierta sobre RLS la cerro
> `supabase/migrations/20260616110000_security_lockdown.sql`. Lo unico que
> seguia vigente —que todo el repo se servia publicamente— se cerro con el
> `.vercelignore` creado el 02/09/2026. No planifiques a partir de aqui.

Resultado de la auditoría completa realizada el 16/05/2026. Todo lo que está en este documento funciona correctamente; estas son optimizaciones y tareas pendientes ordenadas por prioridad.

---

## 🔴 Rendimiento (prioridad alta)

### Favicon embebido en base64 (~300 KB por página)
Las tres páginas (`index.html`, `privacidad/`, `terminos/`) tienen el favicon como `data:image/png;base64,...` inline. Eso infla las páginas legales de ~4 KB de contenido a **404 KB**, y `index.html` de ~43 KB a **692 KB**.

**Arreglo:** extraer el favicon a un archivo `favicon.png` (redimensionado a 48×48 px) y referenciar con `<link rel="icon" href="/favicon.png">` en las tres páginas.

Impacto estimado: páginas legales 404 KB → ~4 KB; `index.html` 692 KB → ~290 KB.

### Mockups de móvil embebidos en base64 (~83 KB c/u)
Los tres mockups de teléfono en `index.html` usan `src="data:image/png;base64,..."` en lugar de archivos. Ya existen imágenes en `assets/` (`app-plan.jpeg`, `app-splash.jpeg`, `summary.png`, `weekly-plan.png`, `while-training.png`) — verificar si son las mismas y reemplazar los base64 por `<img src="/assets/...">`.

---

## 🟡 Accesibilidad

### 3 imágenes sin atributo `alt`
Los tres `<img>` de los mockups de móvil no tienen `alt`. Añadir texto descriptivo o `alt=""` si son decorativos.

---

## 🟡 Seguridad / Infraestructura (pasos fuera del repo)

### Desplegar Edge Function para activar el CORS restrictivo
El cambio de CORS `*` → `https://2trainapp.com` está en el código pero **no activo** hasta que se despliegue:
```bash
supabase functions deploy join-waitlist
```

### Verificar RLS en la tabla `waitlist`
Confirmar en el dashboard de Supabase que **Row Level Security está activado** en la tabla `waitlist`. Sin RLS, cualquiera con la anon key (visible en el código, como es habitual en Supabase) podría leer todos los emails.

### Confirmar secrets de Supabase
Verificar que están configurados en Supabase → Project Settings → Edge Functions → Secrets:
- `RESEND_API_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (lo inyecta Supabase automáticamente, pero confirmar)
- `SITE_URL` (opcional; si no está, el fallback es `https://2trainapp.com`)

### Valorar rate limiting anti-spam
El formulario de waitlist no tiene rate limiting. Alguien podría enviar peticiones masivas y consumir cuota de Resend. Opciones: activar rate limiting en Supabase (Project Settings → API), o implementar un contador por IP en la Edge Function.

---

## 🟢 Dominio

### `www.2trainapp.com` no resuelve
El subdominio `www` no tiene registro DNS. Los usuarios que escriban `www.2trainapp.com` no llegarán a la landing.

**Arreglo:**
1. En IONOS, añadir un registro CNAME: `www` → `cname.vercel-dns.com`
2. En Vercel, añadir `www.2trainapp.com` al proyecto `tr-a-in-landing` (Settings → Domains)
3. Configurar un redirect 301 de `www` → apex en `vercel.json`:
```json
{
  "redirects": [
    { "source": "/:path*", "has": [{"type": "host", "value": "www.2trainapp.com"}], "destination": "https://2trainapp.com/:path*", "permanent": true }
  ]
}
```

---

## 🔵 Limpieza menor

- **Archivos duplicados en raíz:** `weekly-plan.png` y `while-training.png` en la raíz son copias exactas de los que hay en `assets/` y no están referenciados en ningún HTML. Borrar.
- **SRI en CDN scripts:** los `<script>` de Tailwind, GSAP y Google Fonts no tienen atributo `integrity` (Subresource Integrity). Menor riesgo para una landing, pero recomendable en producción.
- **Tailwind CDN "play":** `cdn.tailwindcss.com` es el CDN de desarrollo y muestra un aviso en consola en producción. Para una build final, considerar el CLI de Tailwind o el CDN con versión fija de `cdn.jsdelivr.net`.
