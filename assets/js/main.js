/* Dragon's Lair Hobbies — front-end interactions */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

/* ---------- year ---------- */
$('#year').textContent = new Date().getFullYear();

/* ---------- toast helper ---------- */
const toast = $('#toast');
function say(msg) {
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(say._t);
  say._t = setTimeout(() => toast.classList.remove('show'), 2600);
}

/* ---------- mobile nav ---------- */
const menu = $('#mobileMenu');
$('#menuToggle')?.addEventListener('click', () => menu.classList.toggle('open'));
menu?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => menu.classList.remove('open')));

/* ---------- search ---------- */
const searchPanel = $('#searchPanel');
const searchInput = $('#searchInput');
$('#searchToggle')?.addEventListener('click', () => {
  searchPanel.classList.toggle('open');
  if (searchPanel.classList.contains('open')) searchInput.focus();
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { searchPanel.classList.remove('open'); closeLightbox(); }
});
searchInput?.addEventListener('input', e => {
  const q = e.target.value.toLowerCase().trim();
  $$('.tile, .brand-card, .access .card').forEach(el => {
    const match = !q || el.textContent.toLowerCase().includes(q) || (el.dataset.cat || '').toLowerCase().includes(q);
    el.style.opacity = match ? '1' : '.22';
    el.style.pointerEvents = match ? '' : 'none';
  });
});

/* ---------- cart / wishlist ---------- */
let cart = 0;
$('#cartButton')?.addEventListener('click', () => {
  cart = cart ? 0 : 1;
  $('#cartCount').textContent = cart;
  say(cart ? 'Your cart is ready for the next quest.' : 'Cart cleared. Roll again when ready.');
});
$('#wishToggle')?.addEventListener('click', () => say('Wishlist opens on the main store — headed there now ↗'));

/* ---------- category tap feedback ---------- */
$$('.tile, .brand-card, .access .card').forEach(el => {
  el.addEventListener('click', e => {
    const cat = el.dataset.cat;
    if (!cat) return;
    // Let the real link navigate; still show a quick flash
    if (el.getAttribute('target') === '_blank') say(`Opening ${cat} on the main store…`);
  });
});

/* ---------- store selector ---------- */
// index: 0=Sun 1=Mon 2=Tue 3=Wed 4=Thu 5=Fri 6=Sat  (minutes since midnight)
const HOURS = {
  wallingford: {
    name: 'Wallingford',
    open:  [10*60, 14*60, 14*60, 14*60, 14*60, 14*60, 10*60],
    close: [18*60, 20*60, 20*60, 20*60, 21*60, 22*60+30, 18*60]
  },
  berlin: {
    name: 'Berlin',
    open:  [10*60, null, 14*60, 14*60, 14*60, 14*60, 10*60],
    close: [18*60, null, 20*60, 20*60, 21*60, 22*60+30, 18*60]
  }
};
const STORES = HOURS;
let currentStore = 'wallingford';

function fmt(mins) {
  if (mins == null) return 'Closed';
  const h24 = Math.floor(mins / 60), m = mins % 60;
  const suf = h24 >= 12 ? 'PM' : 'AM';
  let h = h24 % 12; if (h === 0) h = 12;
  return m ? `${h}:${String(m).padStart(2,'0')} ${suf}` : `${h} ${suf}`;
}

function updateStatus() {
  const store = STORES[currentStore];
  const now = new Date();
  const dow = now.getDay(); // 0 Sun
  const mins = now.getHours() * 60 + now.getMinutes();
  const openAt = store.open[dow];
  const closeAt = store.close[dow];
  const el = $('#openStatus');
  const closeEl = $('#closeTime');
  const dot = document.querySelector('.status-dot');
  const todayEl = $('#todayHours');
  if (openAt == null) {
    el.textContent = 'Closed today';
    closeEl.textContent = `${store.name} · reopens tomorrow`;
    dot.style.background = '#7a746a';
    dot.style.boxShadow = 'none';
    if (todayEl) todayEl.textContent = 'Closed today';
    return;
  }
  const isOpen = mins >= openAt && mins < closeAt;
  if (isOpen) {
    el.textContent = 'Open now';
    closeEl.textContent = `Closes ${fmt(closeAt)}`;
    dot.style.background = 'var(--success)';
    dot.style.boxShadow = '0 0 12px var(--success)';
  } else {
    el.textContent = mins < openAt ? 'Opens later today' : 'Closed for the night';
    closeEl.textContent = mins < openAt ? `Opens ${fmt(openAt)}` : `Reopens tomorrow`;
    dot.style.background = '#c9a44a';
    dot.style.boxShadow = '0 0 12px #c9a44a';
  }
  if (todayEl) todayEl.textContent = `${fmt(openAt)} – ${fmt(closeAt)}`;
}
updateStatus();
setInterval(updateStatus, 60_000);

$$('.store-chip').forEach(chip => chip.addEventListener('click', () => {
  $$('.store-chip').forEach(c => c.classList.remove('active'));
  chip.classList.add('active');
  currentStore = chip.dataset.store;
  updateStatus();
  say(`Now shopping ${STORES[currentStore].name}.`);
}));

/* ---------- gallery lightbox ---------- */
const lightbox = $('#lightbox');
const lightboxImage = $('#lightboxImage');
$$('.gphoto').forEach(p => p.addEventListener('click', () => {
  lightboxImage.src = p.dataset.full;
  lightboxImage.alt = p.querySelector('img').alt;
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
}));
function closeLightbox() {
  lightbox?.classList.remove('open');
  lightbox?.setAttribute('aria-hidden', 'true');
}
$('.lclose')?.addEventListener('click', closeLightbox);
lightbox?.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
