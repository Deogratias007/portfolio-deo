/* ============================================================
   PORTFOLIO — Déo-Gratias AKOWANOU
   Fichier  : js/main.js
   ============================================================ */

/* -----------------------------------------------
   1. Navbar — ombre au scroll
----------------------------------------------- */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 30) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});


/* -----------------------------------------------
   2. Smooth scroll — liens de navigation
----------------------------------------------- */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});


/* -----------------------------------------------
   3. Animation d'apparition au scroll (Intersection Observer)
----------------------------------------------- */
const observerOptions = {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

/* Éléments à animer */
document.querySelectorAll(
  '.service-card, .project-card, .about-card, .skill-card, .journey-card, .contact-card, .hero-stats .stat'
).forEach(el => {
  el.classList.add('fade-in');
  observer.observe(el);
});


/* -----------------------------------------------
   5. PERFORMANCE - LAZY LOADING
----------------------------------------------- */
const lazyImages = document.querySelectorAll('img[data-src]');

const imageObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src;
      img.classList.remove('lazy');
      imageObserver.unobserve(img);
    }
  });
});

lazyImages.forEach(img => imageObserver.observe(img));

/* -----------------------------------------------
   6. PRÉCHARGEMENT DES LIENS IMPORTANTS
----------------------------------------------- */
const importantLinks = document.querySelectorAll('a[href^="#"]');
importantLinks.forEach(link => {
  link.addEventListener('mouseenter', () => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      target.style.willChange = 'transform, opacity';
    }
  });
});

/* -----------------------------------------------
   7. OPTIMISATION DES ANIMATIONS
----------------------------------------------- */
let ticking = false;
function requestTick() {
  if (!ticking) {
    requestAnimationFrame(updateAnimations);
    ticking = true;
  }
}

function updateAnimations() {
  ticking = false;
}

// Optimisation du scroll
window.addEventListener('scroll', requestTick, { passive: true });

/* -----------------------------------------------
   4. Année dynamique dans le footer
----------------------------------------------- */
const footerYear = document.querySelector('.footer p');
if (footerYear) {
  footerYear.innerHTML = footerYear.innerHTML.replace(
    '2026',
    new Date().getFullYear()
  );
}
