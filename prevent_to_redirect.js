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
