(function () {
  'use strict';

  var html = document.documentElement;
  var themeToggle = document.getElementById('themeToggle');
  var themeIcon = document.getElementById('themeIcon');
  var menuToggle = document.getElementById('menuToggle');
  var navLinks = document.getElementById('navLinks');
  var navAnchors = navLinks ? Array.prototype.slice.call(navLinks.querySelectorAll('a[href^="#"]')) : [];
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia && window.matchMedia('(pointer:fine)').matches;

  function setTheme(theme) {
    html.setAttribute('data-theme', theme);
    try { localStorage.setItem('theme', theme); } catch (e) {}
    if (themeIcon) themeIcon.textContent = theme === 'dark' ? '☼' : '☾';
    if (themeToggle) {
      themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
      themeToggle.setAttribute('aria-pressed', theme === 'light' ? 'true' : 'false');
    }
  }

  var savedTheme = null;
  try { savedTheme = localStorage.getItem('theme'); } catch (e) {}
  setTheme(savedTheme || 'dark');

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      setTheme(html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
    });
  }

  function closeMenu() {
    if (!navLinks || !menuToggle) return;
    navLinks.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open menu');
  }

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', function () {
      var open = navLinks.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(open));
      menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    navLinks.querySelectorAll('a').forEach(function (link) { link.addEventListener('click', closeMenu); });
    window.addEventListener('resize', function () { if (window.innerWidth > 800) closeMenu(); });
  }

  if (!reduceMotion && finePointer) {
    var heroVisual = document.querySelector('.hero-visual');
    if (heroVisual) {
      heroVisual.addEventListener('pointermove', function (event) {
        var rect = heroVisual.getBoundingClientRect();
        var x = ((event.clientX - rect.left) / rect.width - 0.5) * 14;
        var y = ((event.clientY - rect.top) / rect.height - 0.5) * 14;
        heroVisual.style.setProperty('--mx', x.toFixed(2) + 'px');
        heroVisual.style.setProperty('--my', y.toFixed(2) + 'px');
      });
      heroVisual.addEventListener('pointerleave', function () {
        heroVisual.style.setProperty('--mx', '0px');
        heroVisual.style.setProperty('--my', '0px');
      });
    }
  }

  if ('IntersectionObserver' in window && !reduceMotion) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -4% 0px' });

    document.querySelectorAll('.focus-card, .timeline-item, .project-card, .publication, .recognition-list div, .skills-matrix > div').forEach(function (element, index) {
      element.classList.add('reveal');
      element.style.transitionDelay = Math.min(index % 4, 3) * 55 + 'ms';
      revealObserver.observe(element);
    });
  } else {
    document.querySelectorAll('.reveal').forEach(function (element) { element.classList.add('is-visible'); });
  }

  if ('IntersectionObserver' in window) {
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navAnchors.forEach(function (link) {
          link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
        });
      });
    }, { rootMargin: '-28% 0px -62% 0px', threshold: 0 });
    document.querySelectorAll('main section[id]').forEach(function (section) { sectionObserver.observe(section); });
  }
})();
