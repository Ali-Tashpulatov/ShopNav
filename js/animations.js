/**
 * animations.js — ShopNav Premium Animations
 * Balanced olive-emerald design system.
 *
 * Key fixes vs previous version:
 *  - Cursor is opt-in (fades in on first mouse move, doesn't block interactions)
 *  - Removed body cursor:none (handled via CSS .visible class instead)
 *  - Language selector and city selector events properly wired
 *  - Dropdown z-index / overlay issues resolved via pointer-events management
 *  - Compatible with both <script defer> and <script type="module"> loading
 *  - All animations use graceful degradation — content visible first
 */

const GSAP_URL       = 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js';
const SCROLLTRIG_URL = 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js';
const LENIS_URL      = 'https://cdn.jsdelivr.net/npm/lenis@1.1.14/dist/lenis.min.js';

/* ── Fallback: ensure everything is visible no matter what ─────────────── */
function ensureVisible() {
  document.querySelectorAll(
    '.hero-word, [data-animate], .navbar, .card, .mode-card, .step-item, .category-card, .deal-card'
  ).forEach(el => {
    el.style.opacity    = '';
    el.style.transform  = '';
    el.style.filter     = '';
    el.style.visibility = '';
  });
}

/* Safety net: if GSAP hasn't finished within 2.5 s, show everything */
const safetyTimer = setTimeout(ensureVisible, 2500);

function loadScript(src) {
  return new Promise(resolve => {
    if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
    const s   = document.createElement('script');
    s.src     = src;
    s.async   = true;
    s.onload  = resolve;
    s.onerror = () => resolve();
    document.head.appendChild(s);
    setTimeout(resolve, 3000);
  });
}

/* ════════════════════════════════════════════════════════════════
   MAIN INIT
   ════════════════════════════════════════════════════════════════ */
