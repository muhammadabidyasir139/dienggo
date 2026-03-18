CREATE TABLE "bookings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"kode_booking" text NOT NULL,
	"nama_lengkap" text NOT NULL,
	"email" text NOT NULL,
	"telepon" text NOT NULL,
	"permintaan" text,
	"tipe_item" text NOT NULL,
	"check_in" date,
	"check_out" date,
	"tanggal" date,
	"jumlah_tamu" integer DEFAULT 1,
	"subtotal" integer NOT NULL,
	"pajak" integer NOT NULL,
	"total" integer NOT NULL,
	"metode_bayar" text DEFAULT 'pending' NOT NULL,
	"status" text DEFAULT 'unpaid',
	"snap_token" text,
	"midtrans_order_id" text,
	"villa_id" uuid,
	"cabin_id" uuid,
	"jeep_id" uuid,
	"wisata_id" uuid,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "bookings_kode_booking_unique" UNIQUE("kode_booking")
);
--> statement-breakpoint
CREATE TABLE "cabins" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"nama" text NOT NULL,
	"harga" integer NOT NULL,
	"rating" real DEFAULT 0,
	"ulasan" integer DEFAULT 0,
	"lokasi" text,
	"koordinat" text,
	"kamar_tidur" integer,
	"maks_tamu" integer,
	"kamar_mandi" integer,
	"fasilitas_utama" jsonb DEFAULT '[]'::jsonb,
	"deskripsi" text,
	"foto_utama" text,
	"galeri" jsonb DEFAULT '[]'::jsonb,
	"wisata_terdekat" jsonb DEFAULT '[]'::jsonb,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "cabins_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "facilities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"icon" text,
	CONSTRAINT "facilities_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "jeep_includes" (
	"jeep_id" uuid,
	"facility_id" uuid,
	CONSTRAINT "jeep_includes_jeep_id_facility_id_pk" PRIMARY KEY("jeep_id","facility_id")
);
--> statement-breakpoint
CREATE TABLE "jeeps" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"nama" text NOT NULL,
	"harga" integer NOT NULL,
	"rating" real DEFAULT 0,
	"ulasan" integer DEFAULT 0,
	"maks_orang" integer,
	"durasi" text,
	"destinasi_count" integer,
	"foto_utama" text,
	"galeri" jsonb DEFAULT '[]'::jsonb,
	"destinasi" jsonb DEFAULT '[]'::jsonb,
	"isi_paket" jsonb DEFAULT '[]'::jsonb,
	"kebijakan" jsonb DEFAULT '[]'::jsonb,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "jeeps_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"password" text,
	"name" text NOT NULL,
	"phone" text,
	"image" text,
	"role" text DEFAULT 'customer',
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "villas" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"nama" text NOT NULL,
	"harga" integer NOT NULL,
	"rating" real DEFAULT 0,
	"ulasan" integer DEFAULT 0,
	"lokasi" text,
	"koordinat" text,
	"kamar_tidur" integer,
	"maks_tamu" integer,
	"kamar_mandi" integer,
	"fasilitas_utama" jsonb DEFAULT '[]'::jsonb,
	"deskripsi" text,
	"foto_utama" text,
	"galeri" jsonb DEFAULT '[]'::jsonb,
	"wisata_terdekat" jsonb DEFAULT '[]'::jsonb,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "villas_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "wisata" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"nama" text NOT NULL,
	"harga" integer NOT NULL,
	"rating" real DEFAULT 0,
	"ulasan" text DEFAULT '0',
	"lokasi" text,
	"koordinat" text,
	"durasi_wisata" text,
	"kontak" text,
	"bahasa" text,
	"fasilitas" jsonb DEFAULT '[]'::jsonb,
	"narasi" jsonb DEFAULT '[]'::jsonb,
	"foto_utama" text,
	"galeri" jsonb DEFAULT '[]'::jsonb,
	"video_reels" jsonb DEFAULT '[]'::jsonb,
	"rundown" jsonb DEFAULT '[]'::jsonb,
	"author_name" text,
	"author_image" text,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "wisata_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_villa_id_villas_id_fk" FOREIGN KEY ("villa_id") REFERENCES "public"."villas"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_cabin_id_cabins_id_fk" FOREIGN KEY ("cabin_id") REFERENCES "public"."cabins"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_jeep_id_jeeps_id_fk" FOREIGN KEY ("jeep_id") REFERENCES "public"."jeeps"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_wisata_id_wisata_id_fk" FOREIGN KEY ("wisata_id") REFERENCES "public"."wisata"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "jeep_includes" ADD CONSTRAINT "jeep_includes_jeep_id_jeeps_id_fk" FOREIGN KEY ("jeep_id") REFERENCES "public"."jeeps"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "jeep_includes" ADD CONSTRAINT "jeep_includes_facility_id_facilities_id_fk" FOREIGN KEY ("facility_id") REFERENCES "public"."facilities"("id") ON DELETE cascade ON UPDATE no action;