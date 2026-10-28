# Records API

A small TypeScript API in front of the records produced by [html-records](https://github.com/kiman121/html-records). On startup it validates `data/records.json` with Zod and loads SQLite. The same id updates in place.

`GET /records` returns the rows. `GET /records/:id` returns one record.

This is separate from client work. It is the public sample for the application stack on the CV: TypeScript, Express, Zod, and a database behind a REST API.

## Run

```bash
npm install
npm test
npm start
```

The server listens on port 3000. `PORT` overrides it.

Node prints a warning that its built-in SQLite module is still experimental. The tests use that module.
