"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Pencil, Trash2, Calendar } from "lucide-react";
import DataTable from "@/components/admin/DataTable";
import DeleteDialog from "@/components/admin/DeleteDialog";
import BookedDatesModal from "@/components/admin/BookedDatesModal";
import { deleteCabin, updateCabin } from "@/app/admin/actions/cabin";

export default function CabinTableClient({ data }: { data: any[] }) {
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [bookedModalData, setBookedModalData] = useState<{ id: string, name: string, dates: string[] } | null>(null);

    const handleDelete = async () => {
        if (!deleteId) return;
        setIsDeleting(true);
        try {
            await deleteCabin(deleteId);
            setDeleteId(null);
        } catch (error) {
            console.error(error);
            alert("Gagal menghapus cabin");
        } finally {
            setIsDeleting(false);
        }
    };

    const columns = [
        {
            header: "Cabin",
            accessorKey: "nama",
            cell: (item: any) => (
                <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded bg-slate-100 overflow-hidden flex-shrink-0">
                        {item.fotoUtama ? (
                            <Image src={item.fotoUtama} alt={item.nama} fill className="object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">No Img</div>
                        )}
                    </div>
                    <div>
                        <p className="font-medium text-slate-900">{item.nama}</p>
                        <p className="text-xs text-slate-500">{item.lokasi}</p>
                    </div>
                </div>
            ),
        },
        {
            header: "Harga",
            accessorKey: "harga",
            cell: (item: any) => (
                <span>Rp {item.harga.toLocaleString("id-ID")}</span>
            ),
        },
        {
            header: "Status",
            accessorKey: "isActive",
            cell: (item: any) => (
                <span
                    className={`px-2.5 py-1 text-xs font-medium border rounded-full ${item.isActive
                            ? "bg-green-100 text-green-700 border-green-200"
                            : "bg-slate-100 text-slate-700 border-slate-200"
                        }`}
                >
                    {item.isActive ? "Aktif" : "Nonaktif"}
                </span>
            ),
        },
        {
            header: "WhatsApp Owner",
            accessorKey: "whatsappOwner",
            cell: (item: any) => (
                <span className="text-sm text-slate-600">{item.whatsappOwner || "-"}</span>
            ),
        },
    ];

    const handleSaveBookedDates = async (dates: string[]) => {
        if (!bookedModalData) return;
        try {
            await updateCabin(bookedModalData.id, { bookedDates: dates });
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    const actions = (item: any) => (
        <>
            <button
                onClick={() => setBookedModalData({ id: item.id, name: item.nama, dates: item.bookedDates || [] })}
                className="inline-flex p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                title="Kelola Tanggal Booked"
            >
                <Calendar className="w-4 h-4" />
            </button>
            <Link
                href={`/admin/cabin/${item.id}/edit`}
                className="inline-flex p-2 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                title="Edit"
            >
                <Pencil className="w-4 h-4" />
            </Link>
            <button
                onClick={() => setDeleteId(item.id)}
                className="inline-flex p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                title="Hapus"
            >
                <Trash2 className="w-4 h-4" />
            </button>
        </>
    );

    return (
        <>
            <DataTable columns={columns} data={data} actions={actions} />

            <DeleteDialog
                isOpen={!!deleteId}
                title="Hapus Cabin"
                description="Apakah Anda yakin ingin menghapus cabin ini? Data wisata terdekat dan lain-lain di dalamnya juga akan terhapus. Tindakan ini tidak dapat dibatalkan."
                isDeleting={isDeleting}
                onConfirm={handleDelete}
                onCancel={() => setDeleteId(null)}
            />

            <BookedDatesModal
                isOpen={!!bookedModalData}
                onClose={() => setBookedModalData(null)}
                itemId={bookedModalData?.id || ""}
                itemType="cabin"
                itemName={bookedModalData?.name || ""}
                initialDates={bookedModalData?.dates || []}
                onSave={handleSaveBookedDates}
            />
        </>
    );
}
