"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft, Save } from "lucide-react";
import FormField from "@/components/admin/FormField";
import ImageUploader from "@/components/admin/ImageUploader";
import Link from "next/link";
import { createAktivitas, updateAktivitas } from "@/app/admin/actions/aktivitas";

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
        harga: initialData?.harga || 0,
        lokasi: initialData?.lokasi || "",
        koordinat: initialData?.koordinat || "",
        durasiWisata: initialData?.durasiWisata || "",
        kontak: initialData?.kontak || "",
        bahasa: initialData?.bahasa || "Bahasa Indonesia",
        ulasan: initialData?.ulasan || "",
        fotoUtama: initialData?.fotoUtama || "",
        authorName: initialData?.authorName || "",
        authorImage: initialData?.authorImage || "",
        isActive: initialData?.isActive ?? true,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;

        if (type === "checkbox") {
            setFormData((prev) => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
        } else if (type === "number") {
            setFormData((prev) => ({ ...prev, [name]: Number(value) }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));

            // Auto-generate slug from nama
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
                router.push("/admin/aktivitas");
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
                    href="/admin/aktivitas"
                    className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                        {isEdit ? "Edit Aktivitas" : "Tambah Aktivitas"}
                    </h2>
                    <p className="text-slate-500">
                        {isEdit ? "Ubah informasi aktivitas yang ada" : "Tambahkan aktivitas baru"}
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-6 md:col-span-2">
                        <h3 className="text-lg font-semibold border-b pb-2">Informasi Dasar</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                label="Nama Aktivitas"
                                name="nama"
                                type="text"
                                required
                                value={formData.nama}
                                onChange={handleChange}
                            />
                            <FormField
                                label="Slug (URL)"
                                name="slug"
                                type="text"
                                required
                                value={formData.slug}
                                onChange={handleChange}
                            />
                            <FormField
                                label="Harga Tiket Masuk (Rp)"
                                name="harga"
                                type="number"
                                required
                                min={0}
                                value={formData.harga}
                                onChange={handleChange}
                                helpText="Isi 0 jika gratis"
                            />
                            <div className="flex items-center gap-2 mt-8">
                                <input
                                    type="checkbox"
                                    id="isActive"
                                    name="isActive"
                                    checked={formData.isActive}
                                    onChange={handleChange}
                                    className="w-4 h-4 text-amber-500 rounded border-slate-300 focus:ring-amber-500"
                                />
                                <label htmlFor="isActive" className="text-sm font-medium text-slate-700">
                                    Aktivitas Aktif (Ditampilkan)
                                </label>
                            </div>
                        </div>

                        <FormField
                            label="Ulasan / Deskripsi Singkat"
                            name="ulasan"
                            type="textarea"
                            rows={4}
                            value={formData.ulasan}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="space-y-6 md:col-span-2">
                        <h3 className="text-lg font-semibold border-b pb-2">Detail & Lokasi</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                label="Lokasi"
                                name="lokasi"
                                type="text"
                                value={formData.lokasi}
                                onChange={handleChange}
                            />
                            <FormField
                                label="Link Google Maps (Peta)"
                                name="koordinat"
                                type="url"
                                value={formData.koordinat}
                                onChange={handleChange}
                            />
                            <FormField
                                label="Estimasi Durasi"
                                name="durasiWisata"
                                type="text"
                                value={formData.durasiWisata}
                                onChange={handleChange}
                                helpText="e.g. 2-3 Jam"
                            />
                            <FormField
                                label="Kontak / Telepon"
                                name="kontak"
                                type="text"
                                value={formData.kontak}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="space-y-6 md:col-span-2">
                        <h3 className="text-lg font-semibold border-b pb-2">Media & Author</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <ImageUploader
                                label="Foto Utama"
                                value={formData.fotoUtama}
                                onChange={(url) => setFormData((prev) => ({ ...prev, fotoUtama: url }))}
                            />
                            <div className="space-y-4">
                                <FormField
                                    label="Nama Author"
                                    name="authorName"
                                    type="text"
                                    value={formData.authorName}
                                    onChange={handleChange}
                                />
                                <ImageUploader
                                    label="Foto Author"
                                    value={formData.authorImage}
                                    onChange={(url) => setFormData((prev) => ({ ...prev, authorImage: url }))}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t">
                    <Link
                        href="/admin/aktivitas"
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
