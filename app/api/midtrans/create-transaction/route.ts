import { NextRequest, NextResponse } from "next/server";
import { snap } from "@/lib/midtrans";
import { db } from "@/db";
import { bookings } from "@/db/schema";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import fs from "fs/promises";
import path from "path";

function generateOrderId() {
    return `DG-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
}

async function getItemDetails(slug: string, type: string) {
    // 1. Try database first
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
        
        if (dbItem) {
            return {
                id: dbItem.id,
                nama: dbItem.nama,
                harga: dbItem.harga
            };
        }
    } catch (e) {
        console.error("DB item lookup error:", e);
    }

    // 2. Fallback to JSON
    try {
        const fileName = type === "hotel-cabin" ? "cabins.json" : type === "wisata" ? "wisata.json" : `${type}s.json`;
        const filePath = path.join(process.cwd(), "data", fileName);
        const jsonData = await fs.readFile(filePath, "utf-8");
        const items = JSON.parse(jsonData);
        const jsonItem = items.find((item: { slug: string; [key: string]: unknown }) => item.slug === slug);
        if (jsonItem) {
            return {
                id: jsonItem.id,
                nama: jsonItem.nama,
                harga: jsonItem.harga
            };
        }
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

        // Validate required fields
        if (!namaLengkap || !email || !telepon || !slug || !type) {
            return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
        }

        // Fetch item details
        const item = await getItemDetails(slug, type);
        if (!item) {
            return NextResponse.json({ error: "Item tidak ditemukan" }, { status: 404 });
        }

        // Calculate prices
        const subtotal = item.harga;
        let nightsTotal = 1;
        if ((type === "villa" || type === "hotel-cabin") && checkIn && checkOut) {
            const start = new Date(checkIn);
            const end = new Date(checkOut);
            const diffTime = Math.abs(end.getTime() - start.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            nightsTotal = diffDays > 0 ? diffDays : 1;
        }
        const total = subtotal * nightsTotal;

        if (total === 0) {
            return NextResponse.json({ error: "Item gratis, tidak perlu pembayaran" }, { status: 400 });
        }

        const orderId = generateOrderId();

        // Ensure we have a valid UUID for the database reference
        const isUUID = (id: string | null) => id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
        const validDbItemId = isUUID(item.id) ? item.id : null;

        const itemRefs: Record<string, string | null> = {
            villaId: type === "villa" ? validDbItemId : null,
            cabinId: type === "hotel-cabin" ? validDbItemId : null,
            jeepId: type === "jeep" ? validDbItemId : null,
            wisataId: type === "wisata" ? validDbItemId : null,
        };

        // Insert booking into database
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
            metodeBayar: "pending",
            status: "unpaid",
            midtransOrderId: orderId,
            ...itemRefs,
        }).returning();

        // Create Midtrans transaction
        const parameter = {
            transaction_details: {
                order_id: orderId,
                gross_amount: total,
            },
            item_details: [
                {
                    id: slug,
                    price: subtotal,
                    quantity: nightsTotal,
                    name: `${item.nama.substring(0, 40)}${(type === "villa" || type === "hotel-cabin") ? ` (${nightsTotal} Malam)` : ""}`, // Midtrans limit 50 chars
                },
            ],
            customer_details: {
                first_name: namaLengkap,
                email: email,
                phone: telepon,
            },
        };

        const transaction = await snap.createTransaction(parameter);

        // Update booking with snap token
        const { eq } = await import("drizzle-orm");
        await db.update(bookings)
            .set({ snapToken: transaction.token })
            .where(eq(bookings.id, booking.id));

        return NextResponse.json({
            token: transaction.token,
            redirect_url: transaction.redirect_url,
            orderId: orderId,
        });
    } catch (error: any) {
        console.error("Midtrans create transaction error:", error);
        return NextResponse.json(
            { error: error?.message || "Terjadi kesalahan saat membuat transaksi" },
            { status: 500 }
        );
    }
}
