'use strict';
document.documentElement.classList.add('js');
const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('#navigation');
function closeMenu() { menu.setAttribute('aria-expanded', 'false'); menu.setAttribute('aria-label', 'Відкрити меню'); nav.classList.remove('is-open'); }
menu.addEventListener('click', () => { const open = menu.getAttribute('aria-expanded') !== 'true'; menu.setAttribute('aria-expanded', String(open)); menu.setAttribute('aria-label', open ? 'Закрити меню' : 'Відкрити меню'); nav.classList.toggle('is-open', open); });
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
document.addEventListener('keydown', e => { if (e.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') { closeMenu(); menu.focus(); } });
window.addEventListener('resize', () => { if (window.innerWidth > 800) closeMenu(); });
const figures = [...document.querySelectorAll('.gallery figure')];
const filters = [...document.querySelectorAll('[data-filter]')];
filters.forEach(button => button.addEventListener('click', () => {
  filters.forEach(b => b.setAttribute('aria-pressed', String(b === button)));
  figures.forEach(f => { f.hidden = button.dataset.filter !== 'all' && f.dataset.category !== button.dataset.filter; });
  document.querySelector('#gallery-status').textContent = `Показано ${figures.filter(f => !f.hidden).length} робіт.`;
}));
const dialog = document.querySelector('#lightbox');
let currentLinks = [], currentIndex = 0, opener = null;
function showPhoto() {
  const link = currentLinks[currentIndex];
  const img = document.querySelector('#lightbox-image');
  img.src = link.href; img.alt = link.querySelector('img').alt;
  document.querySelector('#lightbox-title').textContent = link.dataset.title;
  document.querySelector('#lightbox-post').href = link.dataset.post;
  document.querySelector('#lightbox-count').textContent = `${String(currentIndex + 1).padStart(2, '0')} / ${String(currentLinks.length).padStart(2, '0')}`;
}
document.querySelectorAll('.gallery-photo').forEach(link => link.addEventListener('click', e => {
  if (typeof dialog.showModal !== 'function' || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
  e.preventDefault(); opener = link;
  currentLinks = figures.filter(f => !f.hidden).map(f => f.querySelector('a'));
  currentIndex = currentLinks.indexOf(link); showPhoto(); dialog.showModal(); document.body.classList.add('modal-open'); document.querySelector('#lightbox-close').focus();
}));
function stepPhoto(n) { currentIndex = (currentIndex + n + currentLinks.length) % currentLinks.length; showPhoto(); }
document.querySelector('#lightbox-prev').addEventListener('click', () => stepPhoto(-1));
document.querySelector('#lightbox-next').addEventListener('click', () => stepPhoto(1));
document.querySelector('#lightbox-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('keydown', e => { if (e.key === 'ArrowLeft') { e.preventDefault(); stepPhoto(-1); } if (e.key === 'ArrowRight') { e.preventDefault(); stepPhoto(1); } });
dialog.addEventListener('click', e => { if (e.target === dialog) { const r = dialog.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dialog.close(); } });
dialog.addEventListener('close', () => { document.body.classList.remove('modal-open'); opener?.focus({preventScroll:true}); });
const messages = {
  'Фарбування': 'Привіт, Дашо! Хочу обговорити запис на фарбування. Підкажи, будь ласка, вартість і вільний час.',
  'Стрижка': 'Привіт, Дашо! Хочу обговорити запис на стрижку. Підкажи, будь ласка, вартість і вільний час.',
  'SPA-догляд': 'Привіт, Дашо! Хочу обговорити SPA-догляд для волосся. Підкажи, будь ласка, вартість і вільний час.',
  'Зачіска': 'Привіт, Дашо! Хочу обговорити зачіску для події. Підкажи, будь ласка, вартість і можливість запису.'
};
function updateMessage() { const value = document.querySelector('input[name="service"]:checked').value; document.querySelector('#message-text').textContent = messages[value]; document.querySelector('#copy-status').textContent = 'Скопіюй повідомлення та надішли його в Direct.'; }
document.querySelectorAll('input[name="service"]').forEach(input => input.addEventListener('change', updateMessage));
document.querySelectorAll('[data-service]').forEach(a => a.addEventListener('click', () => { document.querySelectorAll('input[name="service"]').forEach(i => { i.checked = i.value === a.dataset.service; }); updateMessage(); }));
document.querySelector('#booking-form').addEventListener('submit', e => e.preventDefault());
document.querySelector('#copy-message').addEventListener('click', async () => {
  const message = document.querySelector('#message-text').textContent;
  const status = document.querySelector('#copy-status');
  try {
    if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
    await navigator.clipboard.writeText(message); status.textContent = 'Скопійовано! Відкрий Instagram і встав повідомлення в Direct.';
  } catch {
    const range = document.createRange(); range.selectNodeContents(document.querySelector('#message-text'));
    const selection = window.getSelection(); selection.removeAllRanges(); selection.addRange(range);
    status.textContent = 'Текст виділено. Скопіюй його вручну та надішли в Direct.';
  }
});
document.querySelector('#year').textContent = String(new Date().getFullYear());
