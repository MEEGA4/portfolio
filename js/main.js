// =============================================
// Portfolio - Alejandro Martínez Barba
// main.js - All interactivity
// =============================================

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavScroll();
  initActiveNav();
  initMobileMenu();
  initScrollReveal();
  initCVDownload();
  initScrollProgress();
  initLiveClock();
  initSpotlight();
  initCopyEmail();
  logConsoleSignature();
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
    rootMargin: '-88px 0px 0px 0px'
  });

  sections.forEach(section => observer.observe(section));
}

function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const closeButton = document.getElementById('mobileMenuClose');
  const mobileLinks = mobileMenu.querySelectorAll('.nav__mobile-link');

  const closeMenu = (restoreFocus = true) => {
    mobileMenu.classList.remove('open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    if (restoreFocus) hamburger.focus();
  };

  hamburger.addEventListener('click', () => {
    mobileMenu.classList.add('open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    closeButton.focus();
  });

  closeButton.addEventListener('click', () => closeMenu());

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => closeMenu(false));
  });

  mobileMenu.addEventListener('keydown', (event) => {
    if (event.key !== 'Tab') return;
    const focusable = [...mobileMenu.querySelectorAll('a, button')];
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && mobileMenu.classList.contains('open')) closeMenu();
  });

  window.matchMedia('(min-width: 901px)').addEventListener('change', (event) => {
    if (event.matches && mobileMenu.classList.contains('open')) closeMenu(false);
  });
}

// ===== 3. SCROLL REVEAL =====

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

// ===== 4. SCROLL PROGRESS BAR =====

function initScrollProgress() {
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;

  const updateProgress = () => {
    const scrollPx = document.documentElement.scrollTop || document.body.scrollTop;
    const winHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = winHeight > 0 ? (scrollPx / winHeight) * 100 : 0;
    bar.style.width = `${Math.min(100, Math.max(0, scrolled))}%`;
  };

  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();
}

// ===== 5. LIVE CLOCK =====

function initLiveClock() {
  const clockEl = document.getElementById('liveClock');
  const formatter = new Intl.DateTimeFormat('es-ES', {
    timeZone: 'Europe/Madrid',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZoneName: 'short'
  });

  const updateClock = () => { clockEl.textContent = formatter.format(new Date()); };

  updateClock();
  setInterval(updateClock, 1000);
}

// ===== 6. HERO SPOTLIGHT =====

function initSpotlight() {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  let ticking = false;

  hero.addEventListener('mousemove', (e) => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const rect = hero.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        hero.style.setProperty('--mouse-x', `${x.toFixed(1)}%`);
        hero.style.setProperty('--mouse-y', `${y.toFixed(1)}%`);
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

// ===== 7. COPY EMAIL BUTTON =====

function initCopyEmail() {
  const btn = document.getElementById('copyEmailBtn');
  const tooltip = document.getElementById('copyTooltip');
  const icon = document.getElementById('copyIcon');
  const text = document.getElementById('copyText');
  if (!btn) return;

  const showCopiedFeedback = () => {
    btn.classList.add('copied');
    if (icon) icon.className = 'fa-solid fa-check';
    if (text) text.textContent = 'copiado';
    if (tooltip) tooltip.classList.add('show');

    setTimeout(() => {
      btn.classList.remove('copied');
      if (icon) icon.className = 'fa-regular fa-copy';
      if (text) text.textContent = 'copiar';
      if (tooltip) tooltip.classList.remove('show');
    }, 2200);
  };

  btn.addEventListener('click', async () => {
    const email = btn.getAttribute('data-email') || 'zarzaleja86@gmail.com';
    let copied = false;

    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(email);
        copied = true;
      } catch {
        copied = false;
      }
    }

    if (!copied) {
      // Fallback via temporary textarea
      try {
        const textarea = document.createElement('textarea');
        textarea.value = email;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        textarea.select();
        copied = document.execCommand('copy');
        document.body.removeChild(textarea);
      } catch {
        copied = false;
      }
    }

    if (copied) {
      showCopiedFeedback();
    } else {
      window.location.href = `mailto:${email}`;
    }
  });
}

// ===== 8. CONSOLE SIGNATURE =====

function logConsoleSignature() {
  const mono = 'font-family: "JetBrains Mono", monospace;';
  console.log(
    '%c REGISTRO %c v2026.06 — bilbao, es\n%c> hola, curioso. el código está en github.com/MEEGA4',
    `${mono} background: #E89A4A; color: #11100E; font-weight: 700; padding: 2px 6px;`,
    `${mono} color: #6E665A;`,
    `${mono} color: #E89A4A;`
  );
}

// ===== 9. CV DOWNLOAD =====

function initCVDownload() {
  const btn = document.getElementById('downloadCV');
  if (!btn) return;

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const url = btn.getAttribute('href');
    const filename = btn.getAttribute('download') || 'CV.pdf';

    fetch(url)
      .then(res => res.blob())
      .then(blob => {
        const a = document.createElement('a');
        const blobUrl = URL.createObjectURL(blob);
        a.href = blobUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
      })
      .catch(() => {
        window.open(url, '_blank');
      });
  });
}
