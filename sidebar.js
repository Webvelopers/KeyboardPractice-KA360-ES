/**
 * Sidebar toggle for KeyboardPractice.
 *
 * Executes synchronously at end of <body>, independent of ES module loading,
 * HMR, and Service Worker cache. Uses CSS class toggle only (no hidden
 * attribute) to avoid cascade conflicts. Coordinates with app.js via
 * event.__sidebarHandled.
 */
(function () {
  "use strict";

  function isWide() {
    return typeof window !== "undefined" && typeof window.matchMedia === "function"
      ? window.matchMedia("(min-width: 1024px)").matches
      : false;
  }

  function getToggleButtons() {
    return Array.prototype.slice.call(
      document.querySelectorAll("#sidebar-toggle, [data-sidebar-toggle]")
    );
  }

  function syncToggleButtons(nowOpen) {
    getToggleButtons().forEach(function (toggleBtn) {
      toggleBtn.setAttribute("aria-expanded", String(nowOpen));
      toggleBtn.setAttribute(
        "aria-label",
        nowOpen ? "Cerrar navegacion principal" : "Abrir navegacion principal"
      );
    });
  }

  function toggle(target) {
    var sidebar = document.getElementById("app-sidebar");
    var scrim = document.getElementById("sidebar-scrim");
    if (!sidebar || getToggleButtons().length === 0) return;

    var nowOpen = !sidebar.classList.contains("is-open");

    sidebar.classList.toggle("is-open", nowOpen);
    if (scrim && !isWide()) scrim.classList.toggle("is-open", nowOpen);
    if (document.body) document.body.classList.toggle("is-sidebar-open", nowOpen);
    syncToggleButtons(nowOpen);
    sidebar.setAttribute("aria-hidden", String(!nowOpen));
  }

  document.addEventListener("click", function (e) {
    if (e.__sidebarHandled) return;
    var btn = e.target.closest("#sidebar-toggle, [data-sidebar-toggle]");
    if (!btn) return;
    e.preventDefault();
    toggle(btn);
    e.__sidebarHandled = true;
  });
})();
