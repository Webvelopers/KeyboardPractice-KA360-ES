/**
 * Theme pre-boot script for KeyboardPractice.
 *
 * Runs synchronously before the page renders to prevent a bright/dark mismatch.
 * ADR-013 keeps user settings inside the encrypted store, so the preboot script
 * must not read application LocalStorage. The saved theme is applied after the
 * user unlocks the app.
 *
 * CSP note: This file is loaded via <script src="..."> from index.html
 * so it complies with script-src 'self'.
 */
/**
 * @fileoverview Theme preboot — synchronous setup before first paint.
 *
 * - Applies the system theme synchronously to prevent a flash of the wrong
 *   theme (FOUC).
 * - SEC-010: refuses to render inside a frame. `frame-ancestors` cannot be set
 *   from a `<meta>` CSP, so on static hosts that cannot send headers this guard
 *   is the clickjacking protection. `critical.css` hides a framed document and
 *   `bootstrap.js` does not start the app.
 * - Adds the PWA manifest link.
 *
 * The production CSP is a static `<meta>` emitted at build time
 * (`vite.config.js`, SEC-009) plus the `server.js` header; this script no
 * longer injects it. The app only runs from a server (local, public or
 * private host); opening `index.html` through `file://` is not supported.
 */
(function () {
  // SEC-010: clickjacking guard (comparison works even for cross-origin parents).
  try {
    if (window.top !== window.self) {
      document.documentElement.setAttribute("data-framed", "true");
    }
  } catch (_e) {
    document.documentElement.setAttribute("data-framed", "true");
  }

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

  try {
    var manifestLink = document.createElement("link");
    manifestLink.rel = "manifest";
    manifestLink.href = "./manifest.json";
    document.head.appendChild(manifestLink);
  } catch (_e) {}
})();
