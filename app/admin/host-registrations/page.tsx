import { getHostRegistrations } from "@/app/admin/actions/host-registration";
import HostRegistrationsTable from "./HostRegistrationsTable";

export default async function HostRegistrationsPage() {
    const data = await getHostRegistrations();

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                        Registrasi Tuan Rumah
                    </h1>
                    <p className="text-slate-500 mt-1 font-medium">
                        Kelola pendaftaran properti baru dari calon host Dienggo.
                    </p>
                </div>
            </div>

            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-6">
                <HostRegistrationsTable data={data} />
            </div>
        </div>
    );
}
