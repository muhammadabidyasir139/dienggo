import { Navbar } from "@/components/Navbar";
import { getHostRegistrationById } from "@/app/admin/actions/host-registration";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import { 
  Home, 
  Mountain, 
  Car, 
  MapPin, 
  Calendar, 
  Clock, 
  ArrowLeft,
  Wifi,
  Tv,
  ChefHat,
  Waves,
  Wind,
  Briefcase,
  Coffee,
  Flame,
  Dumbbell,
  Palmtree,
  Zap,
  ShieldAlert,
  Map as MapIcon,
  CheckCircle2,
  XCircle,
  AlertCircle
} from "lucide-react";
import StatusBadge from "@/components/admin/StatusBadge";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";

const facilityIcons: Record<string, any> = {
  wifi: Wifi,
  tv: Tv,
  dapur: ChefHat,
  mesin_cuci: Waves,
  parkir_gratis: Car,
  parkir_berbayar: Car,
  ac: Wind,
  area_kerja: Briefcase,
  kolam_renang: Waves,
  bak_mandi_panas: Flame,
  patio: Palmtree,
  bbq: ChefHat,
  area_makan_luar: Coffee,
  perapian: Flame,
  meja_biliar: Zap,
  perapian_dalam: Flame,
  piano: Zap,
  peralatan_olahraga: Dumbbell,
  akses_danau: Waves,
  akses_pantai: Palmtree,
  akses_ski: Mountain,
  pancuran_luar: Waves,
};

const safetyIcons: Record<string, any> = {
  alarm_asap: ShieldAlert,
  p3k: ShieldAlert,
  pemadam_api: ShieldAlert,
  alarm_karbon: ShieldAlert,
};

