/**
 * Theme pre-boot script for KeyboardPractice.
 *
 * Runs synchronously before the page renders to prevent FOUC (Flash of
 * Unstyled Content). Reads the user's theme preference from LocalStorage
 * and applies it to <html> before the browser paints.
 *
 * Also loads the PWA manifest link (skipped on file:// protocol due to
 * CORS restrictions on null origins).
 *
 * CSP note: This file is loaded via <script src="..."> from index.html
 * so it complies with script-src 'self'.
 */
(function () {
  try {
    var settings = JSON.parse(localStorage.getItem("kp.userSettings") || "{}");
    var storedTheme = ["light", "dark", "system"].indexOf(settings.theme) !== -1 ? settings.theme : "system";
    var theme = storedTheme === "system" && window.matchMedia
      ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
      : storedTheme === "dark" ? "dark" : "light";
    document.documentElement.dataset.theme = theme;
    document.documentElement.dataset.themeSetting = storedTheme;
  } catch (_error) {
    document.documentElement.dataset.theme = "light";
  }

  // Load the PWA manifest only when served over http/https.
  // Browsers block manifest loading from file:// due to CORS policy
  // (unique null origin), so we skip it on the file protocol.
  try {
    if (location.protocol !== "file:") {
      var manifestLink = document.createElement("link");
      manifestLink.rel = "manifest";
      manifestLink.href = "/manifest.json";
      document.head.appendChild(manifestLink);
    }
  } catch (_e) {}

  // Content-Security-Policy meta tag (defense in depth for static hosts).
  // Skipped on file:// because 'self' resolves to a null origin which blocks
  // all scripts and styles. Also skipped on Vite's dev server because the
  // development client applies inline styles for HMR/overlay diagnostics.
  // The server.js HTTP header provides CSP when the app is served in production.
  try {
    var isViteDevServer = location.port === "5173";
    if (location.protocol !== "file:" && !isViteDevServer) {
      var cspMeta = document.createElement("meta");
      cspMeta.httpEquiv = "Content-Security-Policy";
      cspMeta.content = "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'self'; worker-src 'self'; manifest-src 'self'; form-action 'none'; base-uri 'self'";
      document.head.appendChild(cspMeta);
    }
  } catch (_e) {}
})();
