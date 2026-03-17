import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { getCustomerOrders } from "@/app/actions/orders";
import { OrderCard } from "@/components/OrderCard";
import { ShoppingBag, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function PesananPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        redirect("/login");
    }

    const orders = await getCustomerOrders(session.user.id);

    return (
        <main className="min-h-screen bg-background pb-20">
            <Navbar />

            <div className="pt-24 md:pt-32 pb-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-primary dark:hover:text-accent font-medium mb-4 transition-colors"
                    >
                        <ArrowLeft size={16} /> Kembali ke Beranda
                    </Link>
                    <h1 className="text-3xl font-black text-foreground">Pesanan Saya</h1>
                    <p className="mt-1 text-neutral-500 text-sm">
                        Riwayat pemesanan villa, tour, dan aktivitas wisata Anda.
                    </p>
                </div>

                {/* Orders List */}
                {orders.length > 0 ? (
                    <div className="flex flex-col gap-4">
                        {orders.map((order) => (
                            <OrderCard key={order.id} order={order} />
                        ))}
                    </div>
                ) : (
                    /* Empty State */
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-20 h-20 rounded-full bg-neutral-100 dark:bg-slate-800 flex items-center justify-center mb-6">
                            <ShoppingBag size={36} className="text-neutral-300 dark:text-slate-600" />
                        </div>
                        <h2 className="text-xl font-bold text-foreground mb-2">Belum Ada Pesanan</h2>
                        <p className="text-neutral-500 text-sm max-w-sm mb-6">
                            Anda belum memiliki pesanan.
                            Jelajahi villa dan aktivitas wisata di Dieng sekarang!
                        </p>
                        <div className="flex gap-3">
                            <Link
                                href="/villa"
                                className="px-6 py-3 rounded-xl bg-primary text-white dark:bg-accent dark:text-neutral-900 font-bold hover:scale-[1.02] transition-transform"
                            >
                                Lihat Villa
                            </Link>
                            <Link
                                href="/wisata"
                                className="px-6 py-3 rounded-xl bg-white dark:bg-slate-800 text-foreground font-bold border border-neutral-200 dark:border-slate-700 hover:bg-neutral-50 dark:hover:bg-slate-700 transition-colors"
                            >
                                Lihat Wisata
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
