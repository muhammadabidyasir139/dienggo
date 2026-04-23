export const dynamic = "force-dynamic";

import Link from "next/link";
import { Plus } from "lucide-react";
import FacilityTable from "./FacilityTable";
import { getFacilities } from "@/app/admin/actions/facility";

export default async function FacilityPage() {
    const facilities = await getFacilities();

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">Fasilitas</h2>
                    <p className="text-slate-500">Kelola daftar fasilitas yang tersedia.</p>
                </div>
                <Link
                    href="/admin/facilities/create"
                    className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Tambah Fasilitas
                </Link>
            </div>

            <FacilityTable data={facilities} />
        </div>
    );
}
