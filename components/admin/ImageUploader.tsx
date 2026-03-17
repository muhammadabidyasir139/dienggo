"use client";

import { useState } from "react";
import Image from "next/image";
import { UploadCloud, X, Loader2 } from "lucide-react";

interface ImageUploaderProps {
    label: string;
    value: string;
    onChange: (url: string) => void;
    error?: string;
}

export default function ImageUploader({ label, value, onChange, error }: ImageUploaderProps) {
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // TODO: Connect this to actual action when ready
        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);

            const res = await fetch("/api/admin/upload", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) throw new Error("Upload failed");
            const data = await res.json();
            onChange(data.url);
        } catch (err) {
            console.error(err);
            alert("Gagal upload gambar. Cek ukuran atau koneksi.");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">{label}</label>

            {value ? (
                <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-slate-200 group">
                    <Image src={value} alt="Preview" fill className="object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                            type="button"
                            onClick={() => onChange("")}
                            className="p-2 bg-white text-red-600 rounded-full hover:bg-red-50"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            ) : (
                <label
                    className={`relative block w-full aspect-video border-2 border-dashed rounded-lg cursor-pointer hover:bg-slate-50 transition-colors ${error ? "border-red-300" : "border-slate-300"
                        } flex flex-col items-center justify-center gap-2`}
                >
                    {isUploading ? (
                        <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
                    ) : (
                        <>
                            <UploadCloud className="w-8 h-8 text-slate-400" />
                            <span className="text-sm text-slate-500 font-medium">Klik untuk upload foto</span>
                            <span className="text-xs text-slate-400">JPG, PNG maks 2MB</span>
                        </>
                    )}
                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                        disabled={isUploading}
                    />
                </label>
            )}

            {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
    );
}
