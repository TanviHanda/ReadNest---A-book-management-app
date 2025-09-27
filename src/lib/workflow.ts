import { Client } from "@upstash/workflow";
import { env } from "./env";

export const workflowClient = new Client({
  baseUrl: env.QSTASH_URL,
  token: env.QSTASH_TOKEN,
});
