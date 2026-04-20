/* ============================================================
   PORT DIGITAL — script.js
   ============================================================ */

(function () {
  'use strict';

  const SCHEDULE_URL = 'https://api.leadconnectorhq.com/widget/booking/b9j4QU3I5nlOsGMwjcgt';
  const WEBHOOK_URL  = 'https://services.leadconnectorhq.com/hooks/gnqR8GWpBsH0WFjECCUM/webhook-trigger/2c09e743-ec20-4fdc-a2b1-921cbe657b9a';

  /* ---- Utility ---- */
  const qs  = (sel, ctx = document) => ctx.querySelector(sel);
  const qsa = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
  const on  = (el, ev, fn, opts) => el && el.addEventListener(ev, fn, opts);

  /* ============================================================
     PAGE TRANSITIONS
  ============================================================ */
  function initPageTransitions() {
    const overlay = document.createElement('div');
    overlay.classList.add('page-transition-overlay');
    document.body.appendChild(overlay);

    overlay.style.transition = 'none';
    overlay.style.opacity    = '1';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        overlay.style.transition = '';
        overlay.style.opacity    = '0';
      });
    });

    on(document, 'click', e => {
      const link = e.target.closest('a[href]');
      if (!link) return;
      const href = link.getAttribute('href');
      if (!href) return;
      if (
        href.startsWith('http') || href.startsWith('//') ||
        href.startsWith('#')    || href.startsWith('mailto:') ||
        href.startsWith('tel:')
      ) return;
      e.preventDefault();
      overlay.style.opacity       = '1';
      overlay.style.pointerEvents = 'all';
      setTimeout(() => { window.location.href = href; }, 340);
    });
  }

  /* ============================================================
     NAV — scroll state
  ============================================================ */
  function initNav() {
    const nav = qs('.nav');
    if (!nav) return;
    const update = () => nav.classList.toggle('scrolled', window.scrollY > 10);
    on(window, 'scroll', update, { passive: true });
    update();
  }

  /* ============================================================
     MOBILE DRAWER
  ============================================================ */
  function initDrawer() {
    const ham    = qs('.nav-ham');
    const drawer = qs('.nav-drawer');
    if (!ham || !drawer) return;

    let open = false;
    function toggle(state) {
      open = state ?? !open;
      ham.classList.toggle('is-open', open);
      drawer.classList.toggle('is-open', open);
      ham.setAttribute('aria-expanded', String(open));
      drawer.setAttribute('aria-hidden', String(!open));
      document.body.style.overflow = open ? 'hidden' : '';
    }

    on(ham, 'click', () => toggle());
    qsa('a', drawer).forEach(a => on(a, 'click', () => toggle(false)));
    on(document, 'keydown', e => { if (e.key === 'Escape' && open) toggle(false); });
  }

  /* ============================================================
     LOGO — PAGE LOAD TYPEWRITER (nav logo only, fires once)
     Brackets spring in, then "pd" slowly types to "port digital".
  ============================================================ */
  function initNavLogoEntrance() {
    const LONG     = 'port digital';
    const navLogo  = qs('nav .nav-logo');
    if (!navLogo) return;

    const el       = navLogo.querySelector('.logo-letters');
    const bracketL = navLogo.querySelector('.logo-bracket-left');
    const bracketR = navLogo.querySelector('.logo-bracket-right');
    if (!el || !bracketL || !bracketR) return;

    // Initial state: hidden, displaced
    [bracketL, bracketR].forEach(b => {
      b.style.opacity    = '0';
      b.style.transition = 'none';
    });
    el.style.opacity    = '0';
    el.style.transition = 'none';
    bracketL.style.transform = 'translateX(-12px)';
    bracketR.style.transform = 'translateX(12px)';

    // Phase 1: brackets spring in (after 160ms)
    setTimeout(() => {
      const t = 'transform 0.65s cubic-bezier(0.34,1.56,0.64,1), opacity 0.45s ease';
      bracketL.style.transition = t;
      bracketR.style.transition = t;
      el.style.transition       = 'opacity 0.35s ease 0.1s';

      bracketL.style.transform = '';
      bracketL.style.opacity   = '';
      bracketR.style.transform = '';
      bracketR.style.opacity   = '';
      el.style.opacity         = '';
    }, 160);

    // Phase 2: slow type-out starting after brackets land (~900ms)
    let charIndex = 2; // already shows "pd" (2 chars)
    el.textContent = 'pd';

    function typeNextChar() {
      if (charIndex >= LONG.length) return;
      el.textContent = LONG.slice(0, charIndex + 1);
      charIndex++;
      if (charIndex < LONG.length) setTimeout(typeNextChar, 115);
    }

    // Start from 'p' and type the full word
    setTimeout(() => {
      el.textContent = LONG[0]; // start from 'p'
      charIndex = 1;
      typeNextChar();
    }, 920);
  }

  /* ============================================================
     LOGO — BODY LOGO HOVER TYPEWRITER
     Footer logos (not nav) type on hover, erase on leave.
  ============================================================ */
  function initBodyLogoHover() {
    const SHORT = 'pd';
    const LONG  = 'port digital';

    const bodyLogos = qsa('.nav-logo').filter(el => !el.closest('nav'));

    bodyLogos.forEach(logo => {
      const el = logo.querySelector('.logo-letters');
      if (!el) return;

      let goal  = 'short';
      let timer = null;

      function step() {
        const cur = el.textContent;
        if (goal === 'long') {
          if (cur === LONG) return;
          if (LONG.startsWith(cur)) {
            el.textContent = LONG.slice(0, cur.length + 1);
          } else {
            el.textContent = LONG[0];
          }
          if (el.textContent !== LONG) timer = setTimeout(step, 70);
        } else {
          if (cur === SHORT) return;
          const newLen = cur.length - 1;
          if (newLen <= SHORT.length) { el.textContent = SHORT; return; }
          el.textContent = cur.slice(0, newLen);
          timer = setTimeout(step, 45);
        }
      }

      on(logo, 'mouseenter', () => {
        clearTimeout(timer);
        goal = 'long';
        if (el.textContent === SHORT) el.textContent = LONG[0];
        step();
      });
      on(logo, 'mouseleave', () => {
        clearTimeout(timer);
        goal = 'short';
        step();
      });
    });
  }

  /* ============================================================
     HERO REVEAL
  ============================================================ */
  function initHeroReveal() {
    const hero = qs('.hero');
    if (!hero) return;
    requestAnimationFrame(() => {
      setTimeout(() => hero.classList.add('is-revealed'), 80);
    });
  }

  /* ============================================================
     HERO DOT GRID — mouse parallax
  ============================================================ */
  function initHeroDots() {
    const dots = qs('.hero-dots');
    if (!dots) return;
    let mx = 0, my = 0, raf;
    on(document, 'mousemove', e => {
      mx = (e.clientX / window.innerWidth  - 0.5) * 2;
      my = (e.clientY / window.innerHeight - 0.5) * 2;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        dots.style.transform = `translate(${mx * 12}px, ${my * 10}px)`;
      });
    }, { passive: true });
  }

  /* ============================================================
     SCROLL REVEAL
  ============================================================ */
  function initScrollReveal() {
    if (!('IntersectionObserver' in window)) {
      qsa('.reveal').forEach(el => el.classList.add('is-visible'));
      return;
    }
    const obs = new IntersectionObserver(entries => {
      entries.forEach(({ target, isIntersecting }) => {
        if (isIntersecting) { target.classList.add('is-visible'); obs.unobserve(target); }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -48px 0px' });
    qsa('.reveal').forEach(el => obs.observe(el));
  }

  /* ============================================================
     STAT COUNTER
  ============================================================ */
  function initCounters() {
    const counters = qsa('[data-count]');
    if (!counters.length) return;

    const easeOutExpo = t => t >= 1 ? 1 : 1 - Math.pow(2, -10 * t);

    function animateOne(el) {
      const target   = parseFloat(el.dataset.count);
      const prefix   = el.dataset.prefix || '';
      const suffix   = el.dataset.suffix || '';
      const duration = 1600;
      const start    = performance.now();
      const isInt    = Number.isInteger(target);

      function tick(now) {
        const t = Math.min((now - start) / duration, 1);
        const v = target * easeOutExpo(t);
        el.textContent = prefix + (isInt ? Math.round(v) : v.toFixed(1)) + suffix;
        if (t < 1) requestAnimationFrame(tick);
        else el.textContent = prefix + (isInt ? target : target.toFixed(0)) + suffix;
      }
      requestAnimationFrame(tick);
    }

    if (!('IntersectionObserver' in window)) { counters.forEach(animateOne); return; }

    const obs = new IntersectionObserver(entries => {
      entries.forEach(({ target, isIntersecting }) => {
        if (isIntersecting) { animateOne(target); obs.unobserve(target); }
      });
    }, { threshold: 0.5 });
    counters.forEach(el => obs.observe(el));
  }

  /* ============================================================
     FORM SUBMISSION — webhook POST
  ============================================================ */
  function initForms() {
    qsa('.js-form').forEach(form => {
      on(form, 'submit', async e => {
        e.preventDefault();

        const wrap    = form.closest('.form-wrap');
        const thanks  = wrap && qs('.form-thanks', wrap);
        const errorEl = wrap && qs('.form-error', wrap);
        const btn     = form.querySelector('.form-btn');

        const nameInput    = form.querySelector('[name="name"]');
        const phoneInput   = form.querySelector('[name="phone"]');
        const messageInput = form.querySelector('[name="message"]');

        const payload = {
          fullName:    (nameInput?.value    || '').trim(),
          phone:       (phoneInput?.value   || '').trim(),
          message:     (messageInput?.value || '').trim(),
          submittedAt: new Date().toISOString(),
          source:      window.location.href,
        };

        if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }
        if (errorEl) errorEl.style.display = 'none';

        try {
          const res = await fetch(WEBHOOK_URL, {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify(payload),
          });

          if (!res.ok) throw new Error('HTTP ' + res.status);

          form.style.display = 'none';
          if (errorEl) errorEl.style.display = 'none';
          if (thanks) {
            thanks.classList.add('visible');
            thanks.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        } catch (err) {
          if (btn) { btn.disabled = false; btn.textContent = 'Send Message'; }
          if (errorEl) {
            errorEl.style.display = 'block';
            errorEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
        }
      });
    });
  }

  /* ============================================================
     CUSTOM CURSOR
  ============================================================ */
  function initCursor() {
    if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return;

    const dot  = qs('.cursor-dot');
    const ring = qs('.cursor-ring');
    if (!dot || !ring) return;

    let mx = -100, my = -100, rx = -100, ry = -100;

    on(document, 'mousemove', e => {
      mx = e.clientX; my = e.clientY;
      dot.style.left = mx + 'px';
      dot.style.top  = my + 'px';
      document.body.classList.add('cursor-active');
    }, { passive: true });

    on(document, 'mouseleave', () => document.body.classList.remove('cursor-active'));

    (function lerp() {
      rx += (mx - rx) * 0.13;
      ry += (my - ry) * 0.13;
      ring.style.left = rx + 'px';
      ring.style.top  = ry + 'px';
      requestAnimationFrame(lerp);
    })();

    const hoverSel = 'a, button, .svc-card, .svct-card, .why-card, .work-card, .btn, .btn-schedule-lg, .nav-schedule-btn, .next-client-card, input, textarea';
    on(document, 'mouseover', e => { if (e.target.closest(hoverSel)) ring.classList.add('is-hovering'); });
    on(document, 'mouseout',  e => { if (e.target.closest(hoverSel)) ring.classList.remove('is-hovering'); });
  }

  /* ============================================================
     ACTIVE NAV LINK HIGHLIGHTING
  ============================================================ */
  function initActiveNav() {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    qsa('.nav-link, .nav-drawer a').forEach(a => {
      const href = (a.getAttribute('href') || '').split('/').pop();
      if (href === path || (path === '' && (href === 'index.html' || href === '/'))) {
        a.style.setProperty('color', 'var(--blue)', 'important');
      }
    });
  }

  /* ============================================================
     INIT
  ============================================================ */
  on(document, 'DOMContentLoaded', () => {
    initPageTransitions();
    initNav();
    initDrawer();
    initHeroReveal();
    initHeroDots();
    initScrollReveal();
    initCounters();
    initForms();
    initCursor();
    initNavLogoEntrance();
    initBodyLogoHover();
    initActiveNav();
  });

})();
