# PayFlow — Client

Application web du portefeuille électronique PayFlow. React, Vite et
Tailwind CSS v4 — aucune bibliothèque de composants tierce.

## Démarrage

```bash
npm install
cp .env.example .env
npm run dev
```

## Fonctionnalités

- Connexion et inscription par numéro de téléphone et code PIN
- Interface bilingue français / anglais
- Tableau de bord : solde, activité récente
- Envoyer de l'argent, payer une facture, recharger, retirer
- Historique complet avec filtre par type d'opération
- Interface accessible au clavier et aux lecteurs d'écran

## Architecture

```
src/
├── features/
│   ├── auth/
│   │   ├── services/        auth.service.js, session.service.js
│   │   ├── hooks/            useAuth, useLoginForm, useRegisterForm
│   │   ├── context/          AuthProvider
│   │   ├── utils/             validators.js
│   │   ├── layouts/           AuthLayout
│   │   └── views/              LoginView, RegisterView
│   └── wallet/
│       ├── services/         wallet.service.js
│       ├── hooks/             useWallet, useTransferForm, useBillPaymentForm,
│       │                      useTopUpForm, useWithdrawalForm
│       ├── context/           WalletProvider
│       ├── utils/              validators.js, format.js
│       ├── components/         TransactionRow, StatusBadge,
│       │                       TransactionDetailModal, RadioOption
│       └── views/               DashboardHome, TransferView, BillPaymentView,
│                                 TopUpView, WithdrawalView, HistoryView
├── context/                    LanguageProvider (i18n partagé, FR/EN)
├── routes/                     PublicRoute, ProtectedRoute, AppRoutes
├── layouts/                    MainLayout, Sidebar, Navbar
├── lib/
│   ├── httpClient.js           Client axios unique, intercepteurs
│   └── serverErrorCodes.js     Correspondance code serveur → clé i18n
└── config/i18n/                fr.json, en.json
```

Chaque module a une responsabilité unique : la validation ne connaît pas
le réseau, le réseau ne connaît pas l'interface, les vues ne connaissent
que l'état exposé par leurs hooks.

## Authentification et session

Le token d'accès expire au bout de 15 minutes ; `httpClient.js` le
rafraîchit automatiquement en arrière-plan via `/auth/refresh` — aucune
déconnexion visible tant que le refresh token (7 jours) reste valide.

## Gestion des erreurs serveur

Le serveur renvoie `{ message, code }`. `src/lib/serverErrorCodes.js`
associe chaque `code` connu à une clé de traduction locale ; un code
inconnu retombe sur le message anglais brut du serveur plutôt que de
planter.

## Accessibilité

- Libellés associés à chaque champ (`htmlFor` / `id`)
- Erreurs annoncées (`role="alert"`) et reliées au champ concerné
- États `aria-invalid`, `aria-busy` sur les éléments interactifs
- Focus visible et navigation clavier complète
- Sidebar mobile : fermeture au clavier (Échap), focus déplacé à
  l'ouverture
