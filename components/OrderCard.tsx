"use client";

import { Calendar, CreditCard, Hash, MapPin, Users } from "lucide-react";

type OrderStatus = "unpaid" | "paid" | "cancelled" | "refunded";

const statusConfig: Record<OrderStatus, { label: string; bg: string; text: string; dot: string }> = {
    unpaid: { label: "Belum Bayar", bg: "bg-amber-50 dark:bg-amber-900/20", text: "text-amber-700 dark:text-amber-400", dot: "bg-amber-500" },
    paid: { label: "Lunas", bg: "bg-emerald-50 dark:bg-emerald-900/20", text: "text-emerald-700 dark:text-emerald-400", dot: "bg-emerald-500" },
    cancelled: { label: "Dibatalkan", bg: "bg-red-50 dark:bg-red-900/20", text: "text-red-700 dark:text-red-400", dot: "bg-red-500" },
    refunded: { label: "Refund", bg: "bg-blue-50 dark:bg-blue-900/20", text: "text-blue-700 dark:text-blue-400", dot: "bg-blue-500" },
};

const typeLabels: Record<string, string> = {
    villa: "Villa",
    cabin: "Hotel Cabin",
    jeep: "Jeep Tour",
    wisata: "Wisata",
};

interface OrderCardProps {
    kodeBooking: string;
    tipeItem: string;
    itemName: string;
    checkIn: string | null;
    checkOut: string | null;
    tanggal: string | null;
    jumlahTamu: number | null;
    total: number;
    metodeBayar: string;
    status: string | null;
    createdAt: Date | null;
}

export function OrderCard({ order }: { order: OrderCardProps }) {
    const s = statusConfig[(order.status?.toLowerCase() as OrderStatus) || "unpaid"];
    const dateDisplay = order.checkIn
        ? `${new Date(order.checkIn).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}${order.checkOut ? ` → ${new Date(order.checkOut).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}` : ""}`
        : order.tanggal
            ? new Date(order.tanggal).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
            : "-";

    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-neutral-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 bg-neutral-50 dark:bg-slate-800/50 border-b border-neutral-100 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                    <Hash size={14} className="text-neutral-400" />
                    <span className="text-sm font-bold text-foreground tracking-wide">{order.kodeBooking}</span>
                </div>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${s.bg} ${s.text}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                    {s.label}
                </span>
            </div>

            {/* Body */}
            <div className="p-5 space-y-4">
                {/* Item */}
                <div>
                    <p className="text-xs font-bold text-primary dark:text-accent uppercase tracking-wider mb-0.5">
                        {typeLabels[order.tipeItem] || order.tipeItem}
                    </p>
                    <h3 className="text-lg font-bold text-foreground leading-snug">{order.itemName}</h3>
                </div>

                {/* Details grid */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                        <Calendar size={15} className="text-neutral-400 shrink-0" />
                        <span>{dateDisplay}</span>
                    </div>
                    {order.jumlahTamu && (
                        <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                            <Users size={15} className="text-neutral-400 shrink-0" />
                            <span>{order.jumlahTamu} tamu</span>
                        </div>
                    )}
                    <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                        <CreditCard size={15} className="text-neutral-400 shrink-0" />
                        <span className="capitalize">{order.metodeBayar}</span>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-neutral-100 dark:border-slate-800">
                    <p className="text-xs text-neutral-400">
                        Dipesan {order.createdAt ? new Date(order.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : "-"}
                    </p>
                    <p className="text-xl font-black text-primary dark:text-accent">
                        Rp {order.total.toLocaleString("id-ID")}
                    </p>
                </div>
            </div>
        </div>
    );
}
