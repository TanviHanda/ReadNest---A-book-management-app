"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/actions/utils";
import { revalidatePath } from "next/cache";

export async function getAllUsersForAdmin() {
  await requireAdmin();

  try {
    const allUsers = await db.select({
      id: users.id,
      fullName: users.fullName,
      email: users.email,
      universityId: users.universityId,
      status: users.status,
      role: users.role,
      lastActivityDate: users.lastActivityDate,
      createdAt: users.createdAt,
    }).from(users).orderBy(users.createdAt);

    return { success: true, data: allUsers };
  } catch (error) {
    console.error("Error fetching users:", error);
    return { success: false, error: "Failed to fetch users", data: [] };
  }
}

export async function updateUserStatus(userId: string, status: "PENDING" | "APPROVED" | "REJECTED" | "BANNED") {
  await requireAdmin();

  try {
    const updatedUser = await db
      .update(users)
      .set({ status })
      .where(eq(users.id, userId))
      .returning();

    revalidatePath("/admin/users");
    return { success: true, data: updatedUser[0] };
  } catch (error) {
    console.error("Error updating user status:", error);
    return { success: false, error: "Failed to update user status" };
  }
}

export async function banUser(userId: string) {
  return updateUserStatus(userId, "BANNED");
}

export async function approveUser(userId: string) {
  return updateUserStatus(userId, "APPROVED");
}

export async function rejectUser(userId: string) {
  return updateUserStatus(userId, "REJECTED");
}
