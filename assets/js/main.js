const $ = (s) => document.querySelector(s);
const menu = $('#mobileMenu');
$('#menuToggle')?.addEventListener('click', () => menu.classList.toggle('open'));
const searchPanel = $('#searchPanel');
$('#searchToggle')?.addEventListener('click', () => { searchPanel.classList.toggle('open'); if (searchPanel.classList.contains('open')) $('#searchInput').focus(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') searchPanel.classList.remove('open'); });
menu?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => menu.classList.remove('open')));
let cart = 0;
$('#cartButton')?.addEventListener('click', () => { cart = cart ? 0 : 1; $('#cartCount').textContent = cart; const toast = $('#toast'); toast.textContent = cart ? 'Your cart is ready for the next quest.' : 'Cart cleared. Roll again when ready.'; toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 2600); });
$('#searchInput')?.addEventListener('input', e => { const q = e.target.value.toLowerCase(); document.querySelectorAll('.category-card').forEach(card => { card.style.opacity = !q || card.textContent.toLowerCase().includes(q) ? '1' : '.28'; }); });
document.querySelectorAll('.category-card').forEach(card => card.addEventListener('click', () => { const toast = $('#toast'); toast.textContent = `Loading ${card.dataset.category} shelves...`; toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 1800); }));
$('#year').textContent = new Date().getFullYear();

const lightbox = document.querySelector('#lightbox'); const lightboxImage = document.querySelector('#lightboxImage');
document.querySelectorAll('.gallery-photo').forEach(photo => photo.addEventListener('click', () => { lightboxImage.src=photo.dataset.full; lightboxImage.alt=photo.querySelector('img').alt; lightbox.classList.add('open'); lightbox.setAttribute('aria-hidden','false'); }));
function closeLightbox(){lightbox?.classList.remove('open');lightbox?.setAttribute('aria-hidden','true');}
document.querySelector('.lightbox-close')?.addEventListener('click', closeLightbox); lightbox?.addEventListener('click', e => {if(e.target===lightbox) closeLightbox();});
