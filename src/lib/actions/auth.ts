// Minimal auth action stubs used by the auth pages while the app is in dev.
export async function signInWithCredentials(values: { email?: string; password?: string }) {
  console.log("signInWithCredentials", values)
  // TODO: replace with real logic
  return Promise.resolve({ success: true } as { success: boolean; error?: string })
}

export async function signUp(values: Record<string, unknown>) {
  console.log("signUp", values)
  // TODO: replace with real registration logic
  return Promise.resolve({ success: true } as { success: boolean; error?: string })
}
