/**
 * Oasis Catering — Analytics & Conversion Tracking Module
 * Production-ready handler for Google Analytics 4 (GA4) and Meta Pixel (Facebook Ads)
 */
(function() {
  "use strict";

  // Injected IDs (populated via window global or direct config)
  var GA_MEASUREMENT_ID = window.GA_MEASUREMENT_ID || "G-7VFFMGLN1S";
  var META_PIXEL_ID = window.META_PIXEL_ID || "";         // e.g. "123456789012345"

  // 1. Google Analytics 4 Loader
  if (GA_MEASUREMENT_ID && !window._ga_loaded && !window.gtag) {
    window._ga_loaded = true;
    var gaScript = document.createElement("script");
    gaScript.async = true;
    gaScript.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(GA_MEASUREMENT_ID);
    document.head.appendChild(gaScript);

    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag("js", new Date());
    gtag("config", GA_MEASUREMENT_ID, { send_page_view: true });
  }

  // 2. Meta Pixel Loader
  if (META_PIXEL_ID && !window._fbq_loaded) {
    window._fbq_loaded = true;
    (function(f, b, e, v, n, t, s) {
      if (f.fbq) return;
      n = f.fbq = function() {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = true;
      n.version = '2.0';
      n.queue = [];
      t = b.createElement(e);
      t.async = true;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

    window.fbq('init', META_PIXEL_ID);
    window.fbq('track', 'PageView');
  }

  // 3. Automated High-Intent Conversion Tracking
  function initConversions() {
    // WhatsApp interactions -> Lead / Contact
    document.querySelectorAll('a[href*="wa.me"]').forEach(function(el) {
      el.addEventListener("click", function() {
        if (window.fbq) window.fbq('track', 'Contact', { content_name: 'WhatsApp Direct Chat' });
        if (window.gtag) window.gtag('event', 'generate_lead', { method: 'WhatsApp' });
      });
    });

    // Direct phone calls -> Contact
    document.querySelectorAll('a[href^="tel:"]').forEach(function(el) {
      el.addEventListener("click", function() {
        if (window.fbq) window.fbq('track', 'Contact', { content_name: 'Phone Call Dial' });
        if (window.gtag) window.gtag('event', 'contact', { method: 'Phone' });
      });
    });

    // PDF Menu download -> ViewContent
    document.querySelectorAll('a[href*="oasis-catering-menu.pdf"]').forEach(function(el) {
      el.addEventListener("click", function() {
        if (window.fbq) window.fbq('track', 'ViewContent', { content_name: 'PDF Menu Download' });
        if (window.gtag) window.gtag('event', 'file_download', { file_name: 'oasis-catering-menu.pdf' });
      });
    });

    // Book Now CTAs -> InitiateCheckout
    document.querySelectorAll('.btn-book-gold, .hero-btn-primary, a[href*="#book"]').forEach(function(el) {
      el.addEventListener("click", function() {
        if (window.fbq) window.fbq('track', 'InitiateCheckout', { content_name: 'Book Event CTA' });
        if (window.gtag) window.gtag('event', 'begin_checkout', { content_name: 'Book Event CTA' });
      });
    });

    // Quotation Form submit -> Lead
    var quoteForm = document.getElementById("quoteForm");
    if (quoteForm) {
      quoteForm.addEventListener("submit", function() {
        if (window.fbq) window.fbq('track', 'Lead', { content_name: 'Quotation Request Form' });
        if (window.gtag) window.gtag('event', 'generate_lead', { content_name: 'Quotation Form' });
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initConversions);
  } else {
    initConversions();
  }
})();
