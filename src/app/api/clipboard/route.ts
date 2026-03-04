import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { clipboardItems } from "@/db/schema";
import { eq, desc, and, like, or } from "drizzle-orm";
import { getUserFromSession, getUserFromApiKey } from "@/lib/auth";
import { detectContentType } from "@/lib/utils";

async function getAuthUser(request: NextRequest) {
  // Try API key from header first (for Linux/Android clients)
  const apiKey = request.headers.get("x-api-key");
  if (apiKey) {
    return getUserFromApiKey(apiKey);
  }
  // Fall back to session cookie (for web UI)
  return getUserFromSession();
}

// GET /api/clipboard - List clipboard items
export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const filter = searchParams.get("filter"); // all, pinned, favorites, text, url, code
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");
    const since = searchParams.get("since"); // ISO timestamp for sync

    let conditions = [eq(clipboardItems.userId, user.id)];

    if (since) {
      const sinceDate = new Date(since);
      conditions.push(
        // Items updated after the since timestamp
        // We use a raw comparison approach
        eq(clipboardItems.userId, user.id) // placeholder, handled below
      );
    }

    let query = db
      .select()
      .from(clipboardItems)
      .where(eq(clipboardItems.userId, user.id))
      .orderBy(desc(clipboardItems.isPinned), desc(clipboardItems.updatedAt))
      .limit(limit)
      .offset(offset);

    const items = await query;

    // Apply filters in memory for simplicity
    let filtered = items;

    if (since) {
      const sinceDate = new Date(since);
      filtered = filtered.filter(
        (item) => item.updatedAt && item.updatedAt > sinceDate
      );
    }

    if (filter === "pinned") {
      filtered = filtered.filter((item) => item.isPinned);
    } else if (filter === "favorites") {
      filtered = filtered.filter((item) => item.isFavorite);
    } else if (filter === "text" || filter === "url" || filter === "code") {
      filtered = filtered.filter((item) => item.contentType === filter);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.content.toLowerCase().includes(searchLower) ||
          (item.title && item.title.toLowerCase().includes(searchLower))
      );
    }

    return NextResponse.json({ items: filtered, total: filtered.length });
  } catch (error) {
    console.error("GET clipboard error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/clipboard - Create clipboard item
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { content, title, tags, deviceName, deviceType } = body;

    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    const contentType = body.contentType || detectContentType(content);

    const [item] = await db
      .insert(clipboardItems)
      .values({
        userId: user.id,
        content,
        contentType,
        title: title || null,
        tags: tags ? JSON.stringify(tags) : null,
        deviceName: deviceName || null,
        deviceType: deviceType || "web",
        syncedAt: new Date(),
      })
      .returning();

    return NextResponse.json({ item }, { status: 201 });
  } catch (error) {
    console.error("POST clipboard error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
