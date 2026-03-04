import { createDatabase } from "@kilocode/app-builder-db";
import * as schema from "./schema";

type DB = ReturnType<typeof createDatabase<typeof schema>>;

let _db: DB | null = null;

function getDb(): DB {
  if (!_db) {
    _db = createDatabase(schema);
  }
  return _db;
}

export const db = new Proxy({} as DB, {
  get(_target, prop: keyof DB) {
    return getDb()[prop];
  },
});
