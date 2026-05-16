const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ydXpqdHFld2pha2Z3c2hmYWd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg5MjAyMzcsImV4cCI6MjA5NDQ5NjIzN30.GC0IRyXF1QppjbvQJNoYhe_FbWIAa6mjOZQkplrEbfM';

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
  function closeModal() { modal.classList.remove('active'); document.body.style.overflow = ''; }
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

  // Nav scroll
  const nav = document.getElementById('nav');
  function syncNav() {
    if (window.scrollY > 50) {
      nav.style.background = 'rgba(10,10,10,0.85)';
      nav.style.backdropFilter = 'blur(12px)';
      nav.style.borderBottom = '1px solid var(--line)';
    } else {
      nav.style.background = 'transparent';
      nav.style.backdropFilter = 'none';
      nav.style.borderBottom = '1px solid transparent';
    }
  }
  syncNav();
  window.addEventListener('scroll', syncNav, { passive: true });

  // Sticky mobile CTA — show after hero
  const sticky = document.getElementById('sticky-cta');
  function syncSticky() {
    if (window.innerWidth >= 768) { sticky.classList.remove('show'); return; }
    sticky.classList.toggle('show', window.scrollY > 600);
  }
  syncSticky();
  window.addEventListener('scroll', syncSticky, { passive: true });
  window.addEventListener('resize', syncSticky);

  // Animations
  if (!reduceMotion) {
    gsap.from('#hero-headline .word', { y: 80, opacity: 0, duration: 0.95, stagger: 0.07, ease: 'power3.out' });
    gsap.from('#hero-sub', { y: 20, opacity: 0, duration: 0.8, delay: 0.6, ease: 'power3.out' });
    gsap.from('#hero-form', { y: 20, opacity: 0, duration: 0.8, delay: 0.8, ease: 'power3.out' });
    gsap.from('.trust-row', { y: 10, opacity: 0, duration: 0.6, delay: 1.0, ease: 'power3.out' });
    gsap.set('#hero-phone .phone-front, #hero-phone .phone-back', { force3D: true, backfaceVisibility: 'hidden' });
    // 3-phone carousel
    (function() {
      var phones = [
        document.getElementById('ph0'),
        document.getElementById('ph1'),
        document.getElementById('ph2')
      ];

      var _w = window.innerWidth;
      var POS = _w < 768 ? [
        { x: 57,  y: 0,  rotation: 3,  scale: 1,    opacity: 1,    zIndex: 3 },
        { x: 136, y: 39, rotation: 9,  scale: 0.82, opacity: 0.45, zIndex: 1 },
        { x: -18, y: 36, rotation: -9, scale: 0.82, opacity: 0.45, zIndex: 2 }
      ] : _w < 1024 ? [
        { x: 70,  y: 0,  rotation: 3,  scale: 1,    opacity: 1,    zIndex: 3 },
        { x: 165, y: 48, rotation: 9,  scale: 0.82, opacity: 0.45, zIndex: 1 },
        { x: -20, y: 44, rotation: -9, scale: 0.82, opacity: 0.45, zIndex: 2 }
      ] : [
        { x: 80,  y: 0,  rotation: 3,  scale: 1,    opacity: 1,    zIndex: 3 },
        { x: 190, y: 55, rotation: 9,  scale: 0.82, opacity: 0.45, zIndex: 1 },
        { x: -25, y: 50, rotation: -9, scale: 0.82, opacity: 0.45, zIndex: 2 }
      ];

      var posIdx = [0, 1, 2];
      phones.forEach(function(ph, i) { gsap.set(ph, POS[posIdx[i]]); });
      phones.forEach(function(ph, i) {
        gsap.from(ph, { opacity: 0, duration: 0.7, delay: 0.1 + i * 0.1, ease: 'power2.out' });
      });

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
    })();
    gsap.to('#hero-phone', { y: -60, scrollTrigger: { trigger: 'section', start: 'top top', end: 'bottom top', scrub: 0.5 }});
    gsap.from('#beta-block', { scale: 0.96, opacity: 0, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: '#beta-block', start: 'top 85%' } });
  }

  // FAQ
  document.querySelectorAll('.faq-q').forEach(q => q.addEventListener('click', () => q.closest('.faq-item').classList.toggle('open')));

  // Capture referral code from URL
  const _refCode = new URLSearchParams(window.location.search).get('ref') || null;

  // Modal form submit
  const mForm = document.getElementById('modal-form');
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

  function showModalSuccess(referralCode, position, projection) {
    const link = referralCode ? `https://2trainapp.com?ref=${referralCode}` : 'https://2trainapp.com';

    if (referralCode) {
      const refLinkEl = document.getElementById('referral-link-text');
      refLinkEl.textContent = `https://2trainapp.com?ref=${referralCode}`;
      refLinkEl.href = link;
      const copyBtn = document.getElementById('copy-referral');
      copyBtn.onclick = () => {
        navigator.clipboard.writeText(link).then(() => {
          copyBtn.textContent = '¡Copiado!';
          setTimeout(() => { copyBtn.textContent = 'Copiar link'; }, 2000);
        });
      };
      const waMsg = encodeURIComponent(`Acabo de reservar mi plaza en 2trAIn ⚡ Un entrenador personal con IA que te explica cada decisión. Solo 100 plazas gratuitas de por vida. Entra con mi link 👉 ${link}`);
      document.getElementById('share-whatsapp').href = `https://wa.me/?text=${waMsg}`;
      const twText = encodeURIComponent(`Acabo de reservar mi plaza en 2trAIn ⚡\n\nIA que te explica CADA decisión de tu entrenamiento.\nSolo 100 plazas gratis para siempre →`);
      document.getElementById('share-twitter').href = `https://twitter.com/intent/tweet?text=${twText}&url=${encodeURIComponent(link)}`;
    }

    if (position) {
      document.getElementById('waitlist-position').textContent = `#${position}`;
      const waveText = document.getElementById('wave-status-text');
      const waveSub = document.getElementById('wave-status-sub');
      if (waveText && waveSub) {
        if (position <= 100) {
          waveText.textContent = 'Wave 1 ⚡';
          waveSub.textContent = 'Acceso de por vida';
        } else {
          waveText.textContent = 'Wave 2';
          waveSub.textContent = `A ${position - 100} puestos de Wave 1`;
        }
      }
    }

    if (projection && position) {
      const ctaEl = document.getElementById('share-cta-text');
      if (ctaEl) {
        const p3 = projection['3'];
        if (p3 && p3 < position) {
          ctaEl.textContent = `Con 3 amigos subes al puesto #${p3} ⚡`;
        } else if (position > 100) {
          ctaEl.textContent = 'Comparte para subir en la lista';
        } else {
          ctaEl.textContent = 'Ayuda a tus amigos a entrar en Wave 1 ⚡';
        }
      }
    }

    mForm.classList.add('hidden');
    mSuccess.classList.remove('hidden');
    gsap.timeline()
      .to('#check-circle', { strokeDashoffset: 0, duration: 0.6, ease: 'power2.out' })
      .to('#check-mark', { strokeDashoffset: 0, duration: 0.4, ease: 'power2.out' }, '-=0.2');
  }

  mForm.addEventListener('submit', async e => {
    e.preventDefault();
    hideModalError();
    const email = mForm.querySelector('input[name="email"]').value.trim();
    mBtn.querySelector('.btn-label').textContent = 'Enviando…';
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
      showModalError('Algo salió mal. Inténtalo de nuevo o escríbenos.');
      mBtn.querySelector('.btn-label').textContent = 'Entrar a la beta';
      mBtn.disabled = false; mBtn.style.opacity = '';
    }
  });

  modal.addEventListener('transitionend', () => {
    if (!modal.classList.contains('active')) {
      setTimeout(() => {
        mForm.classList.remove('hidden');
        mSuccess.classList.add('hidden');
        mForm.reset();
        hideModalError();
        mBtn.querySelector('.btn-label').textContent = 'Entrar a la beta';
        mBtn.disabled = false; mBtn.style.opacity = '';
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
    if (diff <= 0) { el.textContent = 'Beta disponible'; return; }
    var d = Math.floor(diff / 86400000);
    var h = Math.floor((diff % 86400000) / 3600000);
    var m = Math.floor((diff % 3600000) / 60000);
    el.textContent = d + 'd ' + h + 'h ' + m + 'm';
  }
  tick();
  setInterval(tick, 60000);
})();
