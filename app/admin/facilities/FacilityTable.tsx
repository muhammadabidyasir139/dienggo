"use client";

import { useState } from "react";
import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import DataTable from "@/components/admin/DataTable";
import DeleteDialog from "@/components/admin/DeleteDialog";
import { deleteFacility } from "@/app/admin/actions/facility";

export default function FacilityTable({ data }: { data: any[] }) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await deleteFacility(deleteId);
      setDeleteId(null);
    } catch (error) {
      console.error(error);
      alert("Gagal menghapus fasilitas");
    } finally {
      setIsDeleting(false);
    }
  };

  const columns = [
    {
      header: "Nama Fasilitas",
      accessorKey: "name",
    },
    {
      header: "Ikon",
      accessorKey: "icon",
    },
  ];

  const actions = (item: any) => (
    <>
      <Link
        href={`/admin/facilities/${item.id}/edit`}
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
        title="Hapus Fasilitas"
        description="Apakah Anda yakin ingin menghapus fasilitas ini? Tindakan ini tidak dapat dibatalkan."
        isDeleting={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </>
  );
}
