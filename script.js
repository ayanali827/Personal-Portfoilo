/* ============================================================
   SCRIPT.JS — Ayan Ali Saleem
   ============================================================ */

(function () {
  'use strict';

  /* ---- Dark Mode Toggle ---- */
  var themeToggle = document.getElementById('themeToggle');
  var themeIcon = document.getElementById('themeIcon');
  var html = document.documentElement;

  function setTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    if (themeIcon) {
      themeIcon.textContent = theme === 'dark' ? '\u2600' : '\u263E';
    }
  }

  var saved = localStorage.getItem('theme');
  if (saved) {
    setTheme(saved);
  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    setTheme('dark');
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      setTheme(next);
    });
  }

  /* ---- Hamburger Menu ---- */
  var hamburger = document.getElementById('hamburger');
  var navLinks = document.getElementById('navLinks');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function () {
      navLinks.classList.toggle('open');
    });

    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
      });
    });
  }

  /* ---- Scroll Reveal ---- */
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  function initReveal() {
    document.querySelectorAll('.reveal').forEach(function (el) {
      observer.observe(el);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initReveal);
  } else {
    initReveal();
  }

  /* ---- Navbar border on scroll ---- */
  var nav = document.querySelector('nav');
  if (nav) {
    nav.style.borderBottomColor = window.scrollY > 20 ? 'var(--border)' : 'transparent';
    window.addEventListener('scroll', function () {
      nav.style.borderBottomColor = window.scrollY > 20 ? 'var(--border)' : 'transparent';
    });
  }

})();
