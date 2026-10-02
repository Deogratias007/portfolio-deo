/* ============================================================
   Déo-Gratias AKOWANOU · la devanture peinte

   Le site reste lisible sans ce fichier : les diapos affichent
   alors leur première vue, et rien n’est caché.
   ============================================================ */

const douceur = window.matchMedia('(prefers-reduced-motion: reduce)');

/* ------------------------------------------------------------
   LA DIAPO
   Un cadre fixe, les vues passent une par une, avec le temps de
   lire. Le témoin se remplit pour qu’on comprenne qu’il faut
   attendre, et tout s’arrête dès qu’on survole ou qu’on touche.
------------------------------------------------------------ */

const FLECHE_G = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5 L8 12 L15 19"/></svg>';
const FLECHE_D = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 5 L16 12 L9 19"/></svg>';

document.querySelectorAll('[data-diapo]').forEach((diapo) => {
  const piste = diapo.querySelector('.diapo__piste');
  if (!piste) return;

  const vues = Array.from(piste.children);
  if (vues.length < 2) return;

  const duree = Number(diapo.dataset.duree) || 6000;
  diapo.style.setProperty('--duree', duree + 'ms');

  const cadre = diapo.querySelector('.diapo__cadre');
  cadre.setAttribute('aria-roledescription', 'diaporama');
  vues.forEach((vue, i) => {
    vue.setAttribute('aria-roledescription', 'vue');
    vue.setAttribute('aria-label', (i + 1) + ' sur ' + vues.length);
  });

  /* La barre de commande est construite ici : sans JavaScript elle
     n’aurait aucun sens, puisque rien ne pourrait avancer. */
  const barre = document.createElement('div');
  barre.className = 'diapo__barre';

  const precedent = document.createElement('button');
  precedent.type = 'button';
  precedent.className = 'diapo__fleche';
  precedent.innerHTML = FLECHE_G;
  precedent.setAttribute('aria-label', 'Vue précédente');

  const suivant = document.createElement('button');
  suivant.type = 'button';
  suivant.className = 'diapo__fleche';
  suivant.innerHTML = FLECHE_D;
  suivant.setAttribute('aria-label', 'Vue suivante');

  const temoins = document.createElement('ul');
  temoins.className = 'diapo__temoins';

  const boutons = vues.map((vue, i) => {
    const li = document.createElement('li');
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'diapo__temoin';
    b.setAttribute('aria-label', 'Aller à la vue ' + (i + 1));
    b.addEventListener('click', () => aller(i, true));
    li.appendChild(b);
    temoins.appendChild(li);
    return b;
  });

  barre.append(precedent, temoins, suivant);
  diapo.appendChild(barre);

  let index = 0;
  let minuteur = null;

  function montrer() {
    piste.style.transform = 'translate3d(' + (-index * 100) + '%, 0, 0)';
    vues.forEach((vue, i) => {
      vue.toggleAttribute('inert', i !== index);
      vue.setAttribute('aria-hidden', String(i !== index));
    });
    boutons.forEach((b, i) => {
      if (i === index) b.setAttribute('aria-current', 'true');
      else b.removeAttribute('aria-current');
    });
  }

  function programmer() {
    clearTimeout(minuteur);
    if (douceur.matches) return;
    minuteur = setTimeout(() => aller(index + 1, false), duree);
  }

  function aller(cible, parLaMain) {
    index = (cible + vues.length) % vues.length;
    montrer();
    if (parLaMain) {
      /* Relancer l’animation du témoin : on la retire puis on la remet. */
      diapo.classList.remove('diapo--anime');
      void diapo.offsetWidth;
      diapo.classList.add('diapo--anime');
    }
    programmer();
  }

  precedent.addEventListener('click', () => aller(index - 1, true));
  suivant.addEventListener('click', () => aller(index + 1, true));

  /* On s’arrête dès que quelqu’un regarde vraiment. */
  const pause = (oui) => {
    diapo.dataset.pause = oui ? 'oui' : 'non';
    if (oui) clearTimeout(minuteur);
    else programmer();
  };
  diapo.addEventListener('mouseenter', () => pause(true));
  diapo.addEventListener('mouseleave', () => pause(false));
  diapo.addEventListener('focusin', () => pause(true));
  diapo.addEventListener('focusout', () => pause(false));

  /* Le doigt : on fait glisser la vue comme sur une tablette. */
  let departX = null;
  cadre.addEventListener('touchstart', (e) => { departX = e.touches[0].clientX; pause(true); }, { passive: true });
  cadre.addEventListener('touchend', (e) => {
    if (departX === null) return;
    const ecart = e.changedTouches[0].clientX - departX;
    if (Math.abs(ecart) > 40) aller(index + (ecart < 0 ? 1 : -1), true);
    departX = null;
    pause(false);
  }, { passive: true });

  /* Les flèches du clavier, quand la barre a le focus. */
  barre.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); aller(index - 1, true); }
    if (e.key === 'ArrowRight') { e.preventDefault(); aller(index + 1, true); }
  });

  /* Le chargement différé ne voit jamais arriver une vue décalée
     horizontalement : on demande ses images dès que la diapo approche. */
  const demander = () => diapo.querySelectorAll('img[loading="lazy"]').forEach((i) => { i.loading = 'eager'; });

  montrer();

  if ('IntersectionObserver' in window) {
    const eveil = new IntersectionObserver((entrees, obs) => {
      entrees.forEach((e) => {
        if (!e.isIntersecting) return;
        demander();
        diapo.classList.add('diapo--anime');
        programmer();
        obs.disconnect();
      });
    }, { rootMargin: '400px 0px' });
    eveil.observe(diapo);
  } else {
    demander();
    diapo.classList.add('diapo--anime');
    programmer();
  }
});

