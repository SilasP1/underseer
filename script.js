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
  const status = carousel.querySelector('[data-carousel-status]');
  let current = 0;
  let timer;

  const showSlide = (index) => {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      const active = slideIndex === current;
      slide.classList.toggle('is-active', active);
    });
    if (status) status.textContent = `${String(current + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
  };

  const startCarousel = () => {
    if (timer || slides.length < 2) return;
    timer = window.setInterval(() => showSlide(current + 1), 5000);
  };

  const stopCarousel = () => {
    window.clearInterval(timer);
    timer = undefined;
  };

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) startCarousel();
      else stopCarousel();
    }, { threshold: 0.25 });
    observer.observe(carousel);
  } else {
    startCarousel();
  }
});
