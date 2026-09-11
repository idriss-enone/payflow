# PayFlow

Portefeuille électronique avec transferts entre utilisateurs, recharge,
retrait et paiement de factures, connecté à un agrégateur de paiements
multi-opérateurs (mobile money) inspiré du modèle Maviance/Smobilpay.

## Aperçu

PayFlow illustre une architecture de paiement à deux niveaux, courante dans
le secteur fintech en Afrique centrale et de l'Ouest :

- **Client** — l'application que l'utilisateur final utilise : gestion du
  solde, transferts entre utilisateurs, recharge, retrait, paiement de
  factures.
- **Serveur** — l'API qui traite les demandes d'authentification et, à
  terme, les opérations financières.

Les transferts entre utilisateurs restent internes à l'application. Les
opérations qui impliquent un opérateur mobile money externe (recharge,
retrait, facture) transitent par une couche d'agrégation dédiée.

## Stack technique

| Couche          | Technologies                                         |
| --------------- | ---------------------------------------------------- |
| Client          | React 18, Vite, Tailwind CSS v4, React Router, Axios |
| Serveur         | Node.js, Express                                     |
| Base de données | PostgreSQL _(à venir)_                               |

## Structure du dépôt

```
payflow/
├── client/     Application React — voir client/README.md
├── server/     API Express — voir server/README.md
└── package.json
```

`client` et `server` sont deux applications indépendantes, chacune avec ses
propres dépendances. Le dépôt les regroupe pour faciliter le développement
local et le versionnage conjoint.

## Démarrage

### Prérequis

- Node.js ≥ 19
- npm ≥ 9

### Installation

```bash
git clone https://github.com/idriss-enone/payflow.git
cd payflow

npm install
npm install --prefix client
npm install --prefix server
```

### Configuration

```bash
cp client/.env.example client/.env
cp server/.env.example server/.env
```

### Lancer le projet

```bash
npm run dev
npm run dev:client
npm run dev:server
```

Le client démarre sur `http://localhost:5173`, le serveur sur
`http://localhost:4000`.

## Architecture de l'authentification

Le client fonctionne de façon autonome grâce à un serveur simulé
(`axios-mock-adapter`) qui reproduit fidèlement le contrat d'API réel.
Cela permet de développer et de démontrer l'interface sans dépendance à un
backend déployé.

Pour brancher le serveur réel, dans `client/.env` :

```bash
VITE_AUTH_BACKEND=api
VITE_API_BASE_URL=http://localhost:4000/api
```

Aucune autre modification n'est nécessaire côté client : services, hooks et
vues ne connaissent que le contrat d'API, jamais son implémentation.

## Feuille de route

- [x] Authentification (connexion, inscription, i18n FR/EN, accessibilité)
- [x] Client HTTP avec bascule mock / API réelle
- [x] Squelette de l'API (routes, structure)
- [ ] Persistance PostgreSQL
- [ ] Authentification serveur (hachage du PIN, JWT)
- [ ] Tableau de bord (transferts, factures, recharge, retrait, historique)
- [ ] Console d'agrégation multi-opérateurs

## Licence

Projet personnel à but de démonstration.
