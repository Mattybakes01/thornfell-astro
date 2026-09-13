// Read more / Read less toggles on the collection cards.
// JS only switches a class and updates the button; CSS handles the animation.
document.querySelectorAll('.card__toggle').forEach((button) => {
  button.addEventListener('click', () => {
    const panel = button.previousElementSibling;   // the .card__more div just above the button
    const isOpen = panel.classList.toggle('is-open');

    button.setAttribute('aria-expanded', isOpen);
    button.textContent = isOpen ? 'Read less' : 'Read more';
  });
});

// Fade sections in as they scroll into view.
// IntersectionObserver tells us when an element enters the viewport
// without us having to listen to every scroll event.
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);   // fade once, then stop watching
    }
  });
}, { threshold: 0.15 });                  // trigger when 15% of the element is visible

document.querySelectorAll('.fade-in').forEach((el) => observer.observe(el));