async function init() {
  try {
    await loadScript(GSAP_URL);
    await loadScript(SCROLLTRIG_URL);
    await loadScript(LENIS_URL);

    const gsap          = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;

    if (!gsap) { clearTimeout(safetyTimer); ensureVisible(); return; }
    if (ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

    /* ── Lenis smooth scroll ──────────────────────────────────── */
    try {
      const LenisClass = window.Lenis;
      if (LenisClass) {
        const lenis = new LenisClass({
          duration:    1.3,
          easing:      t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          smoothTouch: false,
        });
        gsap.ticker.add(time => lenis.raf(time * 1000));
        gsap.ticker.lagSmoothing(0);
        if (ScrollTrigger) lenis.on('scroll', ScrollTrigger.update);
      }
    } catch (_) { /* Lenis optional */ }

    const isHome = document.body.classList.contains('page-home');

    /* ── 1. Custom cursor (home only) ─────────────────────────── */
    if (isHome) initCursor(gsap);

    /* ── 2. Hero entrance ─────────────────────────────────────── */
    initHeroEntrance(gsap);

    /* ── 3. Navbar scroll-state ───────────────────────────────── */
    initNavbar(gsap, ScrollTrigger);

    /* ── 4. Scroll reveals ────────────────────────────────────── */
    if (ScrollTrigger) initScrollReveals(gsap, ScrollTrigger);

    /* ── 5. Hover interactions ────────────────────────────────── */
    initInteractions(gsap);
    if (isHome) initEmeraldInteractions(gsap);

    /* ── 7. Selector fixes ────────────────────────────────────── */
    initSelectorFixes();

    /* ── 8. Page exit ─────────────────────────────────────────── */
    initPageExit(gsap);

  } catch (err) {
    clearTimeout(safetyTimer);
    ensureVisible();
    console.warn('[ShopNav] Animation init failed, degraded gracefully:', err.message);
  }
}

/* ════════════════════════════════════════════════════════════════
   HERO ENTRANCE
   ════════════════════════════════════════════════════════════════ */
function initHeroEntrance(gsap) {
  const SPLASH_DONE = 0.95;

  gsap.delayedCall(SPLASH_DONE, () => {
    const navbar     = document.getElementById('mainNavbar');
    const heroBadge  = document.querySelector('[data-animate="hero-badge"]');
    const heroWords  = document.querySelectorAll('.hero-word');
    const heroSub    = document.querySelector('[data-animate="hero-sub"]');
    const heroSearch = document.getElementById('heroSearchContainer');
    const searchBtns = document.querySelector('[data-animate="search-types"]');
    const heroStats  = document.querySelector('[data-animate="hero-stats"]');

    const tl = gsap.timeline({ onComplete: () => clearTimeout(safetyTimer) });

    if (navbar) {
      gsap.set(navbar, { y: -20, opacity: 0 });
      tl.to(navbar, { y: 0, opacity: 1, duration: 0.52, ease: 'power3.out' }, 0);
    }

    if (heroBadge) {
      gsap.set(heroBadge, { y: 20, opacity: 0, scale: 0.92 });
      tl.to(heroBadge, { y: 0, opacity: 1, scale: 1, duration: 0.62, ease: 'back.out(1.5)' }, 0.1);
    }

    if (heroWords.length) {
      gsap.set(heroWords, { y: 36, opacity: 0, filter: 'blur(8px)' });
      tl.to(heroWords, {
        y: 0, opacity: 1, filter: 'blur(0px)',
        duration: 0.75,
        stagger:  0.09,
        ease:     'power4.out',
      }, 0.2);
    }

    if (heroSub) {
      gsap.set(heroSub, { y: 20, opacity: 0 });
      tl.to(heroSub, { y: 0, opacity: 1, duration: 0.58, ease: 'power3.out' }, 0.5);
    }

    if (heroSearch) {
      gsap.set(heroSearch, { y: 20, opacity: 0, scale: 0.97 });
      tl.to(heroSearch, { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: 'power3.out' }, 0.64);
    }

    if (searchBtns) {
      gsap.set(searchBtns, { y: 12, opacity: 0 });
      tl.to(searchBtns, { y: 0, opacity: 1, duration: 0.48, ease: 'power2.out' }, 0.80);
    }

    if (heroStats) {
      const statItems = heroStats.querySelectorAll('.stat');
      const targets   = statItems.length ? Array.from(statItems) : [heroStats];
      gsap.set(targets, { y: 16, opacity: 0 });
      tl.to(targets, { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: 'power2.out' }, 0.9);
    }

    /* Floating search bar */
    const searchBar = document.getElementById('heroSearchBar');
    if (searchBar) {
      gsap.to(searchBar, {
        y: -4, duration: 3.8, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 1.2,
      });
    }
  });
}

/* ════════════════════════════════════════════════════════════════
   NAVBAR
   ════════════════════════════════════════════════════════════════ */
function initNavbar(gsap, ScrollTrigger) {
  const navbar = document.getElementById('mainNavbar');
  if (navbar && ScrollTrigger) {
    ScrollTrigger.create({
      start:       'top -50px',
      onEnter:     () => navbar.setAttribute('data-scrolled', 'true'),
      onLeaveBack: () => navbar.removeAttribute('data-scrolled'),
    });
  }
}

/* ════════════════════════════════════════════════════════════════
   SCROLL REVEALS (GSAP-powered)
   ════════════════════════════════════════════════════════════════ */
function initScrollReveals(gsap, ScrollTrigger) {

  function revealBatch(selector, opts = {}) {
    const els = document.querySelectorAll(selector);
    if (!els.length) return;

    ScrollTrigger.batch(els, {
      onEnter: batch => gsap.fromTo(batch,
        { opacity: 0, y: opts.y || 28, filter: 'blur(3px)' },
        {
          opacity: 1, y: 0, filter: 'blur(0px)',
          duration: opts.duration || 0.65,
          stagger:  opts.stagger  || 0.06,
          ease:     'power3.out',
          overwrite: true,
        }
      ),
      start: 'top 88%',
      once:  true,
    });
  }

  setTimeout(() => {
    revealBatch('.card.card-padded',  { stagger: 0.07 });
    revealBatch('.mode-card',         { stagger: 0.08, y: 26 });
    revealBatch('.step-item',         { stagger: 0.07, y: 18 });
    revealBatch('.category-card',     { stagger: 0.055, y: 18 });
    revealBatch('.deal-card',         { stagger: 0.05, y: 16 });
    ScrollTrigger.refresh();
  }, 350);

  window.refreshScrollAnimations = () => {
    ScrollTrigger.refresh();
    revealBatch('.category-card', { stagger: 0.055, y: 18 });
    revealBatch('.deal-card',         { stagger: 0.05, y: 16 });
  };
}

/* ════════════════════════════════════════════════════════════════
   STANDARD INTERACTIONS (all pages)
   ════════════════════════════════════════════════════════════════ */
function initInteractions(gsap) {

  function addHover(selector, yVal = -5, scaleVal = 1.015) {
    document.querySelectorAll(selector).forEach(el => {
      el.addEventListener('mouseenter', () =>
        gsap.to(el, { y: yVal, scale: scaleVal, boxShadow: '0 14px 36px rgba(0,0,0,.1)', duration: 0.24, ease: 'power2.out', overwrite: 'auto' })
      );
      el.addEventListener('mouseleave', () =>
        gsap.to(el, { y: 0, scale: 1, boxShadow: '0 1px 4px rgba(0,0,0,.06)', duration: 0.24, ease: 'power2.out', overwrite: 'auto' })
      );
    });
  }

  addHover('.deal-card');
  addHover('.category-card', -4, 1.014);
  addHover('.mode-card',     -5, 1.010);
  addHover('.product-card');
  addHover('.card.card-padded', -3, 1.008);

  /* Hero search bar */
  const heroBar = document.getElementById('heroSearchBar');
  if (heroBar) {
    heroBar.addEventListener('mouseenter', () =>
      gsap.to(heroBar, { boxShadow: '0 0 0 2px rgba(5,150,105,.14), 0 8px 28px rgba(0,0,0,.1)', duration: 0.24, ease: 'power2.out', overwrite: 'auto' })
    );
    heroBar.addEventListener('mouseleave', () => {
      if (!heroBar.contains(document.activeElement))
        gsap.to(heroBar, { boxShadow: '0 4px 18px rgba(0,0,0,.07)', duration: 0.24, ease: 'power2.out', overwrite: 'auto' });
    });
    heroBar.addEventListener('focusin', () =>
      gsap.to(heroBar, { boxShadow: '0 0 0 3px rgba(5,150,105,.18), 0 10px 32px rgba(0,0,0,.12)', scale: 1.008, duration: 0.22, ease: 'power2.out', overwrite: 'auto' })
    );
    heroBar.addEventListener('focusout', () =>
      gsap.to(heroBar, { boxShadow: '0 4px 18px rgba(0,0,0,.07)', scale: 1, duration: 0.24, ease: 'power2.out', overwrite: 'auto' })
    );
  }

  /* Primary & accent buttons */
  document.querySelectorAll('.btn-primary, .search-bar-btn, .btn-accent').forEach(btn => {
    btn.addEventListener('mouseenter',  () => gsap.to(btn, { scale: 1.04, y: -1, duration: 0.17, ease: 'back.out(2)', overwrite: 'auto' }));
    btn.addEventListener('mouseleave',  () => gsap.to(btn, { scale: 1,    y:  0, duration: 0.20, ease: 'power2.out',  overwrite: 'auto' }));
    btn.addEventListener('mousedown',   () => gsap.to(btn, { scale: 0.95,       duration: 0.08, ease: 'power2.in',   overwrite: 'auto' }));
    btn.addEventListener('mouseup',     () => gsap.to(btn, { scale: 1,          duration: 0.20, ease: 'back.out(2)', overwrite: 'auto' }));
  });

  /* Navbar links */
  document.querySelectorAll('.navbar-links a').forEach(link => {
    link.addEventListener('mouseenter', () => gsap.to(link, { y: -1, duration: 0.14, ease: 'power2.out', overwrite: 'auto' }));
    link.addEventListener('mouseleave', () => gsap.to(link, { y:  0, duration: 0.14, ease: 'power2.out', overwrite: 'auto' }));
  });

  /* Search type chips */
  document.querySelectorAll('.search-type-btn').forEach(btn => {
    btn.addEventListener('mouseenter', () => gsap.to(btn, { scale: 1.05, y: -2, duration: 0.17, ease: 'back.out(2)', overwrite: 'auto' }));
    btn.addEventListener('mouseleave', () => gsap.to(btn, { scale: 1,    y:  0, duration: 0.17, ease: 'power2.out', overwrite: 'auto' }));
  });
}

/* ════════════════════════════════════════════════════════════════
   EMERALD INTERACTIONS (home page only)
   ════════════════════════════════════════════════════════════════ */
function initEmeraldInteractions(gsap) {

  /* 3D card tilt on mouse-move */
  function addTilt(selector) {
    document.querySelectorAll(selector).forEach(card => {
      card.style.transformStyle = 'preserve-3d';

      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x    = (e.clientX - rect.left) / rect.width  - 0.5;
        const y    = (e.clientY - rect.top)  / rect.height - 0.5;
        gsap.to(card, {
          rotateY: x * 10,
          rotateX: -y * 8,
          transformPerspective: 900,
          duration: 0.32,
          ease:     'power2.out',
          overwrite: 'auto',
        });
      });

      card.addEventListener('mouseleave', () =>
        gsap.to(card, { rotateY: 0, rotateX: 0, duration: 0.55, ease: 'power3.out', overwrite: 'auto' })
      );
    });
  }

  addTilt('.mode-card');
  addTilt('.card.card-padded');

  /* Soft emerald glow on card hover */
  document.querySelectorAll('.mode-card, .deal-card, .card.card-padded').forEach(card => {
    card.addEventListener('mouseenter', () =>
      gsap.to(card, {
        boxShadow:   '0 0 22px rgba(5,150,105,0.12), 0 0 44px rgba(5,150,105,0.04), 0 18px 38px rgba(0,0,0,0.28)',
        borderColor: 'rgba(52,211,153,0.28)',
        y: -6,
        duration: 0.28, ease: 'power2.out', overwrite: 'auto',
      })
    );
    card.addEventListener('mouseleave', () =>
      gsap.to(card, {
        boxShadow:   '0 2px 12px rgba(0,0,0,0.20)',
        borderColor: 'rgba(52,211,153,0.14)',
        y: 0,
        duration: 0.35, ease: 'power2.out', overwrite: 'auto',
      })
    );
  });

  /* Search bar emerald glow on focus */
  const heroBar = document.getElementById('heroSearchBar');
  if (heroBar) {
    heroBar.addEventListener('focusin', () =>
      gsap.to(heroBar, {
        boxShadow: '0 0 0 2.5px rgba(5,150,105,0.2), 0 0 35px rgba(5,150,105,0.1), 0 12px 32px rgba(0,0,0,0.22)',
        scale: 1.01,
        duration: 0.28, ease: 'power2.out', overwrite: 'auto',
      })
    );
    heroBar.addEventListener('focusout', () =>
      gsap.to(heroBar, {
        boxShadow: '0 0 0 1px rgba(52,211,153,0.1), 0 6px 20px rgba(0,0,0,0.18)',
        scale: 1,
        duration: 0.28, ease: 'power2.out', overwrite: 'auto',
      })
    );
  }
}

