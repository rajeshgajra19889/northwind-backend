# Northwind Backend

[![CI](https://github.com/rajeshgajra19889/northwind-backend/actions/workflows/ci.yml/badge.svg)](https://github.com/rajeshgajra19889/northwind-backend/actions/workflows/ci.yml)
[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=flat-square&logo=nestjs&logoColor=white)](https://nestjs.com)
[![TypeORM](https://img.shields.io/badge/TypeORM-262627?style=flat-square&logo=typeorm&logoColor=white)](https://typeorm.io)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org)
[![Node.js](https://img.shields.io/badge/Node.js-5FA04E?style=flat-square&logo=nodedotjs&logoColor=white)](https://nodejs.org)

NestJS + TypeORM REST API for the Northwind admin app. Sits on a PostgreSQL copy of the Northwind sample database.

## Live API

https://northwind-backend-ykt7.onrender.com/suppliers

## Setup

```bash
npm install
```

Create a `.env` file:

```
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=Northwind
```

## Run

```bash
npm run start:dev
```

Runs on http://localhost:3000

## Notes

- The Northwind tables don't auto-increment their ids, so create endpoints pick `MAX(id)+1`.
- Almost every list endpoint supports `?page=&pageSize=&search=&sortBy=&sortOrder=` and returns `{ data, total, totalPages, page, pageSize }`.
- Deletes on rows that are referenced by other tables are blocked with a clear error.

## Endpoints

- `/customers`, `/products`, `/categories`, `/suppliers`, `/orders`, `/order-details`, `/employees`, `/territories`, `/regions`, `/shippers`
- `/dashboard` returns stats, monthly sales, order status, recent orders and top products for the dashboard page
- Extra routes: `/employees/:id/territories` (assign/unassign territories to an employee), `/orders?employeeId=&customerId=`, `/products?supplierId=`