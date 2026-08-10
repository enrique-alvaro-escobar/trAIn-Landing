import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { buildEmail } from './email-template.ts'

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
          html: buildEmail(position, referralLink, isEn, referrals),
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
