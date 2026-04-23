import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { bookings } from "@/db/schema";
import { eq } from "drizzle-orm";
// import { DOKU_CONFIG } from "@/lib/doku"; // For signature verification if needed

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        
        // DOKU Jokul notification structure:
        // {
        //   "order": { "invoice_number": "...", "amount": ... },
        //   "transaction": { "status": "SUCCESS" | "FAILED", "date": "..." },
        //   ...
        // }
        
        const orderId = body.order?.invoice_number;
        const dokuStatus = body.transaction?.status;
        
        if (!orderId) {
            return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
        }

        console.log(`[DOKU Webhook] Order: ${orderId}, Status: ${dokuStatus}`);

        let bookingStatus = "unpaid";
        if (dokuStatus === "SUCCESS") {
            bookingStatus = "paid";
        } else if (dokuStatus === "FAILED" || dokuStatus === "EXPIRED") {
            bookingStatus = "cancelled";
        }

        // Update database
        await db.update(bookings)
            .set({
                status: bookingStatus,
                metodeBayar: "DOKU",
                updatedAt: new Date(),
            })
            .where(eq(bookings.midtransOrderId, orderId));

        return NextResponse.json({ status: "ok" });
    } catch (error: any) {
        console.error("DOKU notification error:", error);
        return NextResponse.json(
            { error: error?.message || "Notification processing failed" },
            { status: 500 }
        );
    }
}
