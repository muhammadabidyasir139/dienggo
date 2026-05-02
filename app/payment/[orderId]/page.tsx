import { db } from "@/db";
import { bookings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Wallet, ExternalLink, CalendarClock, CheckCircle } from "lucide-react";
import { mockPayOrder } from "@/app/actions/orders";

export default async function PaymentPage({ params }: { params: Promise<{ orderId: string }> }) {
    const { orderId } = await params;

    const [booking] = await db.select().from(bookings).where(eq(bookings.kodeBooking, orderId)).limit(1);

    if (!booking) {
        notFound();
    }

    return (
        <div className="container mx-auto px-4 py-12 max-w-3xl min-h-[70vh] flex flex-col items-center justify-center">
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-neutral-100 w-full text-center">
                <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CalendarClock className="text-amber-500 w-10 h-10" />
                </div>
                
                <h1 className="text-3xl font-black text-neutral-900 mb-4">
                    Pesanan Diterima!
                </h1>
                
                <p className="text-lg text-neutral-600 mb-8 max-w-lg mx-auto">
                    Terima kasih! Pesanan Anda dengan nomor <span className="font-bold text-primary">{orderId}</span> telah kami terima. 
                    <br/><br/>
                    <strong>Anda akan dihubungi oleh admin</strong> terkait ketersediaan pesanan Anda.
                </p>

                <div className="bg-primary/5 rounded-2xl p-6 mb-8 text-left border border-primary/20">
                    <h3 className="font-bold text-neutral-900 flex items-center gap-2 mb-4">
                        <Wallet className="text-primary" />
                        Metode Pembayaran
                    </h3>
                    <p className="text-neutral-600 text-sm mb-6 leading-relaxed">
                        Jika Admin telah mengkonfirmasi ketersediaan kepada Anda, silakan lanjutkan proses pembayaran dengan mengklik tombol di bawah ini. Anda akan diarahkan ke halaman pembayaran DOKU untuk mendapatkan nomor Virtual Account (VA) beserta panduan cara membayarnya.
                    </p>

                    {/* ORIGINAL PAYMENT LINK (Commented out for testing) */}
                    {/* <Link href={booking.paymentUrl || "#"} className="flex w-full items-center justify-center gap-2 bg-primary text-white font-bold py-4 px-8 rounded-xl hover:bg-primary/90 hover:scale-[1.02] transition-all">
                        Klik Bayar Sekarang
                        <ExternalLink size={20} />
                    </Link> */}

                    {/* MOCK PAYMENT FORM (Temporary for testing) */}
                    <form action={async () => {
                        "use server";
                        await mockPayOrder(orderId);
                        redirect(`/payment/${orderId}/success`);
                    }}>
                        <button type="submit" className="flex w-full items-center justify-center gap-2 bg-emerald-500 text-white font-bold py-4 px-8 rounded-xl hover:bg-emerald-600 hover:scale-[1.02] transition-all">
                            Simulasi Bayar Berhasil (Test)
                            <CheckCircle size={20} />
                        </button>
                    </form>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
                    <Link href="/pesanan" className="text-neutral-500 font-medium hover:text-primary transition-colors">
                        Lihat Pesanan Saya
                    </Link>
                    <span className="hidden sm:inline text-neutral-300">|</span>
                    <Link href="/" className="text-neutral-500 font-medium hover:text-primary transition-colors">
                        Kembali ke Beranda
                    </Link>
                </div>
            </div>
        </div>
    );
}
