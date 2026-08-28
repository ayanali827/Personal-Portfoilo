(function () {
  'use strict';

  var html = document.documentElement;
  var body = document.body;
  var header = document.querySelector('.site-header');
  var pageShell = document.getElementById('pageShell');
  var pageCurtain = document.getElementById('pageCurtain');
  var themeToggle = document.getElementById('themeToggle');
  var themeIcon = document.getElementById('themeIcon');
  var menuToggle = document.getElementById('menuToggle');
  var navLinks = document.getElementById('navLinks');
  var navAnchors = navLinks ? Array.prototype.slice.call(navLinks.querySelectorAll('a[href^="#"]')) : [];
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia && window.matchMedia('(pointer:fine)').matches;
  var transitionMs = 420;
  var transitionBusy = false;

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
    document.addEventListener('click', function (event) {
      if (navLinks.classList.contains('open') && !navLinks.contains(event.target) && !menuToggle.contains(event.target)) closeMenu();
    });
    window.addEventListener('resize', function () { if (window.innerWidth > 820) closeMenu(); });
  }

  function updateHeader() {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 24);
  }
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

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

    document.querySelectorAll('.scroll-section, .focus-card, .timeline-item, .project-card, .impact-stat, .publication, .recognition-list div, .skills-matrix > div').forEach(function (element, index) {
      element.classList.add('reveal');
      element.style.transitionDelay = Math.min(index % 4, 3) * 55 + 'ms';
      revealObserver.observe(element);
    });
  } else {
    document.querySelectorAll('.reveal').forEach(function (element) { element.classList.add('is-visible'); });
  }

  function updateActiveNav(id) {
    navAnchors.forEach(function (link) {
      link.classList.toggle('active', link.getAttribute('href') === '#' + id);
    });
  }

  function scrollToHash(hash) {
    var target = document.querySelector(hash);
    if (!target) return;
    target.scrollIntoView({ behavior: 'auto', block: 'start' });
    updateActiveNav(target.id);
  }

  function runInPageTransition(update) {
    if (!pageShell || reduceMotion || transitionBusy) {
      update();
      return;
    }

    transitionBusy = true;
    pageShell.classList.remove('is-entering');
    pageShell.classList.add('is-exiting');

    window.setTimeout(function () {
      update();
      pageShell.classList.remove('is-exiting');
      pageShell.classList.add('is-entering');
      window.setTimeout(function () {
        pageShell.classList.remove('is-entering');
        transitionBusy = false;
      }, transitionMs);
    }, transitionMs);
  }

  function isSameDocumentHashLink(link) {
    if (!link || !link.getAttribute('href')) return false;
    var rawHref = link.getAttribute('href');
    if (rawHref.charAt(0) !== '#') return false;
    return !!document.querySelector(rawHref);
  }

  document.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function (event) {
      if (!isSameDocumentHashLink(link)) return;
      var hash = link.getAttribute('href');
      if (!hash || hash === window.location.hash) return;
      event.preventDefault();
      closeMenu();
      runInPageTransition(function () {
        history.pushState(null, '', hash);
        scrollToHash(hash);
      });
    });
  });

  window.addEventListener('popstate', function () {
    if (window.location.hash) {
      runInPageTransition(function () { scrollToHash(window.location.hash); });
    } else {
      runInPageTransition(function () { window.scrollTo({ top: 0, behavior: 'auto' }); updateActiveNav('top'); });
    }
  });

  if ('IntersectionObserver' in window) {
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        updateActiveNav(entry.target.id);
      });
    }, { rootMargin: '-28% 0px -62% 0px', threshold: 0 });
    document.querySelectorAll('main section[id]').forEach(function (section) { sectionObserver.observe(section); });
  }

  function dismissCurtain() {
    if (!pageCurtain) return;
    pageCurtain.classList.add('is-dismissed');
    body.classList.add('is-ready');
  }

  function revealInitialPage() {
    if (pageShell && !reduceMotion) pageShell.classList.add('is-entering');
    window.setTimeout(dismissCurtain, reduceMotion ? 0 : 180);
    window.setTimeout(dismissCurtain, 1600);
  }

  if (document.readyState === 'complete') {
    revealInitialPage();
  } else {
    window.addEventListener('load', revealInitialPage, { once: true });
  }

  // Scroll-linked depth and restrained cursor interactions keep the static site cinematic without dependencies.
  var progressBar = document.getElementById('scrollProgress');
  var navProgress = document.getElementById('navProgress');
  var spotlight = document.querySelector('.cursor-spotlight');
  var parallaxItems = Array.prototype.slice.call(document.querySelectorAll('[data-parallax]'));
  var countItems = Array.prototype.slice.call(document.querySelectorAll('.count'));
  var tiltItems = Array.prototype.slice.call(document.querySelectorAll('[data-tilt]'));
  var lastScrollY = -1;
  var countObserver;

  function formatCount(value, decimals) {
    return Number(value).toFixed(decimals);
  }

  function animateCount(element) {
    if (element.dataset.counted === 'true') return;
    element.dataset.counted = 'true';
    var target = Number(element.dataset.count || 0);
    var prefix = element.dataset.prefix || '';
    var suffix = element.dataset.suffix || '';
    var decimals = (String(element.dataset.count).split('.')[1] || '').length;
    if (reduceMotion) {
      element.textContent = prefix + formatCount(target, decimals) + suffix;
      return;
    }
    var start = performance.now();
    var duration = 900;
    function tick(now) {
      var progress = Math.min((now - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      element.textContent = prefix + formatCount(target * eased, decimals) + suffix;
      if (progress < 1) window.requestAnimationFrame(tick);
    }
    window.requestAnimationFrame(tick);
  }

  if ('IntersectionObserver' in window && countItems.length) {
    countObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          countObserver.unobserve(entry.target);
        }
      });
    }, { threshold: .55 });
    countItems.forEach(function (item) { countObserver.observe(item); });
  } else {
    countItems.forEach(animateCount);
  }

  function updateScrollScene() {
    var maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    var ratio = maxScroll > 0 ? Math.min(window.scrollY / maxScroll, 1) : 0;
    if (progressBar) progressBar.style.transform = 'scaleX(' + ratio + ')';
    if (navProgress) navProgress.style.transform = 'scaleX(' + ratio + ')';
    if (lastScrollY === window.scrollY) return;
    lastScrollY = window.scrollY;
    parallaxItems.forEach(function (item) {
      var rect = item.getBoundingClientRect();
      if (rect.bottom < -120 || rect.top > window.innerHeight + 120) return;
      var speed = Number(item.dataset.parallax || 0);
      item.style.setProperty('--scroll-shift', (window.scrollY * speed).toFixed(2) + 'px');
    });
  }
  updateScrollScene();
  window.addEventListener('scroll', updateScrollScene, { passive: true });
  window.addEventListener('resize', updateScrollScene, { passive: true });

  if (finePointer && spotlight && !reduceMotion) {
    window.addEventListener('pointermove', function (event) {
      spotlight.style.setProperty('--spot-x', event.clientX + 'px');
      spotlight.style.setProperty('--spot-y', event.clientY + 'px');
    }, { passive: true });
  }

  var projectPin = document.querySelector('.project-pin');
  var projectViewport = document.querySelector('.project-viewport');
  var projectStage = document.querySelector('.project-stage');
  function updateProjectStrip() {
    if (!projectPin || !projectViewport || !projectStage || reduceMotion || window.innerWidth <= 820) return;
    var pinRect = projectPin.getBoundingClientRect();
    var pinTop = pinRect.top + window.scrollY;
    var travel = Math.max(projectStage.scrollWidth - projectViewport.clientWidth, 0);
    var available = Math.max(projectPin.offsetHeight - projectViewport.offsetHeight, 1);
    var progress = Math.max(0, Math.min(1, (window.scrollY - pinTop) / available));
    projectStage.style.transform = 'translateX(' + (-travel * progress).toFixed(2) + 'px)';
  }
  updateProjectStrip();
  window.addEventListener('scroll', updateProjectStrip, { passive: true });
  window.addEventListener('resize', updateProjectStrip, { passive: true });

  if (finePointer && !reduceMotion) {
    tiltItems.forEach(function (card) {
      card.addEventListener('pointermove', function (event) {
        var rect = card.getBoundingClientRect();
        var x = ((event.clientX - rect.left) / rect.width - .5) * 4;
        var y = ((event.clientY - rect.top) / rect.height - .5) * -4;
        card.style.setProperty('--tilt-x', x.toFixed(2) + 'deg');
        card.style.setProperty('--tilt-y', y.toFixed(2) + 'deg');
      });
      card.addEventListener('pointerleave', function () {
        card.style.setProperty('--tilt-x', '0deg');
        card.style.setProperty('--tilt-y', '0deg');
      });
    });
  }

})();
