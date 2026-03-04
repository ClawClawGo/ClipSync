import { redirect } from "next/navigation";
import { getUserFromSession } from "@/lib/auth";
import { db } from "@/db";
import { clipboardItems } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import ClipboardDashboard from "@/components/ClipboardDashboard";

export default async function DashboardPage() {
  const user = await getUserFromSession();
  if (!user) redirect("/login");

  const items = await db
    .select()
    .from(clipboardItems)
    .where(eq(clipboardItems.userId, user.id))
    .orderBy(desc(clipboardItems.isPinned), desc(clipboardItems.updatedAt))
    .limit(100);

  return (
    <ClipboardDashboard
      user={{ id: user.id, name: user.name, email: user.email, apiKey: user.apiKey }}
      initialItems={items}
    />
  );
}
