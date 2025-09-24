// Re-export authOptions from the project-root `auth.ts` so `@/auth` resolves
// to the NextAuth options when imported from the app router.
export { authOptions } from "../auth";

// Minimal auth helper used by middleware and layouts. Keep behavior unchanged —
// returns null when no session is available. Replace with real session lookup
// if you wire NextAuth session checks into middleware.
export async function auth() {
	return null;
}
