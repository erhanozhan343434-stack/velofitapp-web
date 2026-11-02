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
  // Reuse the exact black store badge from the homepage for visual consistency.
  var original = destination ? Array.from(document.querySelectorAll("a.store")).find(function (a) {
    return a.getAttribute("href") === destination;
  }) : null;
  var button = original ? original.cloneNode(true) : document.createElement("a");
  button.removeAttribute("onclick");
  button.removeAttribute("id");
  button.classList.add("vf-download-bar__button");
  button.href = destination || "#indir";
  if (!original) button.textContent = "İndirme seçenekleri";
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
