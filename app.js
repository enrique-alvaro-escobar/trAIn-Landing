const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ydXpqdHFld2pha2Z3c2hmYWd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg5MjAyMzcsImV4cCI6MjA5NDQ5NjIzN30.GC0IRyXF1QppjbvQJNoYhe_FbWIAa6mjOZQkplrEbfM';
const isEn = document.documentElement.lang === 'en';

// 👉 URL de la web app (chat de IA) que está montando tu amigo. CAMBIAR cuando esté lista.
// El objetivo que escribe el usuario se envía como primer mensaje del chat en el query param `q`.
const WEBAPP_URL = 'https://app.2trainapp.com';

(function() {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.matchMedia('(max-width: 767px)').matches;
  gsap.registerPlugin(ScrollTrigger);
  // En móvil, ignorar el resize de la barra de direcciones evita que ScrollTrigger
  // recalcule y provoque saltos/contenido en blanco al hacer scroll.
  ScrollTrigger.config({ ignoreMobileResize: true });

  // Hero video: arranca al cargar (autoplay). El póster <img> es el LCP (pinta al instante)
  // y el vídeo aparece con un fundido en cuanto puede reproducirse.
  (function() {
    var hv = document.querySelector('.hero-cine__video');
    if (!hv) return;
    if (reduceMotion) { try { hv.pause(); } catch (e) {} return; } // se queda el póster estático
    hv.addEventListener('playing', function() { hv.classList.add('is-playing'); });
    var p = hv.play(); if (p && p.catch) p.catch(function() {});
  })();

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

  // Hero goal input → redirige a la web app (chat de IA) con el objetivo como primer mensaje.
  const goalForm = document.getElementById('goal-form');
  if (goalForm) {
    goalForm.addEventListener('submit', e => {
      e.preventDefault();
      const goal = goalForm.querySelector('input[name="goal"]').value.trim();
      if (!goal) return;
      window.location.href = WEBAPP_URL + '?q=' + encodeURIComponent(goal);
    });

    const goalInput = document.getElementById('goal-input');

    // Placeholder animado (máquina de escribir + cursor parpadeante) que rota objetivos de ejemplo.
    if (goalInput && !reduceMotion) {
      const examples = isEn
        ? (isMobile ? [
            'Build muscle',
            'Lose fat, not strength',
            'Run my first 10K',
            'Get strong at home',
            'Train after an injury'
          ] : [
            'I want to build muscle without losing definition',
            'I want to lose fat without starving',
            'I want to run my first marathon',
            'I want to get strong training at home',
            'I want to get back to training after an injury'
          ])
        : (isMobile ? [
            'Ganar músculo',
            'Perder grasa, no fuerza',
            'Correr mi primer 10K',
            'Ponerme fuerte en casa',
            'Entrenar tras una lesión'
          ] : [
            'Quiero ganar músculo sin perder definición',
            'Quiero perder grasa sin pasar hambre',
            'Quiero correr mi primera maratón',
            'Quiero ponerme fuerte entrenando en casa',
            'Quiero volver a entrenar tras una lesión'
          ]);
      const restHint = isEn ? "What's your goal?" : '¿Cuál es tu objetivo?';
      const caret = '▏';
      let ei = 0, ci = 0, deleting = false, focused = false, blinkOn = true, base = '', typeTimer;
      function paint() {
        if (focused) { goalInput.setAttribute('placeholder', restHint); return; }
        goalInput.setAttribute('placeholder', base + (blinkOn ? caret : ' '));
      }
      setInterval(() => { blinkOn = !blinkOn; paint(); }, 530);
      function tick() {
        if (focused) return;
        const word = examples[ei];
        if (!deleting) {
          ci++; base = word.slice(0, ci); blinkOn = true; paint();
          if (ci === word.length) { deleting = true; typeTimer = setTimeout(tick, 1700); return; }
          typeTimer = setTimeout(tick, 55);
        } else {
          ci--; base = word.slice(0, ci); blinkOn = true; paint();
          if (ci === 0) { deleting = false; ei = (ei + 1) % examples.length; typeTimer = setTimeout(tick, 450); return; }
          typeTimer = setTimeout(tick, 28);
        }
      }
      goalInput.addEventListener('focus', () => { focused = true; clearTimeout(typeTimer); paint(); });
      goalInput.addEventListener('blur', () => {
        focused = false;
        if (goalInput.value) return;
        ci = 0; deleting = false; base = ''; clearTimeout(typeTimer); typeTimer = setTimeout(tick, 300);
      });
      paint();
      typeTimer = setTimeout(tick, 600);
    }
  }

  // Demo "Míralo pensar" input → redirige a la web app con el caso del usuario como primer mensaje.
  const demoGoalForm = document.getElementById('demo-goal-form');
  if (demoGoalForm) {
    demoGoalForm.addEventListener('submit', e => {
      e.preventDefault();
      const goal = demoGoalForm.querySelector('input[name="goal"]').value.trim();
      if (!goal) return;
      window.location.href = WEBAPP_URL + '?q=' + encodeURIComponent(goal);
    });
  }

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

  // Navbar: arranca compacto (clase nav-compact en el HTML) y se despliega
  // al primer scroll, quedándose expandido para siempre.
  let navExpanded = false;
  function expandNav() {
    if (navExpanded || !nav) return;
    navExpanded = true;
    nav.classList.remove('nav-compact');
  }
  if (nav) {
    if (reduceMotion || window.scrollY > 20) {
      // Sin animación o ya scrolleado al cargar: expandir sin transición.
      nav.classList.add('no-nav-anim');
      expandNav();
      requestAnimationFrame(function () {
        requestAnimationFrame(function () { nav.classList.remove('no-nav-anim'); });
      });
    }
    window.addEventListener('scroll', function () {
      if (window.scrollY > 20) expandNav();
    }, { passive: true });
  }

  // Animations
  if (!reduceMotion) {
    // --- Hero cinematográfico ---
    gsap.from('#hero-headline .word', { y: 80, opacity: 0, duration: 0.95, stagger: 0.1, ease: 'power3.out', delay: 0.15 });
    gsap.from('#hero-sub', { y: 24, opacity: 0, duration: 0.8, delay: 0.6, ease: 'power3.out' });
    gsap.from('#hero-cta', { y: 20, opacity: 0, duration: 0.8, delay: 0.85, ease: 'power3.out' });
    // Parallax sutil del vídeo de fondo (scale 1.15 en CSS deja overscan; el desplazamiento ±4% nunca descubre el borde)
    gsap.fromTo('.hero-cine__video', { yPercent: -4, scale: 1.15 }, { yPercent: 4, scale: 1.15, ease: 'none', scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 0.5 } });

    gsap.from('#beta-block', { scale: 0.96, opacity: 0, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: '#beta-block', start: 'top 85%' } });

    // --- Reveal de secciones al hacer scroll ---
    // Desplazamiento más corto y disparo más temprano en móvil → menos sensación de tirón / blanco.
    var RY = isMobile ? 18 : 40;
    var startPos = isMobile ? 'top 94%' : 'top 86%';
    // Etiquetas y títulos de sección: fade-up individual (las .vsec tienen su propio reveal abajo)
    gsap.utils.toArray('section:not(#hero):not(.vsec):not(.reels) :is(.label, h2.display)').forEach(function(el) {
      gsap.from(el, { y: isMobile ? 16 : 32, opacity: 0, duration: 0.6, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: startPos, once: true } });
    });
    // Tarjetas y bloques: fade-up escalonado por grupo (set inicial evita el parpadeo de batch)
    ['section:not(#hero) .grid > div',
     'section:not(#hero) .max-w-xl',
     'section:not(#hero) table',
     'section:not(#hero) .faq-item'].forEach(function(sel) {
      var els = gsap.utils.toArray(sel);
      if (!els.length) return;
      gsap.set(els, { opacity: 0, y: RY });
      ScrollTrigger.batch(els, { start: startPos, once: true,
        onEnter: function(batch) { gsap.to(batch, { opacity: 1, y: 0, duration: 0.55, stagger: isMobile ? 0.06 : 0.1, ease: 'power3.out' }); } });
    });

    // Secciones VÍDEO + TEXTO: el vídeo entra desde su lado y el texto en cascada
    gsap.utils.toArray('.vsec').forEach(function(sec) {
      var media = sec.querySelector('.vsec__media');
      var textKids = sec.querySelectorAll('.vsec__text > *');
      var reverse = !!sec.querySelector('.vsec--reverse');
      var fromX = isMobile ? 0 : (reverse ? 60 : -60);
      if (media) gsap.from(media, { x: fromX, y: isMobile ? 28 : 0, opacity: 0, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: sec, start: startPos, once: true } });
      if (textKids.length) gsap.from(textKids, { y: isMobile ? 18 : 28, opacity: 0, duration: 0.6, stagger: 0.08, ease: 'power3.out',
        scrollTrigger: { trigger: sec, start: startPos, once: true } });
    });
  }

  // ===== Scrollytelling reels: el móvil queda fijo y el reel + el texto cambian al hacer scroll =====
  (function() {
    var stage = document.querySelector('.reels');
    if (!stage) return;
    var reels = gsap.utils.toArray('.reels__reel');
    var strip = stage.querySelector('.reels__strip');
    var steps = gsap.utils.toArray('.reels__step');
    if (!steps.length) return;

    // Si un reel aún no existe (archivo no subido), se oculta y se ve el placeholder.
    reels.forEach(function(v) {
      function hide() { v.style.display = 'none'; }
      v.addEventListener('error', hide);
      var s = v.querySelector('source');
      if (s) s.addEventListener('error', hide);
    });

    // MÓVIL/TABLET ≤860px: layout apilado nativo (CSS). Sin filmstrip ni ScrollTrigger.
    // Cada reel (tarjeta) se reproduce solo cuando entra en pantalla, para ahorrar datos.
    if (window.matchMedia('(max-width: 860px)').matches) {
      if ('IntersectionObserver' in window) {
        var io = new IntersectionObserver(function(entries) {
          entries.forEach(function(e) {
            if (e.isIntersecting) { var p = e.target.play(); if (p && p.catch) p.catch(function() {}); }
            else { try { e.target.pause(); } catch (err) {} }
          });
        }, { threshold: 0.4 });
        reels.forEach(function(v) { io.observe(v); });
      } else {
        reels.forEach(function(v) { var p = v.play(); if (p && p.catch) p.catch(function() {}); });
      }
      steps.forEach(function(s) { s.classList.add('on'); });
      return;
    }

    stage.classList.add('js-active');
    var current = -1;
    // Filmstrip por pasos (sin hueco): la tira sube un alto completo por vídeo.
    function setStrip(i) {
      if (strip) strip.style.transform = 'translateY(' + (-i * 100) + '%)';
    }
    function activate(i) {
      if (i === current) return;
      current = i;
      setStrip(i);
      reels.forEach(function(v, idx) {
        if (idx === i) { v.classList.add('on'); var p = v.play(); if (p && p.catch) p.catch(function() {}); }
        else { v.classList.remove('on'); try { v.pause(); } catch (e) {} }
      });
      steps.forEach(function(s, idx) { s.classList.toggle('on', idx === i); });
    }
    // Cuando el texto del paso llega al centro, salta DIRECTO a su vídeo (snap), con su texto centrado.
    steps.forEach(function(step, i) {
      ScrollTrigger.create({ trigger: step, start: 'center center', end: 'bottom center',
        onToggle: function(self) { if (self.isActive) activate(i); } });
    });

    // No reproducimos el reel 0 al cargar (está bajo el fold): arranca cuando su paso entra
    // en el centro del viewport. Solo fijamos la posición inicial de la tira.
    setStrip(0);
  })();

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

  // FAQ — filtros por categoría (acorta la lista mostrando solo lo relevante)
  (function() {
    var chips = document.querySelectorAll('.faq-chip');
    if (!chips.length) return;
    var items = document.querySelectorAll('#faq .faq-item');
    chips.forEach(function(chip) {
      chip.addEventListener('click', function() {
        var cat = chip.getAttribute('data-filter');
        chips.forEach(function(c) { c.classList.toggle('active', c === chip); });
        items.forEach(function(item) {
          var show = cat === 'all' || item.getAttribute('data-cat') === cat;
          item.classList.toggle('hidden', !show);
          if (!show) {
            item.classList.remove('open');
            var b = item.querySelector('.faq-q');
            if (b) b.setAttribute('aria-expanded', 'false');
          }
        });
      });
    });
  })();

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
    nav.classList.remove('nav-compact'); // si aún está compacto, despliega la barra
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

