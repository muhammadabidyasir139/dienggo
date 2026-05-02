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

export async function getOrderByBookingCode(kodeBooking: string) {
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
            paymentUrl: bookings.paymentUrl,
            createdAt: bookings.createdAt,
            villa: { nama: villas.nama, fotoUtama: villas.fotoUtama },
            cabin: { nama: cabins.nama, fotoUtama: cabins.fotoUtama },
            jeep: { nama: jeeps.nama, fotoUtama: jeeps.fotoUtama },
            wisataItem: { nama: wisata.nama, fotoUtama: wisata.fotoUtama },
        })
        .from(bookings)
        .leftJoin(villas, eq(bookings.villaId, villas.id))
        .leftJoin(cabins, eq(bookings.cabinId, cabins.id))
        .leftJoin(jeeps, eq(bookings.jeepId, jeeps.id))
        .leftJoin(wisata, eq(bookings.wisataId, wisata.id))
        .where(eq(bookings.kodeBooking, kodeBooking))
        .limit(1);

    if (result.length === 0) return null;
    const b = result[0] as any;
    
    let itemName = "-";
    let itemFoto = "";
    if (b.tipeItem === "villa" && b.villa) { 
        itemName = b.villa.nama; 
        itemFoto = b.villa.fotoUtama || ""; 
    } else if ((b.tipeItem === "cabin" || b.tipeItem === "hotel-cabin") && b.cabin) { 
        itemName = b.cabin.nama; 
        itemFoto = b.cabin.fotoUtama || ""; 
    } else if (b.tipeItem === "jeep" && b.jeep) { 
        itemName = b.jeep.nama; 
        itemFoto = b.jeep.fotoUtama || ""; 
    } else if ((b.tipeItem === "wisata" || b.tipeItem === "aktivitas") && b.wisataItem) { 
        itemName = b.wisataItem.nama; 
        itemFoto = b.wisataItem.fotoUtama || ""; 
    }

    return {
        ...b,
        itemName,
        itemFoto,
    };
}

export async function getOrderDetailById(id: string) {
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
            paymentUrl: bookings.paymentUrl,
            snapToken: bookings.snapToken,
            permintaan: bookings.permintaan,
            createdAt: bookings.createdAt,
            villa: { nama: villas.nama, whatsappOwner: villas.whatsappOwner },
            cabin: { nama: cabins.nama, whatsappOwner: cabins.whatsappOwner },
            jeep: { nama: jeeps.nama, whatsappOwner: jeeps.whatsappOwner },
            wisataItem: { nama: wisata.nama, kontak: wisata.kontak }, // Notice: wisata uses 'kontak'
        })
        .from(bookings)
        .leftJoin(villas, eq(bookings.villaId, villas.id))
        .leftJoin(cabins, eq(bookings.cabinId, cabins.id))
        .leftJoin(jeeps, eq(bookings.jeepId, jeeps.id))
        .leftJoin(wisata, eq(bookings.wisataId, wisata.id))
        .where(eq(bookings.id, id))
        .limit(1);

    if (result.length === 0) return null;
    const b = result[0] as any;
    
    let itemName = "-";
    let whatsappOwner = "";
    if (b.tipeItem === "villa" && b.villa) { 
        itemName = b.villa.nama; 
        whatsappOwner = b.villa.whatsappOwner || ""; 
    } else if ((b.tipeItem === "cabin" || b.tipeItem === "hotel-cabin") && b.cabin) { 
        itemName = b.cabin.nama; 
        whatsappOwner = b.cabin.whatsappOwner || ""; 
    } else if (b.tipeItem === "jeep" && b.jeep) { 
        itemName = b.jeep.nama; 
        whatsappOwner = b.jeep.whatsappOwner || ""; 
    } else if ((b.tipeItem === "wisata" || b.tipeItem === "aktivitas") && b.wisataItem) { 
        itemName = b.wisataItem.nama; 
        whatsappOwner = b.wisataItem.kontak || ""; 
    }

    return {
        ...b,
        itemName,
        whatsappOwner,
    };
}

export async function mockPayOrder(kodeBooking: string) {
    await db.update(bookings).set({ status: "paid" }).where(eq(bookings.kodeBooking, kodeBooking));
}
