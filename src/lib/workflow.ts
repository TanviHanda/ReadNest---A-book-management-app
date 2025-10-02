import { Client as QStashClient, resend } from "@upstash/qstash";
import { Client as WorkflowClient } from "@upstash/workflow";
import { env } from "./env";

export const workflowClient = new WorkflowClient({
  baseUrl: env.QSTASH_URL,
  token: env.QSTASH_TOKEN,
});

const qstashclient = new QStashClient({ token: env.QSTASH_TOKEN });

export const sendEmail = async ({
  email,
  subject,
  message,
}: {
  email: string;
  subject: string;
  message: string;
}) => {
  const { messageId } = await qstashclient.publishJSON({
    api: {
      name: "email",
      provider: resend({ token: env.RESEND_TOKEN }),
    },
    body: {
      from: "onboarding@readnest.tanvii.dev",
      to: [email],
      subject,
      html: message,
    },
  });
  console.log("Email sent with messageId:", messageId);
};
