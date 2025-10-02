import { UTApi } from "uploadthing/server";
import { env } from "./env";

// Initialize UTApi using environment configuration. If you need custom options,
// pass them here. The SDK will prefer provided options over env vars.
export const utapi = new UTApi({
  token: env.UPLOADTHING_TOKEN,
  // token will be picked up from process.env.UPLOADTHING_TOKEN or similar env var
});