// ===== Demo "Míralo pensar": pensar (razonamiento) → colapsar → generar (carrusel), tamaño fijo =====
(function() {
  var section = document.querySelector('#demo');
  if (!section) return;
  var chat = section.querySelector('.demo-chat');

  // Carrusel siempre en movimiento: duplicamos las tarjetas para un bucle sin saltos (-50%).
  var track = section.querySelector('.demo-carousel__track');
  if (track) {
    var clone = track.cloneNode(true);
    clone.querySelectorAll('*').forEach(function(el) { el.setAttribute('aria-hidden', 'true'); });
    while (clone.firstChild) track.appendChild(clone.firstChild);
  }

  var statusEl = section.querySelector('.demo-chat__status-text');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!chat || reduceMotion || typeof gsap === 'undefined') return;  // CSS deja todo visible por defecto

  var user = chat.querySelector('.demo-bubble--user');
  var reasonBox = chat.querySelector('.demo-reason');
  var reasonBody = chat.querySelector('.demo-reason__body');
  var reasonLines = chat.querySelectorAll('.demo-reason__line');
  var toggle = chat.querySelector('.demo-reason__toggle');
  var label = chat.querySelector('.demo-reason__label');
  var aiBubble = chat.querySelector('.demo-bubble--ai');
  var genWrap = chat.querySelector('.demo-gen');
  var genHead = chat.querySelector('.demo-gen__head');
  var carousel = chat.querySelector('.demo-carousel');
  var goBtn = chat.querySelector('.demo-go');

  // Cambia el texto de estado de arriba (debajo de "2trAIn") con un fundido.
  function setStatus(t) {
    if (!statusEl) return;
    gsap.to(statusEl, { opacity: 0, duration: 0.18, onComplete: function() {
      statusEl.textContent = t;
      gsap.to(statusEl, { opacity: 1, duration: 0.18 });
    }});
  }

  // Cambia la cabecera del razonamiento (donde pone "Razonando con tus datos") con un fundido.
  function setPhrase(t) {
    if (!label) return;
    gsap.to(label, { opacity: 0, duration: 0.18, onComplete: function() {
      label.textContent = t;
      gsap.to(label, { opacity: 1, duration: 0.18 });
    }});
  }

  // Idioma de la demo según <html lang> (el mismo app.js sirve ES y EN).
  var demoEN = document.documentElement.lang === 'en';

  // 5 frases de "pensamiento" — se animan en la cabecera del razonamiento, una por línea.
  var phrases = demoEN ? [
    'Reading your history…',
    'Detecting shoulder discomfort…',
    'Ruling out risky exercises…',
    'Finding safe angles…',
    'Adding a preventive warm-up…'
  ] : [
    'Leyendo tu historial…',
    'Detectando molestia en el hombro…',
    'Descartando ejercicios de riesgo…',
    'Buscando ángulos seguros…',
    'Añadiendo calentamiento preventivo…'
  ];

  // Tamaño fijo + lo generado oculto hasta que "genere" (no reserva espacio mientras piensa).
  chat.classList.add('demo-chat--seq');
  aiBubble.classList.add('demo-pending');
  genWrap.classList.add('demo-pending');
  gsap.set([user, reasonBox], { opacity: 0, y: 14 });
  gsap.set(reasonLines, { opacity: 0, y: 8 });

  var tl = gsap.timeline({ scrollTrigger: { trigger: chat, start: 'top 72%', once: true } });

  // 1 · la pregunta del usuario
  tl.to(user, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' });

  // 2 · se abre la caja de razonamiento
  tl.to(reasonBox, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }, '+=0.3');

  // 3 · PENSAR: la cabecera del razonamiento va cambiando de subproceso y aparece cada línea
  reasonLines.forEach(function(line, i) {
    tl.call(setPhrase, [phrases[i % phrases.length]]);
    tl.to(line, { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }, '+=0.05');
    tl.to({}, { duration: 0.55 });  // pausa para "pensar"
  });

  // 4 · COLAPSAR el razonamiento a un chip ("✓ Razonado · 5 pasos") para hacer sitio
  tl.call(function() {
    reasonBox.classList.add('is-interactive', 'is-collapsed');
    if (label) { gsap.set(label, { opacity: 1 }); label.textContent = demoEN ? 'Reasoned with your data' : 'Razonado con tus datos'; }
    if (toggle) toggle.setAttribute('aria-expanded', 'false');
  }, null, '+=0.3');
  tl.to(reasonBody, { height: 0, opacity: 0, duration: 0.45, ease: 'power2.inOut' });
  tl.call(setStatus, [demoEN ? 'Generating your session…' : 'Generando tu sesión…']);

  // 5 · respuesta de la IA
  tl.call(function() { aiBubble.classList.remove('demo-pending'); });
  tl.fromTo(aiBubble, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }, '+=0.05');

  // 6 · GENERAR: aparece la sesión (carrusel) y el botón
  tl.call(function() { genWrap.classList.remove('demo-pending'); });
  tl.fromTo(genHead, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }, '+=0.1');
  tl.fromTo(carousel, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }, '-=0.1');
  tl.call(setStatus, [demoEN ? 'Session generated ✓' : 'Sesión generada ✓']);
  tl.fromTo(goBtn, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }, '+=0.05');

  // Toggle: reabrir / colapsar el razonamiento a mano (habilita scroll si se desborda).
  if (toggle) {
    toggle.addEventListener('click', function() {
      if (!reasonBox.classList.contains('is-interactive')) return;
      var willCollapse = !reasonBox.classList.contains('is-collapsed');
      reasonBox.classList.toggle('is-collapsed');
      toggle.setAttribute('aria-expanded', String(!willCollapse));
      if (willCollapse) {
        chat.classList.remove('is-open');
        gsap.to(reasonBody, { height: 0, opacity: 0, duration: 0.35, ease: 'power2.inOut' });
      } else {
        chat.classList.add('is-open');
        gsap.fromTo(reasonBody, { height: 0, opacity: 0 }, { height: 'auto', opacity: 1, duration: 0.35, ease: 'power2.out' });
      }
    });
  }
})();

// ===== "Pruébalo ya mismo": en móvil va DESPUÉS del chat (primero ves la demo, luego la usas) =====
(function() {
  var cta = document.querySelector('.demo-head__cta');
  var head = document.querySelector('.demo-head');
  var chat = document.querySelector('#demo .demo-chat');
  if (!cta || !head || !chat) return;
  var mq = window.matchMedia('(max-width: 860px)');
  function place() {
    if (mq.matches) {
      // móvil: el CTA justo después del chat
      if (chat.nextElementSibling !== cta) chat.parentNode.insertBefore(cta, chat.nextSibling);
    } else {
      // desktop: de vuelta a la columna izquierda, bajo el badge
      if (cta.parentNode !== head) head.appendChild(cta);
    }
  }
  place();
  if (mq.addEventListener) mq.addEventListener('change', place);
  else if (mq.addListener) mq.addListener(place);
})();
