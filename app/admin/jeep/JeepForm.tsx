"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft, Save, Plus } from "lucide-react";
import FormField from "@/components/admin/FormField";
import ImageUploader from "@/components/admin/ImageUploader";
import Link from "next/link";
import { createJeep, updateJeep } from "@/app/admin/actions/jeep";

interface JeepFormProps {
    initialData?: any;
    isEdit?: boolean;
}

export default function JeepForm({ initialData, isEdit }: JeepFormProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        nama: initialData?.nama || "",
        slug: initialData?.slug || "",
        harga: initialData?.harga || 0,
        maksOrang: initialData?.maksOrang || 4,
        durasi: initialData?.durasi || "",
        destinasiCount: initialData?.destinasiCount || 1,
        fotoUtama: initialData?.fotoUtama || "",
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
                res = await updateJeep(initialData.id, formData);
            } else {
                res = await createJeep(formData);
            }

            if (res.success) {
                router.push("/admin/jeep");
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
                    href="/admin/jeep"
                    className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                        {isEdit ? "Edit Paket Jeep" : "Tambah Paket Jeep"}
                    </h2>
                    <p className="text-slate-500">
                        {isEdit ? "Ubah informasi paket jeep yang sudah ada" : "Tambahkan paket wisata jeep baru"}
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-6 md:col-span-2">
                        <h3 className="text-lg font-semibold border-b pb-2">Informasi Paket</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                label="Nama Paket"
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
                                label="Harga per Jeep (Rp)"
                                name="harga"
                                type="number"
                                required
                                min={0}
                                value={formData.harga}
                                onChange={handleChange}
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
                                    Paket Aktif (Ditampilkan)
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6 md:col-span-2">
                        <h3 className="text-lg font-semibold border-b pb-2">Detail Perjalanan</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <FormField
                                label="Maks Orang (Kapasitas)"
                                name="maksOrang"
                                type="number"
                                min={1}
                                value={formData.maksOrang}
                                onChange={handleChange}
                            />
                            <FormField
                                label="Durasi (e.g. 6 Jam / 1 Hari)"
                                name="durasi"
                                type="text"
                                value={formData.durasi}
                                onChange={handleChange}
                            />
                            <FormField
                                label="Jumlah Destinasi"
                                name="destinasiCount"
                                type="number"
                                min={1}
                                value={formData.destinasiCount}
                                onChange={handleChange}
                            />
                        </div>
                        <p className="text-sm text-slate-500">
                            List destinasi spesifik (array) dapat dikelola setelah paket dibuat.
                        </p>
                    </div>

                    <div className="space-y-6 md:col-span-2">
                        <h3 className="text-lg font-semibold border-b pb-2">Media</h3>
                        <ImageUploader
                            label="Foto Utama"
                            value={formData.fotoUtama}
                            onChange={(url) => setFormData((prev) => ({ ...prev, fotoUtama: url }))}
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t">
                    <Link
                        href="/admin/jeep"
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
                        Simpan Paket Jeep
                    </button>
                </div>
            </form>
        </div>
    );
}
