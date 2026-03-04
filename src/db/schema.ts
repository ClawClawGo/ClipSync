import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  apiKey: text("api_key").notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const clipboardItems = sqliteTable("clipboard_items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  contentType: text("content_type").notNull().default("text"), // text, url, code, image
  title: text("title"),
  tags: text("tags"), // JSON array stored as string
  isPinned: integer("is_pinned", { mode: "boolean" }).notNull().default(false),
  isFavorite: integer("is_favorite", { mode: "boolean" }).notNull().default(false),
  deviceName: text("device_name"),
  deviceType: text("device_type"), // linux, android, web
  syncedAt: integer("synced_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const syncSessions = sqliteTable("sync_sessions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull().references(() => users.id),
  deviceName: text("device_name").notNull(),
  deviceType: text("device_type").notNull(),
  lastSyncAt: integer("last_sync_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});
