/* =========================================================
   DRAGON'S LAIR HOBBIES — QUEST BOARD
   Interactive site behavior. Vanilla JS, no dependencies.
   ========================================================= */
(function () {
  'use strict';

  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.prototype.slice.call(c.querySelectorAll(s));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Year ---------- */
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Nav scrolled state + scroll progress ---------- */
  const nav = $('#nav');
  const sprog = $('#sprog');
  function onScroll() {
    const y = window.scrollY || window.pageYOffset;
    if (nav) nav.classList.toggle('scrolled', y > 20);
    if (sprog) {
      const h = document.documentElement;
      const max = (h.scrollHeight - h.clientHeight) || 1;
      const p = Math.max(0, Math.min(100, (y / max) * 100));
      sprog.style.setProperty('--p', p.toFixed(2) + '%');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  const navToggle = $('#navToggle');
  const navMenu = $('#navMenu');
  function setMenu(open) {
    document.body.classList.toggle('menu-open', open);
    if (navMenu) navMenu.classList.toggle('is-open', open);
    if (navToggle) navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  }
  if (navToggle) navToggle.addEventListener('click', () => setMenu(!document.body.classList.contains('menu-open')));
  if (navMenu) navMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

  /* ---------- Reveal on scroll ---------- */
  const revealEls = $$('[data-reveal]');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in'));
  }

  /* ---------- Hours: Wallingford + Berlin (America/New_York) ---------- */
  const HOURS = {
    wallingford: [
      [10, 18], [14, 20], [14, 20], [14, 20], [14, 21], [14, 22.5], [10, 18],
    ],
    berlin: [
      [10, 18], null, [14, 20], [14, 20], [14, 21], [14, 22.5], [10, 18],
    ],
  };
  const DAY_LONG  = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  function fmtHour(t) {
    if (t == null) return 'Closed';
    const h24 = Math.floor(t), m = Math.round((t - h24) * 60);
    const suf = h24 >= 12 ? 'PM' : 'AM';
    let h = h24 % 12; if (h === 0) h = 12;
    return m ? `${h}:${String(m).padStart(2, '0')} ${suf}` : `${h} ${suf}`;
  }

  function eastern() {
    try {
      const parts = new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/New_York', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false,
      }).formatToParts(new Date());
      let wd = '', hh = 0, mm = 0;
      for (const p of parts) {
        if (p.type === 'weekday') wd = p.value;
        else if (p.type === 'hour') hh = parseInt(p.value, 10);
        else if (p.type === 'minute') mm = parseInt(p.value, 10);
      }
      const map = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
      const day = map[wd];
      if (day === undefined) return null;
      return { day, t: hh + mm / 60 };
    } catch (_) { return null; }
  }

  function statusFor(hours, et) {
    const today = hours[et.day];
    if (!today) {
      for (let i = 1; i <= 7; i++) {
        const nx = hours[(et.day + i) % 7];
        if (nx) return { open: false, label: 'Closed', detail: `Opens ${DAY_LONG[(et.day + i) % 7]} at ${fmtHour(nx[0])}` };
      }
      return { open: false, label: 'Closed', detail: '' };
    }
    if (et.t >= today[0] && et.t < today[1]) {
      const rem = today[1] - et.t;
      const detail = rem <= 1 ? `Closes ${fmtHour(today[1])}` : `Until ${fmtHour(today[1])}`;
      return { open: true, label: 'Open now', detail };
    }
    if (et.t < today[0]) return { open: false, label: 'Closed', detail: `Opens today at ${fmtHour(today[0])}` };
    for (let i = 1; i <= 7; i++) {
      const nx = hours[(et.day + i) % 7];
      if (nx) return { open: false, label: 'Closed', detail: `Opens ${i === 1 ? 'tomorrow' : DAY_LONG[(et.day + i) % 7]} at ${fmtHour(nx[0])}` };
    }
    return { open: false, label: 'Closed', detail: '' };
  }

  function paintStore(container, storeKey, et) {
    const hours = HOURS[storeKey];
    if (!hours) return;
    const status = statusFor(hours, et);
    // Status badge
    const badge = container.querySelector('[data-status-badge]');
    const text  = container.querySelector('[data-status-text]');
    if (badge) {
      badge.classList.toggle('open', status.open);
      badge.classList.toggle('closed', !status.open);
    }
    if (text) text.textContent = `${status.label}${status.detail ? ' · ' + status.detail : ''}`;
    // Full hours list (visit)
    const list = container.querySelector('[data-hours]');
    if (list) {
      const rows = list.querySelectorAll('li');
      rows.forEach((li, i) => li.classList.toggle('today', i === et.day));
    }
    // Compact hours grid (loc-band)
    const mini = container.querySelector('[data-hours-mini]');
    if (mini) {
      const days = mini.querySelectorAll('.d');
      days.forEach(el => {
        const idx = parseInt(el.getAttribute('data-d'), 10);
        const isToday = idx === et.day;
        el.classList.toggle('today', isToday);
        // Also mark the following .t sibling
        const t = el.nextElementSibling;
        if (t) {
          t.parentNode.classList && t.parentNode.classList.remove; // no-op
          if (isToday) el.parentNode && el.parentNode.classList; // no-op safety
        }
      });
      // Mark the .t adjacent to .d.today as today (grid uses "row" pattern; we tag both spans)
      mini.querySelectorAll('.t').forEach((t, i) => t.classList.toggle('today', i === et.day));
      // "today" row highlighting via CSS reads .d.today AND .t.today
      // We piggy-back the loc-card CSS via grid-item selection
    }
  }

  function updateAllStores() {
    const et = eastern() || {
      day: new Date().getDay(),
      t: new Date().getHours() + new Date().getMinutes() / 60,
    };
    $$('[data-store]').forEach(el => paintStore(el, el.getAttribute('data-store'), et));
  }
  updateAllStores();
  setInterval(updateAllStores, 60 * 1000);

  /* ---------- Gallery filter ---------- */
  const gallery = $('#gallery');
  const chips = $$('.gal-chip');
  if (gallery && chips.length) {
    chips.forEach(chip => chip.addEventListener('click', () => {
      const filter = chip.getAttribute('data-filter');
      chips.forEach(c => c.classList.toggle('on', c === chip));
      gallery.querySelectorAll('.gtile').forEach(tile => {
        const match = filter === 'all' || tile.getAttribute('data-cat') === filter;
        tile.classList.toggle('hidden', !match);
      });
    }));
  }

  /* ---------- Lightbox ---------- */
  const lightbox = $('#lightbox');
  const lightboxImage = $('#lightboxImage');
  if (lightbox && lightboxImage) {
    gallery && gallery.querySelectorAll('.gtile').forEach(tile => {
      tile.addEventListener('click', () => {
        const img = tile.querySelector('img');
        if (!img) return;
        lightboxImage.src = img.src;
        lightboxImage.alt = img.alt;
        lightbox.classList.add('open');
        lightbox.setAttribute('aria-hidden', 'false');
      });
    });
    function closeLb() {
      lightbox.classList.remove('open');
      lightbox.setAttribute('aria-hidden', 'true');
    }
    lightbox.querySelector('.lb-close')?.addEventListener('click', closeLb);
    lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLb(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLb(); });
  }

  /* ---------- Copy address ---------- */
  const toast = $('#toast');
  function say(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('is-on');
    clearTimeout(say._t);
    say._t = setTimeout(() => toast.classList.remove('is-on'), 2200);
  }
  $$('[data-copy]').forEach(btn => btn.addEventListener('click', async () => {
    const text = btn.getAttribute('data-copy');
    try {
      await navigator.clipboard.writeText(text);
      say('Address copied');
    } catch (_) {
      // Fallback: create a temporary textarea
      const ta = document.createElement('textarea');
      ta.value = text; ta.style.position = 'fixed'; ta.style.left = '-9999px';
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); say('Address copied'); }
      catch (_) { say('Copy failed — try selecting'); }
      finally { document.body.removeChild(ta); }
    }
  }));

  /* ---------- Smooth-scroll for same-page anchors (nav offset) ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (!href || href === '#' || href.length < 2) return;
      const el = document.getElementById(href.slice(1));
      if (!el) return;
      e.preventDefault();
      const y = el.getBoundingClientRect().top + window.scrollY - 78;
      window.scrollTo({ top: y, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  });

})();
