"use client";

import { useState } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import DataTable from "@/components/admin/DataTable";
import StatusBadge from "@/components/admin/StatusBadge";
import { updateBookingStatus } from "@/app/admin/actions/booking";

export default function BookingTableClient({ data }: { data: any[] }) {
    const [isUpdating, setIsUpdating] = useState<string | null>(null);

    const handleUpdateStatus = async (id: string, newStatus: string) => {
        setIsUpdating(id);
        try {
            await updateBookingStatus(id, newStatus);
        } catch (error) {
            console.error(error);
            alert("Gagal mengupdate status booking");
        } finally {
            setIsUpdating(null);
        }
    };

    const columns = [
        {
            header: "Kode & Item",
            accessorKey: "kodeBooking",
            cell: (item: any) => (
                <div>
                    <p className="font-medium text-slate-900">{item.kodeBooking}</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                        {item.tipeItem.toUpperCase()}: <span className="text-slate-700">{item.itemName}</span>
                    </p>
                </div>
            ),
        },
        {
            header: "Pelanggan",
            accessorKey: "namaLengkap",
            cell: (item: any) => (
                <div>
                    <p className="font-medium text-slate-900">{item.namaLengkap}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{item.email}</p>
                    <p className="text-xs text-slate-500">{item.telepon}</p>
                </div>
            ),
        },
        {
            header: "Check-in / Tanggal",
            accessorKey: "tanggal",
            cell: (item: any) => (
                <div>
                    <p className="text-sm font-bold text-slate-800">
                        {item.checkIn && item.checkOut ? (
                            <span className="flex flex-col">
                                <span className="text-primary text-[10px] uppercase font-black mb-0.5">MENGINAP</span>
                                <span>{new Date(item.checkIn).toLocaleDateString("id-ID", { day: "numeric", month: "short" })} - {new Date(item.checkOut).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</span>
                            </span>
                        ) : (
                            <span>{item.tanggal ? new Date(item.tanggal).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : "-"}</span>
                        )}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold">
                        Dipesan: {new Date(item.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
                    </p>
                </div>
            ),
        },
        {
            header: "Total",
            accessorKey: "total",
            cell: (item: any) => (
                <span className="font-medium whitespace-nowrap">Rp {item.total.toLocaleString("id-ID")}</span>
            ),
        },
        {
            header: "Status",
            accessorKey: "status",
            cell: (item: any) => <StatusBadge status={item.status} />,
        },
    ];

    const actions = (item: any) => (
        <div className="flex justify-end gap-2">
            <button
                onClick={() => window.location.href = `/admin/booking/${item.id}`}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors cursor-pointer"
                title="Lihat Detail"
            >
                Detail
            </button>

            {item.status.toLowerCase() !== "paid" && (
                <button
                    onClick={() => handleUpdateStatus(item.id, "Paid")}
                    disabled={isUpdating === item.id}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-green-700 bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                    title="Tandai Lunas"
                >
                    <CheckCircle className="w-3.5 h-3.5" /> Lunas
                </button>
            )}

            {item.status.toLowerCase() !== "cancelled" && (
                <button
                    onClick={() => handleUpdateStatus(item.id, "Cancelled")}
                    disabled={isUpdating === item.id}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                    title="Batalkan Booking"
                >
                    <XCircle className="w-3.5 h-3.5" /> Batal
                </button>
            )}
        </div>
    );

    return <DataTable columns={columns} data={data} actions={actions} />;
}
