import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getCustomerOrders } from "@/app/actions/orders";
import { OrderCard } from "@/components/OrderCard";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";

export default async function PesananDashboardPage({
    searchParams,
}: {
    searchParams: Promise<{ status?: string }>;
}) {
    const session = await getServerSession(authOptions);
    const { status } = await searchParams;
    
    let orders = await getCustomerOrders(session?.user?.id || "");
    
    if (status) {
        orders = orders.filter(o => o.status === status);
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black text-foreground">Pesanan Saya</h1>
                <p className="text-neutral-500 mt-2">Daftar riwayat pemesanan villa, hotel cabin, dan aktivitas wisata Anda.</p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 p-1.5 bg-neutral-100 rounded-2xl w-fit">
                {[
                    { label: "Semua", value: "" },
                    { label: "Belum Bayar", value: "unpaid" },
                    { label: "Lunas", value: "paid" },
                ].map((tab) => {
                    const isActive = status === tab.value || (!status && tab.value === "");
                    return (
                        <Link
                            key={tab.value}
                            href={tab.value ? `/dashboard/pesanan?status=${tab.value}` : "/dashboard/pesanan"}
                            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${isActive
                                    ? "bg-white text-primary shadow-sm"
                                    : "text-neutral-500 hover:text-foreground"
                                }`}
                        >
                            {tab.label}
                        </Link>
                    )
                })}
            </div>

            {/* List Order */}
            {orders.length > 0 ? (
                <div className="flex flex-col gap-6">
                    {orders.map((order) => (
                        <div key={order.id} className="max-w-2xl">
                             <OrderCard order={order} />
                        </div>
                    ))}
                </div>
            ) : (
                 /* Empty State */
                 <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-3xl border border-neutral-100 shadow-sm max-w-2xl">
                    <div className="w-20 h-20 rounded-full bg-neutral-100 flex items-center justify-center mb-6">
                        <ShoppingBag size={36} className="text-neutral-300" />
                    </div>
                    <h2 className="text-xl font-bold text-foreground mb-2">Belum Ada Pesanan</h2>
                    <p className="text-neutral-500 text-sm max-w-sm mb-6 px-4">
                        Anda belum memiliki pesanan {status ? `dengan status ${status === 'paid' ? 'Lunas' : 'Belum Bayar'}` : ""}.
                        Jelajahi villa dan aktivitas wisata di Dieng sekarang!
                    </p>
                    <div className="flex gap-3 px-4">
                        <Link
                            href="/villa"
                            className="px-6 py-3 rounded-xl bg-primary text-white font-bold hover:scale-[1.02] transition-transform"
                        >
                            Lihat Villa
                        </Link>
                        <Link
                            href="/aktivitas"
                            className="px-6 py-3 rounded-xl bg-white text-foreground font-bold border border-neutral-200 hover:bg-neutral-50 transition-colors"
                        >
                            Lihat Aktivitas
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
