CREATE TABLE "festivals" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"monastery_id" varchar NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"significance" text NOT NULL,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp,
	"duration" varchar,
	"festival_type" varchar NOT NULL,
	"traditions" text[] DEFAULT '{}'::text[],
	"rituals" text[] DEFAULT '{}'::text[],
	"image_url" varchar,
	"is_annual" boolean DEFAULT true,
	"status" varchar DEFAULT 'upcoming' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "media" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"monastery_id" varchar,
	"festival_id" varchar,
	"type" varchar NOT NULL,
	"url" varchar NOT NULL,
	"title" varchar,
	"description" text,
	"alt" varchar,
	"category" varchar,
	"is_main" boolean DEFAULT false,
	"sort_order" integer DEFAULT 0,
	"file_size" integer,
	"mime_type" varchar,
	"uploaded_by" varchar,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "monasteries" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"location" text NOT NULL,
	"district" varchar NOT NULL,
	"founded_year" integer NOT NULL,
	"history" text NOT NULL,
	"rituals" text[] DEFAULT '{}'::text[] NOT NULL,
	"architecture" text,
	"latitude" numeric(10, 8),
	"longitude" numeric(11, 8),
	"altitude" integer,
	"main_image" varchar,
	"image_gallery" text[] DEFAULT '{}'::text[],
	"panoramic_url" varchar,
	"significance" text,
	"visiting_hours" text,
	"entry_fee" numeric(10, 2) DEFAULT '0',
	"accessibility" text,
	"nearby_attractions" text[] DEFAULT '{}'::text[],
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"sid" varchar PRIMARY KEY NOT NULL,
	"sess" jsonb NOT NULL,
	"expire" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tour_hotspots" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"monastery_id" varchar NOT NULL,
	"title" varchar NOT NULL,
	"description" text NOT NULL,
	"type" varchar NOT NULL,
	"x_position" numeric(5, 2) NOT NULL,
	"y_position" numeric(5, 2) NOT NULL,
	"linked_media_id" varchar,
	"audio_url" varchar,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar,
	"first_name" varchar,
	"last_name" varchar,
	"profile_image_url" varchar,
	"is_admin" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "festivals" ADD CONSTRAINT "festivals_monastery_id_monasteries_id_fk" FOREIGN KEY ("monastery_id") REFERENCES "public"."monasteries"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "media" ADD CONSTRAINT "media_monastery_id_monasteries_id_fk" FOREIGN KEY ("monastery_id") REFERENCES "public"."monasteries"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "media" ADD CONSTRAINT "media_festival_id_festivals_id_fk" FOREIGN KEY ("festival_id") REFERENCES "public"."festivals"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "media" ADD CONSTRAINT "media_uploaded_by_users_id_fk" FOREIGN KEY ("uploaded_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tour_hotspots" ADD CONSTRAINT "tour_hotspots_monastery_id_monasteries_id_fk" FOREIGN KEY ("monastery_id") REFERENCES "public"."monasteries"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tour_hotspots" ADD CONSTRAINT "tour_hotspots_linked_media_id_media_id_fk" FOREIGN KEY ("linked_media_id") REFERENCES "public"."media"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "IDX_session_expire" ON "sessions" USING btree ("expire");