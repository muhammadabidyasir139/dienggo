"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft, Save, Plus } from "lucide-react";
import FormField from "@/components/admin/FormField";
import ImageUploader from "@/components/admin/ImageUploader";
import Link from "next/link";
import { createCabin, updateCabin } from "@/app/admin/actions/cabin";

import MultiSelect from "@/components/admin/MultiSelect";
import FacilityModal from "@/components/admin/FacilityModal";

interface CabinFormProps {
    initialData?: any;
    isEdit?: boolean;
    facilities?: any[];
}

export default function CabinForm({ initialData, isEdit, facilities = [] }: CabinFormProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [availableFacilities, setAvailableFacilities] = useState(facilities);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [formData, setFormData] = useState({
        nama: initialData?.nama || "",
        slug: initialData?.slug || "",
        harga: initialData?.harga || 0,
        lokasi: initialData?.lokasi || "",
        koordinat: initialData?.koordinat || "",
        deskripsi: initialData?.deskripsi || "",
        fotoUtama: initialData?.fotoUtama || "",
        kamarTidur: initialData?.kamarTidur || 1,
        maksTamu: initialData?.maksTamu || 2,
        kamarMandi: initialData?.kamarMandi || 1,
        isActive: initialData?.isActive ?? true,
        fasilitasUtama: initialData?.fasilitasUtama || [],
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
                res = await updateCabin(initialData.id, formData);
            } else {
                res = await createCabin(formData);
            }

            if (res.success) {
                router.push("/admin/cabin");
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
                    href="/admin/cabin"
                    className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                        {isEdit ? "Edit Cabin" : "Tambah Cabin"}
                    </h2>
                    <p className="text-slate-500">
                        {isEdit ? "Ubah informasi cabin yang sudah ada" : "Tambahkan cabin baru ke sistem"}
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-6 md:col-span-2">
                        <h3 className="text-lg font-semibold border-b pb-2">Informasi Dasar</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                label="Nama Cabin"
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
                                helpText="Auto-generated dari nama, e.g. cabin-indah"
                            />
                            <FormField
                                label="Harga per Malam (Rp)"
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
                                    Cabin Aktif (Ditampilkan)
                                </label>
                            </div>
                        </div>

                        <FormField
                            label="Deskripsi"
                            name="deskripsi"
                            type="textarea"
                            rows={4}
                            value={formData.deskripsi}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="space-y-6 md:col-span-2">
                        <h3 className="text-lg font-semibold border-b pb-2">Lokasi & Kapasitas</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                label="Lokasi (e.g. Batur)"
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
                                helpText="https://maps.google.com/?q=..."
                            />
                            <div className="grid grid-cols-3 gap-4 md:col-span-2">
                                <FormField
                                    label="Kmr. Tidur"
                                    name="kamarTidur"
                                    type="number"
                                    min={1}
                                    value={formData.kamarTidur}
                                    onChange={handleChange}
                                />
                                <FormField
                                    label="Maks Tamu"
                                    name="maksTamu"
                                    type="number"
                                    min={1}
                                    value={formData.maksTamu}
                                    onChange={handleChange}
                                />
                                <FormField
                                    label="Kmr. Mandi"
                                    name="kamarMandi"
                                    type="number"
                                    min={1}
                                    value={formData.kamarMandi}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5 font-medium">
                            <div className="flex items-center justify-between">
                                <label className="block text-sm font-medium text-slate-700">
                                    Fasilitas Utama
                                </label>
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(true)}
                                    className="flex items-center gap-1 text-xs text-amber-600 hover:text-amber-700 font-semibold transition-colors bg-amber-50 px-2 py-1 rounded-md"
                                >
                                    <Plus className="w-3 h-3" />
                                    Tambah Baru
                                </button>
                            </div>
                            <MultiSelect
                                label=""
                                options={availableFacilities.map((f: any) => ({ id: f.id, name: f.name }))}
                                selected={formData.fasilitasUtama}
                                onChange={(selected) => setFormData((prev) => ({ ...prev, fasilitasUtama: selected }))}
                                helpText="Pilih fasilitas yang tersedia untuk cabin ini"
                            />
                        </div>
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
                        href="/admin/cabin"
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
                        Simpan Cabin
                    </button>
                </div>
            </form>

            <FacilityModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={(newFacility) => {
                    setAvailableFacilities((prev) => [newFacility, ...prev]);
                    setFormData((prev) => ({
                        ...prev,
                        fasilitasUtama: [...prev.fasilitasUtama, newFacility.id],
                    }));
                }}
            />
        </div>
    );
}
