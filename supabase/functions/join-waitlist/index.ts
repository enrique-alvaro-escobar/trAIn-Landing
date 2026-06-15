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
    const { email, referred_by } = await req.json()

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

    const siteUrl = Deno.env.get('SITE_URL') ?? 'https://2trainapp.com'
    const referralLink = `${siteUrl}?ref=${referralCode}`

    // Send email only on first signup
    if (!alreadyRegistered) {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: '2trAIn Waitlist <waitlist@2trainapp.com>',
          to: email,
          subject: `Eres el #${position} en la waitlist de 2trAIn`,
          html: buildEmail(position, referralLink),
        }),
      })
    }

    return new Response(JSON.stringify({ referral_code: referralCode, position, projection, already_registered: alreadyRegistered }), {
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
function buildEmail(position: number, referralLink: string): string {
  const waMsg = encodeURIComponent(`¿Entrenas solo y sin guía? Acabo de reservar mi plaza en 2trAIn, un entrenador personal con IA que te dice exactamente qué hacer en cada momento. Solo hay 100 plazas gratuitas de por vida. Entra con mi link y los dos subimos posiciones en la lista 👇\n${referralLink}`)
  const twMsg = encodeURIComponent(`Acabo de reservar mi plaza en 2trAIn ⚡\n\nUn entrenador personal con IA que se adapta a ti en tiempo real.\n\nSolo 100 plazas gratis para siempre. Entra antes de que se llene →`)
  const whatsappUrl = `https://wa.me/?text=${waMsg}`
  const twitterUrl = `https://twitter.com/intent/tweet?text=${twMsg}&url=${encodeURIComponent(referralLink)}`
  const font = `-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif`

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="color-scheme" content="dark">
  <meta name="supported-color-schemes" content="dark">
  <title>Estás dentro de 2trAIn</title>
</head>
<body style="margin:0;padding:0;background-color:#0a0a0a;font-family:${font};">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a0a0a;padding:24px 12px;">
<tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:540px;">

  <!-- HEADER -->
  <tr><td style="padding:8px 4px 20px;">
    <span style="font-size:18px;font-weight:800;letter-spacing:-0.3px;color:#ffffff;">2tr<span style="color:#5a8fe3;">AI</span>n</span>
  </td></tr>

  <!-- HERO -->
  <tr><td style="background:#0e0e0e;border:1px solid #1f1f1f;border-radius:16px 16px 0 0;border-bottom:none;padding:36px 32px 32px;text-align:center;">
    <p style="margin:0 0 10px;font-size:11px;font-weight:700;letter-spacing:0.22em;text-transform:uppercase;color:#5a8fe3;">Plaza confirmada</p>
    <p style="margin:0;font-size:88px;font-weight:800;letter-spacing:-3px;color:#ffffff;line-height:1;">#${position}</p>
    <p style="margin:10px 0 26px;font-size:14px;color:#8a8a8a;">en la waitlist de 2trAIn</p>
    <a href="${referralLink}" style="display:inline-block;background:#2a6fdb;color:#ffffff;font-size:14px;font-weight:700;padding:13px 30px;border-radius:999px;text-decoration:none;">Ver mi posición →</a>
  </td></tr>

  <!-- BODY CARD -->
  <tr><td style="background:#111111;border:1px solid #1f1f1f;border-top:none;border-radius:0 0 16px 16px;padding:4px 28px 8px;">

    <!-- Waves -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr><td style="padding:26px 0 8px;">
        <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;color:#8a8a8a;">Cómo subes de posición</p>
      </td></tr>

      <tr><td style="border-top:1px solid #1f1f1f;padding:16px 0;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
          <td>
            <p style="margin:0 0 2px;font-size:15px;font-weight:700;color:#ffffff;">Wave 1 — Primeros 100</p>
            <p style="margin:0;font-size:12.5px;color:#8a8a8a;">Acceso de por vida · Gratis para siempre</p>
          </td>
          <td align="right" style="padding-left:8px;white-space:nowrap;">
            <span style="background:#0e1830;color:#5a8fe3;font-size:11px;font-weight:700;padding:5px 11px;border-radius:999px;border:1px solid #1e3a6e;">3 referidos ⚡</span>
          </td>
        </tr></table>
      </td></tr>

      <tr><td style="border-top:1px solid #1f1f1f;padding:16px 0;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
          <td>
            <p style="margin:0 0 2px;font-size:15px;font-weight:700;color:#ffffff;">Wave 2 — Siguientes 150</p>
            <p style="margin:0;font-size:12.5px;color:#8a8a8a;">Acceso semanas después del lanzamiento</p>
          </td>
          <td align="right" style="padding-left:8px;white-space:nowrap;">
            <span style="background:#161616;color:#8a8a8a;font-size:11px;font-weight:700;padding:5px 11px;border-radius:999px;border:1px solid #2a2a2a;">1 referido</span>
          </td>
        </tr></table>
      </td></tr>

      <tr><td style="border-top:1px solid #1f1f1f;padding:16px 0 22px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
          <td>
            <p style="margin:0 0 2px;font-size:15px;font-weight:700;color:#ffffff;">Wave 3 — Últimas 150</p>
            <p style="margin:0;font-size:12.5px;color:#8a8a8a;">Por orden de llegada</p>
          </td>
          <td align="right" style="padding-left:8px;white-space:nowrap;">
            <span style="background:#161616;color:#666666;font-size:11px;font-weight:700;padding:5px 11px;border-radius:999px;border:1px solid #242424;">Lista de espera</span>
          </td>
        </tr></table>
      </td></tr>
    </table>

    <!-- Referral -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr><td style="border-top:1px solid #1f1f1f;padding:24px 0 0;">
        <p style="margin:0 0 6px;font-size:11px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;color:#5a8fe3;">Tu link de referido</p>
        <p style="margin:0 0 14px;font-size:13.5px;color:#8a8a8a;line-height:1.5;">Comparte y sube posiciones. Con 3 amigos tienes Wave 1 garantizado.</p>
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
        <a href="${referralLink}" style="display:block;background:#2a6fdb;color:#ffffff;font-size:14px;font-weight:700;padding:14px 0;border-radius:8px;text-decoration:none;text-align:center;">Compartir mi link →</a>
      </td></tr>
    </table>

    <!-- Urgency -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr><td style="border-top:1px solid #1f1f1f;padding:26px 0 28px;text-align:center;">
        <p style="margin:0 0 6px;font-size:21px;font-weight:800;color:#ffffff;letter-spacing:-0.3px;">Solo 100 plazas Wave 1.</p>
        <p style="margin:0;font-size:13px;color:#8a8a8a;line-height:1.6;">Cuando se llenen, no hay vuelta atrás.<br><strong style="color:#5a8fe3;">3 amigos = acceso de por vida, gratis.</strong></p>
      </td></tr>
    </table>

  </td></tr>

  <!-- FOOTER -->
  <tr><td style="padding:18px 0 24px;text-align:center;">
    <p style="margin:0 0 3px;font-size:12px;color:#555555;">— El equipo de 2trAIn</p>
    <p style="margin:0;font-size:11px;color:#444444;">Te apuntaste en <a href="${referralLink.split('?')[0]}" style="color:#5a8fe3;text-decoration:none;">2trainapp.com</a></p>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`
}
