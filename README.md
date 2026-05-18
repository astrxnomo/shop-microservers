# shop-microservers

Aplicación de e-commerce construida con arquitectura de microservicios. Cuenta con autenticación, catálogo de productos, carrito de compras y procesamiento de órdenes, todo orquestado tras un gateway Nginx.

> Para la versión en inglés, ver [README.en.md](./README.en.md).

## Arquitectura

```
                       ┌─────────────────┐
                       │   Gateway Nginx │  :80
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

| Ruta            | Servicio | Puerto interno | Responsabilidad                                                            |
| --------------- | -------- | -------------- | -------------------------------------------------------------------------- |
| `/api/auth/`    | auth     | 3004           | Registro, login, emisión de JWT                                            |
| `/api/catalog/` | catalog  | 3001           | Listado de productos y manejo de stock                                     |
| `/api/cart/`    | cart     | 3002           | Carrito efímero por usuario (Redis, TTL 7 días)                            |
| `/api/orders/`  | orders   | 3003           | Checkout: valida stock → decrementa → persiste orden → limpia carrito      |
| `/`             | frontend | 3000           | Next.js App Router (SPA, JWT en `localStorage`)                            |

## Stack

-   **Backend:** Node.js + TypeScript, Express, Prisma
-   **Frontend:** Next.js 15, React 19, Tailwind, Radix UI
-   **Bases de datos:** PostgreSQL 16 (catalog y orders), Redis 7 (carrito)
-   **Gateway:** Nginx
-   **Orquestación:** Docker Compose

## Requisitos

-   Docker y Docker Compose
-   Puerto 80 libre (o configurar `GATEWAY_PORT` en `.env`)

## Levantar el proyecto

```bash
cp .env.example .env
docker compose up --build
```

La app queda disponible en **http://localhost** (o `http://localhost:${GATEWAY_PORT}`).

Para reconstruir un solo servicio:

```bash
docker compose up --build <servicio>   # auth | catalog | cart | orders | frontend
```

Para apagar y borrar volúmenes (reinicia las bases de datos):

```bash
docker compose down -v
```

## Variables de entorno

| Variable              | Descripción                                            | Default          |
| --------------------- | ------------------------------------------------------ | ---------------- |
| `POSTGRES_USER`       | Usuario compartido de los Postgres                     | `shop`           |
| `POSTGRES_PASSWORD`   | Contraseña compartida de los Postgres                  | `shop`           |
| `CATALOG_DB_NAME`     | Nombre de la base del catálogo                         | `catalog`        |
| `ORDERS_DB_NAME`      | Nombre de la base de órdenes (compartida con auth)     | `orders`         |
| `JWT_SECRET`          | Secreto para firmar/verificar JWT (compartido)         | `supersecret`    |
| `GATEWAY_PORT`        | Puerto público del gateway                             | `80`             |
| `NEXT_PUBLIC_API_URL` | URL base que usa el frontend para llamar al gateway    | `http://localhost` |

## Desarrollo local de un servicio

Cada servicio tiene su propio `package.json`:

```bash
cd services/<servicio>
npm install
npm run dev           # tsx watch (backend) | next dev (frontend)
npm run build         # compila a dist/ (backend) | next build
npm run db:migrate    # prisma migrate deploy (auth, catalog, orders)
npm run db:generate   # prisma generate
npm run db:seed       # solo en catalog
```

## Convenciones

-   **Forma de respuesta:** Todas las rutas devuelven `{ success, data, error }`.
-   **Comunicación entre servicios:** Por la red interna `shop` usando los nombres de servicio como hostname.
-   **El frontend nunca llama directo a los servicios** — todo pasa por el gateway.
-   El catálogo se autopobla con 12 productos al primer arranque (idempotente).

## Datos

-   `catalog_db` — tabla `Product`.
-   `orders_db` — tablas `User`, `Order`, `OrderItem`. Compartida por auth y orders, cada uno con su propio schema de Prisma apuntando a la misma DB.
-   Redis — solo carritos, sin persistencia.

El schema se aplica con `prisma db push` en el `CMD` del Dockerfile al arrancar.
