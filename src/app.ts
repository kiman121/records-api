import express from "express";
import type { DatabaseSync } from "node:sqlite";
import { getRecord, listRecords } from "./db.ts";

export function createApp(db: DatabaseSync) {
  const app = express();
  app.get("/health", (_req, res) => {
    res.json({ ok: true });
  });
  app.get("/records", (_req, res) => {
    res.json(listRecords(db));
  });
  app.get("/records/:id", (req, res) => {
    const record = getRecord(db, req.params.id);
    if (!record) {
      res.status(404).json({ error: "Record not found" });
      return;
    }
    res.json(record);
  });
  return app;
}
