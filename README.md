# Portfolio — Déo Gratios Akowanou

## Structure des fichiers

```
portfolio-deo/
│
├── index.html          ← Page principale (unique fichier HTML)
│
├── css/
│   └── style.css       ← Tous les styles (variables, layout, responsive)
│
├── js/
│   └── main.js         ← Interactions (scroll, animations, smooth scroll)
│
├── images/             ← Dossier pour tes photos et visuels
│   └── (vide pour l'instant — voir section "Images" ci-dessous)
│
└── README.md           ← Ce fichier
```

---

## Comment ouvrir avec WAMP + VSCode

1. Copie le dossier `portfolio-deo/` dans `C:/wamp64/www/`
2. Démarre WAMP (icône verte dans la barre des tâches)
3. Ouvre ton navigateur et va sur : `http://localhost/portfolio-deo/`
4. Dans VSCode : Fichier → Ouvrir le dossier → sélectionne `portfolio-deo/`

---

## Ce que tu dois personnaliser

Ouvre `index.html` dans VSCode et remplace :

| Ce qui est écrit          | Remplace par                   |
|---------------------------|-------------------------------|
| `+229 XX XX XX XX`        | Ton vrai numéro WhatsApp      |
| `https://wa.me/22900000000` | `https://wa.me/229TONVRAINUM` |
| `ton@email.com`           | Ton vrai email                |

---

## Ajouter ta photo

1. Mets ta photo dans le dossier `images/` (ex: `photo.jpg`)
2. Dans `index.html`, trouve la div `.avatar` :
   ```html
   <div class="avatar">DG</div>
   ```
3. Remplace-la par :
   ```html
   <img class="avatar" src="images/photo.jpg" alt="Déo Gratios Akowanou" />
   ```
4. Dans `css/style.css`, ajoute à `.avatar` :
   ```css
   object-fit: cover;
   ```

---

## Technologies utilisées

- HTML5 sémantique
- CSS3 (variables CSS, Grid, Flexbox, animations)
- JavaScript vanilla (Intersection Observer, smooth scroll)
- Google Fonts — Inter
- Aucune dépendance externe (pas de jQuery, pas de framework)

---

## Déploiement gratuit en ligne

### Option A — Netlify (recommandé)
1. Va sur https://netlify.com → crée un compte gratuit
2. Glisse-dépose ton dossier `portfolio-deo/` sur le dashboard
3. Ton site est en ligne en 30 secondes avec un lien `xxx.netlify.app`

### Option B — GitHub Pages
1. Crée un repo GitHub nommé `portfolio`
2. Upload tous les fichiers
3. Settings → Pages → Source: main → Ton site : `tonnom.github.io/portfolio`

---

Bonne chance Déo ! 🚀
