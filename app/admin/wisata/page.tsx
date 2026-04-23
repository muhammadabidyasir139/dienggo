export const dynamic = "force-dynamic";

import Link from "next/link";
import { Plus } from "lucide-react";
import { getAktivitas } from "@/app/admin/actions/wisata";
import AktivitasTableClient from "./AktivitasTableClient";

export default async function AktivitasPage() {
    const aktivitas = await getAktivitas();

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">Wisata & Aktivitas</h2>
                    <p className="text-slate-500">Kelola daftar wisata dan aktivitas Dieng.</p>
                </div>
                <Link
                    href="/admin/wisata/create"
                    className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Tambah Wisata
                </Link>
            </div>

            <AktivitasTableClient data={aktivitas} />
        </div>
    );
}
