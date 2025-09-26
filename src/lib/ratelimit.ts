import { Ratelimit } from "@upstash/ratelimit";
import redis from "@/db/redis";

const ratelimit = new Ratelimit({
  // Use the existing redis client created by Redis.fromEnv()
  redis,
  limiter: Ratelimit.fixedWindow(5, "1m"),
  analytics: true,
  prefix: "@upstash/ratelimit",
});

export default ratelimit;