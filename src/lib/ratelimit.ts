import { Ratelimit } from "@upstash/ratelimit";
import redis from "@/db/redis";

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.fixedWindow(5, "1m"),
  analytics: true,
  prefix: "@upstash/ratelimit",
});

export default ratelimit;

export const limitRequest = async (identifier: string) => {
  try {
    return await ratelimit.limit(identifier);
  } catch (error) {
    console.warn("Rate limit backend unavailable; allowing request.", error);
    return { success: true, pending: 0, limit: 0, reset: 0 };
  }
};
