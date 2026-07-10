/**
 * Theme pre-boot script for KeyboardPractice.
 *
 * Runs synchronously before the page renders to prevent a bright/dark mismatch.
 * ADR-013 keeps user settings inside the encrypted store, so the preboot script
 * must not read application LocalStorage. The saved theme is applied after the
 * user unlocks the app.
 *
 * Also loads the PWA manifest link (skipped on file:// protocol due to
 * CORS restrictions on null origins).
 *
 * CSP note: This file is loaded via <script src="..."> from index.html
 * so it complies with script-src 'self'.
 */
/**
 * @fileoverview Theme preboot — synchronous theme application before first paint.
 *
 * Applies the preferred theme (system or stored) synchronously to prevent
 * flash of unstyled content (FOUC) during initial page load. Also loads
 * the PWA manifest (skipped on file:// protocol) and injects CSP meta tags
 * for security (skipped on file:// and Vite dev server).
 */
(function () {
  try {
    var storedTheme = "system";
    var theme = window.matchMedia
      ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
      : "light";
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
      manifestLink.href = "./manifest.json";
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
      cspMeta.content = "default-src 'self'; script-src 'self' 'sha256-O5LpBDujzzsDirbZBYVc66qnylYSBjFxBwrPMFoSfgM='; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'self'; worker-src 'self'; manifest-src 'self'; form-action 'none'; base-uri 'self'";
      document.head.appendChild(cspMeta);
    }
  } catch (_e) {}
})();
