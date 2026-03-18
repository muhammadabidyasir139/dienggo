"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft, Save } from "lucide-react";
import FormField from "@/components/admin/FormField";
import ImageUploader from "@/components/admin/ImageUploader";
import Link from "next/link";
import { createAktivitas, updateAktivitas } from "@/app/admin/actions/wisata";

interface AktivitasFormProps {
    initialData?: any;
    isEdit?: boolean;
}

export default function AktivitasForm({ initialData, isEdit }: AktivitasFormProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        nama: initialData?.nama || "",
        slug: initialData?.slug || "",
        fotoUtama: initialData?.fotoUtama || "",
        isi: initialData?.isi || "",
        isActive: initialData?.isActive ?? true,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;

        if (type === "checkbox") {
            setFormData((prev) => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));

            // Auto-generate slug from nama (judul)
            if (name === "nama" && !isEdit) {
                setFormData((prev) => ({
                    ...prev,
                    slug: value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, ""),
                }));
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            let res;
            if (isEdit) {
                res = await updateAktivitas(initialData.id, formData);
            } else {
                res = await createAktivitas(formData);
            }

            if (res.success) {
                router.push("/admin/wisata");
            } else {
                alert("Gagal menyimpan data: " + res.error);
            }
        } catch (err: any) {
            alert("Error: " + err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl">
            <div className="flex items-center gap-4 mb-6">
                <Link
                    href="/admin/wisata"
                    className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                        {isEdit ? "Edit Wisata" : "Tambah Wisata"}
                    </h2>
                    <p className="text-slate-500">
                        {isEdit ? "Ubah informasi wisata yang ada" : "Tambahkan wisata baru"}
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-6 md:col-span-2">
                        <h3 className="text-lg font-semibold border-b pb-2">Konten Aktivitas</h3>
                        <div className="space-y-6">
                            <FormField
                                label="Judul Aktivitas"
                                name="nama"
                                type="text"
                                required
                                value={formData.nama}
                                onChange={handleChange}
                                placeholder="Masukkan judul aktivitas..."
                            />

                            <ImageUploader
                                label="Gambar Utama"
                                value={formData.fotoUtama}
                                onChange={(url) => setFormData((prev) => ({ ...prev, fotoUtama: url }))}
                            />

                            <FormField
                                label="Isi Aktivitas"
                                name="isi"
                                type="textarea"
                                rows={8}
                                required
                                value={formData.isi}
                                onChange={handleChange}
                                placeholder="Tuliskan berita atau konten aktivitas di sini..."
                            />

                            <div className="flex items-center gap-2 pt-2">
                                <input
                                    type="checkbox"
                                    id="isActive"
                                    name="isActive"
                                    checked={formData.isActive}
                                    onChange={handleChange}
                                    className="w-4 h-4 text-amber-500 rounded border-slate-300 focus:ring-amber-500"
                                />
                                <label htmlFor="isActive" className="text-sm font-medium text-slate-700">
                                    Highlight (Tampilkan di halaman utama)
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t">
                    <Link
                        href="/admin/wisata"
                        className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition-colors"
                    >
                        Batal
                    </Link>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-70"
                    >
                        {isSubmitting ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <Save className="w-5 h-5" />
                        )}
                        Simpan
                    </button>
                </div>
            </form>
        </div>
    );
}
