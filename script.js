(function () {
  'use strict';
  var html = document.documentElement;
  var themeToggle = document.getElementById('themeToggle');
  var themeIcon = document.getElementById('themeIcon');
  var menuToggle = document.getElementById('menuToggle');
  var navLinks = document.getElementById('navLinks');
  var navAnchors = navLinks ? Array.prototype.slice.call(navLinks.querySelectorAll('a[href^="#"]')) : [];

  function setTheme(theme) {
    html.setAttribute('data-theme', theme);
    try { localStorage.setItem('theme', theme); } catch (e) {}
    if (themeIcon) themeIcon.textContent = theme === 'dark' ? '☼' : '☾';
    if (themeToggle) themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
  }
  var savedTheme = null;
  try { savedTheme = localStorage.getItem('theme'); } catch (e) {}
  setTheme(savedTheme || 'dark');
  if (themeToggle) themeToggle.addEventListener('click', function () { setTheme(html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'); });

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', function () {
      var open = navLinks.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(open));
      menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    navLinks.querySelectorAll('a').forEach(function (link) { link.addEventListener('click', function () { navLinks.classList.remove('open'); menuToggle.setAttribute('aria-expanded', 'false'); }); });
  }

  if (window.matchMedia && !window.matchMedia('(prefers-reduced-motion: reduce)').matches && window.matchMedia('(pointer:fine)').matches) {
    var heroVisual = document.querySelector('.hero-visual');
    if (heroVisual) {
      heroVisual.addEventListener('pointermove', function (event) {
        var rect = heroVisual.getBoundingClientRect();
        var x = ((event.clientX - rect.left) / rect.width - 0.5) * 12;
        var y = ((event.clientY - rect.top) / rect.height - 0.5) * 12;
        heroVisual.style.setProperty('--mx', x.toFixed(2) + 'px');
        heroVisual.style.setProperty('--my', y.toFixed(2) + 'px');
      });
      heroVisual.addEventListener('pointerleave', function () { heroVisual.style.setProperty('--mx', '0px'); heroVisual.style.setProperty('--my', '0px'); });
    }
  }

  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) { entries.forEach(function (entry) { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); revealObserver.unobserve(entry.target); } }); }, { threshold: 0.1 });
    document.querySelectorAll('.focus-card, .timeline-item, .project-card, .publication, .recognition-list div, .skills-matrix > div').forEach(function (el) { el.classList.add('reveal'); revealObserver.observe(el); });
    var sectionObserver = new IntersectionObserver(function (entries) { entries.forEach(function (entry) { if (entry.isIntersecting) { navAnchors.forEach(function (link) { link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id); }); } }); }, { rootMargin: '-30% 0px -60% 0px', threshold: 0 });
    document.querySelectorAll('main section[id]').forEach(function (section) { sectionObserver.observe(section); });
  }
})();
