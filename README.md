# HN Rénovation – site vitrine

Site de HN Rénovation (artisan peintre à Cambrai) : React + Vite + Tailwind côté
navigateur, serveur Express (`server.ts`) qui sert le site, l'API de la galerie
(photos sur Cloudflare R2) et l'espace `/admin`.

## ⚠️ Sécurité : actions à faire par le propriétaire

1. **Code malveillant supprimé.** `postcss.config.js` et `eslint.config.js`
   contenaient du code obfusqué caché après de longs espaces. Il interrogeait des
   nœuds Ethereum publics pour obtenir l'adresse d'un serveur, téléchargeait un
   script et l'exécutait (`eval`, processus `node` détachés). `postcss.config.js`
   est exécuté à **chaque** `npm run build` (en local, Docker et Render).
   - Analyser l'ordinateur de développement (antivirus/EDR), vérifier les
     extensions VS Code installées et les autres dépôts locaux (même motif dans
     `*.config.js`, `global.o=`, `global.i=`, `_$_`).
   - Changer le mot de passe GitHub, révoquer les jetons et clés SSH, vérifier
     les sessions actives et l'historique des pushs.
2. **`.env` retiré du dépôt**, mais il reste dans l'historique Git. **Tous les
   secrets qu'il contenait doivent être renouvelés** : `ADMIN_PASSWORD`,
   `JWT_SECRET`, clés R2, Cloudinary, Google, Resend, `DATABASE_URL`.
   Les nouvelles valeurs se saisissent uniquement dans le tableau de bord de
   l'hébergeur (Render › Environment), jamais dans le code.

## Installation

Prérequis : Node.js 20 ou plus.

```bash
npm ci
cp .env.example .env   # puis remplir les valeurs (ne jamais committer .env)
```

## Commandes

| Commande | Rôle |
| --- | --- |
| `npm run dev` | Site en développement sur http://localhost:8080 |
| `npm start` | Serveur Express (API + site compilé) sur le port `PORT` (5000 par défaut) |
| `npm run build` | Compile le site dans `dist/` |
| `npm run lint` | Vérification ESLint |

En développement, lancer `npm run dev` et `npm start` en parallèle : le site
(port 8080) appelle l'API sur http://localhost:5000.

## Variables d'environnement

Voir `.env.example` (noms uniquement, sans valeurs).

| Variable | Obligatoire | Usage |
| --- | --- | --- |
| `JWT_SECRET` | oui | Signature des sessions admin (longue chaîne aléatoire) |
| `ADMIN_EMAIL` | oui | Identifiant admin |
| `ADMIN_PASSWORD_HASH` ou `ADMIN_PASSWORD` | oui (l'un des deux) | Mot de passe admin ; préférer le hash |
| `CORS_ORIGIN` | oui | URL publique du site, ex. `https://hn-renovation.fr` |
| `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_ACCOUNT_ID`, `R2_BUCKET_NAME`, `R2_PUBLIC_DOMAIN` | oui | Stockage des photos de la galerie |
| `GOOGLE_API_KEY` | non | Route `/api/reviews` |
| `VITE_API_BASE` | non | Adresse de l'API pour `/admin` (vide = même domaine) |
| `CLOUDINARY_*` | non | Uniquement pour le script ponctuel `migrate.ts` |

Générer `ADMIN_PASSWORD_HASH` (remplacer le mot de passe) :

```bash
node -e "const c=require('crypto');const s=c.randomBytes(16);console.log('scrypt:'+s.toString('hex')+':'+c.scryptSync(process.argv[1],s,64).toString('hex'))" 'NouveauMotDePasse'
```

## Déploiement

**Render** (`render.yaml`) : build `npm install && npm run build`, démarrage
`npm run start`. Avant le déploiement, renseigner toutes les variables
obligatoires dans Render › Environment (le fichier `.env` n'est plus dans le
dépôt ; sans elles, le serveur refuse de démarrer et affiche la variable
manquante).

**Docker** : `docker build -t hn-renovation .` puis
`docker run --env-file .env -p 5000:5000 hn-renovation` (`.dockerignore` exclut
`.env` de l'image).

Retour arrière : redéployer la version précédente depuis l'historique des
déploiements Render ; aucune migration de données n'est nécessaire.

## Fonctionnement

- **Demandes de devis** : formulaire `src/components/Contact.tsx` → Formspree
  (seul canal actif, e-mail vers hn.renovation.fr@gmail.com). L'ancienne route
  serveur `/upload` (Resend), inutilisée et non sécurisée, a été supprimée.
- **Galerie** : `/api/public/images/:category` liste les photos R2 ;
  `/admin` permet d'en ajouter (fichier vérifié : JPEG/PNG/WebP, 5 Mo max).
- **SEO** : `src/data/routeMeta.ts` définit titre, description, canonical et
  Open Graph de chaque page. Le serveur les injecte dans le HTML initial
  (visibles sans JavaScript) et `<SeoHead>` les reprend côté navigateur.
- **Mesure d'audience** : Google Analytics n'est chargé qu'après acceptation
  dans le bandeau cookies (lien « Gestion des cookies » en pied de page).
- **Sécurité serveur** : en-têtes CSP/HSTS, limitation des tentatives de
  connexion admin (5 / 15 min / IP), comparaison des identifiants en temps
  constant, erreurs JSON sans détails internes.

## Journal des modifications (audit d'octobre 2026)

- Suppression du code malveillant dans `postcss.config.js` / `eslint.config.js`.
- `.env` retiré du suivi Git, `.env.example`, `.dockerignore`.
- Connexion admin, téléversements, suppression/renommage d'images sécurisés.
- Liens « Contact / Devis » fonctionnels depuis toutes les pages, même quand
  la section n'est pas encore chargée (`src/lib/scroll.ts`).
- Lien d'appel corrigé (`tel:+33602228001`), e-mail du pied de page corrigé,
  bouton « Devis » visible en permanence sur mobile.
- Formulaire : anti double envoi, états envoi/succès/erreur, type de
  prestation, commune, surface, mention de confidentialité.
- Métadonnées uniques par page dans le HTML initial ; suppression des avis
  balisés en dur (JSON-LD) et des listes de mots-clés des pages services.
- Consentement avant Google Analytics.
- `srcset` du hero aligné sur la largeur réelle des images (aucune image
  modifiée).

## Points à valider par le propriétaire

- Renouvellement de tous les secrets (voir plus haut) et analyse du poste.
- `CORS_ORIGIN` et variables R2 bien configurées sur Render avant déploiement.
- Chiffres du hero (50+ projets, 48+ clients, 96 %) et « 5.0 / 5 • 7 avis » :
  à justifier ou retirer ; mention « assurance décennale » : attestation,
  activités couvertes et validité.
- Pages légales à créer avec les informations réelles de l'entreprise :
  mentions légales (raison sociale, SIRET, hébergeur…) et politique de
  confidentialité (durée de conservation des demandes de devis).
- Cartes Google Maps intégrées : elles déposent des cookies Google ; prévoir
  un consentement ou un clic pour afficher la carte.
- Pages ville × prestation (25 URL quasi identiques) : ne conserver que les
  zones réellement desservies, avec du contenu propre à chaque ville.
- Photos de la galerie : uniquement des chantiers réels, avec autorisation.
- Recommandation VS Code `cweijan.dbclient-jdbc` dans `.vscode/extensions.json`
  sans rapport avec le projet : vérifier qu'elle est voulue.
- Dépendances non utilisées par le site (`resend`, `nodemailer`) : peuvent
  être retirées de `package.json`.
