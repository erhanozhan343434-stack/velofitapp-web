(function () {
  "use strict";
  var apple = "https://apps.apple.com/tr/app/velofit-ai/id6809853060?l=tr";
  var google = "https://play.google.com/store/apps/details?id=com.erhanozhan.wellnesscompanion";
  var ua = navigator.userAgent || "";
  var ios = /iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
  var android = /Android/i.test(ua);
  var store = ios ? "app_store" : android ? "play_store" : "unknown";
  var destination = ios ? apple : android ? google : null;
  var dismissed = false;
  var bar = document.createElement("aside");
  bar.className = "vf-download-bar";
  bar.setAttribute("aria-label", "VeloFit uygulamasını indir");
  bar.setAttribute("data-visible", "false");
  var copy = document.createElement("div");
  copy.className = "vf-download-bar__text";
  copy.innerHTML = "<strong>Ücretsiz başla</strong>İlk antrenmanını keşfet";
  var button = document.createElement("a");
  button.className = "vf-download-bar__button";
  button.href = destination || "#indir";
  var label = document.createElement("span");
  label.textContent = ios ? "App Store’dan indir" : android ? "Google Play’den indir" : "İndirme seçenekleri";
  if (ios || android) {
    var icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    icon.setAttribute("viewBox", ios ? "0 0 24 24" : "0 0 512 512");
    icon.setAttribute("width", "20");
    icon.setAttribute("height", "20");
    icon.setAttribute("aria-hidden", "true");
    icon.setAttribute("focusable", "false");
    var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("fill", "currentColor");
    path.setAttribute("d", ios
      ? "M17.05 12.54c.02 2.15 1.89 2.87 1.91 2.88-.02.05-.3 1.03-.99 2.05-.6.88-1.23 1.75-2.22 1.77-.97.02-1.28-.57-2.39-.57-1.1 0-1.45.55-2.37.59-.95.04-1.67-.96-2.28-1.84-1.24-1.8-2.18-5.09-.91-7.3a3.53 3.53 0 0 1 2.98-1.81c.93-.02 1.81.64 2.39.64.57 0 1.64-.79 2.77-.67.47.02 1.8.19 2.65 1.44-.07.04-1.58.92-1.54 2.82ZM15.2 6.95a3.48 3.48 0 0 0 .81-2.52 3.54 3.54 0 0 0-2.31 1.2 3.32 3.32 0 0 0-.83 2.44 2.92 2.92 0 0 0 2.33-1.12Z"
      : "M48 59.49v393a4.33 4.33 0 0 0 7.37 3.07L260 256 55.37 56.42A4.33 4.33 0 0 0 48 59.49ZM283 233 344 172 83 25l200 208Zm0 46L83 487l261-147-61-61Zm84-84-61 61 61 61 87-49a14 14 0 0 0 0-24l-87-49Z");
    icon.appendChild(path);
    button.appendChild(icon);
  }
  button.appendChild(label);
  if (destination) {
    button.target = "_blank";
    button.rel = "noopener noreferrer";
  }
  var close = document.createElement("button");
  close.type = "button";
  close.className = "vf-download-bar__close";
  close.setAttribute("aria-label", "İndirme önerisini kapat");
  close.textContent = "×";
  bar.appendChild(copy);
  bar.appendChild(button);
  bar.appendChild(close);
  document.body.appendChild(bar);

  function track(name, params) {
    try { if (typeof window.gtag === "function") window.gtag("event", name, params); } catch (_) {}
  }
  function refresh() {
    var survey = document.getElementById("vfOv");
    var surveyOpen = survey && window.getComputedStyle(survey).display !== "none";
    var shouldShow = !dismissed && !surveyOpen && window.innerWidth < 768 && window.scrollY > 480;
    bar.setAttribute("data-visible", shouldShow ? "true" : "false");
  }
  close.addEventListener("click", function () {
    dismissed = true;
    refresh();
    track("mobile_download_dismiss", { event_category: "engagement" });
  });
  button.addEventListener("click", function () {
    track("mobile_download_cta_click", { event_category: "engagement", store: store, placement: "sticky" });
    if (ios) track("app_store_click", { event_category: "engagement", placement: "sticky" });
    if (android) track("play_store_click", { event_category: "engagement", placement: "sticky" });
  });
  window.addEventListener("scroll", refresh, { passive: true });
  window.addEventListener("resize", refresh);
  // Survey opens asynchronously; keep the bar from overlapping it.
  var survey = document.getElementById("vfOv");
  if (survey && typeof MutationObserver !== "undefined") {
    new MutationObserver(refresh).observe(survey, { attributes: true, attributeFilter: ["style", "class"] });
  }
  refresh();
})();
