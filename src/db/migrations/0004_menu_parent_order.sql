-- Header menü: parent_id ve index ekle
ALTER TABLE "company_header_menu_items" ADD COLUMN IF NOT EXISTS "parent_id" integer;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "company_header_menu_items_parent_id_idx" ON "company_header_menu_items" USING btree ("parent_id");--> statement-breakpoint
ALTER TABLE "company_header_menu_items" ADD CONSTRAINT "company_header_menu_items_parent_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."company_header_menu_items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint

-- Footer menü: parent_id ve index ekle
ALTER TABLE "company_footer_menu_items" ADD COLUMN IF NOT EXISTS "parent_id" integer;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "company_footer_menu_items_parent_id_idx" ON "company_footer_menu_items" USING btree ("parent_id");--> statement-breakpoint
ALTER TABLE "company_footer_menu_items" ADD CONSTRAINT "company_footer_menu_items_parent_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."company_footer_menu_items"("id") ON DELETE cascade ON UPDATE no action;
