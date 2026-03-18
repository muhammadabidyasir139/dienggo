ALTER TABLE "wisata" ALTER COLUMN "harga" SET DEFAULT 0;--> statement-breakpoint
ALTER TABLE "wisata" ALTER COLUMN "harga" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "wisata" ADD COLUMN "isi" text;