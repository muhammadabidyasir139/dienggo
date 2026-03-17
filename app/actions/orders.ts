"use server";

import { db } from "@/db";
import { bookings, villas, cabins, jeeps, wisata } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function getCustomerOrders(userId: string) {
    const result = await db
        .select({
            id: bookings.id,
            kodeBooking: bookings.kodeBooking,
            namaLengkap: bookings.namaLengkap,
            email: bookings.email,
            telepon: bookings.telepon,
            tipeItem: bookings.tipeItem,
            checkIn: bookings.checkIn,
            checkOut: bookings.checkOut,
            tanggal: bookings.tanggal,
            jumlahTamu: bookings.jumlahTamu,
            subtotal: bookings.subtotal,
            pajak: bookings.pajak,
            total: bookings.total,
            metodeBayar: bookings.metodeBayar,
            status: bookings.status,
            createdAt: bookings.createdAt,
            villa: { nama: villas.nama },
            cabin: { nama: cabins.nama },
            jeep: { nama: jeeps.nama },
            wisataItem: { nama: wisata.nama },
        })
        .from(bookings)
        .leftJoin(villas, eq(bookings.villaId, villas.id))
        .leftJoin(cabins, eq(bookings.cabinId, cabins.id))
        .leftJoin(jeeps, eq(bookings.jeepId, jeeps.id))
        .leftJoin(wisata, eq(bookings.wisataId, wisata.id))
        .where(eq(bookings.userId, userId))
        .orderBy(desc(bookings.createdAt));

    return result.map((b) => {
        let itemName = "-";
        if (b.tipeItem === "villa" && b.villa) itemName = b.villa.nama;
        if (b.tipeItem === "cabin" && b.cabin) itemName = b.cabin.nama;
        if (b.tipeItem === "jeep" && b.jeep) itemName = b.jeep.nama;
        if (b.tipeItem === "wisata" && b.wisataItem) itemName = b.wisataItem.nama;

        return {
            ...b,
            itemName,
        };
    });
}