/* ------------------------------------------------------------
   LE LETTRAGE
   Le panneau se peint en deux passes, la lettre puis son ombre.
   Il se repeint quand on revient en haut : l’enseigne est vivante,
   mais on ne la voit refaire son geste que si on remonte la voir.
------------------------------------------------------------ */

const lettrage = document.querySelector('.lettrage');

if (lettrage) {
  const peindre = () => lettrage.setAttribute('data-peint', 'oui');
  const effacer = () => lettrage.removeAttribute('data-peint');

  if ('IntersectionObserver' in window && !douceur.matches) {
    const pinceau = new IntersectionObserver(
      (entrees) => entrees.forEach((e) => (e.isIntersecting ? peindre() : effacer())),
      { threshold: 0.35 }
    );
    pinceau.observe(lettrage);
    /* Filet de sécurité : le lettrage ne reste jamais invisible. */
    setTimeout(peindre, 2500);
  } else {
    peindre();
  }
}

/* ------------------------------------------------------------
   LA PORTE D’AYIXO
   On ne la fait jouer que lorsqu’elle est à l’écran : une boucle
   qui tourne dans le vide coûte de la batterie pour rien.
------------------------------------------------------------ */

document.querySelectorAll('[data-porte]').forEach((porte) => {
  if (!('IntersectionObserver' in window)) { porte.dataset.joue = 'oui'; return; }
  const oeil = new IntersectionObserver(
    (entrees) => entrees.forEach((e) => { porte.dataset.joue = e.isIntersecting ? 'oui' : 'non'; }),
    { rootMargin: '120px 0px', threshold: 0 }
  );
  oeil.observe(porte);
});

/* ------------------------------------------------------------
   LES TAMPONS DE STATUT
   Ils se posent quand leur liste arrive à l’écran, une seule fois.
------------------------------------------------------------ */

const listes = document.querySelectorAll('.realisations, .chantiers');

if (listes.length && 'IntersectionObserver' in window && !douceur.matches) {
  const poser = (liste) => liste.setAttribute('data-pose', 'oui');
  listes.forEach((liste) => liste.setAttribute('data-pose', 'non'));

  const tampon = new IntersectionObserver((entrees, obs) => {
    entrees.forEach((e) => {
      if (!e.isIntersecting) return;
      poser(e.target);
      obs.unobserve(e.target);
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0 });

  listes.forEach((liste) => tampon.observe(liste));

  /* Filet de sécurité : un statut est une information, pas une décoration.
     Rien ne doit rester invisible si l’observateur ne répond pas. */
  setTimeout(() => listes.forEach(poser), 3000);
}

/* ------------------------------------------------------------
   L’ANNÉE ET LA PLAQUE DE RAPPEL
------------------------------------------------------------ */

const annee = document.getElementById('annee');
if (annee) annee.textContent = new Date().getFullYear();

const rappel = document.querySelector('.rappel');
const enseigne = document.querySelector('.enseigne');

if (rappel && enseigne && 'IntersectionObserver' in window) {
  rappel.hidden = false;
  const veille = new IntersectionObserver(
    (entrees) => rappel.classList.toggle('visible', !entrees[0].isIntersecting),
    { rootMargin: '-140px 0px 0px 0px', threshold: 0 }
  );
  veille.observe(enseigne);
}
