import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const ALLOWED_ORIGINS = new Set([
  'https://2trainapp.com',
  'https://www.2trainapp.com',
  'http://localhost:8000',
  'http://127.0.0.1:8000',
])

function buildCors(origin: string | null) {
  const allow = origin && ALLOWED_ORIGINS.has(origin) ? origin : 'https://2trainapp.com'
  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Vary': 'Origin',
  }
}

Deno.serve(async (req) => {
  const corsHeaders = buildCors(req.headers.get('origin'))

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { email, referred_by, lang, hp } = await req.json()
    const isEn = lang === 'en'

    // Honeypot: campo oculto que solo rellenan los bots → respondemos OK sin registrar nada.
    if (hp && String(hp).trim() !== '') {
      return new Response(JSON.stringify({ ok: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(JSON.stringify({ error: 'Email inválido' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // Rate limit por IP: máx. 10 intentos/hora. Resiliente: si la tabla signup_log
    // aún no existe, count = null → no limita (fail open).
    const ip = (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() || 'unknown'
    const rlSince = new Date(Date.now() - 60 * 60 * 1000).toISOString()
    const rl = await supabase.from('signup_log')
      .select('*', { count: 'exact', head: true })
      .eq('ip', ip).gte('created_at', rlSince)
    if ((rl.count ?? 0) >= 10) {
      return new Response(JSON.stringify({ error: isEn ? 'Too many attempts. Please try again later.' : 'Demasiados intentos. Inténtalo más tarde.' }), {
        status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }
    await supabase.from('signup_log').insert({ ip })

    // Insert — if duplicate, fetch existing record
    const { data: inserted, error: insertError } = await supabase
      .from('waitlist')
      .insert({ email, referred_by: referred_by || null })
      .select('referral_code')
      .single()

    let referralCode: string
    let alreadyRegistered = false

    if (insertError) {
      if (insertError.code === '23505') {
        alreadyRegistered = true
        const { data: existing } = await supabase
          .from('waitlist')
          .select('referral_code')
          .eq('email', email)
          .single()
        referralCode = existing!.referral_code
      } else {
        throw insertError
      }
    } else {
      referralCode = inserted!.referral_code
    }

    // Get position
    const { data: posData } = await supabase.rpc('get_waitlist_position', { p_email: email })
    const position: number = posData ?? 0

    // Get projected positions with extra referrals
    const [r1, r2, r3] = await Promise.all([
      supabase.rpc('project_waitlist_position', { p_email: email, p_extra_referrals: 1 }),
      supabase.rpc('project_waitlist_position', { p_email: email, p_extra_referrals: 2 }),
      supabase.rpc('project_waitlist_position', { p_email: email, p_extra_referrals: 3 }),
    ])
    const projection = { '1': r1.data ?? position, '2': r2.data ?? position, '3': r3.data ?? position }

    // Stats para el modal (resilientes: si locked_position aún no existe → 0/null).
    const totalRes = await supabase.from('waitlist').select('*', { count: 'exact', head: true })
    const total = totalRes.count ?? 0
    const lockedRes = await supabase.from('waitlist').select('*', { count: 'exact', head: true }).not('locked_position', 'is', null)
    const lockedCount = lockedRes.count ?? 0
    const refRes = await supabase.from('waitlist').select('*', { count: 'exact', head: true }).eq('referred_by', referralCode)
    const referrals = refRes.count ?? 0
    const lockedRowRes = await supabase.from('waitlist').select('locked_position').eq('email', email).maybeSingle()
    const lockedPosition = (lockedRowRes.data as { locked_position?: number } | null)?.locked_position ?? null

    // Dominio público FIJO (evita usar SITE_URL mal configurado, p.ej. la URL de Vercel).
    const siteUrl = 'https://2trainapp.com'
    const referralLink = `${siteUrl}?ref=${referralCode}`

    // Tope diario de emails: backstop anti-flood para no quemar Resend / la reputación
    // del dominio. (Resend gratis = 100/día; sube/baja DAILY_EMAIL_CAP según tu plan.)
    const dayStart = new Date(); dayStart.setUTCHours(0, 0, 0, 0)
    const dc = await supabase.from('waitlist')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', dayStart.toISOString())
    const dailyCount = dc.count ?? 0
    const DAILY_EMAIL_CAP = 300

    // Send email only on first signup (y por debajo del tope diario)
    if (!alreadyRegistered && dailyCount <= DAILY_EMAIL_CAP) {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: '2trAIn Waitlist <waitlist@2trainapp.com>',
          to: email,
          subject: isEn ? `You're #${position} on the 2trAIn waitlist` : `Eres el #${position} en la waitlist de 2trAIn`,
          html: buildEmail(position, referralLink, isEn),
        }),
      })
    }

    return new Response(JSON.stringify({ referral_code: referralCode, position, projection, already_registered: alreadyRegistered, total, locked: lockedCount, referrals, locked_position: lockedPosition }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error(err)
    return new Response(JSON.stringify({ error: 'Error interno' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})

// Email en tema OSCURO, alineado con la identidad de la landing (fondo #0A0A0A, acento #2A6FDB).
// Bilingüe: isEn=true → inglés; si no, español.
function buildEmail(position: number, referralLink: string, isEn: boolean): string {
  const t = isEn
    ? {
        lang: 'en', title: "You're in — 2trAIn", eyebrow: 'Spot confirmed', sub: 'on the 2trAIn waitlist',
        ctaTop: 'View my spot →', how: 'How you move up',
        w1: 'Wave 1 — First 100', w1s: 'Lifetime access · Free forever', w1b: '3 referrals ⚡',
        w2: 'Wave 2 — Next 150', w2s: 'Access weeks after launch', w2b: '1 referral',
        w3: 'Wave 3 — Last 150', w3s: 'First come, first served', w3b: 'Waitlist',
        refK: 'Your referral link', refS: 'Share and move up. With 3 friends you lock in Wave 1.',
        shareBtn: 'Share my link →', urg: 'Only 100 Wave 1 spots.',
        urg1: "Once they're gone, there's no going back.", urg2: '3 friends = lifetime access, free.',
        team: '— The 2trAIn team', signup: 'You signed up at',
        wa: `Train solo with no guidance? I just reserved my spot in 2trAIn, an AI personal coach that tells you exactly what to do at every moment. Only 100 free lifetime spots. Join with my link and we both move up the list 👇\n${referralLink}`,
        tw: `Just reserved my spot in 2trAIn ⚡\n\nAn AI personal coach that adapts to you in real time.\n\nOnly 100 free-forever spots. Get in before it fills up →`,
      }
    : {
        lang: 'es', title: 'Estás dentro de 2trAIn', eyebrow: 'Plaza confirmada', sub: 'en la waitlist de 2trAIn',
        ctaTop: 'Ver mi posición →', how: 'Cómo subes de posición',
        w1: 'Wave 1 — Primeros 100', w1s: 'Acceso de por vida · Gratis para siempre', w1b: '3 referidos ⚡',
        w2: 'Wave 2 — Siguientes 150', w2s: 'Acceso semanas después del lanzamiento', w2b: '1 referido',
        w3: 'Wave 3 — Últimas 150', w3s: 'Por orden de llegada', w3b: 'Lista de espera',
        refK: 'Tu link de referido', refS: 'Comparte y sube posiciones. Con 3 amigos tienes Wave 1 garantizado.',
        shareBtn: 'Compartir mi link →', urg: 'Solo 100 plazas Wave 1.',
        urg1: 'Cuando se llenen, no hay vuelta atrás.', urg2: '3 amigos = acceso de por vida, gratis.',
        team: '— El equipo de 2trAIn', signup: 'Te apuntaste en',
        wa: `¿Entrenas solo y sin guía? Acabo de reservar mi plaza en 2trAIn, un entrenador personal con IA que te dice exactamente qué hacer en cada momento. Solo hay 100 plazas gratuitas de por vida. Entra con mi link y los dos subimos posiciones en la lista 👇\n${referralLink}`,
        tw: `Acabo de reservar mi plaza en 2trAIn ⚡\n\nUn entrenador personal con IA que se adapta a ti en tiempo real.\n\nSolo 100 plazas gratis para siempre. Entra antes de que se llene →`,
      }

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(t.wa)}`
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(t.tw)}&url=${encodeURIComponent(referralLink)}`
  const font = `-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif`

  return `<!DOCTYPE html>
<html lang="${t.lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="color-scheme" content="dark">
  <meta name="supported-color-schemes" content="dark">
  <title>${t.title}</title>
</head>
<body style="margin:0;padding:0;background-color:#0a0a0a;font-family:${font};">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a0a0a;padding:24px 12px;">
<tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:540px;">

  <!-- HEADER -->
  <tr><td style="padding:8px 4px 20px;">
    <img src="https://2trainapp.com/assets/logo-texto.png" width="140" height="20" alt="2trAIn" style="display:block;height:20px;width:auto;border:0;outline:none;">
  </td></tr>

  <!-- HERO -->
  <tr><td style="background:#0e0e0e;border:1px solid #1f1f1f;border-radius:16px 16px 0 0;border-bottom:none;padding:36px 32px 32px;text-align:center;">
    <p style="margin:0 0 10px;font-size:11px;font-weight:700;letter-spacing:0.22em;text-transform:uppercase;color:#5a8fe3;">${t.eyebrow}</p>
    <p style="margin:0;font-size:88px;font-weight:800;letter-spacing:-3px;color:#ffffff;line-height:1;">#${position}</p>
    <p style="margin:10px 0 26px;font-size:14px;color:#8a8a8a;">${t.sub}</p>
    <a href="${referralLink}" style="display:inline-block;background:#2a6fdb;color:#ffffff;font-size:14px;font-weight:700;padding:13px 30px;border-radius:999px;text-decoration:none;">${t.ctaTop}</a>
  </td></tr>

  <!-- BODY CARD -->
  <tr><td style="background:#111111;border:1px solid #1f1f1f;border-top:none;border-radius:0 0 16px 16px;padding:4px 28px 8px;">

    <!-- Waves -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr><td style="padding:26px 0 8px;">
        <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;color:#8a8a8a;">${t.how}</p>
      </td></tr>

      <tr><td style="border-top:1px solid #1f1f1f;padding:16px 0;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
          <td>
            <p style="margin:0 0 2px;font-size:15px;font-weight:700;color:#ffffff;">${t.w1}</p>
            <p style="margin:0;font-size:12.5px;color:#8a8a8a;">${t.w1s}</p>
          </td>
          <td align="right" style="padding-left:8px;white-space:nowrap;">
            <span style="background:#0e1830;color:#5a8fe3;font-size:11px;font-weight:700;padding:5px 11px;border-radius:999px;border:1px solid #1e3a6e;">${t.w1b}</span>
          </td>
        </tr></table>
      </td></tr>

      <tr><td style="border-top:1px solid #1f1f1f;padding:16px 0;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
          <td>
            <p style="margin:0 0 2px;font-size:15px;font-weight:700;color:#ffffff;">${t.w2}</p>
            <p style="margin:0;font-size:12.5px;color:#8a8a8a;">${t.w2s}</p>
          </td>
          <td align="right" style="padding-left:8px;white-space:nowrap;">
            <span style="background:#161616;color:#8a8a8a;font-size:11px;font-weight:700;padding:5px 11px;border-radius:999px;border:1px solid #2a2a2a;">${t.w2b}</span>
          </td>
        </tr></table>
      </td></tr>

      <tr><td style="border-top:1px solid #1f1f1f;padding:16px 0 22px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
          <td>
            <p style="margin:0 0 2px;font-size:15px;font-weight:700;color:#ffffff;">${t.w3}</p>
            <p style="margin:0;font-size:12.5px;color:#8a8a8a;">${t.w3s}</p>
          </td>
          <td align="right" style="padding-left:8px;white-space:nowrap;">
            <span style="background:#161616;color:#666666;font-size:11px;font-weight:700;padding:5px 11px;border-radius:999px;border:1px solid #242424;">${t.w3b}</span>
          </td>
        </tr></table>
      </td></tr>
    </table>

    <!-- Referral -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr><td style="border-top:1px solid #1f1f1f;padding:24px 0 0;">
        <p style="margin:0 0 6px;font-size:11px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;color:#5a8fe3;">${t.refK}</p>
        <p style="margin:0 0 14px;font-size:13.5px;color:#8a8a8a;line-height:1.5;">${t.refS}</p>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0d0d0d;border:1px solid #1f1f1f;border-radius:8px;margin-bottom:12px;">
          <tr><td style="padding:13px 14px;">
            <p style="margin:0;font-size:12px;color:#9aa0a8;word-break:break-all;font-family:'Courier New',Courier,monospace;">${referralLink}</p>
          </td></tr>
        </table>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:8px;">
          <tr>
            <td width="50%" style="padding-right:4px;">
              <a href="${whatsappUrl}" style="display:block;background:#25d366;color:#0a0a0a;font-size:13px;font-weight:700;padding:13px 0;border-radius:8px;text-decoration:none;text-align:center;">WhatsApp</a>
            </td>
            <td width="50%" style="padding-left:4px;">
              <a href="${twitterUrl}" style="display:block;background:#1a1a1a;border:1px solid #2a2a2a;color:#ffffff;font-size:13px;font-weight:700;padding:12px 0;border-radius:8px;text-decoration:none;text-align:center;">X / Twitter</a>
            </td>
          </tr>
        </table>
        <a href="${referralLink}" style="display:block;background:#2a6fdb;color:#ffffff;font-size:14px;font-weight:700;padding:14px 0;border-radius:8px;text-decoration:none;text-align:center;">${t.shareBtn}</a>
      </td></tr>
    </table>

    <!-- Urgency -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr><td style="border-top:1px solid #1f1f1f;padding:26px 0 28px;text-align:center;">
        <p style="margin:0 0 6px;font-size:21px;font-weight:800;color:#ffffff;letter-spacing:-0.3px;">${t.urg}</p>
        <p style="margin:0;font-size:13px;color:#8a8a8a;line-height:1.6;">${t.urg1}<br><strong style="color:#5a8fe3;">${t.urg2}</strong></p>
      </td></tr>
    </table>

  </td></tr>

  <!-- FOOTER -->
  <tr><td style="padding:18px 0 24px;text-align:center;">
    <p style="margin:0 0 3px;font-size:12px;color:#555555;">${t.team}</p>
    <p style="margin:0;font-size:11px;color:#444444;">${t.signup} <a href="${referralLink.split('?')[0]}" style="color:#5a8fe3;text-decoration:none;">2trainapp.com</a></p>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`
}
