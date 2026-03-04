# Active Context: ClipSync — Clipboard Manager App

## Current State

**App Status**: ✅ ClipSync clipboard manager app built and deployed

ClipSync is a cross-platform clipboard manager with cloud sync for Linux and Android. Users can manage their clipboard history via a web dashboard and sync from Linux/Android using a REST API with API key authentication.

## Recently Completed

- [x] Base Next.js 16 setup with App Router
- [x] TypeScript configuration with strict mode
- [x] Tailwind CSS 4 integration
- [x] ESLint configuration
- [x] Memory bank documentation
- [x] Recipe system for common features
- [x] **ClipSync app**: Full clipboard manager with cloud sync
  - Database: Drizzle ORM + SQLite (users, clipboard_items, sync_sessions tables)
  - Auth: Email/password registration + login, API key auth for devices
  - API routes: CRUD for clipboard items, bulk sync endpoint
  - Dashboard UI: Search, filter, pin, favorite, copy, delete items
  - Settings tab: API key display, Linux/Android integration guides
  - Landing page: Feature showcase + API preview
  - Docs page: Full REST API documentation
  - Responsive design for mobile/Android web view

## Current Structure

| File/Directory | Purpose | Status |
|----------------|---------|--------|
| `src/app/page.tsx` | Landing page | ✅ Ready |
| `src/app/layout.tsx` | Root layout | ✅ Ready |
| `src/app/login/page.tsx` | Login page | ✅ Ready |
| `src/app/register/page.tsx` | Register page | ✅ Ready |
| `src/app/dashboard/page.tsx` | Dashboard (server) | ✅ Ready |
| `src/app/docs/page.tsx` | API docs page | ✅ Ready |
| `src/app/api/auth/login/route.ts` | Login API | ✅ Ready |
| `src/app/api/auth/register/route.ts` | Register API | ✅ Ready |
| `src/app/api/auth/logout/route.ts` | Logout API | ✅ Ready |
| `src/app/api/clipboard/route.ts` | Clipboard CRUD | ✅ Ready |
| `src/app/api/clipboard/[id]/route.ts` | Single item ops | ✅ Ready |
| `src/app/api/sync/route.ts` | Bulk sync API | ✅ Ready |
| `src/components/ClipboardDashboard.tsx` | Main dashboard UI | ✅ Ready |
| `src/db/schema.ts` | DB schema | ✅ Ready |
| `src/db/index.ts` | DB client | ✅ Ready |
| `src/lib/auth.ts` | Auth utilities | ✅ Ready |
| `src/lib/utils.ts` | Helper utilities | ✅ Ready |
| `.kilocode/` | AI context & recipes | ✅ Ready |

## Database Schema

- **users**: id, name, email, passwordHash, apiKey, createdAt
- **clipboard_items**: id, userId, content, contentType, title, tags, isPinned, isFavorite, deviceName, deviceType, syncedAt, createdAt, updatedAt
- **sync_sessions**: id, userId, deviceName, deviceType, lastSyncAt, createdAt

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | /api/auth/register | Create account |
| POST | /api/auth/login | Sign in |
| POST | /api/auth/logout | Sign out |
| GET | /api/clipboard | List items |
| POST | /api/clipboard | Add item |
| PATCH | /api/clipboard/:id | Update item |
| DELETE | /api/clipboard/:id | Delete item |
| POST | /api/sync | Bulk sync |
| GET | /api/sync | Sync status |

## Session History

| Date | Changes |
|------|---------|
| Initial | Template created with base setup |
| 2026-03-04 | Built ClipSync clipboard manager app with cloud sync for Linux and Android |
