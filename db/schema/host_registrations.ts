import {
    pgTable,
    uuid,
    text,
    integer,
    boolean,
    jsonb,
    timestamp,
    varchar,
} from "drizzle-orm/pg-core";

export const hostRegistrations = pgTable("host_registrations", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id").notNull(), // link to auth user if needed
    category: varchar("category", { length: 20 }).notNull(), // 'villa', 'cabin', 'jeep'
    
    // Step 2: Location
    nama: text("nama").notNull(),
    unit: text("unit"),
    lantai: text("lantai"),
    alamatJalan: text("alamat_jalan").notNull(),
    distrik: text("distrik"),
    kota: text("kota").notNull(),
    provinsi: text("provinsi").notNull(),
    kodePos: varchar("kode_pos", { length: 10 }).notNull(),
    whatsappOwner: text("whatsapp_owner"),
    koordinat: text("koordinat"), // maps location
    
    // Step 3: Facilities
    fasilitas: jsonb("fasilitas").default([]),
    itemKeselamatan: jsonb("item_keselamatan").default([]),
    
    // Step 4: Photos
    fotos: jsonb("fotos").default([]),
    
    // Step 5: Pricing & Details
    deskripsi: text("deskripsi"),
    hargaDasar: integer("harga_dasar").notNull(),
    hargaAkhirPekan: integer("harga_akhir_pekan"),
    hargaLiburan: integer("harga_liburan"),
    
    // Meta
    status: varchar("status", { length: 20 }).default("pending"), // 'pending', 'approved', 'rejected'
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});
