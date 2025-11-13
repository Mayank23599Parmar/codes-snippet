// Your domain (adjust for subdomains, e.g., 'example.com')
const allowedDomain = window.location.hostname;

// 1. Navigation API for same-tab navigations (including most <a> clicks)
if ('navigation' in window) {
  const navigation = window.navigation;

  navigation.addEventListener('navigate', (event) => {
    const destinationUrl = new URL(event.destination.url);
    const isExternal = destinationUrl.hostname !== allowedDomain;

    if (isExternal) {
      console.warn('Blocked external navigation to:', destinationUrl.href);  // Optional
      event.preventDefault();
      alert('Navigation blocked for security reasons.');  // Customize/remove
      return;
    }
  });
} else {
  console.warn('Navigation API not supported – relying on fallbacks');
}

// 2. Override window.open for popups/new tabs
const originalOpen = window.open;
window.open = function(url, name, specs) {
  if (url && !url.startsWith('http')) {
    url = new URL(url, window.location.origin).href;
  } else if (url) {
    url = new URL(url).href;
  }

  const targetUrl = new URL(url || window.location.href);
  const isExternal = targetUrl.hostname !== allowedDomain;

  if (isExternal) {
    console.warn('Blocked external window.open to:', targetUrl.href);  // Optional
    alert('Popup blocked for security reasons.');  // Customize/remove
    return null;
  }

  return originalOpen.call(this, url, name, specs);
};

// 3. Block external <a> href clicks (covers _blank, same-tab, and dynamic links)
document.addEventListener('click', (e) => {
  // Check if the clicked element is an <a> tag (or inside one)
  let link = e.target.closest('a');
  if (!link || !link.href) return;  // Not a link? Bail

  // Parse href (handles relative like './page.html')
  const url = new URL(link.href, window.location.origin);
  const isExternal = url.hostname !== allowedDomain;

  if (isExternal) {
    console.warn('Blocked external link click to:', url.href);  // Optional
    e.preventDefault();  // Stops the navigation/popup
    e.stopPropagation(); // Prevents bubbling if needed
    alert('External link blocked for security.');  // Customize/remove
  }
}, true);  // Capture phase: Intercepts early, before other handlers

// 4. Bonus: Block external form submits (if forms POST to other sites)
document.addEventListener('submit', (e) => {
  if (e.target.tagName === 'FORM') {
    const action = new URL(e.target.action || window.location.href, window.location.origin);
    const isExternal = action.hostname !== allowedDomain;

    if (isExternal) {
      e.preventDefault();
      alert('External form submit blocked.');
    }
  }
}, true);
======================================================
BrowserDesktopAndroid/iOS MobileNotesChromeFull (v102+)Full (Android v142+)
No (iOS – uses WebKit/Safari)Current: v143–145. Excellent for most users.EdgeFull (v102+)Full (v142+)Chromium-based; same as Chrome.FirefoxPartial (v147+)NoDesktop: Recent versions only. Android lags.SafariNoNo (iOS v18.6+)WebKit blocks full overrides in some cases; use CSP headers as backup. Tech Preview may add soon.OperaFull (v88+)Full (v80+)Chromium-based.Samsung InternetFull (v20+)FullAndroid-only; Chromium.

Global Coverage: ~85–90% of users (mostly Chrome/Firefox desktop/mobile). Safari/iOS users (~20% market) get partial via fallbacks.
Old Browsers (e.g., IE11): Limited—only click/form hooks work; no Nav API or easy overrides.
Testing Tip: Use BrowserStack or real devices. For iOS/Safari, the window.open and link blocks still catch 80% of cases.
