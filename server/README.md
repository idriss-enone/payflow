# PayFlow — Server

API REST de PayFlow. Squelette Express : les routes sont en place et
respectent le contrat d'API attendu par le client ; l'implémentation
métier (base de données, hachage, jetons) reste à réaliser.

## Démarrage

```bash
npm install
cp .env.example .env
npm run dev
```

Le serveur écoute par défaut sur `http://localhost:4000`.

## Routes

| Méthode | Route                | Description                   | État        |
| ------- | -------------------- | ----------------------------- | ----------- |
| GET     | `/api/health`        | Vérification de disponibilité | Implémentée |
| POST    | `/api/auth/login`    | Connexion                     | En attente  |
| POST    | `/api/auth/register` | Inscription                   | En attente  |
| POST    | `/api/auth/logout`   | Déconnexion                   | En attente  |

### Contrat d'API

```
POST /auth/login
  Body    { phone, pin }
  200     { user, accessToken, refreshToken }
  401     { message }

POST /auth/register
  Body    { name, phone, pin }
  201     { user, accessToken, refreshToken }
  409     { message }

POST /auth/logout
  204
```

## Structure

```
src/
├── index.js               Point d'entrée, middlewares, montage des routes
├── routes/                 Déclaration des routes
├── controllers/            Logique de chaque route
├── middlewares/            Gestion des erreurs
└── config/                 Connexion à la base de données (à venir)
```
