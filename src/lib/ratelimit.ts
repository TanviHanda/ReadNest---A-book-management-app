import { Ratelimit } from "@upstash/ratelimit";
import redis from "@/db/redis";

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.fixedWindow(1, "1m"),
  analytics: true,
  prefix: "@upstash/ratelimit",
});

export default ratelimit;