# PayFlow — Server

API REST de PayFlow, sur MySQL. Authentification complète (JWT + refresh
tokens révocables) et quatre opérations financières fonctionnelles
(transfert, facture, recharge, retrait), avec idempotence générique.

## Démarrage

```bash
npm install
cp .env.example .env
mysql -u root -p < db/schema.sql
npm run dev
```

Le serveur écoute par défaut sur `http://localhost:4000`.

## Architecture

```
src/
├── index.js                     Point d'entrée, montage des routes
├── config/db.js                 Pool de connexions MySQL
├── constants/
│   └── transaction.constants.js TX_KIND, TX_DIRECTION, TX_STATUS
├── validators/                  Schémas zod (auth, wallet)
├── repositories/                Un fichier par table, aucune logique métier
│   ├── user.repository.js
│   ├── wallet.repository.js
│   ├── refreshToken.repository.js
│   ├── transaction.repository.js
│   ├── topup.repository.js
│   ├── withdrawal.repository.js
│   ├── billPayment.repository.js
│   ├── transfer.repository.js
│   └── idempotency.repository.js
├── services/                    Logique métier, orchestre les repositories
│   ├── auth.service.js
│   ├── wallet.service.js
│   └── transfer.service.js
├── controllers/                 Traduisent HTTP ↔ service
├── middlewares/                 authenticate, asyncHandler, errorHandler
└── utils/                       jwt.js, hash.js, errors.js (AppError)
```

Circulation stricte : **route → contrôleur → service → repository → MySQL**.
Un repository ne parle qu'à une seule table ; un service orchestre
plusieurs repositories et porte toute la logique métier ; un contrôleur
ne fait que traduire HTTP ↔ service.

## Routes

| Méthode | Route                      | Auth    | Idempotence     |
| ------- | -------------------------- | ------- | --------------- |
| POST    | `/api/auth/register`       | —       | —               |
| POST    | `/api/auth/login`          | —       | —               |
| POST    | `/api/auth/refresh`        | —       | —               |
| POST    | `/api/auth/logout`         | —       | —               |
| GET     | `/api/auth/me`             | requise | —               |
| GET     | `/api/wallet/balance`      | requise | —               |
| GET     | `/api/wallet/transactions` | requise | —               |
| GET     | `/api/wallet/summary`      | requise | —               |
| POST    | `/api/wallet/transfer`     | requise | **obligatoire** |
| POST    | `/api/wallet/bill-payment` | requise | optionnelle     |
| POST    | `/api/wallet/topup`        | requise | optionnelle     |
| POST    | `/api/wallet/withdrawal`   | requise | optionnelle     |

L'idempotence se déclare via l'en-tête `Idempotency-Key` (n'importe quelle
chaîne unique, un UUID en pratique). Absente sur `/transfer`, la requête
est rejetée (`400`, code `IDEMPOTENCY_KEY_REQUIRED`).

## Format des numéros de téléphone

Camerounais uniquement : commence par `2` ou `6`, 9 chiffres, avec ou sans
préfixe `+237`/`00237`. Toujours normalisé en stockage vers la forme
locale à 9 chiffres (`670000001`), quel que soit le format saisi.

## Modèle de données

```
users ──1:1── wallets ──1:N── transactions ──1:1── topups
                                            ├──1:1── withdrawals
                                            ├──1:1── bill_payments
                                            └──N:1── transfers
```

`transactions` est le registre générique (`kind`, `direction`, `amount`,
`reference`) partagé par toutes les opérations. Chaque type a sa propre
table de détail, liée par `transaction_id`. `transfers` relie les deux
écritures qu'il produit (`DEBIT` chez l'expéditeur, `CREDIT` chez le
destinataire).

`idempotency_keys` stocke la réponse JSON exacte d'une opération réussie,
indexée par `(user_id, idempotency_key)`. Une requête répétée avec la même
clé reçoit cette réponse telle quelle, sans rejouer l'opération.

## Erreurs

Chaque erreur renvoie `{ message, code }`. `message` est un texte anglais
lisible, indépendant de tout client. `code` est une chaîne stable
(`INSUFFICIENT_FUNDS`, `RECEIVER_NOT_FOUND`, ...) destinée aux clients qui
veulent traduire sans dépendre du texte exact du serveur.

## Sécurité

- PIN haché avec bcryptjs (12 rounds), jamais stocké ni renvoyé en clair
- Refresh tokens hachés en SHA-256 avant stockage, révocables
  individuellement, rotation à chaque rafraîchissement
- `req.user.id` (posé par le middleware `authenticate`, dérivé du JWT) est
  la seule source d'identité pour toute opération — jamais un champ envoyé
  par le client
- `SELECT ... FOR UPDATE` sur les lignes de portefeuille concernées,
  toujours verrouillées dans un ordre fixe (triées par id) pour éviter les
  interblocages entre opérations concurrentes
