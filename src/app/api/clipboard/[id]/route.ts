import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { clipboardItems } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { getUserFromSession, getUserFromApiKey } from "@/lib/auth";

async function getAuthUser(request: NextRequest) {
  const apiKey = request.headers.get("x-api-key");
  if (apiKey) return getUserFromApiKey(apiKey);
  return getUserFromSession();
}

// GET /api/clipboard/[id]
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getAuthUser(request);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const [item] = await db
      .select()
      .from(clipboardItems)
      .where(and(eq(clipboardItems.id, parseInt(id)), eq(clipboardItems.userId, user.id)))
      .limit(1);

    if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({ item });
  } catch (error) {
    console.error("GET clipboard item error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PATCH /api/clipboard/[id]
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getAuthUser(request);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const body = await request.json();
    const { content, title, tags, isPinned, isFavorite, contentType } = body;

    const updateData: Partial<typeof clipboardItems.$inferInsert> = {
      updatedAt: new Date(),
      syncedAt: new Date(),
    };

    if (content !== undefined) updateData.content = content;
    if (title !== undefined) updateData.title = title;
    if (tags !== undefined) updateData.tags = JSON.stringify(tags);
    if (isPinned !== undefined) updateData.isPinned = isPinned;
    if (isFavorite !== undefined) updateData.isFavorite = isFavorite;
    if (contentType !== undefined) updateData.contentType = contentType;

    const [item] = await db
      .update(clipboardItems)
      .set(updateData)
      .where(and(eq(clipboardItems.id, parseInt(id)), eq(clipboardItems.userId, user.id)))
      .returning();

    if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({ item });
  } catch (error) {
    console.error("PATCH clipboard item error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/clipboard/[id]
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getAuthUser(request);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const [deleted] = await db
      .delete(clipboardItems)
      .where(and(eq(clipboardItems.id, parseInt(id)), eq(clipboardItems.userId, user.id)))
      .returning({ id: clipboardItems.id });

    if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE clipboard item error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
