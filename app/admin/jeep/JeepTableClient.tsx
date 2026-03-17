"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Pencil, Trash2, Users, Clock } from "lucide-react";
import DataTable from "@/components/admin/DataTable";
import DeleteDialog from "@/components/admin/DeleteDialog";
import { deleteJeep } from "@/app/admin/actions/jeep";

export default function JeepTableClient({ data }: { data: any[] }) {
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!deleteId) return;
        setIsDeleting(true);
        try {
            await deleteJeep(deleteId);
            setDeleteId(null);
        } catch (error) {
            console.error(error);
            alert("Gagal menghapus jeep");
        } finally {
            setIsDeleting(false);
        }
    };

    const columns = [
        {
            header: "Paket Jeep",
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
                        <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                            <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {item.maksOrang} Orang</span>
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {item.durasi}</span>
                        </div>
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
            header: "Destinasi",
            accessorKey: "destinasiCount",
            cell: (item: any) => (
                <span>{item.destinasiCount} Lokasi</span>
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
    ];

    const actions = (item: any) => (
        <>
            <Link
                href={`/admin/jeep/${item.id}/edit`}
                className="inline-flex p-2 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                title="Edit"
            >
                <Pencil className="w-4 h-4" />
            </Link>
            <button
                onClick={() => setDeleteId(item.id)}
                className="inline-flex p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
                title="Hapus Jeep"
                description="Apakah Anda yakin ingin menghapus paket jeep ini? Tindakan ini tidak dapat dibatalkan."
                isDeleting={isDeleting}
                onConfirm={handleDelete}
                onCancel={() => setDeleteId(null)}
            />
        </>
    );
}
