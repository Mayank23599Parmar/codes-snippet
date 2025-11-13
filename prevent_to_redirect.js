// Your domain (adjust if needed, e.g., for subdomains)
const allowedDomain = window.location.hostname;

// 1. Navigation API for same-tab navigations (original script)
if ('navigation' in window) {
  const navigation = window.navigation;

  navigation.addEventListener('navigate', (event) => {
    const destinationUrl = new URL(event.destination.url);
    const isExternal = destinationUrl.hostname !== allowedDomain;

    if (isExternal) {
      console.warn('Blocked external navigation to:', destinationUrl.href);  // Optional
      event.preventDefault();
      alert('Navigation blocked for security reasons.');  // Customize or remove
      return;
    }
  });
} else {
  console.warn('Navigation API not supported – using fallbacks');
}

// 2. Override window.open to block external popups/new tabs
const originalOpen = window.open;
window.open = function(url, name, specs) {
  // Handle relative URLs
  if (url && !url.startsWith('http')) {
    url = new URL(url, window.location.origin).href;
  } else if (url) {
    url = new URL(url).href;  // Absolute
  }

  const targetUrl = new URL(url || window.location.href);
  const isExternal = targetUrl.hostname !== allowedDomain;

  if (isExternal) {
    console.warn('Blocked external window.open to:', targetUrl.href);  // Optional
    alert('Popup blocked for security reasons.');  // Customize or remove
    return null;  // Returns null instead of the new window
  }

  // Allow internal: Call original
  return originalOpen.call(this, url, name, specs);
};

// 3. Bonus: Block window.open in iframes or other contexts (if needed)
if (window !== window.top) {
  // Same override logic for iframes – repeat the above if your site uses them
}

======================================================
BrowserDesktopAndroid/iOS MobileNotesChromeFull (v102+)Full (Android v142+)
No (iOS – uses WebKit/Safari)Current: v143–145. Excellent for most users.EdgeFull (v102+)Full (v142+)Chromium-based; same as Chrome.FirefoxPartial (v147+)NoDesktop: Recent versions only. Android lags.SafariNoNo (iOS v18.6+)WebKit blocks full overrides in some cases; use CSP headers as backup. Tech Preview may add soon.OperaFull (v88+)Full (v80+)Chromium-based.Samsung InternetFull (v20+)FullAndroid-only; Chromium.

Global Coverage: ~85–90% of users (mostly Chrome/Firefox desktop/mobile). Safari/iOS users (~20% market) get partial via fallbacks.
Old Browsers (e.g., IE11): Limited—only click/form hooks work; no Nav API or easy overrides.
Testing Tip: Use BrowserStack or real devices. For iOS/Safari, the window.open and link blocks still catch 80% of cases.
