// Mobile menu toggle
(function () {
  const header = document.querySelector('[data-header]');
  if (!header) return;
  const toggle = header.querySelector('[data-menu-toggle]');
  if (!toggle) return;

  toggle.addEventListener('click', () => {
    const isOpen = header.getAttribute('data-menu-open') === 'true';
    header.setAttribute('data-menu-open', String(!isOpen));
    toggle.setAttribute('aria-expanded', String(!isOpen));
    document.body.classList.toggle('no-scroll', !isOpen);
  });

  // Close on link click
  header.querySelectorAll('.header__panel a').forEach((link) => {
    link.addEventListener('click', () => {
      header.setAttribute('data-menu-open', 'false');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('no-scroll');
    });
  });
})();

// Newsletter no-op submit (no backend on static site)
document.querySelectorAll('[data-newsletter]').forEach((form) => {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = form.querySelector('[data-newsletter-message]');
    if (message) {
      message.textContent = 'Thank you. You are now part of the Maison correspondence.';
      message.hidden = false;
    }
    form.reset();
  });
});
