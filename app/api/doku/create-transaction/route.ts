import { NextRequest, NextResponse } from "next/server";
import { createDokuCheckout } from "@/lib/doku";
import { db } from "@/db";
import { bookings } from "@/db/schema";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import fs from "fs/promises";
import path from "path";

function generateOrderId() {
    return `DG-DKU-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
}

async function getItemDetails(slug: string, type: string) {
    const { villas, cabins, jeeps, wisata } = await import("@/db/schema");
    const { eq } = await import("drizzle-orm");
    try {
        let dbItem: any = null;
        if (type === "villa") {
            [dbItem] = await db.select().from(villas).where(eq(villas.slug, slug)).limit(1);
        } else if (type === "hotel-cabin") {
            [dbItem] = await db.select().from(cabins).where(eq(cabins.slug, slug)).limit(1);
        } else if (type === "jeep") {
            [dbItem] = await db.select().from(jeeps).where(eq(jeeps.slug, slug)).limit(1);
        } else if (type === "wisata") {
            [dbItem] = await db.select().from(wisata).where(eq(wisata.slug, slug)).limit(1);
        }
        
        if (dbItem) return { id: dbItem.id, nama: dbItem.nama, harga: dbItem.harga };
    } catch (e) {
        console.error("DB item lookup error:", e);
    }

    try {
        const fileName = type === "hotel-cabin" ? "cabins.json" : type === "wisata" ? "wisata.json" : `${type}s.json`;
        const filePath = path.join(process.cwd(), "data", fileName);
        const jsonData = await fs.readFile(filePath, "utf-8");
        const items = JSON.parse(jsonData);
        const jsonItem = items.find((item: any) => item.slug === slug);
        if (jsonItem) return { id: jsonItem.id, nama: jsonItem.nama, harga: jsonItem.harga };
    } catch (e) {
        console.error("JSON item lookup error:", e);
    }

    return null;
}

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        const body = await req.json();
        const { namaLengkap, email, telepon, permintaan, slug, type, checkIn, checkOut, tanggal, jumlahTamu } = body;

        if (!namaLengkap || !email || !telepon || !slug || !type) {
            return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
        }

        const item = await getItemDetails(slug, type);
        if (!item) {
            return NextResponse.json({ error: "Item tidak ditemukan" }, { status: 404 });
        }

        const subtotal = item.harga;
        let nightsTotal = 1;
        if ((type === "villa" || type === "hotel-cabin") && checkIn && checkOut) {
            const start = new Date(checkIn);
            const end = new Date(checkOut);
            const diffTime = Math.abs(end.getTime() - start.getTime());
            nightsTotal = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
        }
        const total = subtotal * nightsTotal;

        if (total === 0) {
            return NextResponse.json({ error: "Item gratis" }, { status: 400 });
        }

        const orderId = generateOrderId();
        const isUUID = (id: string | null) => id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
        const validDbItemId = isUUID(item.id) ? item.id : null;

        const [booking] = await db.insert(bookings).values({
            userId: session?.user?.id || null,
            kodeBooking: orderId,
            namaLengkap,
            email,
            telepon,
            permintaan: permintaan || null,
            tipeItem: type,
            checkIn: checkIn || null,
            checkOut: checkOut || null,
            tanggal: tanggal || null,
            jumlahTamu: jumlahTamu || 1,
            subtotal,
            pajak: 0,
            total,
            metodeBayar: "DOKU",
            status: "unpaid",
            midtransOrderId: orderId, // We repurpose this field for now or can add a new one
            villaId: type === "villa" ? validDbItemId : null,
            cabinId: type === "hotel-cabin" ? validDbItemId : null,
            jeepId: type === "jeep" ? validDbItemId : null,
            wisataId: type === "wisata" ? validDbItemId : null,
        }).returning();

        const dokuResponse = await createDokuCheckout({
            orderId,
            amount: total,
            customer: {
                name: namaLengkap,
                email,
                phone: telepon,
            },
            items: [
                {
                    name: `${item.nama.substring(0, 40)}${(type === "villa" || type === "hotel-cabin") ? ` (${nightsTotal} Malam)` : ""}`,
                    price: subtotal,
                    quantity: nightsTotal,
                },
            ],
        });

        // Update booking with DOKU payment URL
        const { eq } = await import("drizzle-orm");
        await db.update(bookings)
            .set({ 
                paymentUrl: dokuResponse.payment_url 
            })
            .where(eq(bookings.id, booking.id));

        return NextResponse.json({
            redirect_url: dokuResponse.payment_url,
            orderId: orderId,
        });
    } catch (error: any) {
        console.error("DOKU create transaction error:", error);
        return NextResponse.json(
            { error: error?.message || "Terjadi kesalahan saat membuat transaksi" },
            { status: 500 }
        );
    }
}
