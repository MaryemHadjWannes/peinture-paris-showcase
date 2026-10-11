# HN Rénovation – site vitrine

Site de HN Rénovation, artisan peintre à Cambrai : React + Vite + Tailwind côté
navigateur, serveur Express (`server.ts`) qui sert le site, l'API de la galerie
(photos sur Cloudflare R2) et l'espace `/admin`.

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

La liste complète (sans valeurs) est dans `.env.example`. En production, les
valeurs se saisissent dans le tableau de bord de l'hébergeur, jamais dans le
dépôt.

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
`npm run start`. Les variables obligatoires se renseignent dans
Render › Environment ; s'il en manque une, le serveur refuse de démarrer et
indique laquelle.

**Docker** : `docker build -t hn-renovation .` puis
`docker run --env-file .env -p 5000:5000 hn-renovation`.

Retour arrière : redéployer la version précédente depuis l'historique des
déploiements Render ; aucune migration de données n'est nécessaire.

## Fonctionnement

- **Demandes de devis** : formulaire `src/components/Contact.tsx` → Formspree
  (e-mail vers l'adresse de l'entreprise).
- **Galerie** : `/api/public/images/:category` liste les photos ; `/admin`
  permet d'en ajouter (JPEG, PNG ou WebP, 5 Mo maximum).
- **SEO** : `src/data/routeMeta.ts` définit le titre, la description, l'URL
  canonique et l'aperçu de partage de chaque page. Le serveur les place dans le
  HTML initial et `<SeoHead>` les reprend côté navigateur. Après l'ajout d'une
  page, mettre à jour `public/sitemap.xml` et `public/llms.txt`.
- **Mesure d'audience** : Google Analytics n'est chargé qu'après acceptation
  dans le bandeau cookies (lien « Gestion des cookies » en pied de page).
