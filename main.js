/* ========================================
   TUNAKOREA — Main JavaScript
   ======================================== */
import './style.css';

// ----- Navbar Scroll -----
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

function handleNavScroll() {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

// ----- Active Nav Link on Scroll -----
function updateActiveLink() {
  const scrollPos = window.scrollY + 120;
  sections.forEach((section) => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');
    if (scrollPos >= top && scrollPos < top + height) {
      navLinks.forEach((link) => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${id}`) {
          link.classList.add('active');
        }
      });
    }
  });
}

// ----- Mobile Menu Toggle -----
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('open');
  navMenu.classList.toggle('open');
});

// Close menu on link click
navMenu.querySelectorAll('.nav-link').forEach((link) => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('open');
    navMenu.classList.remove('open');
  });
});

// ----- Stats Counter Animation -----
function animateCounters() {
  const statItems = document.querySelectorAll('.stat-item');
  statItems.forEach((item) => {
    const target = parseFloat(item.dataset.target);
    const numberEl = item.querySelector('.stat-number');
    const isDecimal = target % 1 !== 0;
    const duration = 2000;
    const frameRate = 60;
    const totalFrames = (duration / 1000) * frameRate;
    let frame = 0;

    const counter = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      // Easing: ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = target * eased;

      if (isDecimal) {
        numberEl.textContent = current.toFixed(1);
      } else {
        numberEl.textContent = Math.floor(current).toLocaleString();
      }

      if (frame >= totalFrames) {
        clearInterval(counter);
        if (isDecimal) {
          numberEl.textContent = target.toFixed(1);
        } else {
          numberEl.textContent = target.toLocaleString();
        }
      }
    }, 1000 / frameRate);
  });
}

// ----- Scroll Reveal Animations -----
function setupRevealObserver() {
  // Add reveal class to elements
  const revealSelectors = [
    '.about-grid',
    '.capability-card',
    '.product-card',
    '.process-step',
    '.gallery-item',
    '.cert-badge',
    '.news-card',
    '.contact-card',
    '.contact-form',
    '.section-header',
    '.cert-notice',
    '.about-highlights .highlight'
  ];

  revealSelectors.forEach((selector) => {
    document.querySelectorAll(selector).forEach((el) => {
      el.classList.add('reveal');
    });
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Add staggered delay for grid items
          const parent = entry.target.parentElement;
          if (parent) {
            const siblings = [...parent.children].filter((c) =>
              c.classList.contains('reveal')
            );
            const index = siblings.indexOf(entry.target);
            entry.target.style.transitionDelay = `${index * 0.1}s`;
          }
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  );

  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
}

// ----- Stats Intersection Observer -----
function setupStatsObserver() {
  const statsSection = document.querySelector('.stats');
  let animated = false;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !animated) {
          animated = true;
          animateCounters();
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  if (statsSection) observer.observe(statsSection);
}

// ----- Smooth Scroll for anchor links -----
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    const targetEl = document.querySelector(targetId);
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ----- Contact Form -----
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.textContent = 'Message Sent! ✓';
    btn.style.background = 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)';
    btn.disabled = true;

    setTimeout(() => {
      btn.textContent = originalText;
      btn.style.background = '';
      btn.disabled = false;
      contactForm.reset();
    }, 3000);
  });
}

// ----- Parallax effect on Hero -----
function handleParallax() {
  const heroBg = document.querySelector('.hero-bg img');
  if (heroBg && window.scrollY < window.innerHeight) {
    const scrolled = window.scrollY;
    heroBg.style.transform = `scale(${1.05 + scrolled * 0.0002}) translateY(${scrolled * 0.3}px)`;
  }
}

// ----- Event Listeners -----
window.addEventListener('scroll', () => {
  handleNavScroll();
  updateActiveLink();
  handleParallax();
}, { passive: true });

// ----- Initialize -----
document.addEventListener('DOMContentLoaded', () => {
  setupRevealObserver();
  setupStatsObserver();
  handleNavScroll();
});
