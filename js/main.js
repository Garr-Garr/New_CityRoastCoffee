/* ============================================================
   City Roast Coffee — main.js
   Responsibilities:
     1. Sticky header scroll shadow
     2. Mobile nav toggle (open / close / keyboard dismiss)
     3. Close nav on link click or outside tap
     4. Coffees carousel dots indicator
   ============================================================ */

(function () {
  'use strict';

  const analyticsId = document.querySelector('meta[name="google-analytics-measurement-id"]')?.content.trim();

  if (analyticsId) {
    const analyticsScript = document.createElement('script');
    analyticsScript.async = true;
    analyticsScript.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(analyticsId);
    document.head.appendChild(analyticsScript);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', analyticsId);
  }

  const header    = document.querySelector('.site-header');
  const toggle    = document.querySelector('.nav-toggle');
  const menu      = document.querySelector('.nav-menu');
  const navLinks  = menu ? menu.querySelectorAll('a') : [];

  // ── 1. Scroll shadow ──────────────────────────────────────
  function onScroll() {
    header.classList.toggle('scrolled', window.scrollY > 8);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load

  // ── 2. Mobile nav toggle ──────────────────────────────────
  function openMenu() {
    menu.classList.add('open');
    toggle.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Close menu');
  }

  function closeMenu() {
    menu.classList.remove('open');
    toggle.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
  }

  function isMenuOpen() {
    return menu.classList.contains('open');
  }

  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      isMenuOpen() ? closeMenu() : openMenu();
    });

    // ── 3a. Close on any nav link click ───────────────────
    navLinks.forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    // ── 3b. Close on outside tap / click ──────────────────
    document.addEventListener('click', function (e) {
      if (isMenuOpen() && !header.contains(e.target)) {
        closeMenu();
      }
    });

    // ── 3c. Close on Escape key ───────────────────────────
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isMenuOpen()) {
        closeMenu();
        toggle.focus();
      }
    });
  }

  // ── 4. Carousel dots ──────────────────────────────────────
  var grid = document.querySelector('.coffees-grid');
  var dots = Array.from(document.querySelectorAll('.dot'));

  if (grid && dots.length) {
    var cards = Array.from(grid.querySelectorAll('.coffee-card'));

    // Click dot → scroll card into view
    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        var idx = parseInt(dot.dataset.index, 10);
        if (cards[idx]) {
          cards[idx].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
      });
    });

    // Update active dot as user scrolls
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
          var idx = cards.indexOf(entry.target);
          dots.forEach(function (d) { d.classList.remove('dot--active'); });
          if (dots[idx]) { dots[idx].classList.add('dot--active'); }
        }
      });
    }, { root: grid, threshold: 0.5 });

    cards.forEach(function (card) { observer.observe(card); });
  }
}());
