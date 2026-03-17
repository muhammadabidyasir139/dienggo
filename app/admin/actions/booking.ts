"use server";

import { db } from "@/db";
import { bookings, villas, cabins, jeeps, wisata } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getBookings() {
    // Join all relations to get item names based on tipeItem
    const result = await db
        .select({
            id: bookings.id,
            kodeBooking: bookings.kodeBooking,
            namaLengkap: bookings.namaLengkap,
            email: bookings.email,
            telepon: bookings.telepon,
            tipeItem: bookings.tipeItem,
            checkIn: bookings.checkIn,
            tanggal: bookings.tanggal,
            total: bookings.total,
            status: bookings.status,
            createdAt: bookings.createdAt,
            villa: { nama: villas.nama },
            cabin: { nama: cabins.nama },
            jeep: { nama: jeeps.nama },
            wisata: { nama: wisata.nama },
        })
        .from(bookings)
        .leftJoin(villas, eq(bookings.villaId, villas.id))
        .leftJoin(cabins, eq(bookings.cabinId, cabins.id))
        .leftJoin(jeeps, eq(bookings.jeepId, jeeps.id))
        .leftJoin(wisata, eq(bookings.wisataId, wisata.id))
        .orderBy(desc(bookings.createdAt));

    return result.map((b) => {
        let itemName = "-";
        if (b.tipeItem === "villa" && b.villa) itemName = b.villa.nama;
        if (b.tipeItem === "cabin" && b.cabin) itemName = b.cabin.nama;
        if (b.tipeItem === "jeep" && b.jeep) itemName = b.jeep.nama;
        if (b.tipeItem === "wisata" && b.wisata) itemName = b.wisata.nama;

        return {
            ...b,
            itemName,
        };
    });
}

export async function updateBookingStatus(id: string, status: string) {
    try {
        await db
            .update(bookings)
            .set({ status, updatedAt: new Date() })
            .where(eq(bookings.id, id));
        revalidatePath("/admin/booking");
        revalidatePath("/admin"); // Revalidate dashboard stats
        return { success: true };
    } catch (error: any) {
        console.error("Update booking status error:", error);
        return { success: false, error: error.message };
    }
}