export default async function RegistrationDetailPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const registration = await getHostRegistrationById(params.id);
  if (!registration) notFound();

  // Security check: only owner or admin can view
  const userId = (session.user as any).id || session.user.email;
  if (registration.userId !== userId && session.user.role !== 'admin') {
    redirect("/dashboard/pengajuan");
  }

  const fotos = registration.fotos as string[] || [];
  const fasilitas = registration.fasilitas as string[] || [];
  const itemKeselamatan = registration.itemKeselamatan as string[] || [];

  return (
    <main className="min-h-screen bg-slate-50 pt-24 pb-12">
      <Navbar />
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link 
          href="/dashboard/pengajuan"
          className="inline-flex items-center gap-2 text-slate-500 hover:text-primary font-bold mb-8 transition-colors group"
        >
          <div className="p-2 rounded-xl bg-white shadow-sm border border-slate-100 group-hover:bg-primary/5 group-hover:border-primary/20 transition-all">
            <ArrowLeft size={18} />
          </div>
          Kembali ke Daftar Pengajuan
        </Link>

        {/* Header Section */}
        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100 mb-8 relative overflow-hidden">
          {/* Background Decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl -z-10" />
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-6">
              <div className={`w-20 h-20 rounded-3xl flex items-center justify-center shrink-0 shadow-lg ${
                registration.category === "villa" 
                  ? "bg-blue-500 text-white shadow-blue-500/20" 
                  : registration.category === "cabin" 
                    ? "bg-emerald-500 text-white shadow-emerald-500/20" 
                    : "bg-amber-500 text-white shadow-amber-500/20"
              }`}>
                {registration.category === "villa" && <Home size={40} />}
                {registration.category === "cabin" && <Mountain size={40} />}
                {registration.category === "jeep" && <Car size={40} />}
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-xs font-black uppercase tracking-wider">
                    {registration.category}
                  </span>
                  <div className="h-4 w-px bg-slate-200" />
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                    <Calendar size={14} />
                    {new Date(registration.createdAt!).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric"
                    })}
                  </div>
                </div>
                <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-2">
                  {registration.nama}
                </h1>
                <div className="flex items-center gap-2 text-slate-500 font-medium">
                  <MapPin size={18} className="text-primary" />
                  {registration.alamatJalan}, {registration.kota}, {registration.provinsi}
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end gap-3 p-6 bg-slate-50 rounded-3xl border border-slate-100">
              <div className="text-right">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Status Pengajuan</p>
                <div className="flex flex-col items-end gap-1">
                  <StatusBadge status={registration.status!} />
                  {registration.status === 'pending' && (
                    <span className="text-[10px] font-bold text-amber-600 uppercase flex items-center gap-1 mt-1">
                      <Clock size={10} /> Dalam Tinjauan Admin
                    </span>
                  )}
                  {registration.status === 'approved' && (
                    <span className="text-[10px] font-bold text-emerald-600 uppercase flex items-center gap-1 mt-1">
                      <CheckCircle2 size={10} /> Properti Sudah Aktif
                    </span>
                  )}
                  {registration.status === 'rejected' && (
                    <span className="text-[10px] font-bold text-rose-600 uppercase flex items-center gap-1 mt-1">
                      <XCircle size={10} /> Hubungi Admin untuk Info
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Gallery */}
            <section>
              <h2 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-2">
                Galeri Properti
                <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 text-[10px] font-black uppercase">
                  {fotos.length} Foto
                </span>
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {fotos.map((foto, idx) => (
                  <div 
                    key={idx} 
                    className={`relative rounded-2xl overflow-hidden shadow-sm border border-slate-100 aspect-video ${
                      idx === 0 ? "md:col-span-2 md:row-span-2 aspect-auto md:h-full" : ""
                    }`}
                  >
                    <img 
                      src={foto} 
                      alt={`Foto ${idx + 1}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ))}
              </div>
            </section>

            {/* Description */}
            <section className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100">
              <h2 className="text-xl font-black text-slate-900 mb-4">Deskripsi Properti</h2>
              <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed whitespace-pre-wrap">
                {registration.deskripsi || "Tidak ada deskripsi."}
              </div>
            </section>

            {/* Facilities */}
            <section className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100">
              <h2 className="text-xl font-black text-slate-900 mb-6">Fasilitas & Keselamatan</h2>
              
              <div className="space-y-8">
                <div>
                  <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">Fasilitas Umum</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {fasilitas.map((fId) => {
                      const Icon = facilityIcons[fId] || Zap;
                      return (
                        <div key={fId} className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                          <div className="p-2 rounded-lg bg-white text-primary shadow-sm">
                            <Icon size={18} />
                          </div>
                          <span className="text-sm font-bold text-slate-700">{fId.replace(/_/g, ' ')}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {itemKeselamatan.length > 0 && (
                  <div>
                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">Item Keselamatan</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {itemKeselamatan.map((sId) => {
                        const Icon = safetyIcons[sId] || ShieldAlert;
                        return (
                          <div key={sId} className="flex items-center gap-3 p-3 rounded-2xl bg-amber-50 border border-amber-100/50">
                            <div className="p-2 rounded-lg bg-white text-amber-500 shadow-sm">
                              <Icon size={18} />
                            </div>
                            <span className="text-sm font-bold text-amber-700">{sId.replace(/_/g, ' ')}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pricing Card */}
            <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100 sticky top-28">
              <h2 className="text-xl font-black text-slate-900 mb-6">Rincian Harga</h2>
              
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <p className="text-xs font-bold text-slate-400 uppercase mb-1">Harga Dasar (Malam)</p>
                  <p className="text-2xl font-black text-primary">{formatCurrency(registration.hargaDasar)}</p>
                </div>
                
                <div className="p-4 rounded-2xl bg-slate-50/50 border border-slate-100">
                  <p className="text-xs font-bold text-slate-400 uppercase mb-1">Harga Akhir Pekan</p>
                  <p className="text-xl font-black text-slate-700">
                    {registration.hargaAkhirPekan ? formatCurrency(registration.hargaAkhirPekan) : "Sama dengan Dasar"}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50/50 border border-slate-100">
                  <p className="text-xs font-bold text-slate-400 uppercase mb-1">Harga Liburan</p>
                  <p className="text-xl font-black text-slate-700">
                    {registration.hargaLiburan ? formatCurrency(registration.hargaLiburan) : "Sama dengan Dasar"}
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-slate-100">
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-primary/5 text-primary border border-primary/10">
                  <AlertCircle size={20} className="shrink-0 mt-0.5" />
                  <p className="text-xs font-bold leading-relaxed">
                    Pengajuan Anda sedang diproses. Anda tidak dapat mengubah data ini hingga disetujui atau ditolak oleh admin.
                  </p>
                </div>
              </div>
            </div>

            {/* Owner Info */}
            <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100">
              <h2 className="text-lg font-black text-slate-900 mb-4">Informasi Kontak</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">WhatsApp</p>
                  <p className="font-bold text-slate-700">{registration.whatsappOwner}</p>
                </div>
                {registration.unit && (
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Unit/Lantai</p>
                    <p className="font-bold text-slate-700">{registration.unit} {registration.lantai ? `/ ${registration.lantai}` : ""}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
