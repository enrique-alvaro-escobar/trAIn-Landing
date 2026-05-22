const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ydXpqdHFld2pha2Z3c2hmYWd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg5MjAyMzcsImV4cCI6MjA5NDQ5NjIzN30.GC0IRyXF1QppjbvQJNoYhe_FbWIAa6mjOZQkplrEbfM';
const isEn = document.documentElement.lang === 'en';

(function() {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  gsap.registerPlugin(ScrollTrigger);

  // Modal
  const modal = document.getElementById('beta-modal');
  function openModal(prefilledEmail) {
    if (prefilledEmail) {
      const i = modal.querySelector('input[name="email"]');
      if (i) i.value = prefilledEmail;
    }
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  function closeModal() {
    modal.classList.remove('active');
    const mm = document.getElementById('mobile-menu');
    if (!mm || !mm.classList.contains('open')) document.body.style.overflow = '';
  }
  document.getElementById('modal-close').addEventListener('click', closeModal);
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
  document.querySelectorAll('.open-modal').forEach(btn => btn.addEventListener('click', e => { e.preventDefault(); openModal(); }));

  // Hero form & beta-form-2 → open modal with prefill (so user gets the same success state)
  ['hero-form', 'beta-form-2'].forEach(id => {
    const f = document.getElementById(id);
    if (!f) return;
    f.addEventListener('submit', e => {
      e.preventDefault();
      const email = f.querySelector('input[name="email"]').value;
      openModal(email);
      setTimeout(() => document.getElementById('modal-form').requestSubmit(), 250);
    });
  });

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (href.length > 1) {
        const t = document.querySelector(href);
        if (t) { e.preventDefault(); window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 60, behavior: 'smooth' }); }
      }
    });
  });

  // Nav — el estilo (degradado) lo define el CSS; aquí solo lo referenciamos
  const nav = document.getElementById('nav');

  // Animations
  if (!reduceMotion) {
    gsap.from('#hero-headline .word', { y: 80, opacity: 0, duration: 0.95, stagger: 0.07, ease: 'power3.out' });
    gsap.from('#hero-sub', { y: 20, opacity: 0, duration: 0.8, delay: 0.6, ease: 'power3.out' });
    gsap.from('#hero-form', { y: 20, opacity: 0, duration: 0.8, delay: 0.8, ease: 'power3.out' });
    gsap.from('.trust-row', { y: 10, opacity: 0, duration: 0.6, delay: 1.0, ease: 'power3.out' });
    gsap.to('#hero-phone', { y: -60, scrollTrigger: { trigger: 'section', start: 'top top', end: 'bottom top', scrub: 0.5 }});
    gsap.from('#beta-block', { scale: 0.96, opacity: 0, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: '#beta-block', start: 'top 85%' } });
  }

  // 3-phone carousel — los 3 móviles SIEMPRE se posicionan y se ven;
  // el giro automático solo se activa si no se pide movimiento reducido.
  (function() {
    var phones = [
      document.getElementById('ph0'),
      document.getElementById('ph1'),
      document.getElementById('ph2')
    ];
    if (phones.some(function(p) { return !p; })) return;

    var _w = window.innerWidth;
    var POS = _w < 768 ? [
      { x: 71,  y: 0,  rotation: 3,  scale: 1,    opacity: 1,    zIndex: 3 },
      { x: 132, y: 34, rotation: 8,  scale: 0.82, opacity: 0.4,  zIndex: 1 },
      { x: 10,  y: 34, rotation: -8, scale: 0.82, opacity: 0.4,  zIndex: 2 }
    ] : _w < 1024 ? [
      { x: 70,  y: 0,  rotation: 3,  scale: 1,    opacity: 1,    zIndex: 3 },
      { x: 165, y: 48, rotation: 9,  scale: 0.82, opacity: 0.45, zIndex: 1 },
      { x: -20, y: 44, rotation: -9, scale: 0.82, opacity: 0.45, zIndex: 2 }
    ] : [
      { x: 80,  y: 0,  rotation: 3,  scale: 1,    opacity: 1,    zIndex: 3 },
      { x: 190, y: 55, rotation: 9,  scale: 0.82, opacity: 0.45, zIndex: 1 },
      { x: -25, y: 50, rotation: -9, scale: 0.82, opacity: 0.45, zIndex: 2 }
    ];

    // Posiciones iniciales (invisibles hasta que las imágenes decodifiquen)
    var posIdx = [0, 1, 2];
    phones.forEach(function(ph, i) {
      gsap.set(ph, Object.assign({}, POS[posIdx[i]], { opacity: 0, force3D: true }));
    });

    function startCarousel() {
      // Fade in escalonado: los 3 móviles quedan visibles
      phones.forEach(function(ph, i) {
        gsap.to(ph, { opacity: POS[posIdx[i]].opacity, duration: 0.6, delay: i * 0.08, ease: 'power2.out' });
      });

      // Sin animación de giro si el usuario pide movimiento reducido
      if (reduceMotion) return;

      var floatTl = null;
      function startFloat(ph) {
        if (floatTl) floatTl.kill();
        floatTl = gsap.timeline({ repeat: -1, yoyo: true });
        floatTl.to(ph, { y: '-=7', duration: 3.2, ease: 'sine.inOut' });
      }
      setTimeout(function() { startFloat(phones[0]); }, 800);

      setInterval(function() {
        floatTl.kill();
        posIdx = posIdx.map(function(p) { return (p + 1) % 3; });
        phones.forEach(function(ph, i) {
          gsap.to(ph, Object.assign({}, POS[posIdx[i]], { duration: 0.85, ease: 'power3.inOut' }));
        });
        var frontPh = phones[posIdx.indexOf(0)];
        setTimeout(function() { startFloat(frontPh); }, 900);
      }, 3600);
    }

    // Esperar a que las imágenes decodifiquen antes de mostrar
    var imgs = Array.from(document.querySelectorAll('#hero-phone img'));
    Promise.all(imgs.map(function(img) {
      if (img.complete && img.naturalWidth) return Promise.resolve();
      return img.decode ? img.decode().catch(function() {}) : new Promise(function(res) { img.onload = res; img.onerror = res; });
    })).then(startCarousel);
  })();

  // FAQ
  document.querySelectorAll('.faq-q').forEach(q => q.addEventListener('click', () => {
    const isOpen = q.closest('.faq-item').classList.toggle('open');
    q.setAttribute('aria-expanded', isOpen);
  }));

  // Capture referral code from URL
  const _refCode = new URLSearchParams(window.location.search).get('ref') || null;

  // Modal form submit
  const mForm = document.getElementById('modal-form');
  const mFormState = document.getElementById('modal-form-state');
  const mSuccess = document.getElementById('modal-success');
  const mBtn = document.getElementById('modal-submit');
  let mError = document.getElementById('modal-error');
  if (!mError) {
    mError = document.createElement('p');
    mError.id = 'modal-error';
    mError.style.cssText = 'color:#f87171;font-size:13px;text-align:center;margin-top:8px;display:none;';
    mForm.appendChild(mError);
  }

  function showModalError(msg) { mError.textContent = msg; mError.style.display = 'block'; }
  function hideModalError() { mError.style.display = 'none'; }

  function animateNumber(target) {
    if (reduceMotion) { document.getElementById('ms-num').textContent = target; return; }
    const numEl = document.getElementById('ms-num');
    const numWrap = document.getElementById('ms-num-wrap');
    let cur = target + 38;
    numEl.textContent = cur;
    numWrap.classList.remove('pop');
    const step = () => {
      if (cur <= target) {
        numEl.textContent = target;
        requestAnimationFrame(() => { numWrap.classList.add('pop'); });
        return;
      }
      cur -= 1;
      numEl.textContent = cur;
      const rem = cur - target;
      setTimeout(step, rem > 12 ? 28 : rem > 6 ? 55 : 95);
    };
    setTimeout(step, 400);
  }

  function animateBar(position) {
    const fill = document.getElementById('ms-fill');
    const wave = position <= 100 ? 1 : position <= 250 ? 2 : 3;
    let pct, taken, free, waveLabel;
    if (wave === 1) {
      taken = position; free = 100 - position;
      pct = position; waveLabel = isEn ? 'WAVE 1 SPOTS' : 'PLAZAS WAVE 1';
    } else if (wave === 2) {
      taken = position - 100; free = 250 - position + 1;
      pct = Math.round((position - 100) / 150 * 100); waveLabel = isEn ? 'WAVE 2 SPOTS' : 'PLAZAS WAVE 2';
    } else {
      taken = position - 250; free = Math.max(400 - position + 1, 0);
      pct = Math.round((position - 250) / 150 * 100); waveLabel = isEn ? 'WAVE 3 SPOTS' : 'PLAZAS WAVE 3';
    }
    document.getElementById('ms-wl-text').textContent = waveLabel;
    document.getElementById('ms-pos-frac').textContent = isEn ? `${free} available` : `${free} libres`;
    document.getElementById('ms-scarcity-taken').textContent = isEn ? `${taken} taken` : `${taken} ocupada${taken !== 1 ? 's' : ''}`;
    document.getElementById('ms-scarcity-free').textContent = isEn ? `${free} available →` : `${free} disponible${free !== 1 ? 's' : ''} →`;
    if (reduceMotion) { fill.style.transition = 'none'; fill.style.width = pct + '%'; return; }
    setTimeout(() => { fill.style.width = pct + '%'; }, 500);
  }

  function showModalSuccess(referralCode, position, projection) {
    position = position || 1;
    const link = referralCode ? `https://2trainapp.com?ref=${referralCode}` : 'https://2trainapp.com';

    // Determine wave
    const wave = position <= 100 ? 1 : position <= 250 ? 2 : 3;
    const waveData = {
      1: { badge1: 'Wave 1 ⚡', badge2: isEn ? 'Lifetime access' : 'Acceso de por vida', badge3: isEn ? 'Free forever' : 'Gratis para siempre' },
      2: { badge1: 'Wave 2', badge2: isEn ? '3 months free' : '3 meses gratis', badge3: 'Early access' },
      3: { badge1: 'Wave 3', badge2: isEn ? 'Standard access' : 'Acceso normal', badge3: isEn ? 'First come first served' : 'Por orden de llegada' },
    }[wave];
    document.getElementById('ms-badge-1').textContent = waveData.badge1;
    document.getElementById('ms-badge-2').textContent = waveData.badge2;
    document.getElementById('ms-badge-3').textContent = waveData.badge3;

    // Waves card
    const _free = position <= 100 ? 100 - position : position <= 250 ? 251 - position : Math.max(401 - position, 0);
    document.getElementById('ms-pos-frac').textContent = isEn ? `${_free} available` : `${_free} libres`;
    ['ms-w1', 'ms-w2', 'ms-w3'].forEach((id, i) => {
      const el = document.getElementById(id);
      const isActive = i + 1 === wave;
      el.classList.toggle('active', isActive);
      if (isActive) el.querySelector('.ms-ss').textContent = isEn ? "You're here" : 'Tú estás aquí';
    });

    // Share heading
    const p3 = projection && projection['3'];
    const shareH = document.getElementById('ms-share-h');
    if (p3 && p3 < position) {
      shareH.innerHTML = isEn ? `<span class="ms-b">⚡</span> With 3 friends you jump to #${p3}` : `<span class="ms-b">⚡</span> Con 3 amigos subes al puesto #${p3}`;
    } else {
      shareH.innerHTML = isEn ? `<span class="ms-b">⚡</span> Share to move up the list` : `<span class="ms-b">⚡</span> Comparte para subir en la lista`;
    }

    // Referral & share links
    if (referralCode) {
      document.getElementById('ms-ref').textContent = `2trainapp.com?ref=${referralCode}`;
      const copyBtn = document.getElementById('ms-copy');
      copyBtn.onclick = () => {
        navigator.clipboard.writeText(link).then(() => {
          copyBtn.textContent = isEn ? '✓ Copied' : '✓ Copiado';
          setTimeout(() => { copyBtn.textContent = isEn ? 'Copy link' : 'Copiar link'; }, 1600);
        });
      };
    }
    const waMsg = isEn
      ? encodeURIComponent(`I just reserved my spot on 2trAIn ⚡ An AI personal trainer that explains every decision. Only 100 lifetime-free spots. Join with my link 👉 ${link}`)
      : encodeURIComponent(`Acabo de reservar mi plaza en 2trAIn ⚡ Un entrenador personal con IA que te explica cada decisión. Solo 100 plazas gratuitas de por vida. Entra con mi link 👉 ${link}`);
    document.getElementById('ms-wa').href = `https://wa.me/?text=${waMsg}`;
    const twText = isEn
      ? encodeURIComponent(`I just reserved my spot on 2trAIn ⚡\n\nAI that explains EVERY decision in your training.\nOnly 100 free-forever spots →`)
      : encodeURIComponent(`Acabo de reservar mi plaza en 2trAIn ⚡\n\nIA que te explica CADA decisión de tu entrenamiento.\nSolo 100 plazas gratis para siempre →`);
    document.getElementById('ms-x').href = `https://twitter.com/intent/tweet?text=${twText}&url=${encodeURIComponent(link)}`;

    // Show success
    mFormState.classList.add('hidden');
    mSuccess.classList.remove('hidden');

    // Animations
    animateNumber(position);
    animateBar(position);

    // Click number to replay
    const numWrap = document.getElementById('ms-num-wrap');
    numWrap.style.cursor = 'pointer';
    numWrap.onclick = () => {
      const fill = document.getElementById('ms-fill');
      fill.style.transition = 'none';
      fill.style.width = '0%';
      void fill.offsetWidth;
      fill.style.transition = '';
      animateNumber(position);
      animateBar(position);
    };
  }

  mForm.addEventListener('submit', async e => {
    e.preventDefault();
    hideModalError();
    const email = mForm.querySelector('input[name="email"]').value.trim();
    mBtn.querySelector('.btn-label').textContent = isEn ? 'Sending…' : 'Enviando…';
    mBtn.disabled = true; mBtn.style.opacity = '0.6';

    try {
      const res = await fetch('https://nruzjtqewjakfwshfagz.supabase.co/functions/v1/join-waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ email, referred_by: _refCode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error desconocido');
      showModalSuccess(data.referral_code, data.position, data.projection);
    } catch (err) {
      console.error('Waitlist error:', err);
      showModalError(isEn ? 'Something went wrong. Try again or contact us.' : 'Algo salió mal. Inténtalo de nuevo o escríbenos.');
      mBtn.querySelector('.btn-label').textContent = isEn ? 'Join the beta' : 'Entrar a la beta';
      mBtn.disabled = false; mBtn.style.opacity = '';
    }
  });

  modal.addEventListener('transitionend', () => {
    if (!modal.classList.contains('active')) {
      setTimeout(() => {
        mFormState.classList.remove('hidden');
        mSuccess.classList.add('hidden');
        mForm.reset();
        hideModalError();
        mBtn.querySelector('.btn-label').textContent = isEn ? 'Join the beta' : 'Entrar a la beta';
        mBtn.disabled = false; mBtn.style.opacity = '';
        // Reset bar for next open
        const fill = document.getElementById('ms-fill');
        if (fill) { fill.style.transition = 'none'; fill.style.width = '0%'; }
      }, 50);
    }
  });
})();

