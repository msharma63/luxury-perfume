/* Maison theme — minimal vanilla JS, no framework. Custom elements only. */

class CartDrawer extends HTMLElement {
  constructor() {
    super();
    this.overlay = this.querySelector('[data-drawer-overlay]');
    this.closeBtn = this.querySelector('[data-drawer-close]');
    this.overlay && this.overlay.addEventListener('click', () => this.close());
    this.closeBtn && this.closeBtn.addEventListener('click', () => this.close());
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.hasAttribute('open')) this.close();
    });
  }

  open() {
    this.setAttribute('open', '');
    document.documentElement.classList.add('no-scroll');
    const focusable = this.querySelector('[data-drawer-close]');
    focusable && focusable.focus();
  }

  close() {
    this.removeAttribute('open');
    document.documentElement.classList.remove('no-scroll');
  }

  async refresh() {
    try {
      const res = await fetch(`${window.Shopify.routes.root}cart.js`, {
        headers: { 'Content-Type': 'application/json' }
      });
      const cart = await res.json();
      this.dispatchEvent(new CustomEvent('cart:updated', { detail: cart, bubbles: true }));
      const sectionRes = await fetch(`${window.Shopify.routes.root}?section_id=cart-drawer`);
      const html = await sectionRes.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const fresh = doc.querySelector('[data-drawer-body]');
      const current = this.querySelector('[data-drawer-body]');
      if (fresh && current) current.innerHTML = fresh.innerHTML;
    } catch (err) {
      console.error('Cart refresh failed', err);
    }
  }
}
customElements.define('cart-drawer', CartDrawer);

class CartDrawerTrigger extends HTMLElement {
  constructor() {
    super();
    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('[data-cart-open]');
      if (!trigger) return;
      e.preventDefault();
      const drawer = document.querySelector('cart-drawer');
      drawer && drawer.open();
    });
  }
}
customElements.define('cart-drawer-trigger', CartDrawerTrigger);

class ProductForm extends HTMLElement {
  constructor() {
    super();
    this.form = this.querySelector('form');
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
  }

  async handleSubmit(e) {
    e.preventDefault();
    const submitBtn = this.form.querySelector('[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = '…';

    try {
      const formData = new FormData(this.form);
      const res = await fetch(`${window.Shopify.routes.root}cart/add.js`, {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/javascript' }
      });
      if (!res.ok) throw new Error(`Add to cart failed: ${res.status}`);
      const drawer = document.querySelector('cart-drawer');
      if (drawer) {
        await drawer.refresh();
        drawer.open();
      } else {
        window.location.href = `${window.Shopify.routes.root}cart`;
      }
    } catch (err) {
      console.error(err);
      submitBtn.textContent = 'Try again';
      setTimeout(() => { submitBtn.textContent = originalText; submitBtn.disabled = false; }, 1600);
      return;
    }

    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  }
}
customElements.define('product-form', ProductForm);

class VariantPicker extends HTMLElement {
  constructor() {
    super();
    this.addEventListener('click', (e) => {
      const pill = e.target.closest('.pill[data-variant-id]');
      if (!pill || pill.disabled) return;
      this.querySelectorAll('.pill').forEach((p) => p.setAttribute('aria-checked', 'false'));
      pill.setAttribute('aria-checked', 'true');
      const variantId = pill.dataset.variantId;
      const price = pill.dataset.variantPrice;
      const available = pill.dataset.variantAvailable === 'true';
      const form = this.closest('product-form');
      if (form) {
        const idInput = form.querySelector('input[name="id"]');
        if (idInput) idInput.value = variantId;
      }
      const priceEl = document.querySelector('[data-product-price]');
      if (priceEl && price) priceEl.textContent = price;
      const submit = document.querySelector('[data-product-submit]');
      if (submit) {
        submit.disabled = !available;
        submit.textContent = available ? submit.dataset.labelDefault : submit.dataset.labelSoldOut;
      }
    });
  }
}
customElements.define('variant-picker', VariantPicker);

class HeaderMenu extends HTMLElement {
  constructor() {
    super();
    this.toggle = this.querySelector('[data-menu-toggle]');
    this.panel = this.querySelector('[data-menu-panel]');
    this.toggle && this.toggle.addEventListener('click', () => {
      const open = this.hasAttribute('open');
      open ? this.removeAttribute('open') : this.setAttribute('open', '');
      document.documentElement.classList.toggle('no-scroll', !open);
    });
  }
}
customElements.define('header-menu', HeaderMenu);

class PredictiveSearch extends HTMLElement {
  constructor() {
    super();
    this.input = this.querySelector('input[type="search"]');
    this.results = this.querySelector('[data-predictive-results]');
    this.debounce = null;
    if (this.input) {
      this.input.addEventListener('input', () => {
        clearTimeout(this.debounce);
        this.debounce = setTimeout(() => this.fetchResults(this.input.value), 220);
      });
    }
  }

  async fetchResults(q) {
    if (!q || q.length < 2) {
      if (this.results) this.results.innerHTML = '';
      return;
    }
    try {
      const res = await fetch(`${window.Shopify.routes.root}search/suggest?q=${encodeURIComponent(q)}&section_id=predictive-search`);
      const html = await res.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const fresh = doc.querySelector('[data-predictive-results]');
      if (fresh && this.results) this.results.innerHTML = fresh.innerHTML;
    } catch (err) {
      console.error('Predictive search failed', err);
    }
  }
}
customElements.define('predictive-search', PredictiveSearch);

class ProductGallery extends HTMLElement {
  constructor() {
    super();
    this.thumbnails = this.querySelectorAll('[data-thumbnail]');
    this.thumbnails.forEach((t) => {
      t.addEventListener('click', () => {
        const id = t.dataset.thumbnail;
        const target = this.querySelector(`[data-media="${id}"]`);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }
}
customElements.define('product-gallery', ProductGallery);
