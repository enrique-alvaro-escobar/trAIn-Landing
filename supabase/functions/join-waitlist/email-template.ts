/**
 * Plantilla HTML del email de confirmación de waitlist (Resend).
 *
 * Light (default): fondo claro + wordmark negro.
 * Dark (@media prefers-color-scheme: dark): fondo azul marca #2A6FDB + wordmark blanco.
 *
 * Los headers del logo son PNG OPACOS del mismo color que el fondo (Gmail rellena
 * la transparencia PNG con blanco y generaba la "caja" blanca).
 */

const BRAND = '#2A6FDB'
const BRAND_SOFT = '#5a8fe3'
const LIGHT_BG = '#eef1f6'
const LIGHT_CARD = '#ffffff'
const LIGHT_HERO = '#f7f8fb'
const LIGHT_BORDER = '#e2e5eb'
const LIGHT_TEXT = '#1a1a1a'
const LIGHT_MUTED = '#5b6270'
const CARD_W = '540'
const LOGO_LIGHT = 'https://2trainapp.com/assets/logo-header-light.png'
const LOGO_DARK = 'https://2trainapp.com/assets/logo-header-dark.png'

export function buildEmail(
  position: number,
  referralLink: string,
  isEn: boolean,
  referrals = 0,
  spotLink?: string,
): string {
  const viewLink = spotLink || referralLink
  const referralsNeeded = 3
  const referralsClamped = Math.max(0, Math.min(referrals, referralsNeeded))
  const barPct = Math.round((referralsClamped / referralsNeeded) * 100)
  const barWidth = barPct === 0 ? 0 : Math.max(barPct, 8)
  const progressFill = barWidth === 0
    ? `<tr><td style="height:8px;line-height:8px;font-size:0;mso-line-height-rule:exactly;">&nbsp;</td></tr>`
    : `<tr>
        <td style="padding:0;">
          <table role="presentation" width="${barWidth}%" cellpadding="0" cellspacing="0" bgcolor="${BRAND}" style="width:${barWidth}%;background-color:${BRAND};border-radius:999px;">
            <tr><td style="height:8px;line-height:8px;font-size:0;mso-line-height-rule:exactly;">&nbsp;</td></tr>
          </table>
        </td>
      </tr>`

  const t = isEn
    ? {
        lang: 'en',
        title: "You're in — 2trAIn",
        preheader: `Your spot #${position} is confirmed — share your link to move up.`,
        eyebrow: 'Spot confirmed',
        sub: 'on the 2trAIn waitlist',
        ctaTop: 'View my spot →',
        how: 'How you move up',
        w1: 'Wave 1 — First 100',
        w1s: 'Lifetime access · Free forever',
        w1b: '3 referrals ⚡',
        w2: 'Wave 2 — Next 150',
        w2s: 'Access weeks after launch',
        w2b: '1 referral',
        w3: 'Wave 3 — Last 150',
        w3s: 'First come, first served',
        w3b: 'Waitlist',
        refProg: `You have ${referralsClamped} of ${referralsNeeded} referrals`,
        refK: 'Your referral link',
        refS: 'Share and move up. With 3 friends you lock in Wave 1.',
        shareBtn: 'Share on WhatsApp →',
        urg: 'Only 100 Wave 1 spots.',
        urg1: "Once they're gone, there's no going back.",
        urg2: '3 friends = lifetime access, free.',
        team: '— The 2trAIn team',
        signup: 'You signed up at',
        sender: '2trAIn · 2trainapp.com',
        unsub: 'Unsubscribe',
        unsubSubject: 'Unsubscribe from waitlist emails',
        wa: `Train solo with no guidance? I just reserved my spot in 2trAIn, an AI personal coach that tells you exactly what to do at every moment. Only 100 free lifetime spots. Join with my link and we both move up the list 👇\n${referralLink}`,
        tw: `Just reserved my spot in 2trAIn ⚡\n\nAn AI personal coach that adapts to you in real time.\n\nOnly 100 free-forever spots. Get in before it fills up →`,
      }
    : {
        lang: 'es',
        title: 'Estás dentro de 2trAIn',
        preheader: `Tu plaza #${position} está confirmada — comparte tu link para subir posiciones.`,
        eyebrow: 'Plaza confirmada',
        sub: 'en la waitlist de 2trAIn',
        ctaTop: 'Ver mi posición →',
        how: 'Cómo subes de posición',
        w1: 'Wave 1 — Primeros 100',
        w1s: 'Acceso de por vida · Gratis para siempre',
        w1b: '3 referidos ⚡',
        w2: 'Wave 2 — Siguientes 150',
        w2s: 'Acceso semanas después del lanzamiento',
        w2b: '1 referido',
        w3: 'Wave 3 — Últimas 150',
        w3s: 'Por orden de llegada',
        w3b: 'Lista de espera',
        refProg: `Llevas ${referralsClamped} de ${referralsNeeded} referidos`,
        refK: 'Tu link de referido',
        refS: 'Comparte y sube posiciones. Con 3 amigos tienes Wave 1 garantizado.',
        shareBtn: 'Compartir por WhatsApp →',
        urg: 'Solo 100 plazas Wave 1.',
        urg1: 'Cuando se llenen, no hay vuelta atrás.',
        urg2: '3 amigos = acceso de por vida, gratis.',
        team: '— El equipo de 2trAIn',
        signup: 'Te apuntaste en',
        sender: '2trAIn · 2trainapp.com',
        unsub: 'Darme de baja',
        unsubSubject: 'Baja emails waitlist',
        wa: `¿Entrenas solo y sin guía? Acabo de reservar mi plaza en 2trAIn, un entrenador personal con IA que te dice exactamente qué hacer en cada momento. Solo hay 100 plazas gratuitas de por vida. Entra con mi link y los dos subimos posiciones en la lista 👇\n${referralLink}`,
        tw: `Acabo de reservar mi plaza en 2trAIn ⚡\n\nUn entrenador personal con IA que se adapta a ti en tiempo real.\n\nSolo 100 plazas gratis para siempre. Entra antes de que se llene →`,
      }

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(t.wa)}`
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(t.tw)}&url=${encodeURIComponent(referralLink)}`
  const unsubUrl = `mailto:contact@2trainapp.com?subject=${encodeURIComponent(t.unsubSubject)}&body=${encodeURIComponent(referralLink)}`
  const font = `-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif`
  const siteRoot = referralLink.split('?')[0]

  return `<!DOCTYPE html>
<html lang="${t.lang}" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
  <title>${t.title}</title>
  <style>
    :root { color-scheme: light dark; }
    body { margin:0; padding:0; }
    .logo-dark { display:none !important; max-height:0 !important; overflow:hidden !important; mso-hide:all; }
    @media (prefers-color-scheme: dark) {
      .logo-light { display:none !important; max-height:0 !important; overflow:hidden !important; }
      .logo-dark { display:block !important; max-height:none !important; overflow:visible !important; }
      .page { background-color:${BRAND} !important; }
      .card, .hero, .body, .linkbox { background-color:${BRAND} !important; border-color:${BRAND_SOFT} !important; }
      .text-pri { color:#ffffff !important; }
      .text-mut { color:#d6e4f8 !important; }
      .accent { color:#ffffff !important; }
      .bar-track { background-color:#1e4f9e !important; }
      .pill-hi { background-color:#1e4f9e !important; color:#ffffff !important; border-color:#ffffff !important; }
      .pill-lo { background-color:#1e4f9e !important; color:#d6e4f8 !important; border-color:${BRAND_SOFT} !important; }
      .btn-pri { background-color:#ffffff !important; color:${BRAND} !important; }
      .btn-sec { background-color:${BRAND} !important; border-color:#ffffff !important; color:#ffffff !important; }
      .divider { border-color:${BRAND_SOFT} !important; }
      .footer a { color:#ffffff !important; }
    }
  </style>
</head>
<body class="page" style="margin:0;padding:0;background-color:${LIGHT_BG};font-family:${font};" bgcolor="${LIGHT_BG}">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all;">${t.preheader}</div>
<table role="presentation" class="page" width="100%" cellpadding="0" cellspacing="0" bgcolor="${LIGHT_BG}" style="background-color:${LIGHT_BG};padding:24px 12px;">
<tr><td align="center">
<table role="presentation" class="card" width="${CARD_W}" cellpadding="0" cellspacing="0" bgcolor="${LIGHT_CARD}" style="width:${CARD_W}px;max-width:100%;background-color:${LIGHT_CARD};border:1px solid ${LIGHT_BORDER};border-radius:16px;overflow:hidden;">

  <!-- LOGO: light default / dark via media query. Opaque headers = no white box in Gmail. -->
  <tr><td class="card" bgcolor="${LIGHT_CARD}" style="background-color:${LIGHT_CARD};padding:0;line-height:0;font-size:0;">
    <div class="logo-light" style="line-height:0;font-size:0;">
      <img src="${LOGO_LIGHT}" width="540" alt="2trAIn" style="display:block;width:100%;max-width:540px;height:auto;border:0;outline:none;">
    </div>
    <!--[if !mso]><!-->
    <div class="logo-dark" style="display:none;max-height:0;overflow:hidden;line-height:0;font-size:0;">
      <img src="${LOGO_DARK}" width="540" alt="2trAIn" style="display:block;width:100%;max-width:540px;height:auto;border:0;outline:none;">
    </div>
    <!--<![endif]-->
  </td></tr>

  <!-- HERO -->
  <tr><td class="hero" bgcolor="${LIGHT_HERO}" style="background-color:${LIGHT_HERO};border-top:1px solid ${LIGHT_BORDER};border-bottom:1px solid ${LIGHT_BORDER};padding:36px 32px 28px;text-align:center;">
    <p class="accent" style="margin:0 0 10px;font-size:11px;font-weight:700;letter-spacing:0.22em;text-transform:uppercase;color:${BRAND};">${t.eyebrow}</p>
    <p class="text-pri" style="margin:0;font-size:72px;font-weight:800;letter-spacing:-3px;color:${LIGHT_TEXT};line-height:1;">#${position}</p>
    <p class="text-mut" style="margin:10px 0 18px;font-size:14px;color:${LIGHT_MUTED};">${t.sub}</p>
    <a class="accent" href="${viewLink}" style="display:inline-block;color:${BRAND};font-size:13px;font-weight:600;text-decoration:underline;text-underline-offset:3px;">${t.ctaTop}</a>
  </td></tr>

  <!-- Progress -->
  <tr><td class="body" bgcolor="${LIGHT_CARD}" style="background-color:${LIGHT_CARD};padding:24px 28px 20px;">
    <p class="text-pri" style="margin:0 0 12px;font-size:13px;font-weight:700;color:${LIGHT_TEXT};line-height:1.4;">${t.refProg}</p>
    <!-- Barra: tabla anidada (evita la rayita vertical rara de % en celdas hermanas) -->
    <table role="presentation" class="bar-track" width="100%" cellpadding="0" cellspacing="0" bgcolor="#e8ebf0" style="width:100%;background-color:#e8ebf0;border-radius:999px;">
      ${progressFill}
    </table>
  </td></tr>

  <!-- Separador full-bleed -->
  <tr><td class="divider" bgcolor="${LIGHT_CARD}" style="background-color:${LIGHT_CARD};padding:0;border-top:1px solid ${LIGHT_BORDER};font-size:0;line-height:0;height:1px;">&nbsp;</td></tr>

  <!-- How / waves -->
  <tr><td class="body" bgcolor="${LIGHT_CARD}" style="background-color:${LIGHT_CARD};padding:20px 28px 8px;">
    <p class="text-mut" style="margin:0;font-size:11px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;color:${LIGHT_MUTED};line-height:1.4;">${t.how}</p>
  </td></tr>

  <tr><td class="divider" bgcolor="${LIGHT_CARD}" style="background-color:${LIGHT_CARD};padding:0;border-top:1px solid ${LIGHT_BORDER};font-size:0;line-height:0;height:1px;">&nbsp;</td></tr>
  <tr><td class="body" bgcolor="${LIGHT_CARD}" style="background-color:${LIGHT_CARD};padding:16px 28px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
      <td style="padding-right:12px;vertical-align:middle;">
        <p class="text-pri" style="margin:0 0 2px;font-size:15px;font-weight:700;color:${LIGHT_TEXT};line-height:1.35;">${t.w1}</p>
        <p class="text-mut" style="margin:0;font-size:12.5px;color:${LIGHT_MUTED};line-height:1.4;">${t.w1s}</p>
      </td>
      <td align="right" valign="middle" style="vertical-align:middle;white-space:nowrap;">
        <span class="pill-hi" style="display:inline-block;background:#e8f0fb;color:${BRAND};font-size:11px;font-weight:700;padding:5px 11px;border-radius:999px;border:1px solid #b7cef0;line-height:1.2;">${t.w1b}</span>
      </td>
    </tr></table>
  </td></tr>

  <tr><td class="divider" bgcolor="${LIGHT_CARD}" style="background-color:${LIGHT_CARD};padding:0;border-top:1px solid ${LIGHT_BORDER};font-size:0;line-height:0;height:1px;">&nbsp;</td></tr>
  <tr><td class="body" bgcolor="${LIGHT_CARD}" style="background-color:${LIGHT_CARD};padding:16px 28px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
      <td style="padding-right:12px;vertical-align:middle;">
        <p class="text-pri" style="margin:0 0 2px;font-size:15px;font-weight:700;color:${LIGHT_TEXT};line-height:1.35;">${t.w2}</p>
        <p class="text-mut" style="margin:0;font-size:12.5px;color:${LIGHT_MUTED};line-height:1.4;">${t.w2s}</p>
      </td>
      <td align="right" valign="middle" style="vertical-align:middle;white-space:nowrap;">
        <span class="pill-lo" style="display:inline-block;background:#f4f5f7;color:${LIGHT_MUTED};font-size:11px;font-weight:700;padding:5px 11px;border-radius:999px;border:1px solid ${LIGHT_BORDER};line-height:1.2;">${t.w2b}</span>
      </td>
    </tr></table>
  </td></tr>

  <tr><td class="divider" bgcolor="${LIGHT_CARD}" style="background-color:${LIGHT_CARD};padding:0;border-top:1px solid ${LIGHT_BORDER};font-size:0;line-height:0;height:1px;">&nbsp;</td></tr>
  <tr><td class="body" bgcolor="${LIGHT_CARD}" style="background-color:${LIGHT_CARD};padding:16px 28px 20px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
      <td style="padding-right:12px;vertical-align:middle;">
        <p class="text-pri" style="margin:0 0 2px;font-size:15px;font-weight:700;color:${LIGHT_TEXT};line-height:1.35;">${t.w3}</p>
        <p class="text-mut" style="margin:0;font-size:12.5px;color:${LIGHT_MUTED};line-height:1.4;">${t.w3s}</p>
      </td>
      <td align="right" valign="middle" style="vertical-align:middle;white-space:nowrap;">
        <span class="pill-lo" style="display:inline-block;background:#f4f5f7;color:#8a9099;font-size:11px;font-weight:700;padding:5px 11px;border-radius:999px;border:1px solid ${LIGHT_BORDER};line-height:1.2;">${t.w3b}</span>
      </td>
    </tr></table>
  </td></tr>

  <tr><td class="divider" bgcolor="${LIGHT_CARD}" style="background-color:${LIGHT_CARD};padding:0;border-top:1px solid ${LIGHT_BORDER};font-size:0;line-height:0;height:1px;">&nbsp;</td></tr>

  <!-- Referral -->
  <tr><td class="body" bgcolor="${LIGHT_CARD}" style="background-color:${LIGHT_CARD};padding:24px 28px 8px;">
    <p class="accent" style="margin:0 0 6px;font-size:11px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;color:${BRAND};line-height:1.4;">${t.refK}</p>
    <p class="text-mut" style="margin:0 0 14px;font-size:13.5px;color:${LIGHT_MUTED};line-height:1.5;">${t.refS}</p>
    <table role="presentation" class="linkbox" width="100%" cellpadding="0" cellspacing="0" bgcolor="#f7f8fb" style="width:100%;background-color:#f7f8fb;border:1px solid ${LIGHT_BORDER};border-radius:8px;margin-bottom:12px;">
      <tr><td style="padding:13px 14px;">
        <p class="text-pri" style="margin:0;font-size:12px;color:#4a5058;word-break:break-all;font-family:'Courier New',Courier,monospace;line-height:1.4;">${referralLink}</p>
      </td></tr>
    </table>
    <a class="btn-pri" href="${whatsappUrl}" style="display:block;background:${BRAND};color:#ffffff;font-size:14px;font-weight:700;padding:14px 0;border-radius:8px;text-decoration:none;text-align:center;margin-bottom:8px;line-height:1.2;">${t.shareBtn}</a>
    <a class="btn-sec" href="${twitterUrl}" style="display:block;background:#ffffff;border:1px solid ${LIGHT_BORDER};color:${LIGHT_TEXT};font-size:13px;font-weight:700;padding:12px 0;border-radius:8px;text-decoration:none;text-align:center;line-height:1.2;">X / Twitter</a>
  </td></tr>

  <tr><td class="divider" bgcolor="${LIGHT_CARD}" style="background-color:${LIGHT_CARD};padding:0;border-top:1px solid ${LIGHT_BORDER};font-size:0;line-height:0;height:1px;">&nbsp;</td></tr>

  <!-- Urgency -->
  <tr><td class="body" bgcolor="${LIGHT_CARD}" style="background-color:${LIGHT_CARD};padding:26px 28px 28px;text-align:center;">
    <p class="text-pri" style="margin:0 0 8px;font-size:21px;font-weight:800;color:${LIGHT_TEXT};letter-spacing:-0.3px;line-height:1.25;">${t.urg}</p>
    <p class="text-mut" style="margin:0;font-size:13px;color:${LIGHT_MUTED};line-height:1.6;">${t.urg1}<br><strong class="accent" style="color:${BRAND};">${t.urg2}</strong></p>
  </td></tr>
</table>

  <table role="presentation" class="footer" width="${CARD_W}" cellpadding="0" cellspacing="0" style="width:${CARD_W}px;max-width:100%;">
  <tr><td style="padding:18px 0 24px;text-align:center;">
    <p class="text-mut" style="margin:0 0 3px;font-size:12px;color:#8a9099;">${t.team}</p>
    <p class="text-mut" style="margin:0 0 10px;font-size:11px;color:#8a9099;">${t.signup} <a href="${siteRoot}" style="color:${BRAND};text-decoration:none;">2trainapp.com</a></p>
    <p class="text-mut" style="margin:0 0 6px;font-size:11px;color:#8a9099;">${t.sender}</p>
    <p class="text-mut" style="margin:0;font-size:11px;color:#8a9099;"><a href="${unsubUrl}" style="color:#8a9099;text-decoration:underline;">${t.unsub}</a></p>
  </td></tr>
  </table>

</td></tr>
</table>
</body>
</html>`
}
