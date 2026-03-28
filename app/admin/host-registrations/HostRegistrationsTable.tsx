"use client";

import { useState } from "react";
import {
  Check,
  X,
  Eye,
  Home,
  Mountain,
  Car,
  MapPin,
  Calendar,
  DollarSign,
  Image as ImageIcon,
} from "lucide-react";
import {
  approveHostRegistration,
  rejectHostRegistration,
} from "@/app/admin/actions/host-registration";
import DataTable from "@/components/admin/DataTable";
import StatusBadge from "@/components/admin/StatusBadge";
import { formatCurrency } from "@/lib/utils";

export default function HostRegistrationsTable({ data }: { data: any[] }) {
  const [selectedReg, setSelectedReg] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const handleApprove = async (id: string) => {
    if (
      !confirm(
        "Setujui pendaftaran ini? Properti akan langsung terbit di website.",
      )
    )
      return;
    setIsProcessing(true);
    try {
      const res = await approveHostRegistration(id);
      if (res.success) {
        alert("Berhasil disetujui dan diterbitkan!");
        window.location.reload();
      } else {
        alert("Gagal: " + res.error);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async (id: string) => {
    if (!confirm("Tolak pendaftaran ini?")) return;
    setIsProcessing(true);
    try {
      const res = await rejectHostRegistration(id);
      if (res.success) {
        alert("Pendaftaran ditolak.");
        window.location.reload();
      } else {
        alert("Gagal: " + res.error);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const columns = [
    {
      header: "Kategori",
      accessorKey: "category" as const,
      cell: (item: any) => (
        <div className="flex items-center gap-2">
          {item.category === "villa" && (
            <Home size={16} className="text-blue-500" />
          )}
          {item.category === "cabin" && (
            <Mountain size={16} className="text-emerald-500" />
          )}
          {item.category === "jeep" && (
            <Car size={16} className="text-amber-500" />
          )}
          <span className="capitalize font-medium">{item.category}</span>
        </div>
      ),
    },
    { header: "Nama Properti", accessorKey: "nama" as const },
    { header: "Kota", accessorKey: "kota" as const },
    {
      header: "Harga",
      accessorKey: "hargaDasar" as const,
      cell: (item: any) => formatCurrency(item.hargaDasar),
    },
    {
      header: "Status",
      accessorKey: "status" as const,
      cell: (item: any) => <StatusBadge status={item.status} />,
    },
    {
      header: "Tanggal",
      accessorKey: "createdAt" as const,
      cell: (item: any) => new Date(item.createdAt).toLocaleDateString("id-ID"),
    },
  ];

  const actions = (item: any) => (
    <div className="flex items-center gap-2">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setSelectedReg(item);
        }}
        className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
        title="Lihat Detail"
      >
        <Eye size={18} />
      </button>
      {item.status === "pending" && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleApprove(item.id);
            }}
            disabled={isProcessing}
            className="p-2 text-slate-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
            title="Setujui"
          >
            <Check size={18} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleReject(item.id);
            }}
            disabled={isProcessing}
            className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
            title="Tolak"
          >
            <X size={18} />
          </button>
        </>
      )}
    </div>
  );

  return (
        <>
            <DataTable 
                columns={columns} 
                data={data} 
                actions={actions}
            />

      {/* Detail Modal */}
      {selectedReg && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="p-6 border-b flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  Detail Pendaftaran Host
                </h3>
                <p className="text-sm text-slate-500">ID: {selectedReg.id}</p>
              </div>
              <button
                onClick={() => setSelectedReg(null)}
                className="p-2 hover:bg-white rounded-xl transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-10">
              {/* Header Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Kategori
                  </p>
                  <p className="text-lg font-black text-slate-900 capitalize flex items-center gap-2">
                    {selectedReg.category === "villa" && (
                      <Home size={20} className="text-blue-500" />
                    )}
                    {selectedReg.category === "cabin" && (
                      <Mountain size={20} className="text-emerald-500" />
                    )}
                    {selectedReg.category === "jeep" && (
                      <Car size={20} className="text-amber-500" />
                    )}
                    {selectedReg.category}
                  </p>
                </div>
                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Harga Dasar
                  </p>
                  <p className="text-lg font-black text-primary">
                    {formatCurrency(selectedReg.hargaDasar)}
                  </p>
                </div>
                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Status
                  </p>
                  <StatusBadge status={selectedReg.status} />
                </div>
              </div>

              {/* Location */}
              <div className="space-y-4">
                <h4 className="font-bold text-slate-900 flex items-center gap-2 text-lg">
                  <MapPin size={20} className="text-primary" />
                  Lokasi & Alamat
                </h4>
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-10">
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase mb-1">
                      Nama Properti
                    </p>
                    <p className="font-bold text-slate-800">
                      {selectedReg.nama}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase mb-1">
                      Alamat Lengkap
                    </p>
                    <p className="text-slate-700">
                      {selectedReg.alamatJalan}, {selectedReg.distrik || ""},{" "}
                      {selectedReg.kota}, {selectedReg.provinsi},{" "}
                      {selectedReg.kodePos}
                    </p>
                    {selectedReg.unit && (
                      <p className="text-sm text-slate-500 mt-1">
                        Unit: {selectedReg.unit}, Lantai:{" "}
                        {selectedReg.lantai || "-"}
                      </p>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-xs font-bold text-slate-400 uppercase mb-1">
                      Koordinat Maps
                    </p>
                    <a
                      href={selectedReg.koordinat}
                      target="_blank"
                      className="text-primary text-sm hover:underline break-all"
                    >
                      {selectedReg.koordinat || "Tidak ada koordinat"}
                    </a>
                  </div>
                </div>
              </div>

              {/* Facilities */}
              <div className="space-y-4">
                <h4 className="font-bold text-slate-900 flex items-center gap-2 text-lg">
                  <Check size={20} className="text-primary" />
                  Fasilitas & Keselamatan
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <p className="text-xs font-bold text-slate-400 uppercase mb-3">
                      Fasilitas
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {selectedReg.fasilitas?.map((f: string) => (
                        <span
                          key={f}
                          className="px-3 py-1 bg-white border rounded-lg text-xs font-bold text-slate-600 capitalize"
                        >
                          {f.replace(/_/g, " ")}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <p className="text-xs font-bold text-slate-400 uppercase mb-3">
                      Item Keselamatan
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {selectedReg.itemKeselamatan?.map((f: string) => (
                        <span
                          key={f}
                          className="px-3 py-1 bg-amber-50 border border-amber-100 rounded-lg text-xs font-bold text-amber-700 capitalize"
                        >
                          {f.replace(/_/g, " ")}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Photos */}
              <div className="space-y-4">
                <h4 className="font-bold text-slate-900 flex items-center gap-2 text-lg">
                  <ImageIcon size={20} className="text-primary" />
                  Foto Galeri ({selectedReg.fotos?.length || 0})
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {selectedReg.fotos?.map((url: string, i: number) => (
                    <div
                      key={i}
                      className="aspect-video rounded-xl overflow-hidden border bg-slate-100 cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => setLightboxImage(url)}
                    >
                      <img
                        src={url}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-4">
                <h4 className="font-bold text-slate-900 flex items-center gap-2 text-lg">
                  <Eye size={20} className="text-primary" />
                  Deskripsi
                </h4>
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
                    {selectedReg.deskripsi || "Tidak ada deskripsi."}
                  </p>
                </div>
              </div>
            </div>

            {selectedReg.status === "pending" && (
              <div className="p-6 border-t bg-slate-50 flex items-center justify-end gap-3">
                <button
                  onClick={() => handleReject(selectedReg.id)}
                  disabled={isProcessing}
                  className="px-6 py-3 border border-red-200 text-red-600 font-bold rounded-xl hover:bg-red-50 transition-colors disabled:opacity-50"
                >
                  Tolak Pendaftaran
                </button>
                <button
                  onClick={() => handleApprove(selectedReg.id)}
                  disabled={isProcessing}
                  className="px-8 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 shadow-lg shadow-green-100 transition-all disabled:opacity-50"
                >
                  Setujui & Terbitkan
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Lightbox */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 p-4 backdrop-blur-md cursor-zoom-out"
          onClick={() => setLightboxImage(null)}
        >
          <button
            className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors cursor-pointer"
            onClick={() => setLightboxImage(null)}
          >
            <X size={32} />
          </button>
          <div className="relative max-w-5xl max-h-[85vh] w-full h-full flex items-center justify-center p-4">
            <img
              src={lightboxImage}
              alt="Preview"
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl animate-in zoom-in-95 duration-300"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </>
  );
}
