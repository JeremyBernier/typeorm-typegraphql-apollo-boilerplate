# TypeORM, TypeGraphQL, Apollo boilerplate

This is a Node.js boilerplate with TypeORM, TypeGraphQL, and Apollo. Uses PostgreSQL, but feel free to swap that for any database.

I created this due to the unfortunate lack of GitHub repos with this tech stack. Hopefully this saves you time.

## Instructions

### Populate .env files

Rename `.env.sample` to `.env` and populate file with given environment variables (eg. database credentials)

### Run Postgres database (or can skip and do it yourself)

```
docker-compose up -d
```

You'll need to create a database referenced in your .env file (POSTGRES_DATABASE)

```
docker exec -it postgres psql -U postgres
CREATE DATABASE testdb;
```

### Run Node.js server

```
pnpm install
pnpm dev
```

GraphQL server will be running on http://localhost:4000/graphql
