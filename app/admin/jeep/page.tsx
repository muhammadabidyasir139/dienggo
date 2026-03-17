import Link from "next/link";
import { Plus } from "lucide-react";
import { getJeeps } from "@/app/admin/actions/jeep";
import JeepTableClient from "./JeepTableClient";

export default async function JeepPage() {
    const jeeps = await getJeeps();

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">Jeep</h2>
                    <p className="text-slate-500">Kelola daftar paket wisata menggunakan jeep.</p>
                </div>
                <Link
                    href="/admin/jeep/create"
                    className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Tambah Jeep
                </Link>
            </div>

            <JeepTableClient data={jeeps} />
        </div>
    );
}
