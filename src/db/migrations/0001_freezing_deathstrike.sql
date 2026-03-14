ALTER TABLE "companies" ADD COLUMN "logo_media_id" integer;--> statement-breakpoint
ALTER TABLE "companies" ADD COLUMN "hero_image_media_id" integer;--> statement-breakpoint
ALTER TABLE "companies" ADD CONSTRAINT "companies_logo_media_id_media_id_fk" FOREIGN KEY ("logo_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "companies" ADD CONSTRAINT "companies_hero_image_media_id_media_id_fk" FOREIGN KEY ("hero_image_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;