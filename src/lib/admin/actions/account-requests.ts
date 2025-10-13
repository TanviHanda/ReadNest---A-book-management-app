"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { eq, sql, or } from "drizzle-orm";
import { requireAdmin } from "@/lib/actions/utils";
import { revalidatePath } from "next/cache";

export async function getAllAccountRequests() {
  await requireAdmin();

  try {
    const requests = await db
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
      .orderBy(sql`${users.createdAt} DESC`);

    return { success: true, data: requests };
  } catch (error) {
    console.error("Error fetching account requests:", error);
    return { success: false, error: "Failed to fetch account requests" };
  }
}

export async function getAccountRequestsStats() {
  await requireAdmin();

  try {
    const [pending] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(users)
      .where(eq(users.status, "PENDING"));

    const [approved] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(users)
      .where(eq(users.status, "APPROVED"));

    const [rejected] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(users)
      .where(eq(users.status, "REJECTED"));

    const [total] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(users)
      .where(or(eq(users.status, "PENDING"), eq(users.status, "APPROVED"), eq(users.status, "REJECTED")));

    return {
      success: true,
      data: {
        pending: pending.count || 0,
        approved: approved.count || 0,
        rejected: rejected.count || 0,
        total: total.count || 0,
      },
    };
  } catch (error) {
    console.error("Error fetching account requests stats:", error);
    return { success: false, error: "Failed to fetch stats" };
  }
}

export async function approveAccountRequest(userId: string) {
  await requireAdmin();

  try {
    await db
      .update(users)
      .set({ status: "APPROVED" })
      .where(eq(users.id, userId));

    revalidatePath("/admin/account-requests");
    return { success: true, message: "Account approved successfully" };
  } catch (error) {
    console.error("Error approving account:", error);
    return { success: false, error: "Failed to approve account" };
  }
}

export async function rejectAccountRequest(userId: string) {
  await requireAdmin();

  try {
    await db
      .update(users)
      .set({ status: "REJECTED" })
      .where(eq(users.id, userId));

    revalidatePath("/admin/account-requests");
    return { success: true, message: "Account rejected successfully" };
  } catch (error) {
    console.error("Error rejecting account:", error);
    return { success: false, error: "Failed to reject account" };
  }
}
