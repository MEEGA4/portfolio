// =============================================
// Portfolio - Alejandro Martinez Barba
// main.js - All interactivity
// =============================================

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavScroll();
  initActiveNav();
  initMobileMenu();
  initScrollReveal();
  initSkillsFilter();
  initTypingEffect();
  initCVDownload();
});

// ===== 1. THEME MANAGEMENT =====

function initTheme() {
  const stored = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = stored || (systemPrefersDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', theme);
  updateThemeIcons(theme);

  // Desktop toggle
  document.getElementById('themeToggle').addEventListener('click', toggleTheme);
  // Mobile toggle
  document.getElementById('themeToggleMobile').addEventListener('click', toggleTheme);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  updateThemeIcons(next);
}

function updateThemeIcons(theme) {
  const icons = document.querySelectorAll('.theme-toggle i');
  icons.forEach(icon => {
    icon.className = theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
  });
}

// ===== 2. NAVIGATION =====

function initNavScroll() {
  const nav = document.querySelector('.nav');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      nav.classList.add('nav--scrolled');
    } else {
      nav.classList.remove('nav--scrolled');
    }
  }, { passive: true });
}

function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__link');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => link.classList.remove('active'));
        const activeLink = document.querySelector(`.nav__link[href="#${entry.target.id}"]`);
        if (activeLink) activeLink.classList.add('active');
      }
    });
  }, {
    threshold: 0.3,
    rootMargin: '-64px 0px 0px 0px'
  });

  sections.forEach(section => observer.observe(section));
}

function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = mobileMenu.querySelectorAll('.nav__mobile-link');

  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    const icon = hamburger.querySelector('i');
    icon.className = isOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.querySelector('i').className = 'fa-solid fa-bars';
      document.body.style.overflow = '';
    });
  });
}

// ===== 3. TYPING EFFECT =====

class TypeWriter {
  constructor(element, phrases, typingSpeed, deletingSpeed, pauseTime) {
    this.element = element;
    this.phrases = phrases;
    this.typingSpeed = typingSpeed || 80;
    this.deletingSpeed = deletingSpeed || 40;
    this.pauseTime = pauseTime || 2000;
    this.currentPhrase = 0;
    this.currentChar = 0;
    this.isDeleting = false;
    this.type();
  }

  type() {
    const phrase = this.phrases[this.currentPhrase];

    if (this.isDeleting) {
      this.element.textContent = phrase.substring(0, this.currentChar - 1);
      this.currentChar--;
    } else {
      this.element.textContent = phrase.substring(0, this.currentChar + 1);
      this.currentChar++;
    }

    let speed = this.isDeleting ? this.deletingSpeed : this.typingSpeed;

    if (!this.isDeleting && this.currentChar === phrase.length) {
      speed = this.pauseTime;
      this.isDeleting = true;
    } else if (this.isDeleting && this.currentChar === 0) {
      this.isDeleting = false;
      this.currentPhrase = (this.currentPhrase + 1) % this.phrases.length;
      speed = 400;
    }

    setTimeout(() => this.type(), speed);
  }
}

function initTypingEffect() {
  const element = document.querySelector('.hero__role-text');
  if (element) {
    new TypeWriter(element, [
      'Estudiante de Ingenieria Informatica',
      'Desarrollador Web Full-Stack',
      'Universidad de Deusto'
    ]);
  }
}

// ===== 4. SCROLL REVEAL =====

function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal, .reveal--left, .reveal--scale');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}

// ===== 5. SKILLS FILTERING =====

function initSkillsFilter() {
  const buttons = document.querySelectorAll('.skills__category-btn');
  const cards = document.querySelectorAll('.skill-card');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const category = btn.dataset.category;

      cards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.3s ease forwards';
        } else {
          card.style.display = 'none';
          card.style.animation = '';
        }
      });
    });
  });
}

// ===== 6. CV DOWNLOAD =====

function initCVDownload() {
  const btn = document.getElementById('downloadCV');
  if (!btn) return;

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const url = btn.getAttribute('href');
    const filename = url.split('/').pop();

    fetch(url)
      .then(res => res.blob())
      .then(blob => {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = filename;
        a.click();
        URL.revokeObjectURL(a.href);
      })
      .catch(() => {
        window.open(url, '_blank');
      });
  });
}
