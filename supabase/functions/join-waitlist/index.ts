import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://2trainapp.com',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
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
          from: 'Equipo 2trAIn <waitlist@2trainapp.com>',
          to: email,
          subject: `Eres el #${position} en la waitlist de 2trAIn`,
          html: buildEmail(position, referralLink),
        }),
      })
    }

    return new Response(JSON.stringify({ referral_code: referralCode, position, already_registered: alreadyRegistered }), {
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

function buildEmail(position: number, referralLink: string): string {
  const waMsg = encodeURIComponent(`¿Entrenas solo y sin guía? Acabo de reservar mi plaza en 2trAIn, un entrenador personal con IA que te dice exactamente qué hacer en cada momento. Solo hay 100 plazas gratuitas de por vida. Entra con mi link y los dos subimos posiciones en la lista 👇\n${referralLink}`)
  const twMsg = encodeURIComponent(`Acabo de reservar mi plaza en 2trAIn ⚡\n\nUn entrenador personal con IA que se adapta a ti en tiempo real.\n\nSolo 100 plazas gratis para siempre. Entra antes de que se llene →`)
  const whatsappUrl = `https://wa.me/?text=${waMsg}`
  const twitterUrl = `https://twitter.com/intent/tweet?text=${twMsg}&url=${encodeURIComponent(referralLink)}`

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
  <title>Estás dentro de 2trAIn</title>
  <style>
    @media (prefers-color-scheme: dark) {
      .body-bg   { background-color: #0a0a0a !important; }
      .card-bg   { background-color: #111111 !important; border-color: #1e1e1e !important; }
      .row-sep   { border-top-color: #1e1e1e !important; }
      .t-h       { color: #ffffff !important; }
      .t-sub     { color: #888888 !important; }
      .t-foot    { color: #3d3d3d !important; }
      .ref-box   { background-color: #0d0d0d !important; border-color: #1e1e1e !important; }
      .ref-text  { color: #666666 !important; }
      .badge-b   { background-color: #0d1b36 !important; border-color: #1e3a6e !important; }
      .badge-g   { background-color: #111 !important; color: #555 !important; border-color: #222 !important; }
      .btn-x     { background-color: #0d0d0d !important; border-color: #222 !important; }
    }
  </style>
</head>
<body class="body-bg" style="margin:0;padding:0;background-color:#f2f2f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="padding:24px 12px;">
<tr><td align="center">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:540px;">

  <!-- ── HEADER ── -->
  <tr><td style="background:#0a0a0a;border-radius:16px 16px 0 0;padding:24px 32px 0;">
    <p style="margin:0;font-size:17px;font-weight:900;letter-spacing:-0.3px;color:#fff;">2trAIn</p>
  </td></tr>

  <!-- ── HERO ── -->
  <tr><td style="background:#0a0a0a;padding:12px 32px 36px;text-align:center;">
    <p style="margin:0 0 2px;font-size:11px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:#2a6fdb;">PLAZA CONFIRMADA</p>
    <p style="margin:0;font-size:80px;font-weight:900;letter-spacing:-4px;color:#ffffff;line-height:1.05;">#${position}</p>
    <p style="margin:4px 0 24px;font-size:14px;color:#444;">en la waitlist de 2trAIn</p>
    <a href="${referralLink}" style="display:inline-block;background:#2a6fdb;color:#fff;font-size:14px;font-weight:700;padding:12px 28px;border-radius:999px;text-decoration:none;">Ver mi posici&#243;n &rarr;</a>
  </td></tr>

  <!-- ── BODY ── -->
  <tr><td class="card-bg" style="background:#ffffff;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 16px 16px;padding:0 32px;">

    <!-- Waves -->
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr><td style="padding:24px 0 8px;">
        <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#aaa;">C&#243;mo sube tu posici&#243;n</p>
      </td></tr>

      <tr><td class="row-sep" style="border-top:1px solid #f0f0f0;padding:14px 0;">
        <table width="100%" cellpadding="0" cellspacing="0"><tr>
          <td>
            <p class="t-h" style="margin:0 0 1px;font-size:14px;font-weight:800;color:#111;">Wave 1 &mdash; Primeros 100</p>
            <p class="t-sub" style="margin:0;font-size:12px;color:#9ca3af;">Acceso de por vida &middot; Gratis para siempre</p>
          </td>
          <td align="right" style="padding-left:8px;white-space:nowrap;">
            <span class="badge-b" style="background:#eff6ff;color:#2a6fdb;font-size:11px;font-weight:700;padding:4px 10px;border-radius:999px;border:1px solid #bfdbfe;">3 referidos &#9889;</span>
          </td>
        </tr></table>
      </td></tr>

      <tr><td class="row-sep" style="border-top:1px solid #f0f0f0;padding:14px 0;">
        <table width="100%" cellpadding="0" cellspacing="0"><tr>
          <td>
            <p class="t-h" style="margin:0 0 1px;font-size:14px;font-weight:800;color:#111;">Wave 2 &mdash; Siguientes 150</p>
            <p class="t-sub" style="margin:0;font-size:12px;color:#9ca3af;">Acceso semanas despu&#233;s del lanzamiento</p>
          </td>
          <td align="right" style="padding-left:8px;white-space:nowrap;">
            <span class="badge-g" style="background:#f9fafb;color:#9ca3af;font-size:11px;font-weight:700;padding:4px 10px;border-radius:999px;border:1px solid #e5e7eb;">1 referido</span>
          </td>
        </tr></table>
      </td></tr>

      <tr><td class="row-sep" style="border-top:1px solid #f0f0f0;padding:14px 0 20px;">
        <table width="100%" cellpadding="0" cellspacing="0"><tr>
          <td>
            <p class="t-h" style="margin:0 0 1px;font-size:14px;font-weight:800;color:#111;">Wave 3 &mdash; &#218;ltimas 150</p>
            <p class="t-sub" style="margin:0;font-size:12px;color:#9ca3af;">Por orden de llegada</p>
          </td>
          <td align="right" style="padding-left:8px;white-space:nowrap;">
            <span class="badge-g" style="background:#f9fafb;color:#c4c4c4;font-size:11px;font-weight:700;padding:4px 10px;border-radius:999px;border:1px solid #ececec;">Lista de espera</span>
          </td>
        </tr></table>
      </td></tr>
    </table>

    <!-- Referral -->
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr><td class="row-sep" style="border-top:1px solid #f0f0f0;padding:24px 0 0;">
        <p style="margin:0 0 4px;font-size:11px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#2a6fdb;">Tu link de referido</p>
        <p class="t-sub" style="margin:0 0 14px;font-size:13px;color:#9ca3af;line-height:1.5;">Comparte y sube posiciones. Con 3 amigos tienes Wave 1 garantizado.</p>
        <table class="ref-box" width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;margin-bottom:12px;">
          <tr><td style="padding:12px 14px;">
            <p class="ref-text" style="margin:0;font-size:12px;color:#6b7280;word-break:break-all;font-family:'Courier New',Courier,monospace;">${referralLink}</p>
          </td></tr>
        </table>
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:8px;">
          <tr>
            <td width="50%" style="padding-right:4px;">
              <a href="${whatsappUrl}" style="display:block;background:#25d366;color:#fff;font-size:13px;font-weight:700;padding:12px 0;border-radius:8px;text-decoration:none;text-align:center;">WhatsApp</a>
            </td>
            <td width="50%" style="padding-left:4px;">
              <a href="${twitterUrl}" class="btn-x" style="display:block;background:#000;color:#fff;font-size:13px;font-weight:700;padding:12px 0;border-radius:8px;text-decoration:none;text-align:center;">X / Twitter</a>
            </td>
          </tr>
        </table>
        <a href="${referralLink}" style="display:block;background:#2a6fdb;color:#fff;font-size:14px;font-weight:700;padding:14px 0;border-radius:8px;text-decoration:none;text-align:center;">Compartir mi link &rarr;</a>
      </td></tr>
    </table>

    <!-- Urgency -->
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr><td class="row-sep" style="border-top:1px solid #f0f0f0;padding:24px 0 28px;text-align:center;">
        <p class="t-h" style="margin:0 0 6px;font-size:20px;font-weight:900;color:#111;letter-spacing:-0.3px;">Solo 100 plazas Wave 1.</p>
        <p class="t-sub" style="margin:0;font-size:13px;color:#9ca3af;line-height:1.6;">Cuando se llenen, no hay vuelta atr&#225;s.<br><strong style="color:#2a6fdb;">3 amigos = acceso de por vida, gratis.</strong></p>
      </td></tr>
    </table>

  </td></tr>

  <!-- ── FOOTER ── -->
  <tr><td class="t-foot" style="padding:16px 0 24px;text-align:center;color:#c4c4c4;">
    <p style="margin:0 0 3px;font-size:12px;">&mdash; El equipo de 2trAIn</p>
    <p style="margin:0;font-size:11px;">Te apuntaste en <a href="${referralLink.split('?')[0]}" style="color:#c4c4c4;">2trainapp.com</a></p>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`
}
