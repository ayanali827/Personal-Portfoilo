/* ============================================================
   SCRIPT.JS — Ayan Ali Saleem Portfolio
   ============================================================ */

(function () {
  'use strict';

  /* ---- Dark Mode Toggle ---- */
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  const html = document.documentElement;

  // Load saved theme
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    html.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    html.setAttribute('data-theme', 'dark');
    updateThemeIcon('dark');
  }

  function updateThemeIcon(theme) {
    if (!themeIcon) return;
    themeIcon.textContent = theme === 'dark' ? '\u2600' : '\u263E';
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      const current = html.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      updateThemeIcon(next);
    });
  }

  /* ---- Hamburger Menu ---- */
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

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

  /* ---- Typewriter Effect ---- */
  var words = [
    'Robotics Engineer',
    'AI Researcher',
    'Control Systems Specialist',
    'Autonomous Systems Builder',
    'Motion Planning Engineer'
  ];
  var wordIndex = 0;
  var charIndex = 0;
  var isDeleting = false;
  var typedEl = document.getElementById('typed-text');

  function typeEffect() {
    if (!typedEl) return;
    var current = words[wordIndex];
    if (!isDeleting) {
      typedEl.textContent = current.substring(0, charIndex + 1);
      charIndex++;
      if (charIndex === current.length) {
        isDeleting = true;
        setTimeout(typeEffect, 2200);
        return;
      }
      setTimeout(typeEffect, 75);
    } else {
      typedEl.textContent = current.substring(0, charIndex - 1);
      charIndex--;
      if (charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        setTimeout(typeEffect, 400);
        return;
      }
      setTimeout(typeEffect, 35);
    }
  }
  typeEffect();

  /* ---- Scroll Reveal (Intersection Observer) ---- */
  function initScrollReveal() {
    var revealEls = document.querySelectorAll('.reveal, ' +
      '.stat-card, .edu-card, .exp-card, .pub-card, .project-card, .skill-badge');

    if (!revealEls.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -40px 0px'
    });

    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  }

  // Run after DOM ready, then again after a delay for late-rendered content
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScrollReveal);
  } else {
    initScrollReveal();
  }
  // Fallback: observe dynamically
  setTimeout(initScrollReveal, 500);

  /* ---- Contact Form ---- */
  var contactForm = document.getElementById('contactForm');
  var formStatus = document.getElementById('formStatus');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var submitBtn = contactForm.querySelector('button[type="submit"]');
      var originalText = submitBtn.textContent;
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;

      var formData = new FormData(contactForm);

      // Using Formspree — replace the endpoint URL below with your own
      fetch(contactForm.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      })
      .then(function (response) {
        if (response.ok) {
          formStatus.className = 'form-status success';
          formStatus.textContent = 'Thanks! Your message has been sent. I\'ll get back to you soon.';
          formStatus.style.display = 'block';
          contactForm.reset();
        } else {
          response.json().then(function (data) {
            if (Object.hasOwn(data, 'errors')) {
              formStatus.className = 'form-status error';
              formStatus.textContent = data.errors.map(function (e) { return e.message; }).join(', ');
            } else {
              formStatus.className = 'form-status error';
              formStatus.textContent = 'Oops! There was a problem sending your message.';
            }
            formStatus.style.display = 'block';
          });
        }
      })
      .catch(function () {
        formStatus.className = 'form-status error';
        formStatus.textContent = 'Oops! There was a network problem. Please try again.';
        formStatus.style.display = 'block';
      })
      .finally(function () {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      });
    });
  }

  /* ---- Navbar scroll effect ---- */
  var nav = document.querySelector('nav');
  if (nav) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 20) {
        nav.style.borderBottomColor = 'var(--border)';
      } else {
        nav.style.borderBottomColor = 'transparent';
      }
    });
  }

})();
