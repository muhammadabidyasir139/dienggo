"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Pencil, Trash2 } from "lucide-react";
import DataTable from "@/components/admin/DataTable";
import StatusBadge from "@/components/admin/StatusBadge";
import DeleteDialog from "@/components/admin/DeleteDialog";
import { deleteVilla } from "@/app/admin/actions/villa";

export default function VillaTableClient({ data }: { data: any[] }) {
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // In Next.js, refreshing the router will re-fetch Server Components
    const handleDelete = async () => {
        if (!deleteId) return;
        setIsDeleting(true);
        try {
            await deleteVilla(deleteId);
            setDeleteId(null);
        } catch (error) {
            console.error(error);
            alert("Gagal menghapus villa");
        } finally {
            setIsDeleting(false);
        }
    };

    const columns = [
        {
            header: "Villa",
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
    ];

    const actions = (item: any) => (
        <>
            <Link
                href={`/admin/villa/${item.id}/edit`}
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
                title="Hapus Villa"
                description="Apakah Anda yakin ingin menghapus villa ini? Data wisata terdekat dan lain-lain di dalamnya juga akan terhapus. Tindakan ini tidak dapat dibatalkan."
                isDeleting={isDeleting}
                onConfirm={handleDelete}
                onCancel={() => setDeleteId(null)}
            />
        </>
    );
}
