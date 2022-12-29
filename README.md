# TypeORM, TypeGraphQL, Apollo v4 boilerplate

This is a Node.js boilerplate with TypeORM, TypeGraphQL, and Apollo. Uses PostgreSQL, but feel free to swap that for any database. Serves both a GraphQL API and a REST API.

I created this due to the unfortunate lack of GitHub repos with this tech stack. Hopefully this saves you time. This boilerplate is still under construction, I'm still cleaning things up...

This uses Apollo v4 and TypeGraphQL v2 beta. The reason it uses the TypeGraphQL beta is because [v1 doesn't support graphql v16](https://github.com/MichalLytek/type-graphql/issues/1100#issuecomment-1287451179), which screws up error formatting on Apollo v4. Thus if you want to use TypeGraphQL v1, then you'll need to downgrade to Apollo v3 (unless someone knows of a solution)

Note: This is definitely not production ready yet. Right now for example authorization is done on the GraphQL side with cookie sessions stored in Redis, and on the REST API side with JWT tokens. In the process of cleaning things up. For now just see this repo as a reference.

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
