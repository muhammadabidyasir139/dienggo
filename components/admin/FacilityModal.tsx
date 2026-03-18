"use client";

import { useState } from "react";
import { Loader2, X, Save } from "lucide-react";
import FormField from "./FormField";
import { createFacility } from "@/app/admin/actions/facility";

interface FacilityModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (newFacility: any) => void;
}

export default function FacilityModal({
    isOpen,
    onClose,
    onSuccess,
}: FacilityModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        icon: "",
    });

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const res = await createFacility(formData);
            if (res.success) {
                onSuccess(res.data);
                setFormData({ name: "", icon: "" });
                onClose();
            } else {
                alert("Gagal menambah fasilitas: " + res.error);
            }
        } catch (err: any) {
            alert("Error: " + err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between p-4 border-b border-slate-100">
                    <h3 className="text-lg font-semibold text-slate-900">Tambah Fasilitas Baru</h3>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-slate-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5 text-slate-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <FormField
                        label="Nama Fasilitas"
                        name="name"
                        type="text"
                        required
                        placeholder="e.g. WiFi, Parkir"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                    <FormField
                        label="Icon (Lucide Name)"
                        name="icon"
                        type="text"
                        required
                        placeholder="e.g. Wifi, Car"
                        value={formData.icon}
                        onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                        helpText="Nama ikon dari lucide.react, e.g. Wifi, Car, Coffee"
                    />

                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-50 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-70"
                        >
                            {isSubmitting ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Save className="w-4 h-4" />
                            )}
                            Simpan
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