(function() {
  var target = new Date('2026-09-01T00:00:00');
  function tick() {
    var el = document.getElementById('countdown-display');
    if (!el) return;
    var diff = target - new Date();
    if (diff <= 0) { el.textContent = isEn ? 'Beta available' : 'Beta disponible'; return; }
    var d = Math.floor(diff / 86400000);
    var h = Math.floor((diff % 86400000) / 3600000);
    var m = Math.floor((diff % 3600000) / 60000);
    el.innerHTML =
      '<span aria-label="' + d + (isEn ? ' days' : ' días') + '">' + d + 'd</span> ' +
      '<span aria-label="' + h + (isEn ? ' hours' : ' horas') + '">' + h + 'h</span> ' +
      '<span aria-label="' + m + (isEn ? ' minutes' : ' minutos') + '">' + m + 'm</span>';
  }
  tick();
  setInterval(tick, 60000);
})();

// Mobile menu
(function() {
  const toggle = document.getElementById('nav-toggle');
  const menu   = document.getElementById('mobile-menu');
  const nav    = document.getElementById('nav');
  if (!toggle || !menu) return;

  function openMenu() {
    menu.classList.add('open');
    menu.setAttribute('aria-hidden', 'false');
    nav.classList.add('nav-open');
    toggle.setAttribute('aria-label', isEn ? 'Close menu' : 'Cerrar menú');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    const first = menu.querySelector('a, button');
    if (first) first.focus();
  }

  function closeMenu() {
    menu.classList.remove('open');
    menu.setAttribute('aria-hidden', 'true');
    nav.classList.remove('nav-open');
    toggle.setAttribute('aria-label', isEn ? 'Open menu' : 'Abrir menú');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    toggle.focus();
  }

  toggle.addEventListener('click', function() {
    menu.classList.contains('open') ? closeMenu() : openMenu();
  });

  // Close on any link click inside the menu
  menu.querySelectorAll('a').forEach(function(a) {
    a.addEventListener('click', closeMenu);
  });

  // Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && menu.classList.contains('open')) closeMenu();
  });
})();
