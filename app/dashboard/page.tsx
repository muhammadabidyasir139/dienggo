import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getCustomerOrders } from "@/app/actions/orders";
import { ShoppingBag, Newspaper, User, ChevronRight } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);
    const orders = await getCustomerOrders(session?.user?.id || "");
    const unpaidCount = orders.filter(o => o.status === "unpaid").length;

    const stats = [
        { label: "Total Pesanan", value: orders.length, icon: ShoppingBag, color: "bg-blue-500", href: "/dashboard/pesanan" },
        { label: "Belum Bayar", value: unpaidCount, icon: ShoppingBag, color: "bg-amber-500", href: "/dashboard/pesanan?status=unpaid" },
    ];

    return (
        <div className="space-y-8">
            {/* Welcoming */}
            <div>
                <h1 className="text-3xl font-black text-foreground">Halo, {session?.user?.name || "User"} 👋</h1>
                <p className="text-neutral-500 mt-2">Selamat datang kembali di dashboard Dienggo. Kelola pesanan dan profil Anda dengan mudah.</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stats.map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                        <Link key={i} href={stat.href} className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm hover:shadow-md transition-shadow group">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`w-12 h-12 rounded-2xl ${stat.color} text-white flex items-center justify-center p-3`}>
                                    <Icon size={24} />
                                </div>
                                <ChevronRight className="text-neutral-300 group-hover:text-primary transition-colors" />
                            </div>
                            <p className="text-sm font-medium text-neutral-500">{stat.label}</p>
                            <p className="text-2xl font-black text-foreground">{stat.value}</p>
                        </Link>
                    )
                })}
            </div>

            {/* Recent Orders Section */}
            <div className="bg-white p-8 rounded-3xl border border-neutral-100 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-foreground">Pesanan Terakhir</h2>
                    <Link href="/dashboard/pesanan" className="text-sm font-bold text-primary hover:underline">
                        Lihat Semua
                    </Link>
                </div>

                {orders.length > 0 ? (
                    <div className="space-y-4">
                        {orders.slice(0, 3).map((order) => (
                            <div key={order.id} className="flex items-center justify-between p-4 rounded-2xl border border-neutral-50 hover:bg-neutral-50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold">
                                        {order.tipeItem[0].toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-primary uppercase tracking-wider">{order.tipeItem}</p>
                                        <h3 className="font-bold text-foreground">{order.itemName}</h3>
                                        <p className="text-xs text-neutral-400">{order.kodeBooking}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-black text-foreground">Rp {order.total.toLocaleString("id-ID")}</p>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${order.status === "paid" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"}`}>
                                        {order.status === "paid" ? "LUNAS" : "BELUM BAYAR"}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-neutral-400">Belum ada pesanan.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
