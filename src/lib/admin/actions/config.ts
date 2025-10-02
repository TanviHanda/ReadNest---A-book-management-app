"use server";

import { db } from "@/db";
import { systemConfig } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/actions/utils";
import { revalidatePath } from "next/cache";

export async function getSystemConfigs() {
  await requireAdmin();

  try {
    const configs = await db.select().from(systemConfig);
    return { success: true, data: configs };
  } catch (error) {
    console.error("Error fetching configs:", error);
    return { success: false, error: "Failed to fetch configs", data: [] };
  }
}

export async function updateSystemConfig(key: string, value: string) {
  await requireAdmin();

  try {
    const existing = await db
      .select()
      .from(systemConfig)
      .where(eq(systemConfig.key, key))
      .limit(1);

    let result: typeof systemConfig.$inferSelect;
    if (existing.length > 0) {
      const updated = await db
        .update(systemConfig)
        .set({ value, updatedAt: new Date() })
        .where(eq(systemConfig.key, key))
        .returning();
      result = updated[0];
    } else {
      const created = await db
        .insert(systemConfig)
        .values({ key, value })
        .returning();
      result = created[0];
    }

    revalidatePath("/admin/config");
    return { success: true, data: result };
  } catch (error) {
    console.error("Error updating config:", error);
    return { success: false, error: "Failed to update config" };
  }
}

export async function updateMaxBooksAllowed(maxBooks: number) {
  return updateSystemConfig("max_books_allowed", maxBooks.toString());
}
