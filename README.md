# 📋 ClipSync

> Cross-platform clipboard manager with cloud sync for Linux and Android.

Copy on Linux, paste on Android. ClipSync keeps your clipboard history in sync across all your devices via a REST API with API key authentication.

---

## ✨ Features

- 🔄 **Real-time Sync** — Push and pull clipboard items across devices via REST API
- 🐧 **Linux Native** — Integrate with your Linux clipboard daemon using `curl` or any HTTP client
- 📱 **Android Ready** — Access clipboard history from Android using API key auth
- 🔍 **Smart Search** — Search through your entire clipboard history instantly
- 📌 **Pin & Favorite** — Pin important snippets to the top, mark favorites for quick access
- 🔑 **API Key Auth** — Secure API key authentication for programmatic access
- 🌐 **Web Dashboard** — Full-featured browser UI to manage your clipboard history

---

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh) (package manager & runtime)
- Node.js 20+

### Installation

```bash
# Clone the repo
git clone https://github.com/ClawClawGo/ClipSync.git
cd ClipSync

# Install dependencies
bun install

# Run database migrations
bun run db:migrate

# Start the development server
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Secret key for password hashing (change this in production!)
AUTH_SECRET=your-super-secret-key-here
```

---

## 🗄️ Database

ClipSync uses **Drizzle ORM** with **SQLite** for data persistence.

### Schema

| Table | Description |
|-------|-------------|
| `users` | User accounts with email/password and API key |
| `clipboard_items` | Clipboard entries with content, type, tags, pin/favorite status |
| `sync_sessions` | Device sync session tracking |

### Database Commands

```bash
# Generate migrations after schema changes
bun run db:generate

# Apply migrations
bun run db:migrate
```

---

## 🔌 REST API

All API endpoints require authentication via the `x-api-key` header. Find your API key in the **Settings** tab of your dashboard.

### Authentication

```bash
curl -H "x-api-key: YOUR_API_KEY" https://your-app.com/api/clipboard
```

### Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/auth/register` | Create a new account |
| `POST` | `/api/auth/login` | Sign in |
| `POST` | `/api/auth/logout` | Sign out |
| `GET` | `/api/clipboard` | List clipboard items |
| `POST` | `/api/clipboard` | Add a clipboard item |
| `PATCH` | `/api/clipboard/:id` | Update an item |
| `DELETE` | `/api/clipboard/:id` | Delete an item |
| `POST` | `/api/sync` | Bulk sync from a device |
| `GET` | `/api/sync` | Get sync status & connected devices |

### Query Parameters for `GET /api/clipboard`

| Parameter | Type | Description |
|-----------|------|-------------|
| `search` | string | Filter by content |
| `filter` | string | `all` \| `pinned` \| `favorites` \| `text` \| `url` \| `code` |
| `limit` | number | Max items (default: 50) |
| `since` | ISO date | Only items updated after this time |

---

## 🐧 Linux Integration

### Push clipboard content on copy

Add this to your shell config or clipboard daemon (e.g., `xclip`, `wl-paste`):

```bash
# Push current clipboard to ClipSync
xclip -selection clipboard -o | curl -s -X POST https://your-app.com/api/clipboard \
  -H "x-api-key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"content\": \"$(xclip -selection clipboard -o)\", \"deviceType\": \"linux\", \"deviceName\": \"$(hostname)\"}"
```

### Pull latest clipboard item

```bash
# Get the most recent clipboard item
curl -s "https://your-app.com/api/clipboard?limit=1" \
  -H "x-api-key: YOUR_API_KEY" | jq -r '.items[0].content' | xclip -selection clipboard
```

### Bulk sync

```bash
curl -X POST https://your-app.com/api/sync \
  -H "x-api-key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [{"content": "Hello from Linux!", "deviceType": "linux"}],
    "deviceName": "my-laptop",
    "deviceType": "linux"
  }'
```

---

## 📱 Android Integration

Use any HTTP client app (e.g., HTTP Shortcuts, Tasker) to call the API:

```
POST https://your-app.com/api/clipboard
Headers: x-api-key: YOUR_API_KEY
Body: {"content": "text from Android", "deviceType": "android"}
```

Or open the web dashboard in your Android browser — it's fully responsive.

---

## 🏗️ Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| [Next.js](https://nextjs.org) | 16.x | React framework with App Router |
| [React](https://react.dev) | 19.x | UI library |
| [TypeScript](https://typescriptlang.org) | 5.x | Type-safe JavaScript |
| [Tailwind CSS](https://tailwindcss.com) | 4.x | Utility-first CSS |
| [Drizzle ORM](https://orm.drizzle.team) | 0.45.x | Type-safe ORM |
| SQLite | — | Embedded database |
| [Bun](https://bun.sh) | Latest | Package manager & runtime |

---

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── layout.tsx                  # Root layout
│   ├── login/page.tsx              # Login page
│   ├── register/page.tsx           # Register page
│   ├── dashboard/page.tsx          # Dashboard (server component)
│   ├── docs/page.tsx               # API documentation page
│   └── api/
│       ├── auth/login/route.ts     # Login API
│       ├── auth/register/route.ts  # Register API
│       ├── auth/logout/route.ts    # Logout API
│       ├── clipboard/route.ts      # Clipboard CRUD
│       ├── clipboard/[id]/route.ts # Single item operations
│       └── sync/route.ts           # Bulk sync API
├── components/
│   └── ClipboardDashboard.tsx      # Main dashboard UI (client)
├── db/
│   ├── schema.ts                   # Database schema
│   ├── index.ts                    # Database client
│   ├── migrate.ts                  # Migration runner
│   └── migrations/                 # SQL migration files
└── lib/
    ├── auth.ts                     # Auth utilities
    └── utils.ts                    # Helper utilities
```

---

## 🛠️ Development Commands

```bash
bun install        # Install dependencies
bun dev            # Start dev server (http://localhost:3000)
bun build          # Production build
bun start          # Start production server
bun lint           # Run ESLint
bun typecheck      # Run TypeScript type checking
bun run db:generate  # Generate DB migrations
bun run db:migrate   # Apply DB migrations
```

---

## 📄 License

MIT
