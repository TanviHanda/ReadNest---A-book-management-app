"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/actions/utils";
import { revalidatePath } from "next/cache";

export async function getPendingAccountRequests() {
  await requireAdmin();

  try {
    const pending = await db
      .select({
        id: users.id,
        fullName: users.fullName,
        email: users.email,
        universityId: users.universityId,
        universityCard: users.universityCard,
        status: users.status,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.status, "PENDING"))
      .orderBy(users.createdAt);

    return { success: true, data: pending };
  } catch (error) {
    console.error("Error fetching pending account requests:", error);
    return { success: false, error: "Failed to fetch pending account requests", data: [] };
  }
}

export async function approveAccountRequest(userId: string) {
  await requireAdmin();

  try {
    const updated = await db
      .update(users)
      .set({ status: "APPROVED" })
      .where(eq(users.id, userId))
      .returning();

    // Revalidate admin pages that list requests and users
    revalidatePath("/admin/account-requests");
    revalidatePath("/admin/users");

    return { success: true, data: updated[0] };
  } catch (error) {
    console.error("Error approving account request:", error);
    return { success: false, error: "Failed to approve account request" };
  }
}

export async function rejectAccountRequest(userId: string) {
  await requireAdmin();

  try {
    const updated = await db
      .update(users)
      .set({ status: "REJECTED" })
      .where(eq(users.id, userId))
      .returning();

    revalidatePath("/admin/account-requests");
    revalidatePath("/admin/users");

    return { success: true, data: updated[0] };
  } catch (error) {
    console.error("Error rejecting account request:", error);
    return { success: false, error: "Failed to reject account request" };
  }
}
