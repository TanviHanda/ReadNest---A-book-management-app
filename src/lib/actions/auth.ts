"use client";

// Client-side helpers for auth flows. These call the server APIs / NextAuth endpoints.
export async function signInWithCredentials(data: Record<string, unknown>) {
  // NextAuth credentials callback expects form-urlencoded data.
  const form = new URLSearchParams();
  for (const [k, v] of Object.entries(data)) {
    form.set(k, String(v ?? ""));
  }

  const res = await fetch("/api/auth/callback/credentials", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: form.toString(),
  });

  if (!res.ok) {
    const payload = await res.json().catch(() => ({}));
    return { success: false, error: payload.error || "Sign in failed" };
  }

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

  return res.json();
}