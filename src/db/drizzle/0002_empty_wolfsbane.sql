ALTER TYPE "public"."status" ADD VALUE 'BANNED';--> statement-breakpoint
CREATE TABLE "system_config" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"key" varchar(255) NOT NULL,
	"value" text NOT NULL,
	"description" text,
	"updated_at" timestamp with time zone DEFAULT now(),
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "system_config_id_unique" UNIQUE("id"),
	CONSTRAINT "system_config_key_unique" UNIQUE("key")
);
