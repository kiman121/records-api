import { mkdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createApp } from "./app.ts";
import { loadRecords, openDatabase } from "./db.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const records = JSON.parse(readFileSync(path.join(root, "data", "records.json"), "utf8"));
const outputDir = path.join(root, "output");
mkdirSync(outputDir, { recursive: true });
const db = openDatabase(path.join(outputDir, "records.db"));
loadRecords(db, records);

const port = Number(process.env.PORT || 3000);
createApp(db).listen(port, () => {
  console.log(`Records API listening on ${port}`);
});
