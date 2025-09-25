"use server"
import { signIn } from "@/auth";

// Client-side helpers for auth flows.

export async function signInWithCredentials(data: Record<string, unknown>) {
  // Use next-auth client helper to sign in without redirect so we can handle
  // the result and control navigation from the UI.
  const res = await signIn("credentials", { redirect: false, ...data });

  if (!res) return { success: false, error: "Sign in failed" };

  // res can be a string or an object with an `error` property depending on next-auth
  if (typeof res === "object" && res !== null && "error" in res) {
    return { success: false, error: (res as { error?: string }).error };
  }

  // Otherwise, assume sign-in succeeded. Return a consistent success shape
  return { success: true };
}

export async function signUp(data: Record<string, unknown>) {
  const res = await fetch("/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const payload = await res.json().catch(() => ({}));
    return { success: false, error: payload.error || "Signup failed" };
  }

  const payload = await res.json().catch(() => ({}));

  if (payload.success) {
    // Auto sign-in after successful registration so server-side session exists
    const signin = await signInWithCredentials({
      email: String(data.email ?? ""),
      password: String(data.password ?? ""),
    });

    if (!signin?.success) return { success: false, error: signin?.error };

    return { success: true };
  }

  return { success: false, error: payload.error || "Signup failed" };
}