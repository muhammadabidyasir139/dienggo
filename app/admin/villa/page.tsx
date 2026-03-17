import Link from "next/link";
import { Plus, Pencil, Trash2 } from "lucide-react";
import DataTable from "@/components/admin/DataTable";
import StatusBadge from "@/components/admin/StatusBadge";
import DeleteDialog from "@/components/admin/DeleteDialog";
import { getVillas, deleteVilla } from "@/app/admin/actions/villa";

// For Server Actions in React 19 / Next 15, we'll use a Client Component wrapper 
// for the delete button, or just pass the data to a Client Component table.
// To keep it simple, we'll fetch data here and pass to a Client Component for interactivity.

import VillaTableClient from "./VillaTableClient";

export default async function VillaPage() {
    const villas = await getVillas();

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">Villa</h2>
                    <p className="text-slate-500">Kelola daftar akomodasi tipe villa.</p>
                </div>
                <Link
                    href="/admin/villa/create"
                    className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Tambah Villa
                </Link>
            </div>

            <VillaTableClient data={villas} />
        </div>
    );
}
