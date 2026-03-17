import { NextRequest, NextResponse } from "next/server";
import { snap } from "@/lib/midtrans";
import { db } from "@/db";
import { bookings } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
    try {
        const notification = await req.json();

        // Verify notification with Midtrans
        const statusResponse = await snap.transaction.notification(notification);

        const orderId = statusResponse.order_id;
        const transactionStatus = statusResponse.transaction_status;
        const fraudStatus = statusResponse.fraud_status;
        const paymentType = statusResponse.payment_type;

        console.log(`[Midtrans Webhook] Order: ${orderId}, Status: ${transactionStatus}, Fraud: ${fraudStatus}`);

        let bookingStatus = "unpaid";

        if (transactionStatus === "capture") {
            // For credit card transaction, check fraud status
            bookingStatus = fraudStatus === "accept" ? "paid" : "cancelled";
        } else if (transactionStatus === "settlement") {
            bookingStatus = "paid";
        } else if (transactionStatus === "pending") {
            bookingStatus = "unpaid";
        } else if (
            transactionStatus === "deny" ||
            transactionStatus === "cancel" ||
            transactionStatus === "expire"
        ) {
            bookingStatus = "cancelled";
        } else if (transactionStatus === "refund" || transactionStatus === "partial_refund") {
            bookingStatus = "refunded";
        }

        // Update booking status in database
        await db.update(bookings)
            .set({
                status: bookingStatus,
                metodeBayar: paymentType || "unknown",
                updatedAt: new Date(),
            })
            .where(eq(bookings.midtransOrderId, orderId));

        return NextResponse.json({ status: "ok" });
    } catch (error: any) {
        console.error("Midtrans notification error:", error);
        return NextResponse.json(
            { error: error?.message || "Notification processing failed" },
            { status: 500 }
        );
    }
}
