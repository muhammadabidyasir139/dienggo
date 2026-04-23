export const dynamic = "force-dynamic";

import Link from "next/link";
import { Plus } from "lucide-react";
import { getCabins } from "@/app/admin/actions/cabin";
import CabinTableClient from "./CabinTableClient";

export default async function CabinPage() {
    const cabins = await getCabins();

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">Cabin</h2>
                    <p className="text-slate-500">Kelola daftar akomodasi tipe cabin.</p>
                </div>
                <Link
                    href="/admin/cabin/create"
                    className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Tambah Cabin
                </Link>
            </div>

            <CabinTableClient data={cabins} />
        </div>
    );
}
