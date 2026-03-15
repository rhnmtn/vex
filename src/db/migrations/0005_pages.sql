CREATE TABLE IF NOT EXISTS "pages" (
	"id" serial PRIMARY KEY NOT NULL,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"deleted_at" timestamp,
	"created_by_auth_id" text NOT NULL,
	"updated_by_auth_id" text NOT NULL,
	"company_id" integer NOT NULL,
	"title" varchar(500) NOT NULL,
	"slug" varchar(500) NOT NULL,
	"featured_image_id" integer,
	"content" text,
	"meta_title" varchar(255),
	"meta_description" varchar(500)
);
--> statement-breakpoint
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'pages_created_by_auth_id_user_id_fk') THEN
    ALTER TABLE "pages" ADD CONSTRAINT "pages_created_by_auth_id_user_id_fk" FOREIGN KEY ("created_by_auth_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
  END IF;
END $$;--> statement-breakpoint
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'pages_updated_by_auth_id_user_id_fk') THEN
    ALTER TABLE "pages" ADD CONSTRAINT "pages_updated_by_auth_id_user_id_fk" FOREIGN KEY ("updated_by_auth_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
  END IF;
END $$;--> statement-breakpoint
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'pages_company_id_companies_id_fk') THEN
    ALTER TABLE "pages" ADD CONSTRAINT "pages_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;
  END IF;
END $$;--> statement-breakpoint
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'pages_featured_image_id_media_id_fk') THEN
    ALTER TABLE "pages" ADD CONSTRAINT "pages_featured_image_id_media_id_fk" FOREIGN KEY ("featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  END IF;
END $$;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "pages_company_id_idx" ON "pages" USING btree ("company_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "pages_slug_company_deleted_at_idx" ON "pages" USING btree ("slug","company_id","deleted_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "pages_created_by_auth_id_idx" ON "pages" USING btree ("created_by_auth_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "pages_company_id_deleted_at_null_idx" ON "pages" USING btree ("company_id") WHERE "pages"."deleted_at" IS NULL;
