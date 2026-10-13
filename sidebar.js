/**
 * @fileoverview External preboot script for the compact header disclosure.
 * The application shell takes ownership after initialization. Desktop
 * navigation is permanent; this early handler can never collapse it.
 */
(function () {
  "use strict";
  document.addEventListener("click", function (event) {
    var sidebar = document.getElementById("app-sidebar");
    if (event.__sidebarHandled || !sidebar || sidebar.dataset.navigationOwner === "shell") return;
    var toggle = event.target.closest && event.target.closest("#sidebar-toggle");
    if (!toggle || window.matchMedia("(min-width: 1280px)").matches) return;
    event.preventDefault();
    var open = sidebar.hidden;
    sidebar.hidden = !open;
    sidebar.classList.toggle("is-open", open);
    sidebar.setAttribute("aria-hidden", String(!open));
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Cerrar navegación principal" : "Abrir navegación principal");
    event.__sidebarHandled = true;
  });
})();
