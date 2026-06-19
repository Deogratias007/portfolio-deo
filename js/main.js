/* ============================================================
   PORTFOLIO — Déo-Gratias AKOWANOU
   Fichier  : js/main.js
   ============================================================ */

/* -----------------------------------------------
   1. Navbar — ombre au scroll
----------------------------------------------- */
const navbar = document.getElementById('navbar');
const hero = document.querySelector('.hero');
const heroTitle = document.querySelector('.hero-title');

const scrollProgress = document.createElement('div');
scrollProgress.className = 'scroll-progress';
document.body.prepend(scrollProgress);

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
  '.section > .section-tag, .section > .section-title, .section > .section-sub, .service-card, .project-card, .about-card, .skill-card, .journey-card, .contact-card, .hero-stats .stat'
).forEach(el => {
  el.classList.add('fade-in');
  observer.observe(el);
});


/* -----------------------------------------------
   4. Hero premium - reveal, gradient et parallaxe
----------------------------------------------- */
function wrapAnimatedLetters(root) {
  if (!root) return;

  let index = 0;
  const wrapNode = (node) => {
    const fragment = document.createDocumentFragment();

    Array.from(node.textContent).forEach(char => {
      if (char === ' ') {
        fragment.appendChild(document.createTextNode(' '));
        return;
      }

      const span = document.createElement('span');
      span.className = 'char';
      span.style.setProperty('--char-index', index);
      span.textContent = char;
      index += 1;
      fragment.appendChild(span);
    });

    node.replaceWith(fragment);
  };

  Array.from(root.childNodes).forEach(node => {
    if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
      wrapNode(node);
    }

    if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains('accent')) {
      Array.from(node.childNodes).forEach(child => {
        if (child.nodeType === Node.TEXT_NODE && child.textContent.trim()) {
          wrapNode(child);
        }
      });
    }
  });
}

wrapAnimatedLetters(heroTitle);

requestAnimationFrame(() => {
  document.body.classList.add('loaded');
});

if (hero && heroTitle && window.matchMedia('(pointer: fine)').matches) {
  hero.addEventListener('mousemove', (event) => {
    const rect = hero.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 10;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 8;

    heroTitle.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  });

  hero.addEventListener('mouseleave', () => {
    heroTitle.style.transform = '';
  });
}


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
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;

  scrollProgress.style.width = `${Math.min(progress, 100)}%`;
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
