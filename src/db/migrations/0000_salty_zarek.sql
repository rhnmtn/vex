CREATE TYPE "public"."user_role" AS ENUM('ADMIN', 'MANAGER', 'USER', 'GUEST');--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"accountId" text NOT NULL,
	"providerId" text NOT NULL,
	"accessToken" text,
	"refreshToken" text,
	"accessTokenExpiresAt" timestamp,
	"refreshTokenExpiresAt" timestamp,
	"scope" text,
	"idToken" text,
	"password" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "companies" (
	"id" serial PRIMARY KEY NOT NULL,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"deleted_at" timestamp,
	"created_by_auth_id" text,
	"updated_by_auth_id" text,
	"name" varchar(255) NOT NULL,
	"short_name" varchar(50) NOT NULL,
	"tax_office" varchar(100) NOT NULL,
	"tax_number" varchar(20) NOT NULL,
	"address" varchar(1000),
	"city" varchar(100),
	"district" varchar(100),
	"phone" varchar(20),
	"mobile" varchar(20),
	"email" varchar(255),
	"website" varchar(255),
	"logo" varchar(255),
	"logo_alt" varchar(255),
	"description" varchar(1000)
);
--> statement-breakpoint
CREATE TABLE "customers" (
	"id" serial PRIMARY KEY NOT NULL,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"deleted_at" timestamp,
	"created_by_auth_id" text NOT NULL,
	"updated_by_auth_id" text NOT NULL,
	"company_id" integer NOT NULL,
	"name" varchar(255) NOT NULL,
	"contact_name" varchar(255),
	"mobile" varchar(20),
	"email" varchar(255),
	"city" varchar(100),
	"district" varchar(100),
	"address" varchar(1000),
	"tax_office" varchar(100),
	"tax_number" varchar(20),
	"description" varchar(1000)
);
--> statement-breakpoint
CREATE TABLE "media" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"created_by_auth_id" text,
	"company_id" integer NOT NULL,
	"public_id" varchar(255),
	"path" text NOT NULL,
	"filename" varchar(255) NOT NULL,
	"mime_type" varchar(100) NOT NULL,
	"size" integer NOT NULL,
	"alt" varchar(255),
	"width" integer,
	"height" integer
);
--> statement-breakpoint
CREATE TABLE "post_categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"deleted_at" timestamp,
	"created_by_auth_id" text,
	"updated_by_auth_id" text,
	"company_id" integer NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"banner_image_id" integer,
	"content" text,
	"meta_title" varchar(255),
	"meta_description" varchar(500)
);
--> statement-breakpoint
CREATE TABLE "post_category_assignments" (
	"post_id" integer NOT NULL,
	"category_id" integer NOT NULL,
	CONSTRAINT "post_category_assignments_post_id_category_id_pk" PRIMARY KEY("post_id","category_id")
);
--> statement-breakpoint
CREATE TABLE "posts" (
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
	"excerpt" text,
	"featured_image_id" integer,
	"content" text,
	"meta_title" varchar(255),
	"meta_description" varchar(500),
	"published_at" timestamp,
	"is_sticky" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"token" text NOT NULL,
	"expiresAt" timestamp NOT NULL,
	"ipAddress" text,
	"userAgent" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"emailVerified" boolean DEFAULT false NOT NULL,
	"image" text,
	"avatar_media_id" integer,
	"role" "user_role" DEFAULT 'USER',
	"title" text,
	"phone" varchar(20),
	"isActive" boolean DEFAULT true NOT NULL,
	"company_id" integer,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expiresAt" timestamp NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "customers" ADD CONSTRAINT "customers_created_by_auth_id_user_id_fk" FOREIGN KEY ("created_by_auth_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "customers" ADD CONSTRAINT "customers_updated_by_auth_id_user_id_fk" FOREIGN KEY ("updated_by_auth_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "customers" ADD CONSTRAINT "customers_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "media" ADD CONSTRAINT "media_created_by_auth_id_user_id_fk" FOREIGN KEY ("created_by_auth_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "media" ADD CONSTRAINT "media_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_categories" ADD CONSTRAINT "post_categories_created_by_auth_id_user_id_fk" FOREIGN KEY ("created_by_auth_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_categories" ADD CONSTRAINT "post_categories_updated_by_auth_id_user_id_fk" FOREIGN KEY ("updated_by_auth_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_categories" ADD CONSTRAINT "post_categories_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_categories" ADD CONSTRAINT "post_categories_banner_image_id_media_id_fk" FOREIGN KEY ("banner_image_id") REFERENCES "public"."media"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_category_assignments" ADD CONSTRAINT "post_category_assignments_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_category_assignments" ADD CONSTRAINT "post_category_assignments_category_id_post_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."post_categories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_created_by_auth_id_user_id_fk" FOREIGN KEY ("created_by_auth_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_updated_by_auth_id_user_id_fk" FOREIGN KEY ("updated_by_auth_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_featured_image_id_media_id_fk" FOREIGN KEY ("featured_image_id") REFERENCES "public"."media"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_avatar_media_id_media_id_fk" FOREIGN KEY ("avatar_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "companies_tax_number_deleted_at_idx" ON "companies" USING btree ("tax_number","deleted_at");--> statement-breakpoint
CREATE UNIQUE INDEX "companies_email_deleted_at_idx" ON "companies" USING btree ("email","deleted_at");--> statement-breakpoint
CREATE INDEX "companies_created_by_auth_id_idx" ON "companies" USING btree ("created_by_auth_id");--> statement-breakpoint
CREATE INDEX "companies_updated_by_auth_id_idx" ON "companies" USING btree ("updated_by_auth_id");--> statement-breakpoint
CREATE INDEX "companies_deleted_at_null_idx" ON "companies" USING btree ("id") WHERE "companies"."deleted_at" IS NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "customers_email_company_deleted_at_idx" ON "customers" USING btree ("email","company_id","deleted_at");--> statement-breakpoint
CREATE UNIQUE INDEX "customers_mobile_company_deleted_at_idx" ON "customers" USING btree ("mobile","company_id","deleted_at");--> statement-breakpoint
CREATE UNIQUE INDEX "customers_tax_number_company_deleted_at_idx" ON "customers" USING btree ("tax_number","company_id","deleted_at");--> statement-breakpoint
CREATE INDEX "customers_created_by_auth_id_idx" ON "customers" USING btree ("created_by_auth_id");--> statement-breakpoint
CREATE INDEX "customers_updated_by_auth_id_idx" ON "customers" USING btree ("updated_by_auth_id");--> statement-breakpoint
CREATE INDEX "customers_company_id_idx" ON "customers" USING btree ("company_id");--> statement-breakpoint
CREATE INDEX "customers_company_id_deleted_at_null_idx" ON "customers" USING btree ("company_id") WHERE "customers"."deleted_at" IS NULL;--> statement-breakpoint
CREATE INDEX "media_company_id_idx" ON "media" USING btree ("company_id");--> statement-breakpoint
CREATE INDEX "media_created_by_auth_id_idx" ON "media" USING btree ("created_by_auth_id");--> statement-breakpoint
CREATE UNIQUE INDEX "media_public_id_company_idx" ON "media" USING btree ("public_id","company_id") WHERE "media"."public_id" IS NOT NULL;--> statement-breakpoint
CREATE INDEX "post_categories_company_id_idx" ON "post_categories" USING btree ("company_id");--> statement-breakpoint
CREATE UNIQUE INDEX "post_categories_slug_company_deleted_at_idx" ON "post_categories" USING btree ("slug","company_id","deleted_at");--> statement-breakpoint
CREATE INDEX "post_categories_created_by_auth_id_idx" ON "post_categories" USING btree ("created_by_auth_id");--> statement-breakpoint
CREATE INDEX "post_categories_company_id_deleted_at_null_idx" ON "post_categories" USING btree ("company_id") WHERE "post_categories"."deleted_at" IS NULL;--> statement-breakpoint
CREATE INDEX "posts_company_id_idx" ON "posts" USING btree ("company_id");--> statement-breakpoint
CREATE INDEX "posts_company_id_published_at_idx" ON "posts" USING btree ("company_id","published_at");--> statement-breakpoint
CREATE UNIQUE INDEX "posts_slug_company_deleted_at_idx" ON "posts" USING btree ("slug","company_id","deleted_at");--> statement-breakpoint
CREATE INDEX "posts_created_by_auth_id_idx" ON "posts" USING btree ("created_by_auth_id");--> statement-breakpoint
CREATE INDEX "posts_company_id_deleted_at_null_idx" ON "posts" USING btree ("company_id") WHERE "posts"."deleted_at" IS NULL;--> statement-breakpoint
CREATE INDEX "user_company_id_idx" ON "user" USING btree ("company_id");