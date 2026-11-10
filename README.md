# HN Rénovation — site vitrine et galerie

Site en français de **HN Rénovation**, entreprise de peinture et rénovation basée à Cambrai : [hn-renovation.fr](https://hn-renovation.fr).

Le nom historique du dépôt ne correspond pas à la zone commerciale : le site cible Cambrai, Douai, Valenciennes, Arras et Caudry, pas Paris.

## Architecture

- **Interface** : React 18, TypeScript, Vite, Tailwind CSS, composants Radix et React Router.
- **Serveur** : Express dans `server.ts`, qui sert `dist/`, injecte les métadonnées propres à chaque URL et expose les API.
- **Photos** : Cloudflare R2 ; gestion protégée par authentification JWT dans `/admin`.
- **Devis** : formulaire envoyé directement à Formspree. Les photos sont transmises ensuite par e-mail, pas par ce formulaire.
- **Avis affichés** : fichier éditorial `public/data/google-reviews.json`. La route Google Places `/api/reviews` est distincte et n'alimente pas les composants actuels.
- **Audience** : Google Analytics après accord dans le bandeau cookies.

## Installation et développement

Prérequis : Node.js 20+ et npm. Le verrou de référence est `package-lock.json` ; utiliser npm de manière cohérente.

```bash
npm ci
cp .env.example .env
```

Renseigner `.env`, puis lancer dans deux terminaux :

```bash
npm start           # Express et API : http://localhost:5000
npm run dev         # Interface Vite : http://localhost:8080
```

Le serveur cherche aussi `dist/index.html` pour les pages publiques : exécuter `npm run build` avant de les visiter sur le port 5000. `npm run dev` et `npm run preview` servent l'interface sans les injections SEO ni les statuts/redirects Express ; ils ne remplacent pas le serveur de production.

| Commande | Usage |
| --- | --- |
| `npm run dev` | Interface avec rechargement automatique |
| `npm run build` | Compilation de l'interface dans `dist/` |
| `npm start` | Serveur Express et API |
| `npm run preview` | Aperçu Vite du bundle, sans API |
| `npm run typecheck` | Vérification TypeScript de l'interface et de la configuration Vite |
| `npm run lint` | Analyse ESLint |
| `npm run check:seo` | Couverture du sitemap, métadonnées, images de partage et liens du fil d'Ariane |
| `npm run check:server` | Après build : tests HTTP locaux des pages, redirections et erreurs ; port 5099 libre requis |

Les tests serveur utilisent des identifiants fictifs, sans appel R2/Google ni envoi du formulaire.

## Configuration

Ne jamais committer `.env` ou exposer un secret dans une variable `VITE_*` : celles-ci sont intégrées au JavaScript public lors du build.

| Variable | Nécessité | Usage |
| --- | --- | --- |
| `JWT_SECRET` | Obligatoire | Signature des sessions admin ; valeur longue et aléatoire |
| `ADMIN_EMAIL` | Obligatoire | Identifiant admin |
| `ADMIN_PASSWORD_HASH` ou `ADMIN_PASSWORD` | L'un des deux | Préférer le hash scrypt ; il a priorité si les deux sont définis |
| `CORS_ORIGIN` | Obligatoire | Origine publique autorisée, sans slash final |
| `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME` | Obligatoires | Stockage R2 |
| `R2_PUBLIC_DOMAIN` | Obligatoire | Origine publique des images, sans slash final |
| `PORT` | Facultatif | Port Express, 5000 par défaut |
| `VITE_API_BASE` | Facultatif, au build | API de la galerie et de l'admin ; localhost:5000 en développement, même origine en production par défaut |
| `GOOGLE_API_KEY` | Facultatif | Route `/api/reviews`, distincte des avis statiques affichés |
| `CLOUDINARY_*` | Migration uniquement | Script ponctuel `migrate.ts` |

Pour créer `ADMIN_PASSWORD_HASH` sans mettre le mot de passe dans l'historique de commandes, utiliser un terminal Bash :

```bash
read -rsp 'Mot de passe admin : ' HN_ADMIN_PASSWORD; echo
printf '%s' "$HN_ADMIN_PASSWORD" | node -e "const c=require('node:crypto');let p='';process.stdin.setEncoding('utf8');process.stdin.on('data',v=>p+=v);process.stdin.on('end',()=>{const s=c.randomBytes(16);console.log('scrypt:'+s.toString('hex')+':'+c.scryptSync(p,s,64).toString('hex'))})"
unset HN_ADMIN_PASSWORD
```

Conserver le résultat dans `ADMIN_PASSWORD_HASH`, puis retirer `ADMIN_PASSWORD`.

## Déploiement

L'hébergement doit exécuter **Express** pour conserver les métadonnées initiales et les véritables réponses 301/404. Déployer uniquement `dist/` avec un fallback SPA ne reproduit pas ce comportement.

**Render** : configurer les variables dans Environment ; build `npm ci && npm run build`, démarrage `npm start`. Le fichier `render.yaml` actuel utilise `npm install` et contient d'anciennes variables e-mail : vérifier sa configuration avant de créer un nouveau service. Les variables requises de `.env.example` restent à renseigner. Le serveur s'arrête au démarrage si elles manquent. Le service existant suit `main` avec déploiement automatique.

**Docker** :

```bash
docker build -t hn-renovation .
docker run --env-file .env -p 5000:5000 hn-renovation
```

Le Dockerfile actuel installe également les outils de développement nécessaires au démarrage via `tsx`. Retour arrière : redéployer une version précédente chez l'hébergeur. Les photos sont conservées sur R2 indépendamment du code.

## Pages et référencement

| Type | URLs |
| --- | --- |
| Pages générales | `/`, `/realisations`, `/avis` |
| Villes | `/douai-59500`, `/valenciennes-59300`, `/arras-62000`, `/caudry-59540` |
| Services | `/{service}/{ville}` : 5 services × 5 villes = 25 pages |
| Cambrai | Accueil `/` ; `/cambrai-59400` redirige vers `/` |
| Administration | `/admin`, exclue de l'indexation |

Services : `enduit`, `peinture-interieure`, `peinture-exterieure`, `platrerie`, `artisan-peintre`.

Les raccourcis `/{service}` redirigent vers le service à Cambrai. Les anciennes URLs `/ville/{ville}/{service}` sont redirigées uniquement si la ville et le service existent.

Sources à maintenir :

1. `src/data/seo.ts` : villes et services.
2. `src/data/routeMeta.ts` : titres, descriptions, canonicals, aperçus et fils d'Ariane, partagés entre Express et React.
3. `src/pages/CityServicePage.tsx` et les contenus de `src/pages/services/` : rendu des prestations.
4. `public/sitemap.xml` : uniquement les 32 URLs canoniques publiques actuelles ; mettre `lastmod` à jour lorsqu'une page change réellement.
5. `public/llms.txt` : résumé éditorial facultatif, qui ne remplace ni le sitemap ni le contenu du site.
6. `index.html` : données structurées de l'entreprise, coordonnées et zones desservies.

Après ajout d'une ville, compléter ces sources, les contenus locaux et les liens internes, puis exécuter `npm run check:seo`. Ajouter une ville doit correspondre à une intervention réelle et apporter des informations utiles propres à cette zone. Les communes listées dans `nearby` sont actuellement du texte et ne créent aucune page.

Le serveur injecte les **métadonnées**, pas le rendu React complet : ce projet n'est pas une application SSR. Les sections de texte, services, FAQ et contact se montent sans attendre un scroll ; les médias restent différés.

## Vérification avant livraison

```bash
npm run check:seo
npm run typecheck
npm run build
npm run check:server
npm audit
```

Compléter par une vérification navigateur sur mobile et ordinateur : menu, devis, formulaire, galerie et refus/acceptation des cookies. Les tests automatisés ne confirment pas la réception des e-mails Formspree ou les accès R2 de production.

Voir [l'audit du 10 novembre 2026](docs/AUDIT-2026-11-10.md) pour les améliorations, priorités et limites de vérification.
