/* =========================================================
   DRAGON'S LAIR HOBBIES — CABINET OS interactions
   ========================================================= */
(function () {
  'use strict';

  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Power flash once per visit ---------- */
  var flash = document.querySelector('.power-flash');
  if (flash) {
    var seen = false;
    try { seen = sessionStorage.getItem('dl-booted') === '1'; } catch (e) {}
    if (seen) {
      flash.remove();
    } else {
      try { sessionStorage.setItem('dl-booted', '1'); } catch (e) {}
      setTimeout(function () { if (flash.parentNode) flash.remove(); }, 1200);
    }
  }

  /* ---------- Mobile drawer ---------- */
  var menuBtn = document.getElementById('menuBtn');
  var drawer = document.getElementById('drawer');
  var drawerBg = document.getElementById('drawerBg');
  function setDrawer(open) {
    if (!drawer) return;
    drawer.classList.toggle('open', open);
    if (drawerBg) drawerBg.classList.toggle('open', open);
    if (menuBtn) menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) {
      drawer.removeAttribute('hidden');
      drawer.setAttribute('aria-hidden', 'false');
      if (drawer.hasAttribute('inert')) drawer.removeAttribute('inert');
      var firstLink = drawer.querySelector('a');
      if (firstLink) firstLink.focus();
    } else {
      drawer.setAttribute('aria-hidden', 'true');
      try { drawer.setAttribute('inert', ''); } catch (e) {}
      if (!('inert' in document.documentElement)) {
        drawer.querySelectorAll('a,button').forEach(function (el) {
          if (open) el.removeAttribute('tabindex');
          else el.setAttribute('tabindex', '-1');
        });
      }
    }
  }
  setDrawer(false);
  if (menuBtn) menuBtn.addEventListener('click', function () { setDrawer(!drawer.classList.contains('open')); });
  if (drawerBg) drawerBg.addEventListener('click', function () { setDrawer(false); });
  if (drawer) drawer.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { setDrawer(false); if (menuBtn) menuBtn.focus(); }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && drawer && drawer.classList.contains('open')) { setDrawer(false); if (menuBtn) menuBtn.focus(); } });

  /* ---------- Reveal ---------- */
  var revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { threshold: 0.1, rootMargin: '0px 0px -6% 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- Title-screen menu arrow-key nav ---------- */
  var menu = document.getElementById('mainMenu');
  if (menu) {
    var links = Array.prototype.slice.call(menu.querySelectorAll('a'));
    var idx = 0;
    function select(i, focus) {
      idx = (i + links.length) % links.length;
      links.forEach(function (a, n) { a.classList.toggle('sel', n === idx); });
      if (focus) links[idx].focus();
    }
    select(0, false);
    links.forEach(function (a, n) { a.addEventListener('mouseenter', function () { select(n, false); }); });
    menu.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') { e.preventDefault(); select(idx + 1, true); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); select(idx - 1, true); }
    });
  }

  /* ---------- Store hours (Wallingford + Berlin) ---------- */
  // Each day: [open, close] in decimal hours (Eastern time). null = closed.
  var STORES = {
    wallingford: {
      name: 'WALLINGFORD',
      hours: [
        [10, 18], [14, 20], [14, 20], [14, 20], [14, 21], [14, 22.5], [10, 18]
      ]
    },
    berlin: {
      name: 'BERLIN',
      hours: [
        [10, 18], null, [14, 20], [14, 20], [14, 21], [14, 22.5], [10, 18]
      ]
    }
  };
  var DAY = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  function fmt(t) {
    if (t == null) return 'Closed';
    var h = Math.floor(t), m = Math.round((t - h) * 60);
    var ap = h >= 12 ? 'PM' : 'AM', hh = h % 12; if (hh === 0) hh = 12;
    return hh + (m ? ':' + (m < 10 ? '0' + m : m) : '') + ' ' + ap;
  }

  function etParts() {
    try {
      var parts = new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/New_York', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false
      }).formatToParts(new Date());
      var wd = '', hh = 0, mm = 0;
      for (var i = 0; i < parts.length; i++) {
        var pt = parts[i];
        if (pt.type === 'weekday') wd = pt.value;
        else if (pt.type === 'hour') hh = parseInt(pt.value, 10);
        else if (pt.type === 'minute') mm = parseInt(pt.value, 10);
      }
      var map = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
      var day = map[wd];
      if (day === undefined) return null;
      return { day: day, t: hh + mm / 60 };
    } catch (e) { return null; }
  }

  function statusFor(store, et) {
    var t = store.hours[et.day];
    if (!t) {
      // find next open day
      for (var i = 1; i <= 7; i++) {
        var next = store.hours[(et.day + i) % 7];
        if (next) return { open: false, msg: 'CLOSED — OPENS ' + DAY[(et.day + i) % 7] + ' ' + fmt(next[0]) };
      }
      return { open: false, msg: 'CLOSED' };
    }
    var open = et.t >= t[0] && et.t < t[1];
    if (open) {
      var msg = (t[1] - et.t <= 1) ? 'OPEN — CLOSING ' + fmt(t[1]) : 'OPEN — UNTIL ' + fmt(t[1]);
      return { open: true, msg: msg, close: t[1] };
    }
    if (et.t < t[0]) return { open: false, msg: 'CLOSED — OPENS ' + fmt(t[0]) };
    // after close: find next open day
    for (var j = 1; j <= 7; j++) {
      var nx = store.hours[(et.day + j) % 7];
      if (nx) return { open: false, msg: 'CLOSED — OPENS ' + DAY[(et.day + j) % 7] + ' ' + fmt(nx[0]) };
    }
    return { open: false, msg: 'CLOSED' };
  }

  function paintTerm(idSuffix, store, et) {
    var s = statusFor(store, et);
    var stat = document.getElementById('stat' + idSuffix);
    var badge = document.getElementById('statBadge' + idSuffix);
    var list = document.getElementById('hours' + idSuffix);
    if (stat) stat.textContent = s.msg;
    if (badge) {
      badge.classList.toggle('on', s.open);
      badge.classList.toggle('off', !s.open);
      badge.textContent = s.open ? '● ONLINE' : '● OFFLINE';
    }
    if (list) {
      list.querySelectorAll('.day').forEach(function (el) {
        var d = parseInt(el.getAttribute('data-d'), 10);
        el.classList.toggle('today', d === et.day);
      });
    }
  }

  var currentStore = 'wallingford';
  var storeChips = document.querySelectorAll('.hud-store .chip');

  function updateAll() {
    var et = etParts() || { day: new Date().getDay(), t: new Date().getHours() + new Date().getMinutes() / 60 };
    var store = STORES[currentStore];
    var s = statusFor(store, et);
    var hud = document.getElementById('hudStatus');
    if (hud) {
      hud.classList.toggle('on', s.open);
      hud.classList.toggle('off', !s.open);
      hud.innerHTML = '<span class="dot"></span>' + (s.open ? 'OPEN · ' + store.name : 'CLOSED · ' + store.name);
    }
    var hudHours = document.getElementById('hudHours');
    if (hudHours) {
      var todayHours = store.hours[et.day];
      hudHours.textContent = todayHours
        ? fmt(todayHours[0]) + ' – ' + fmt(todayHours[1])
        : 'CLOSED TODAY';
    }
    // Always update both terminals (they're static content, don't switch with chip)
    paintTerm('W', STORES.wallingford, et);
    paintTerm('B', STORES.berlin, et);
  }

  storeChips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      storeChips.forEach(function (c) { c.classList.remove('on'); });
      chip.classList.add('on');
      currentStore = chip.getAttribute('data-store');
      updateAll();
    });
  });
  updateAll();
  setInterval(updateAll, 60 * 1000);

  /* ---------- Gallery filter ---------- */
  var galFilter = document.getElementById('galFilter');
  var gallery = document.getElementById('gallery');
  if (galFilter && gallery) {
    var tiles = Array.prototype.slice.call(gallery.querySelectorAll('.gframe'));
    var galCount = document.getElementById('galCount');
    function applyFilter() {
      var val = galFilter.value, shown = 0;
      tiles.forEach(function (t) {
        var match = (val === 'all' || t.getAttribute('data-cat') === val);
        t.classList.toggle('hide', !match);
        if (match) shown++;
      });
      if (galCount) galCount.textContent = shown + (shown === 1 ? ' PHOTO' : ' PHOTOS');
    }
    galFilter.addEventListener('change', applyFilter);
    applyFilter();
  }

  /* ---------- Primary nav dropdowns ---------- */
  var topnav = document.getElementById('topnav');
  if (topnav) {
    var drops = Array.prototype.slice.call(topnav.querySelectorAll('.tn-drop'));
    function closeAll(except) {
      drops.forEach(function (d) {
        if (d === except) return;
        d.classList.remove('open');
        var b = d.querySelector('.tn-chev'); if (b) b.setAttribute('aria-expanded', 'false');
      });
    }
    drops.forEach(function (d) {
      var btn = d.querySelector('.tn-chev');
      if (!btn) return;
      btn.addEventListener('click', function (e) {
        e.preventDefault(); e.stopPropagation();
        var willOpen = !d.classList.contains('open');
        closeAll(d);
        d.classList.toggle('open', willOpen);
        btn.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
      });
      d.querySelectorAll('.tn-menu a').forEach(function (a) {
        a.addEventListener('click', function () { closeAll(null); });
      });
    });
    document.addEventListener('click', function (e) { if (!topnav.contains(e.target)) closeAll(null); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeAll(null); });
  }

  /* ---------- Open a WE-CARRY accordion via URL hash ---------- */
  function applyHash() {
    var id = (location.hash || '').replace(/^#/, '');
    if (!id) return;
    var el = document.getElementById(id);
    if (el && el.tagName === 'DETAILS') el.open = true;
  }
  window.addEventListener('hashchange', applyHash);
  applyHash();

})();
