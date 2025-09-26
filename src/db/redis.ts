import { Redis } from "@upstash/redis";

// Create a Redis client using environment variables. This matches Upstash
// SDK recommended usage and avoids coupling to the local config helper.
const redis = Redis.fromEnv();

export default redis;