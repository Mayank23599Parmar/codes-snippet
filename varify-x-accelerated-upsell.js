(function () {
  "use strict";

  // Inject CSS styles
  function injectStyles() {
    if (document.getElementById("cart-upsell-carousel-styles")) return;

    const style = document.createElement("style");
    style.id = "cart-upsell-carousel-styles";
    style.textContent = `
      .drawer-recommend-container {
        display: block;
        margin-top: 1.5rem;
        border: 1px solid #CFCFCF;
        padding: 1.25rem 1rem;
      }

      .cart-upsell-product {
        width: 100%;
      }

      .cart-upsell-product__link {
        display: flex;
        width: 100%;
        text-decoration: none;
        color: inherit;
        background: #fff;
        border: 1px solid rgba(var(--color-base-text), 0.15);
        border-radius: 0.5rem;
        overflow: hidden;
        height: 100%;
        align-items: center;
        box-shadow: 0 1px 3px rgba(var(--color-base-text), 0.05);
      }

      .cart-upsell-product__image-wrapper {
        position: relative;
        aspect-ratio: 1;
        overflow: hidden;
        background: #f8f8f8;
        max-width: 56px;
        width: 100%;
        max-height: 56px;
        height: 100%;
      }

      .cart-upsell-product__image {
        width: 100%;
        height: auto;
        vertical-align: middle;
      }
      
      .cart-upsell-product__badge {
        position: absolute;
        top: 0.75rem;
        right: 0.75rem;
        background: rgb(var(--color-base-accent-1));
        color: rgb(var(--color-base-solid-button-labels));
        padding: 0.35rem 0.75rem;
        border-radius: 0.25rem;
        font-size: 0.6875rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .cart-upsell-product__info {
        display: flex;
        flex-direction: column;
        gap: 0.2rem;
        padding: 0.6rem;
        flex-grow: 1;
      }

      .cart-upsell-product__title {
        font-size: 1.2rem;
        font-weight: 700;
        margin: 0;
        line-height: 1;
        color: #1C1B1B;
        text-transform: uppercase;
        letter-spacing: 0px;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      .cart-upsell-product__price {
        margin-top: auto;
        font-size: 1.2rem;
        font-weight: 400;
        color: #1C1B1B;
      }

      .cart-upsell-product__price--regular,
      .cart-upsell-product__price--sale {
        font-size: 1.2rem;
        font-weight: 400;
        color: #1C1B1B;
        line-height: 19.8px;
      }

      .cart-upsell-product__price--compare {
        font-size: 0.875rem;
        text-decoration: line-through;
        color: rgba(var(--color-base-text), 0.5);
        margin-right: 0.5rem;
      }

      .cart-upsell-product__add-to-cart {
        width: 100%;
        line-height: 1.9rem;
        font-size: 1.2rem;
        font-weight: 400;
        font-style: italic;
        text-transform: uppercase;
        letter-spacing: 0px;
        border-radius: 0.5rem;
        background: #000000;
        color: #FFFFFF;
        border: none;
        max-width: 101px;
        padding: 6px 10px;
        height: 32px;
        cursor: pointer;
        position: relative;
      }

      .cart-upsell-product__add-to-cart:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      .btn-loader {
        display: none;
        margin-left: 6px;
      }

      .btn-spinner {
        display: none;
        width: 14px;
        height: 14px;
        border: 2px solid #ffffff;
        border-top-color: transparent;
        border-radius: 50%;
        animation: spinner-rotate 0.6s linear infinite;
        margin-left: 6px;
      }

      .cart-upsell-product__add-to-cart.loading .btn-text {
        display: none;
      }

      .cart-upsell-product__add-to-cart.loading .btn-spinner {
        display: inline-block;
      }

      /* Spinner Loading Styles */
      .cart-upsell-loader {
        display: flex;
        width: 100%;
        min-height: 56px;
        align-items: center;
        justify-content: center;
        background: #fff;
        
      }

      .cart-upsell-spinner {
        width: 40px;
        height: 40px;
        border: 4px solid #f0f0f0;
        border-top-color: #000000;
        border-radius: 50%;
        animation: spinner-rotate 0.8s linear infinite;
        display: inline-block !important;
      }

      @keyframes spinner-rotate {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }
    `;

    document.head.appendChild(style);
  }

  // Format money helper
  function formatMoney(cents) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: Shopify.currency.active,
    }).format(cents / 100);
  }

  const SELECTOR = 'cart-drawer';
  let drawerEl = null;
  let lastCartSignature = null;
  let skipObserver = false;

  /* ---------------------- CART DRAWER REFRESH ---------------------- */

  async function updateCartDrawer() {
    if (!drawerEl) return;

    const sections = ['cart-drawer', 'cart-icon-bubble'];

    const res = await fetch('/cart?sections=' + sections.join(','))
      .then(r => r.json())
      .catch(e => console.warn("Drawer update failed", e));

    const parser = new DOMParser();

    sections.forEach(section => {
      const html = res[section];
      if (!html) return;

      const doc = parser.parseFromString(html, 'text/html');
      const newDrawer = doc.querySelector(SELECTOR);
      if (newDrawer) drawerEl.innerHTML = newDrawer.innerHTML;
    });

    /* ---------------------- HIDE FOOTER IF CART EMPTY ---------------------- */
    try {
      const cart = await fetch('/cart.js').then(r => r.json());
      const footer = drawerEl.querySelector('.drawer__footer');

      if (footer) {
        if (!cart.items || cart.items.length === 0) {
          footer.style.display = 'none';
        } else {
          footer.style.display = '';
        }
      }
    } catch (err) {
      console.warn("Failed to check cart for footer visibility", err);
    }
  }

  async function handleCartChanged() {
    if (!drawerEl) return;

    await updateCartDrawer();
    await refreshRecommendation(true); // Always refresh recommendation after cart change
  }

  /* ---------------------------- RECOMMENDATION ---------------------------- */

  function ensureContainer() {
    let container = drawerEl.querySelector('.drawer-recommend-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'drawer-recommend-container';

      const itemsNode = drawerEl.querySelector('cart-drawer-items');
      const footerNode = drawerEl.querySelector('.drawer__footer');

      if (itemsNode) itemsNode.parentNode.insertBefore(container, itemsNode.nextSibling);
      else if (footerNode) footerNode.parentNode.insertBefore(container, footerNode);
      else drawerEl.appendChild(container);
    }
    return container;
  }

  function getSignature(cart) {
    return JSON.stringify(cart.items.map(i => `${i.id}-${i.quantity}`));
  }

  function renderSkeletonLoading(container) {
    container.innerHTML = `
      <div class="cart-upsell-loader">
        <div class="cart-upsell-spinner"></div>
      </div>
    `;
  }

  async function refreshRecommendation(force = false) {
    if (!drawerEl || !isOpen()) return;
    const container = ensureContainer();
    renderSkeletonLoading(container);
    const cart = await fetch('/cart.js').then(r => r.json());
    const sig = getSignature(cart);

    if (!force && sig === lastCartSignature) {
      return;
    }
    lastCartSignature = sig;

    if (!cart.items.length) {
      container.innerHTML = "";
      return;
    }

    for (const item of cart.items) {
      const url = `/recommendations/products.json?product_id=${item.product_id}&limit=1`;
      const rec = await fetch(url).then(r => r.json());
      const product = rec.products?.[0];
      if (product) {
        renderRecommendation(product, container);
        return;
      }
    }

    container.innerHTML = "";
  }

  function renderRecommendation(product, container) {
    skipObserver = true;

    // Get image URL - handle protocol-relative URLs
    let imageUrl = product.featured_image || (product.images && product.images[0]) || "";
    if (imageUrl && imageUrl.startsWith("//")) {
      imageUrl = "https:" + imageUrl;
    }
    if (!imageUrl) {
      imageUrl = "https://cdn.shopify.com/s/files/1/placeholder.jpg";
    }

    const compareAtPrice = product.compare_at_price;
    const price = product.price;
    const isOnSale = compareAtPrice && compareAtPrice > price;

    // Get first available variant
    const availableVariant = product.variants?.find((v) => v.available) || product.variants?.[0];
    const variantId = availableVariant?.id || "";

    container.innerHTML = `
      <div class="cart-upsell-product">
        <a href="/products/${product.handle}" class="cart-upsell-product__link">
          <div class="cart-upsell-product__image-wrapper">
            <img src="${imageUrl}" alt="${product.title}" class="cart-upsell-product__image" loading="lazy" />
            ${isOnSale ? '<span class="cart-upsell-product__badge">Sale</span>' : ''}
          </div>
          <div class="cart-upsell-product__info">
            <h4 class="cart-upsell-product__title">${product.title}</h4>
            <div class="cart-upsell-product__price">
              ${isOnSale
                ? `
                <span class="cart-upsell-product__price--compare">${formatMoney(compareAtPrice)}</span>
                <span class="cart-upsell-product__price--sale">${formatMoney(price)}</span>
              `
                : `
                <span class="cart-upsell-product__price--regular">${formatMoney(price)}</span>
              `
              }
            </div>
          </div>
          <button type="button" class="cart-upsell-product__add-to-cart"
            data-product-id="${product.id}" data-variant-id="${variantId}">
            <span class="btn-text">Add to cart</span>
            <span class="btn-spinner"></span>
          </button>
        </a>
      </div>
    `;

    setTimeout(() => skipObserver = false, 300);
  }

  async function addRecProduct(variantId, btn) {
    if (!btn) return;
    skipObserver = true;

    // Show loader state - add loading class
    btn.classList.add('loading');
    btn.disabled = true;


    try {
      await fetch('/cart/add.js', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: variantId, quantity: 1 }),
      });

      await handleCartChanged(); // Refresh drawer + recs
    } catch (e) {
      console.error("Failed to add recommended product", e);
    } finally {
      // Reset button state
      btn.classList.remove('loading');
      btn.disabled = false;
      skipObserver = false;
    }
  }

  document.addEventListener('click', e => {
    const btn = e.target.closest('.cart-upsell-product__add-to-cart');
    if (btn) {
      e.preventDefault();
      e.stopPropagation();
      addRecProduct(btn.dataset.variantId, btn);
    }
  });

  /* ---------------------------- OPEN + OBSERVERS ---------------------------- */

  function isOpen() {
    return drawerEl && drawerEl.classList.contains('active');
  }

  function observeDrawerOpen() {
    let wasOpen = false;

    const obs = new MutationObserver(() => {
      const nowOpen = isOpen();
      if (nowOpen && !wasOpen) {
        refreshRecommendation(true);
      }
      wasOpen = nowOpen;
    });

    obs.observe(drawerEl, { attributes: true, attributeFilter: ['class'] });
  }

  /* ---------------------------- XHR INTERCEPTOR ---------------------------- */

  const OriginalXHR = window.XMLHttpRequest;
  window.XMLHttpRequest = new Proxy(OriginalXHR, {
    construct(target, args) {
      const xhr = new target(...args);
      xhr.addEventListener('readystatechange', () => {
        const url = xhr.responseURL;
        if (xhr.readyState === 4 && xhr.status === 200) {
          if (url.includes('/cart/')) {
            setTimeout(handleCartChanged, 200);
          }
        }
      });
      return xhr;
    }
  });

  // Intercept fetch requests
  const originalFetch = window.fetch;
  window.fetch = async function (...args) {
    const response = await originalFetch(...args);

    try {
      const url = (typeof args[0] === 'string' ? args[0] : args[0].url) || '';
      if (url.includes('/cart/update') || url.includes('/cart/change')) {
        // Clone response to not consume the original body
        setTimeout(handleCartChanged, 200);
      }
    } catch (e) {
      console.warn("Failed to intercept fetch", e);
    }

    return response;
  };

  /* ---------------------------- EXTRA FALLBACKS ---------------------------- */

  document.addEventListener('cart:updated', handleCartChanged);
  document.addEventListener('ajax:complete', handleCartChanged);

  const observer = new MutationObserver(() => {
    if (!skipObserver && isOpen()) handleCartChanged();
  });

  function initObserver() {
    const target = drawerEl.querySelector('.drawer__inner') || drawerEl;
    observer.observe(target, { childList: true, subtree: true });
  }

  /* ---------------------------- WAIT FOR DRAWER ---------------------------- */

  const timer = setInterval(() => {
    drawerEl = document.querySelector(SELECTOR);
    if (drawerEl) {
      clearInterval(timer);

      injectStyles();
      observeDrawerOpen();
      initObserver();
    }
  }, 300);

})();
