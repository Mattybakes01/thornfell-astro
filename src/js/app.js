// ---------------------------------------------------------
// Mobile menu
// The button flips aria-expanded; CSS shows the links when the
// nav has .is-open.
// ---------------------------------------------------------
const nav = document.querySelector('.site-nav');
const navToggle = document.querySelector('.site-nav__toggle');
navToggle?.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('is-open');
  navToggle.setAttribute('aria-expanded', isOpen);
});

// ---------------------------------------------------------
// Homepage carousel
// The track is a horizontal scroll area (CSS scroll-snap does the snapping).
// The buttons scroll it by one card's width.
// ---------------------------------------------------------
document.querySelectorAll('.carousel').forEach((carousel) => {
  const track = carousel.querySelector('.carousel__track');
  const prev = carousel.querySelector('.carousel__button--prev');
  const next = carousel.querySelector('.carousel__button--next');

  // Width of one slide plus the gap between slides.
  const step = () => {
    const slide = track.querySelector('.carousel__slide');
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    return slide.getBoundingClientRect().width + gap;
  };

  prev.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
  next.addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));

  // Grey out a button when there's nothing more to scroll to.
  const updateButtons = () => {
    const max = track.scrollWidth - track.clientWidth;
    prev.disabled = track.scrollLeft <= 1;
    next.disabled = track.scrollLeft >= max - 1;
  };
  track.addEventListener('scroll', updateButtons, { passive: true });
  window.addEventListener('resize', updateButtons);
  updateButtons();
});

// ---------------------------------------------------------
// Hat page gallery
// Each thumbnail button stores its full-size image URL in data-full.
// ---------------------------------------------------------
const mainImage = document.querySelector('.gallery__image');
document.querySelectorAll('.gallery__thumb').forEach((thumb) => {
  thumb.addEventListener('click', () => {
    mainImage.removeAttribute('srcset');   // otherwise the browser keeps showing the old srcset image
    mainImage.src = thumb.dataset.full;
    document.querySelectorAll('.gallery__thumb').forEach((t) => t.setAttribute('aria-pressed', 'false'));
    thumb.setAttribute('aria-pressed', 'true');
  });
});

// ---------------------------------------------------------
// Fade sections in as they scroll into view.
// IntersectionObserver tells us when an element enters the viewport
// without us having to listen to every scroll event.
// ---------------------------------------------------------
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);   // fade once, then stop watching
    }
  });
}, { threshold: 0.15 });                  // trigger when 15% of the element is visible

document.querySelectorAll('.fade-in').forEach((el) => observer.observe(el));
