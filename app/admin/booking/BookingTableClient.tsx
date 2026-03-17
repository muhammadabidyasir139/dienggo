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
                    <p className="text-sm font-medium text-slate-700">
                        {item.checkIn || item.tanggal}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                        Dipesan: {new Date(item.createdAt).toLocaleDateString("id-ID")}
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
            {item.status.toLowerCase() !== "paid" && (
                <button
                    onClick={() => handleUpdateStatus(item.id, "Paid")}
                    disabled={isUpdating === item.id}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-green-700 bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg transition-colors disabled:opacity-50"
                    title="Tandai Lunas"
                >
                    <CheckCircle className="w-3.5 h-3.5" /> Lunas
                </button>
            )}

            {item.status.toLowerCase() !== "cancelled" && (
                <button
                    onClick={() => handleUpdateStatus(item.id, "Cancelled")}
                    disabled={isUpdating === item.id}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors disabled:opacity-50"
                    title="Batalkan Booking"
                >
                    <XCircle className="w-3.5 h-3.5" /> Batal
                </button>
            )}
        </div>
    );

    return <DataTable columns={columns} data={data} actions={actions} />;
}
