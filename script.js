const header = document.querySelector('[data-header]');
const menuToggle = document.querySelector('[data-menu-toggle]');
const nav = document.querySelector('[data-nav]');
const tabs = [...document.querySelectorAll('[data-product-tab]')];
const panels = [...document.querySelectorAll('[data-product-panel]')];

const updateHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 16);
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

menuToggle?.addEventListener('click', () => {
  const open = menuToggle.getAttribute('aria-expanded') !== 'true';
  menuToggle.setAttribute('aria-expanded', String(open));
  nav?.classList.toggle('is-open', open);
  document.body.classList.toggle('menu-open', open);
});

nav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  menuToggle?.setAttribute('aria-expanded', 'false');
  nav.classList.remove('is-open');
  document.body.classList.remove('menu-open');
}));

const selectProduct = (name) => {
  tabs.forEach((tab) => {
    const active = tab.dataset.productTab === name;
    tab.classList.toggle('is-active', active);
    tab.setAttribute('aria-selected', String(active));
    tab.tabIndex = active ? 0 : -1;
  });
  panels.forEach((panel) => {
    const active = panel.dataset.productPanel === name;
    panel.classList.toggle('is-active', active);
    panel.hidden = !active;
  });
};

tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectProduct(tab.dataset.productTab));
  tab.addEventListener('keydown', (event) => {
    if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    const direction = event.key === 'ArrowRight' ? 1 : -1;
    const next = (index + direction + tabs.length) % tabs.length;
    selectProduct(tabs[next].dataset.productTab);
    tabs[next].focus();
  });
});

document.querySelectorAll('[data-carousel]').forEach((carousel) => {
  const slides = [...carousel.querySelectorAll('[data-carousel-slide]')];
  const previous = carousel.querySelector('[data-carousel-prev]');
  const next = carousel.querySelector('[data-carousel-next]');
  const controls = carousel.querySelector('.carousel-controls');
  const status = carousel.querySelector('[data-carousel-status]');
  let current = 0;

  const showSlide = (index) => {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      const active = slideIndex === current;
      slide.classList.toggle('is-active', active);
      slide.hidden = !active;
    });
    if (status) status.textContent = `${String(current + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
  };

  controls?.addEventListener('click', (event) => {
    const button = event.target.closest('button');
    if (button === previous) showSlide(current - 1);
    if (button === next) showSlide(current + 1);
  });
});
