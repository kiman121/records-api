import { DatabaseSync } from "node:sqlite";
import { recordSchema, type RecordRow } from "./schema.ts";

export function openDatabase(path = ":memory:") {
  const db = new DatabaseSync(path);
  db.exec(`
    CREATE TABLE IF NOT EXISTS records (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      published TEXT NOT NULL,
      summary TEXT NOT NULL,
      source_url TEXT NOT NULL
    )
  `);
  return db;
}

export function loadRecords(db: DatabaseSync, records: unknown[]) {
  const insert = db.prepare(`
    INSERT INTO records (id, title, published, summary, source_url)
    VALUES (?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      title = excluded.title,
      published = excluded.published,
      summary = excluded.summary,
      source_url = excluded.source_url
  `);
  const parsed = records.map((record) => recordSchema.parse(record));
  for (const record of parsed) {
    insert.run(record.id, record.title, record.published, record.summary, record.source_url);
  }
  return parsed.length;
}

export function listRecords(db: DatabaseSync): RecordRow[] {
  return db.prepare("SELECT id, title, published, summary, source_url FROM records ORDER BY id").all() as RecordRow[];
}

export function getRecord(db: DatabaseSync, id: string): RecordRow | undefined {
  return db.prepare("SELECT id, title, published, summary, source_url FROM records WHERE id = ?").get(id) as RecordRow | undefined;
}
