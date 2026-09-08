# Northwind Backend

REST API for the Northwind Admin App. Built with NestJS and TypeORM, backed by the classic Northwind PostgreSQL database.

## Tech Stack

- **NestJS** — application framework
- **TypeORM** — ORM / database access
- **PostgreSQL** — database (Northwind)
- **ConfigModule** — environment configuration via `.env`

## Features

- Server-side pagination, search, and sorting for customer data
- Repository-pattern data access with TypeORM entities and query builder
- Environment-based configuration (no secrets in code)

## Project setup

```bash
$ npm install
```

## Environment configuration

Create a `.env` file in the project root:

```
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=Northwind
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/customers` | Get customers with paging, search, sorting |

### Query parameters

| Param | Type | Description |
|-------|------|-------------|
| `page` | number | Page number (default 1) |
| `pageSize` | number | Rows per page (default 10) |
| `search` | string | Filter by company/contact name |
| `sortBy` | string | Column to sort by |
| `sortOrder` | `asc` \| `desc` | Sort direction |

### Example response

```json
{
  "data": [
    {
      "customerId": "BERGS",
      "companyName": "Berglunds snabbköp",
      "contactName": "Christina Berglund",
      "city": "Luleå",
      "country": "Sweden"
    }
  ],
  "total": 91,
  "totalPages": 10,
  "page": 1,
  "pageSize": 10
}
```

## Project structure

```
src/
├── customers/          # Customer module
│   ├── customer.entity.ts
│   ├── customer.service.ts
│   ├── customer.controller.ts
│   └── customers.module.ts
└── app.module.ts       # Root module, DB config
```

## License

MIT