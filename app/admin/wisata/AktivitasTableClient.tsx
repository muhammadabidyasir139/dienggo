"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Pencil, Trash2 } from "lucide-react";
import DataTable from "@/components/admin/DataTable";
import DeleteDialog from "@/components/admin/DeleteDialog";
import { deleteAktivitas } from "@/app/admin/actions/wisata";
import Toast from "@/components/admin/Toast";

export default function AktivitasTableClient({ data }: { data: any[] }) {
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [toast, setToast] = useState<{ message: string, type: "success" | "error" } | null>(null);

    const handleDelete = async () => {
        if (!deleteId) return;
        setIsDeleting(true);
        try {
            await deleteAktivitas(deleteId);
            setDeleteId(null);
            setToast({ message: "Aktivitas berhasil dihapus", type: "success" });
        } catch (error) {
            console.error(error);
            setToast({ message: "Gagal menghapus aktivitas", type: "error" });
        } finally {
            setIsDeleting(false);
        }
    };

    const columns = [
        {
            header: "Aktivitas",
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
                        <p className="text-xs text-slate-500 line-clamp-1 max-w-xs">{item.isi || "Tidak ada konten"}</p>
                    </div>
                </div>
            ),
        },
        {
            header: "Highlight",
            accessorKey: "isActive",
            cell: (item: any) => (
                <span
                    className={`px-2.5 py-1 text-xs font-medium border rounded-full ${item.isActive
                            ? "bg-amber-100 text-amber-700 border-amber-200"
                            : "bg-slate-100 text-slate-700 border-slate-200"
                        }`}
                >
                    {item.isActive ? "Highlighted" : "Biasa"}
                </span>
            ),
        },
    ];

    const actions = (item: any) => (
        <>
            <Link
                href={`/admin/wisata/${item.id}/edit`}
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

            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            <DeleteDialog
                isOpen={!!deleteId}
                title="Hapus Aktivitas"
                description="Apakah Anda yakin ingin menghapus aktivitas ini? Tindakan ini tidak dapat dibatalkan."
                isDeleting={isDeleting}
                onConfirm={handleDelete}
                onCancel={() => setDeleteId(null)}
            />
        </>
    );
}
