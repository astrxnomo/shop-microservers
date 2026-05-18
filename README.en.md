# shop-microservers

E-commerce application built on a microservices architecture. Features authentication, a product catalog, a shopping cart, and order processing — all orchestrated behind an Nginx gateway.

> Spanish version: [README.md](./README.md).

## Architecture

```
                       ┌─────────────────┐
                       │  Nginx Gateway  │  :80
                       └────────┬────────┘
            ┌───────────┬───────┼─────────┬───────────┐
            │           │       │         │           │
        ┌───▼──┐   ┌────▼───┐   │   ┌─────▼──┐   ┌────▼─────┐
        │ auth │   │catalog │   │   │  cart  │   │  orders  │
        │ 3004 │   │  3001  │   │   │  3002  │   │   3003   │
        └───┬──┘   └────┬───┘   │   └────┬───┘   └────┬─────┘
            │           │       │        │            │
       ┌────▼────┐  ┌───▼────┐  │   ┌────▼────┐  ┌────▼────┐
       │orders_db│  │catalog │  │   │  redis  │  │orders_db│
       └─────────┘  │   db   │  │   └─────────┘  └─────────┘
                    └────────┘  │
                       ┌────────▼────────┐
                       │ frontend (Next) │  :3000
                       └─────────────────┘
```

| Path            | Service  | Internal port | Responsibility                                                    |
| --------------- | -------- | ------------- | ----------------------------------------------------------------- |
| `/api/auth/`    | auth     | 3004          | Registration, login, JWT issuance                                 |
| `/api/catalog/` | catalog  | 3001          | Product listing and stock management                              |
| `/api/cart/`    | cart     | 3002          | Per-user ephemeral cart (Redis, 7-day TTL)                        |
| `/api/orders/`  | orders   | 3003          | Checkout: verify stock → decrement → persist order → clear cart   |
| `/`             | frontend | 3000          | Next.js App Router (SPA, JWT in `localStorage`)                   |

## Stack

-   **Backend:** Node.js + TypeScript, Express, Prisma
-   **Frontend:** Next.js 15, React 19, Tailwind, Radix UI
-   **Databases:** PostgreSQL 16 (catalog and orders), Redis 7 (cart)
-   **Gateway:** Nginx
-   **Orchestration:** Docker Compose

## Requirements

-   Docker and Docker Compose
-   Port 80 free (or set `GATEWAY_PORT` in `.env`)

## Running the stack

```bash
cp .env.example .env
docker compose up --build
```

The app is then available at **http://localhost** (or `http://localhost:${GATEWAY_PORT}`).

To rebuild a single service:

```bash
docker compose up --build <service>   # auth | catalog | cart | orders | frontend
```

To stop and wipe volumes (resets all databases):

```bash
docker compose down -v
```

## Environment variables

| Variable              | Purpose                                                | Default            |
| --------------------- | ------------------------------------------------------ | ------------------ |
| `POSTGRES_USER`       | Shared user for both Postgres instances                | `shop`             |
| `POSTGRES_PASSWORD`   | Shared password for both Postgres instances            | `shop`             |
| `CATALOG_DB_NAME`     | Catalog database name                                  | `catalog`          |
| `ORDERS_DB_NAME`      | Orders database name (shared with auth)                | `orders`           |
| `JWT_SECRET`          | Shared secret for signing/verifying JWTs               | `supersecret`      |
| `GATEWAY_PORT`        | Public gateway port                                    | `80`               |
| `NEXT_PUBLIC_API_URL` | Base URL the frontend uses to call the gateway         | `http://localhost` |

## Developing a single service locally

Each service has its own `package.json`:

```bash
cd services/<service>
npm install
npm run dev           # tsx watch (backend) | next dev (frontend)
npm run build         # compile to dist/ (backend) | next build
npm run db:migrate    # prisma migrate deploy (auth, catalog, orders)
npm run db:generate   # prisma generate
npm run db:seed       # catalog only
```

## Conventions

-   **Response shape:** Every route returns `{ success, data, error }`.
-   **Inter-service communication:** Over the internal `shop` Docker network using service names as hostnames.
-   **The frontend never calls services directly** — everything goes through the gateway.
-   The catalog auto-seeds 12 products on first boot (idempotent).

## Data

-   `catalog_db` — `Product` table.
-   `orders_db` — `User`, `Order`, `OrderItem` tables. Shared by auth and orders, each with its own Prisma schema pointing to the same DB.
-   Redis — carts only, no persistence.

The schema is applied via `prisma db push` in the Dockerfile `CMD` on startup.
