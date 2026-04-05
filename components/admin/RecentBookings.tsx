"use client";

import { formatDistanceToNow } from "date-fns";
import StatusBadge from "./StatusBadge";

interface Booking {
    id: string;
    kodeBooking: string;
    namaLengkap: string;
    total: number;
    status: string | null;
    createdAt: Date | null;
}

interface RecentBookingsProps {
    bookings: Booking[];
}

export default function RecentBookings({ bookings }: RecentBookingsProps) {
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0,
        }).format(value);
    };

    if (!bookings || bookings.length === 0) {
        return (
            <div className="flex items-center justify-center h-[300px] text-slate-400 text-sm">
                Belum ada booking.
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {bookings.map((booking) => (
                <div 
                    key={booking.id} 
                    className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:border-blue-100 hover:bg-blue-50/30 transition-all group"
                >
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-mono text-slate-400">#{booking.kodeBooking}</span>
                            <StatusBadge status={booking.status || "unpaid"} />
                        </div>
                        <h4 className="font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">
                            {booking.namaLengkap}
                        </h4>
                        <p className="text-xs text-slate-500">
                            {booking.createdAt ? (
                                <>Dipesan {formatDistanceToNow(new Date(booking.createdAt), { addSuffix: true })}</>
                            ) : "Waktu tidak diketahui"}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="font-bold text-slate-900">
                            {formatCurrency(booking.total)}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}
