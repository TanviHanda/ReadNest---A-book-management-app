declare module "@hookform/resolvers/zod" {
  import type { Resolver } from "react-hook-form"

  // Provide a loose declaration for zodResolver that is compatible with generic usage in the app.
  export function zodResolver<T = unknown>(schema: unknown): Resolver<T>
}
