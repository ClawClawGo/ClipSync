import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { clipboardItems, syncSessions } from "@/db/schema";
import { eq, and, gt } from "drizzle-orm";
import { getUserFromSession, getUserFromApiKey } from "@/lib/auth";
import { detectContentType } from "@/lib/utils";

async function getAuthUser(request: NextRequest) {
  const apiKey = request.headers.get("x-api-key");
  if (apiKey) return getUserFromApiKey(apiKey);
  return getUserFromSession();
}

// POST /api/sync - Sync clipboard items from a device
// Accepts: { items: [...], deviceName, deviceType, lastSyncAt }
// Returns: { newItems: [...], updatedItems: [...], serverTime }
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { items: clientItems = [], deviceName = "Unknown Device", deviceType = "web", lastSyncAt } = body;

    const serverTime = new Date();

    // Upsert client items to server
    const savedItems = [];
    for (const clientItem of clientItems) {
      if (!clientItem.content) continue;

      const contentType = clientItem.contentType || detectContentType(clientItem.content);

      const [saved] = await db
        .insert(clipboardItems)
        .values({
          userId: user.id,
          content: clientItem.content,
          contentType,
          title: clientItem.title || null,
          tags: clientItem.tags ? JSON.stringify(clientItem.tags) : null,
          isPinned: clientItem.isPinned || false,
          isFavorite: clientItem.isFavorite || false,
          deviceName,
          deviceType,
          syncedAt: serverTime,
          createdAt: clientItem.createdAt ? new Date(clientItem.createdAt) : serverTime,
          updatedAt: serverTime,
        })
        .returning();

      savedItems.push(saved);
    }

    // Get items from server that are newer than lastSyncAt
    let serverItems = await db
      .select()
      .from(clipboardItems)
      .where(eq(clipboardItems.userId, user.id));

    if (lastSyncAt) {
      const lastSync = new Date(lastSyncAt);
      serverItems = serverItems.filter(
        (item) => item.syncedAt && item.syncedAt > lastSync
      );
    }

    // Update or create sync session
    const existingSessions = await db
      .select()
      .from(syncSessions)
      .where(
        and(
          eq(syncSessions.userId, user.id),
          eq(syncSessions.deviceName, deviceName)
        )
      )
      .limit(1);

    if (existingSessions.length > 0) {
      await db
        .update(syncSessions)
        .set({ lastSyncAt: serverTime })
        .where(eq(syncSessions.id, existingSessions[0].id));
    } else {
      await db.insert(syncSessions).values({
        userId: user.id,
        deviceName,
        deviceType,
        lastSyncAt: serverTime,
      });
    }

    return NextResponse.json({
      success: true,
      savedCount: savedItems.length,
      serverItems,
      serverTime: serverTime.toISOString(),
    });
  } catch (error) {
    console.error("Sync error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// GET /api/sync - Get sync status and connected devices
export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sessions = await db
      .select()
      .from(syncSessions)
      .where(eq(syncSessions.userId, user.id));

    const totalItems = await db
      .select()
      .from(clipboardItems)
      .where(eq(clipboardItems.userId, user.id));

    return NextResponse.json({
      devices: sessions,
      totalItems: totalItems.length,
      apiKey: user.apiKey,
    });
  } catch (error) {
    console.error("GET sync error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
