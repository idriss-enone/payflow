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
- **Serveur** — l'API qui authentifie les utilisateurs et exécute
  réellement les opérations financières, sur MySQL.

Les transferts entre utilisateurs restent internes à l'application. Les
opérations qui impliquent un canal externe (recharge, retrait) ou un
fournisseur (facture) sont enregistrées avec le même niveau de rigueur :
transactions atomiques, verrouillage anti-interblocage, idempotence.

## Stack technique

| Couche          | Technologies                                         |
| --------------- | ---------------------------------------------------- |
| Client          | React 18, Vite, Tailwind CSS v4, React Router, Axios |
| Serveur         | Node.js, Express, Zod, bcryptjs, jsonwebtoken        |
| Base de données | MySQL 8                                              |

## Structure du dépôt

```
payflow/
├── client/     Application React — voir client/README.md
├── server/     API Express + MySQL — voir server/README.md
└── package.json
```

`client` et `server` sont deux applications indépendantes, chacune avec ses
propres dépendances et son propre `.env`.

## Démarrage

### Prérequis

- Node.js ≥ 18
- MySQL ≥ 8
- npm ≥ 9

### Installation

```bash
git clone https://github.com/<ton-compte>/payflow.git
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

Renseigne dans `server/.env` tes identifiants MySQL et deux secrets JWT
(`JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`) — n'importe quelle chaîne
longue et aléatoire en développement.

### Base de données

```bash
mysql -u root -p < server/db/schema.sql
```

### Lancer le projet

```bash
npm run dev          # client + serveur en parallèle
npm run dev:client   # client uniquement
npm run dev:server   # serveur uniquement
```

Le client démarre sur `http://localhost:5173`, le serveur sur
`http://localhost:4000`.

## Comptes de test

Aucun compte n'est pré-chargé — crée-en via `/register`. Pour tester un
transfert, crée au moins deux comptes avec des numéros différents (voir
`server/README.md` pour le format attendu).

## Feuille de route

- [x] Authentification complète (connexion, inscription, refresh, i18n,
      accessibilité)
- [x] Solde et historique des transactions
- [x] Transfert entre utilisateurs (verrouillage anti-interblocage,
      idempotence obligatoire)
- [x] Paiement de facture
- [x] Recharge
- [x] Retrait
- [x] Idempotence générique (topup, retrait, facture optionnelle ;
      transfert obligatoire)
- [ ] Console d'agrégation multi-opérateurs (Kessa Switch)
- [ ] Déploiement (Vercel + Railway)

## Licence

Projet personnel à but de démonstration.
