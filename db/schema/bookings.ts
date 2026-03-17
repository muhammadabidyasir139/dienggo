import {
    pgTable,
    uuid,
    text,
    integer,
    date,
    timestamp,
} from "drizzle-orm/pg-core";
import { users } from "./users";
import { villas } from "./villas";
import { cabins } from "./cabins";
import { jeeps } from "./jeeps";
import { wisata } from "./wisata";

export const bookings = pgTable("bookings", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => users.id),
    kodeBooking: text("kode_booking").unique().notNull(),
    namaLengkap: text("nama_lengkap").notNull(),
    email: text("email").notNull(),
    telepon: text("telepon").notNull(),
    permintaan: text("permintaan"),
    tipeItem: text("tipe_item").notNull(), // villa | cabin | jeep | wisata
    checkIn: date("check_in"),
    checkOut: date("check_out"),
    tanggal: date("tanggal"),
    jumlahTamu: integer("jumlah_tamu").default(1),
    subtotal: integer("subtotal").notNull(),
    pajak: integer("pajak").notNull(),
    total: integer("total").notNull(),
    metodeBayar: text("metode_bayar").notNull().default("pending"),
    status: text("status").default("unpaid"), // unpaid | paid | cancelled | refunded
    snapToken: text("snap_token"),
    midtransOrderId: text("midtrans_order_id"),
    villaId: uuid("villa_id").references(() => villas.id),
    cabinId: uuid("cabin_id").references(() => cabins.id),
    jeepId: uuid("jeep_id").references(() => jeeps.id),
    wisataId: uuid("wisata_id").references(() => wisata.id),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});
