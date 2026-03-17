"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft, Save } from "lucide-react";
import FormField from "@/components/admin/FormField";
import Link from "next/link";
import { createFacility, updateFacility } from "@/app/admin/actions/facility";

interface FacilityFormProps {
  initialData?: any;
  isEdit?: boolean;
}

export default function FacilityForm({
  initialData,
  isEdit,
}: FacilityFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    icon: initialData?.icon || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let res;
      if (isEdit) {
        res = await updateFacility(initialData.id, formData);
      } else {
        res = await createFacility(formData);
      }

      if (res.success) {
        router.push("/admin/facilities");
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
    <div className="max-w-lg">
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/admin/facilities"
          className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            {isEdit ? "Edit Fasilitas" : "Tambah Fasilitas"}
          </h2>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6"
      >
        <FormField
          label="Nama Fasilitas"
          name="name"
          type="text"
          required
          value={formData.name}
          onChange={handleChange}
        />
        <FormField
          label="Ikon (e.g. Wifi, Tv)"
          name="icon"
          type="text"
          value={formData.icon}
          onChange={handleChange}
          helpText="Nama ikon dari Lucide React. Case sensitive."
        />

        <div className="flex justify-end gap-3 pt-6 border-t">
          <Link
            href="/admin/facilities"
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
