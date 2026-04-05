"use server";

import { db } from "@/db";
import { bookings } from "@/db/schema";
import { desc, eq, sql } from "drizzle-orm";

export async function getDashboardData() {
    const rawLatestBookings = await db.select()
        .from(bookings)
        .orderBy(desc(bookings.createdAt))
        .limit(5);

    // Serialize Date objects for React Client Components
    const latestBookings = rawLatestBookings.map(b => ({
        ...b,
        createdAt: b.createdAt ? b.createdAt.toISOString() : null,
        updatedAt: b.updatedAt ? b.updatedAt.toISOString() : null,
        // Drizzle might return Date for checkIn/checkOut too
        checkIn: b.checkIn ? String(b.checkIn) : null,
        checkOut: b.checkOut ? String(b.checkOut) : null,
        tanggal: b.tanggal ? String(b.tanggal) : null,
    }));

    const revenueData = await db.select({
        date: bookings.createdAt,
        total: bookings.total,
        status: bookings.status
    }).from(bookings);

    return {
        latestBookings,
        revenueData: revenueData.map(d => ({
            date: d.date ? d.date.toISOString() : null,
            amount: Number(d.total),
            status: d.status
        }))
    };
}
