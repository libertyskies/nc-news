# Northcoders News API

Northcoders News is an API for interacting with a news database with queries.

This is the backend of a project from Northcoders' software engineering bootcamp.

## Hosted Version

https://nc-news-l5et.onrender.com

## Cloning

Clone this github url from the terminal

```bash
git clone https://github.com/libertyskies/nc-news.git
npm install
```

## Databases

To connect the databases, create a .env.development file and a .env.test file linking to the two separate databases.

Create two environment variables inside these files with assignment of PGDATABASE to the database names.

## Seeding the data

To seed the local database, run the following command:

```bash
npm run setup-dbs
npm run seed
```

## Running tests

Using jest and supertest, the tests can be run with the following command:

```bash
npm t
```

## Node.js and Postgres

minimum node v10.13
minimum Postgres 9.4.0
