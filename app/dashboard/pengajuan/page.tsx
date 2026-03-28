import { Navbar } from "@/components/Navbar";
import { getUserHostRegistrations } from "@/app/admin/actions/host-registration";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { Home, Mountain, Car, MapPin, Calendar, Clock } from "lucide-react";
import StatusBadge from "@/components/admin/StatusBadge";
import { formatCurrency } from "@/lib/utils";
import { getTranslations } from "next-intl/server";

export default async function UserRegistrationsPage() {
    const session = await getServerSession(authOptions);
    const t = await getTranslations("Navigation");

    if (!session?.user) {
        redirect("/login");
    }

    const userId = (session.user as any).id || session.user.email;
    const registrations = await getUserHostRegistrations(userId);

    return (
        <main className="min-h-screen bg-slate-50 pt-24 pb-12">
            <Navbar />
            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                        {t("my_registrations")}
                    </h1>
                    <p className="text-slate-500 mt-1">
                        Pantau status pengajuan properti Anda di sini.
                    </p>
                </div>

                {registrations.length === 0 ? (
                    <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-slate-100">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                            <Home size={40} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">Belum ada pengajuan</h3>
                        <p className="text-slate-500 mt-2 max-w-xs mx-auto">
                            Anda belum mendaftarkan properti apapun sebagai tuan rumah.
                        </p>
                        <a 
                            href="/daftar-tuan-rumah"
                            className="inline-block mt-6 px-6 py-3 bg-primary text-white font-bold rounded-xl hover:scale-105 transition-transform"
                        >
                            Daftar Sekarang
                        </a>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {registrations.map((reg) => (
                            <div key={reg.id} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all hover:shadow-md">
                                <div className="flex items-start gap-4">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
                                        reg.category === 'villa' ? 'bg-blue-50 text-blue-500' : 
                                        reg.category === 'cabin' ? 'bg-emerald-50 text-emerald-500' : 
                                        'bg-amber-50 text-amber-500'
                                    }`}>
                                        {reg.category === 'villa' && <Home size={28} />}
                                        {reg.category === 'cabin' && <Mountain size={28} />}
                                        {reg.category === 'jeep' && <Car size={28} />}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                                {reg.category}
                                            </span>
                                            <span className="text-slate-300">•</span>
                                            <div className="flex items-center gap-1 text-xs font-medium text-slate-500">
                                                <Calendar size={12} />
                                                {new Date(reg.createdAt!).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </div>
                                        </div>
                                        <h3 className="text-xl font-black text-slate-900 leading-tight mb-1">
                                            {reg.nama}
                                        </h3>
                                        <div className="flex items-center gap-2 text-sm text-slate-500">
                                            <MapPin size={14} />
                                            <span className="truncate max-w-[200px] md:max-w-md">
                                                {reg.alamatJalan}, {reg.kota}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-2 border-t md:border-t-0 pt-4 md:pt-0">
                                    <div className="text-right">
                                        <p className="text-xs font-bold text-slate-400 uppercase mb-1">Harga Dasar</p>
                                        <p className="text-lg font-black text-primary">{formatCurrency(reg.hargaDasar)}</p>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        <p className="text-xs font-bold text-slate-400 uppercase mb-1">Status</p>
                                        <StatusBadge status={reg.status!} />
                                        {reg.status === 'pending' && (
                                            <div className="flex items-center gap-1 text-[10px] font-bold text-amber-600 mt-1 uppercase tracking-tighter">
                                                <Clock size={10} />
                                                Dalam Tinjauan
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