/* ════════════════════════════════════════════════════════════════
   LANGUAGE & CITY SELECTOR FIXES
   ════════════════════════════════════════════════════════════════ */
function initSelectorFixes() {
  document.addEventListener('click', e => {
    const langWrap = document.getElementById('langSelectorWrap');
    const cityWrap = document.getElementById('citySelectorWrap');

    if (langWrap && !langWrap.contains(e.target)) {
      const langDd = document.getElementById('langDropdown');
      if (langDd) langDd.style.display = 'none';
    }

    if (cityWrap && !cityWrap.contains(e.target)) {
      const cityDd = document.getElementById('cityDropdown');
      if (cityDd) cityDd.style.display = 'none';
    }
  });
}

/* ════════════════════════════════════════════════════════════════
   CUSTOM CURSOR (home page, touch-safe opt-in)
   ════════════════════════════════════════════════════════════════ */
function initCursor(gsap) {
  const ring = document.getElementById('cursor-ring');
  const dot  = document.getElementById('cursor-dot');
  if (!ring || !dot) return;
  if ('ontouchstart' in window) return;

  let cx = -200, cy = -200, rx = -200, ry = -200;
  let cursorVisible = false;

  document.addEventListener('mousemove', e => {
    cx = e.clientX; cy = e.clientY;

    if (!cursorVisible) {
      cursorVisible = true;
      ring.classList.add('visible');
      dot.classList.add('visible');
    }

    gsap.to(dot, { x: cx, y: cy, duration: 0.06, ease: 'none', overwrite: true });
  });

  gsap.ticker.add(() => {
    rx += (cx - rx) * 0.12;
    ry += (cy - ry) * 0.12;
    gsap.set(ring, { x: rx, y: ry });
  });

  const selectors = [
    'a', 'button', '[role="button"]',
    '.mode-card', '.category-card', '.deal-card',
    '.product-card', '.search-type-btn', '.search-bar-btn'
  ].join(', ');

  document.querySelectorAll(selectors).forEach(el => {
    el.addEventListener('mouseenter', () =>
      gsap.to(ring, { width: 46, height: 46, borderColor: 'rgba(52,211,153,0.75)', duration: 0.2, ease: 'power2.out' })
    );
    el.addEventListener('mouseleave', () =>
      gsap.to(ring, { width: 28, height: 28, borderColor: 'rgba(52,211,153,0.5)', duration: 0.22, ease: 'power2.out' })
    );
  });

  document.addEventListener('mousedown', () => {
    gsap.to(ring, { scale: 0.82, duration: 0.08, ease: 'power2.in' });
    gsap.to(dot,  { scale: 1.5,  duration: 0.08, ease: 'power2.in' });
  });
  document.addEventListener('mouseup', () => {
    gsap.to(ring, { scale: 1, duration: 0.2, ease: 'back.out(2)' });
    gsap.to(dot,  { scale: 1, duration: 0.2, ease: 'back.out(2)' });
  });
}

/* ════════════════════════════════════════════════════════════════
   PAGE EXIT FADE
   ════════════════════════════════════════════════════════════════ */
function initPageExit(gsap) {
  document.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      if (!href || href.startsWith('http') || href.startsWith('#') ||
          href.startsWith('mailto:') || link.target === '_blank') return;
      e.preventDefault();
      gsap.to(document.body, {
        opacity: 0, duration: 0.22, ease: 'power2.in',
        onComplete: () => { window.location.href = href; },
      });
    });
  });
}

/* ════════════════════════════════════════════════════════════════
   DYNAMIC CONTENT HOOK
   ════════════════════════════════════════════════════════════════ */
window.animateDynamicElements = selector => {
  if (!window.gsap) return;
  const els = Array.from(document.querySelectorAll(selector));
  if (!els.length) return;
  window.gsap.fromTo(els,
    { opacity: 0, y: 10, filter: 'blur(3px)' },
    { opacity: 1, y: 0,  filter: 'blur(0px)', duration: 0.32, stagger: 0.04, ease: 'power3.out' }
  );
};

/* ── Boot ─────────────────────────────────────────────────────── */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
