(function () {
  'use strict';

  /* ----------------------------------------------------------
     Background video — random selection
  ---------------------------------------------------------- */
  var videos = [
    'assets/videos/bg_01.mp4',
    'assets/videos/bg_02.mp4',
    'assets/videos/bg_03.mp4'
  ];

  function loadRandomVideo() {
    var videoEl = document.getElementById('bg-video');
    if (!videoEl) return;
    var idx = Math.floor(Math.random() * videos.length);
    setTimeout(function () {
      videoEl.src = videos[idx];
    }, 200);
  }

  /* ----------------------------------------------------------
     Routing helpers
  ---------------------------------------------------------- */
  var VALID_SECTIONS = ['news', 'about', 'music', 'photo', 'contact'];

  function getHashSection() {
    var hash = location.hash.replace('#', '').toLowerCase().trim();
    return VALID_SECTIONS.indexOf(hash) !== -1 ? hash : null;
  }

  /* ----------------------------------------------------------
     Section show / hide with fade
  ---------------------------------------------------------- */
  var currentSection = null;
  var fadeTimer = null;

  function hideAllSections(callback) {
    var panels = document.querySelectorAll('.section-panel');
    panels.forEach(function (panel) {
      panel.classList.remove('is-faded-in');
    });
    if (fadeTimer) clearTimeout(fadeTimer);
    fadeTimer = setTimeout(function () {
      panels.forEach(function (panel) {
        panel.classList.remove('is-visible');
      });
      if (typeof callback === 'function') callback();
    }, 360);
  }

  function showSection(sectionId) {
    var panel = document.getElementById('section-' + sectionId);
    if (!panel) return;
    panel.classList.add('is-visible');
    // Force reflow so transition plays
    panel.getBoundingClientRect();
    setTimeout(function () {
      panel.classList.add('is-faded-in');
    }, 20);
  }

  function activateLogo() {
    var logo = document.getElementById('site-logo');
    if (logo) logo.classList.add('is-active');
  }

  function deactivateLogo() {
    var logo = document.getElementById('site-logo');
    if (logo) logo.classList.remove('is-active');
  }

  /* ----------------------------------------------------------
     Route handler
  ---------------------------------------------------------- */
  function route() {
    var section = getHashSection();

    if (section === currentSection) return;
    currentSection = section;

    if (!section) {
      // Go back to home
      hideAllSections(function () {
        deactivateLogo();
      });
      return;
    }

    // Show target section
    hideAllSections(function () {
      showSection(section);
      activateLogo();
    });
  }

  /* ----------------------------------------------------------
     Navigation link clicks
  ---------------------------------------------------------- */
  function bindNavLinks() {
    var navLinks = document.querySelectorAll('[data-section]');
    navLinks.forEach(function (link) {
      link.addEventListener('click', function (e) {
        var target = link.getAttribute('data-section');
        if (VALID_SECTIONS.indexOf(target) !== -1) {
          e.preventDefault();
          location.hash = target;
        }
      });
    });
  }

  /* ----------------------------------------------------------
     Logo click — go home
  ---------------------------------------------------------- */
  function bindLogoClick() {
    var logo = document.getElementById('site-logo');
    if (!logo) return;
    logo.addEventListener('click', function () {
      if (logo.classList.contains('is-active')) {
        location.hash = '';
      }
    });
  }

  /* ----------------------------------------------------------
     Contact form
  ---------------------------------------------------------- */
  function bindContactForm() {
    var form = document.getElementById('contact-form');
    var successMsg = document.getElementById('form-success');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (successMsg) {
        successMsg.style.display = 'block';
      }
      form.reset();
    });
  }

  /* ----------------------------------------------------------
     Init
  ---------------------------------------------------------- */
  function init() {
    loadRandomVideo();
    bindNavLinks();
    bindLogoClick();
    bindContactForm();

    // Listen for hash changes
    window.addEventListener('hashchange', route);

    // Handle initial URL
    route();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

}());