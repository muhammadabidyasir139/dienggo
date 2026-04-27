import { getSettings } from "@/app/admin/actions/settings";
import MaintenanceToggle from "@/components/admin/MaintenanceToggle";

export default async function SettingsPage() {
    const settings = await getSettings();

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">Pengaturan</h2>
                <p className="text-slate-500">Kelola pengaturan aplikasi Dienggo.</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-slate-900">Mode Perbaikan (Maintenance Mode)</h3>
                        <p className="text-sm text-slate-500 max-w-md">
                            Aktifkan ini untuk mengalihkan semua pengguna ke halaman perbaikan. Admin tetap dapat mengakses panel administrasi.
                        </p>
                    </div>
                    <MaintenanceToggle initialValue={settings.isMaintenanceMode} />
                </div>
            </div>
        </div>
    );
}
