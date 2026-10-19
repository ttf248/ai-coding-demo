(function () {
  "use strict";
  if (window.__archiveAnalyticsInitialized) return;
  window.__archiveAnalyticsInitialized = true;

  const measurementId = "G-8E54P1HX3G";
  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    function () {
      window.dataLayer.push(arguments);
    };
  window.gtag("js", new Date());
  window.gtag("config", measurementId);

  const script = document.createElement("script");
  script.async = true;
  script.src = "https://www.googletagmanager.com/gtag/js?id=" + measurementId;
  document.head.append(script);
})();
