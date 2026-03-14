ALTER TABLE "companies" ADD COLUMN "logo_light_media_id" integer;--> statement-breakpoint
ALTER TABLE "companies" ADD COLUMN "logo_dark_media_id" integer;--> statement-breakpoint
ALTER TABLE "companies" ADD COLUMN "hero_text" varchar(255);--> statement-breakpoint
ALTER TABLE "companies" ADD COLUMN "hero_subtitle" varchar(500);--> statement-breakpoint
ALTER TABLE "companies" ADD CONSTRAINT "companies_logo_light_media_id_media_id_fk" FOREIGN KEY ("logo_light_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "companies" ADD CONSTRAINT "companies_logo_dark_media_id_media_id_fk" FOREIGN KEY ("logo_dark_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "companies" DROP CONSTRAINT IF EXISTS "companies_logo_media_id_media_id_fk";--> statement-breakpoint
ALTER TABLE "companies" DROP COLUMN IF EXISTS "logo_media_id";
