# 💰 BudgetTrack

Gestion de budget personnel — dépenses & revenus avec MongoDB, NestJS et React + TanStack Query.

## Stack

| Couche | Technologie |
|--------|-------------|
| Frontend | React 18 · TypeScript · Vite |
| État serveur | **TanStack Query v5** |
| Backend | **NestJS** · TypeScript |
| Base de données | **MongoDB 7** via Mongoose |
| Containerisation | **Docker Compose** |
| Déploiement frontend | **Netlify** |

---

## Structure

```
budgetTracking/
├── backend/
│   ├── src/
│   │   ├── transactions/
│   │   │   ├── dto/            # Validation DTO (class-validator)
│   │   │   ├── schemas/        # Schéma Mongoose
│   │   │   ├── transactions.controller.ts
│   │   │   ├── transactions.module.ts
│   │   │   └── transactions.service.ts
│   │   ├── app.module.ts       # MongooseModule.forRootAsync
│   │   └── main.ts
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/         # Header, Dashboard, Form, List
│   │   ├── hooks/
│   │   │   └── useTransactions.ts  # ← Tous les hooks TanStack Query
│   │   ├── services/
│   │   │   └── api.ts          # Couche HTTP (axios)
│   │   ├── types/              # Interfaces TypeScript
│   │   ├── App.tsx
│   │   └── main.tsx            # QueryClientProvider
│   ├── nginx.conf
│   ├── netlify.toml
│   └── Dockerfile
└── docker-compose.yml          # mongo + backend + frontend
```

---

## Démarrage rapide

### Avec Docker Compose (recommandé)

```bash
cd budgetTracking
docker-compose up --build
```

| Service | URL                       |
|---------|---------------------------|
| Frontend | http://localhost:5000     |
| API | http://localhost:3001/api |
| MongoDB | mongodb://localhost:27017 |

### Sans Docker

```bash
# MongoDB requis localement (port 27017)

# Backend
cd backend && yarn install && yarn start:dev

# Frontend
cd frontend && yarn install && yarn dev
```

---

## Architecture TanStack Query

Les hooks dans `src/hooks/useTransactions.ts` centralisent toute la logique de données :

```ts
// Lecture avec mise en cache automatique
const { data, isLoading, isError } = useTransactions(filters);
const { data: summary } = useSummary();

// Mutations avec invalidation automatique du cache
const createMutation = useCreateTransaction();
const deleteMutation = useDeleteTransaction();

// Après create/delete → queryClient.invalidateQueries(...)
// → les composants Dashboard + TransactionList se rechargent automatiquement
```

---

## API Endpoints

| Méthode | Route | Description |
|---------|-------|-------------|
| `GET` | `/api/transactions` | Liste (filtres: `type`, `currency`) |
| `GET` | `/api/transactions/summary` | Soldes agrégés par devise |
| `POST` | `/api/transactions` | Créer une transaction |
| `DELETE` | `/api/transactions/:id` | Supprimer par ObjectId |

### Body POST

```json
{
  "type": "income",
  "amount": 2500.00,
  "currency": "EUR",
  "description": "Salaire",
  "date": "2026-03-01"
}
```

---

## Déploiement Netlify

1. Push sur GitHub
2. Connecter le repo sur **Netlify → New Site**
3. Base directory : `frontend`, Build command : `yarn build`, Publish : `dist`
4. Variable d'environnement : `VITE_API_URL=https://votre-backend.railway.app/api`

Le `netlify.toml` gère le routing SPA automatiquement.

**Backend** → déployable sur Railway / Render / Fly.io avec le `Dockerfile` fourni + variable `MONGODB_URI`.
