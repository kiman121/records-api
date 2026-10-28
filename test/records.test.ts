import assert from "node:assert/strict";
import test from "node:test";
import { createApp } from "../src/app.ts";
import { listRecords, loadRecords, openDatabase } from "../src/db.ts";

const sample = [
  {
    id: "alpha",
    title: "Alpha notice",
    published: "2026-10-01",
    summary: "Library reading room closes early on Friday.",
    source_url: "fixtures/records/alpha.html",
  },
  {
    id: "beta",
    title: "Beta notice",
    published: "2026-10-15",
    summary: "Water rate for the quarter stays at the published figure.",
    source_url: "fixtures/records/beta.html",
  },
];

test("loading the same records twice keeps one row per id", () => {
  const db = openDatabase();
  loadRecords(db, sample);
  loadRecords(db, [{ ...sample[0], title: "Alpha notice revised" }, sample[1]]);
  const rows = listRecords(db);
  assert.equal(rows.length, 2);
  assert.equal(rows[0].title, "Alpha notice revised");
});

test("GET /records/:id returns the record and 404 for a miss", async () => {
  const db = openDatabase();
  loadRecords(db, sample);
  const server = createApp(db).listen(0);
  const address = server.address();
  if (!address || typeof address === "string") {
    throw new Error("Expected a TCP port");
  }
  try {
    const found = await fetch(`http://127.0.0.1:${address.port}/records/alpha`);
    assert.equal(found.status, 200);
    const body = await found.json();
    assert.equal(body.id, "alpha");

    const missing = await fetch(`http://127.0.0.1:${address.port}/records/missing`);
    assert.equal(missing.status, 404);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});
