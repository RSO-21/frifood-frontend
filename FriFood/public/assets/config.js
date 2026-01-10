// Runtime config injected at container start via env or remains placeholder.
// Do NOT commit real secrets here.
(function () {
  window.__ENV = window.__ENV || {};
  // Placeholder value; replaced at runtime by entrypoint if GOOGLE_MAPS_API_KEY is set.
  window.__ENV.GOOGLE_MAPS_API_KEY = "__GOOGLE_MAPS_API_KEY__";
})();
