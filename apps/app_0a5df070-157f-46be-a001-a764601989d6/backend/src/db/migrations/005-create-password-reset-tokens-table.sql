-- Create password reset tokens table for password recovery functionality
CREATE TABLE "password_reset_tokens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"token" varchar(255) NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "password_reset_tokens_token_unique" UNIQUE("token"),
	CONSTRAINT "password_reset_tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade
);

-- Add index on user_id for faster lookups
CREATE INDEX "idx_password_reset_tokens_user_id" ON "password_reset_tokens" ("user_id");

-- Add index on token for faster lookups during password reset
CREATE INDEX "idx_password_reset_tokens_token" ON "password_reset_tokens" ("token");

-- Add index on expires_at for cleanup of expired tokens
CREATE INDEX "idx_password_reset_tokens_expires_at" ON "password_reset_tokens" ("expires_at");