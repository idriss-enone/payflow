# PayFlow — Client

Application web du portefeuille électronique PayFlow. React, Vite et
Tailwind CSS v4 uniquement — aucune bibliothèque de composants tierce.

## Démarrage

```bash
npm install
cp .env.example .env
npm run dev
```

## Fonctionnalités

- Connexion et inscription par numéro de téléphone et code PIN
- Interface bilingue français / anglais
- Validation des formulaires en temps réel
- Interface entièrement accessible au clavier et aux lecteurs d'écran

## Architecture

```
src/
├── features/auth/
│   ├── services/        Appels réseau et session
│   ├── mocks/            Serveur simulé, actif par défaut
│   ├── hooks/             État et logique des formulaires
│   ├── context/          État global d'authentification
│   ├── utils/             Validation
│   ├── layouts/           Mise en page des écrans d'authentification
│   └── views/              Écrans de connexion et d'inscription
├── context/               État de langue partagé (i18n)
├── routes/                 Garde-fous de routage (public / protégé)
└── lib/httpClient.js      Client HTTP unique, intercepteurs
```

Chaque module a une responsabilité unique : la validation ne connaît pas le
réseau, le réseau ne connaît pas l'interface, les vues ne connaissent que
l'état exposé par leurs hooks.

## Basculer vers l'API réelle

```bash
VITE_AUTH_BACKEND=api
VITE_API_BASE_URL=http://localhost:4000/api
```

## Accessibilité

- Libellés associés à chaque champ (`htmlFor` / `id`)
- Erreurs annoncées (`role="alert"`) et reliées au champ concerné
- États `aria-invalid`, `aria-busy` sur les éléments interactifs
- Focus visible et navigation clavier complète