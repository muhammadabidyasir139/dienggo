"use client";

import { useState } from "react";
import Image from "next/image";
import { UploadCloud, X, Loader2 } from "lucide-react";

interface MultiImageUploaderProps {
    label: string;
    values: string[];
    onChange: (urls: string[]) => void;
    error?: string;
}

export default function MultiImageUploader({ label, values = [], onChange, error }: MultiImageUploaderProps) {
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setIsUploading(true);
        try {
            const newUrls: string[] = [];
            
            // Upload files sequentially to avoid overwhelming the server/API
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                
                if (file.size > 2 * 1024 * 1024) {
                    alert(`File ${file.name} terlalu besar. Maksimal 2MB.`);
                    continue;
                }

                const formData = new FormData();
                formData.append("file", file);

                const res = await fetch("/api/admin/upload", {
                    method: "POST",
                    body: formData,
                });

                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(errorData.error || `Upload failed for ${file.name}`);
                }
                const data = await res.json();
                newUrls.push(data.url);
            }

            onChange([...values, ...newUrls]);
        } catch (err: any) {
            console.error(err);
            alert("Gagal upload: " + err.message);
        } finally {
            setIsUploading(false);
            // Reset input value so the same file can be selected again if needed
            e.target.value = '';
        }
    };

    const removeImage = (indexToRemove: number) => {
        onChange(values.filter((_, index) => index !== indexToRemove));
    };

    return (
        <div className="space-y-3">
            <label className="block text-sm font-medium text-slate-700">{label}</label>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {values.map((url, index) => (
                    <div key={index} className="relative w-full aspect-video rounded-lg overflow-hidden border border-slate-200 group">
                        <Image src={url} alt={`Gallery ${index + 1}`} fill className="object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="p-2 bg-white text-red-600 rounded-full hover:bg-red-50"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}

                <label
                    className={`relative flex flex-col items-center justify-center w-full aspect-video border-2 border-dashed rounded-lg cursor-pointer hover:bg-slate-50 transition-colors ${error ? "border-red-300" : "border-slate-300"
                        } gap-2`}
                >
                    {isUploading ? (
                        <Loader2 className="w-6 h-6 text-amber-500 animate-spin" />
                    ) : (
                        <>
                            <UploadCloud className="w-6 h-6 text-slate-400" />
                            <span className="text-xs text-slate-500 font-medium text-center px-2">Tambah Foto</span>
                        </>
                    )}
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handleFileChange}
                        disabled={isUploading}
                    />
                </label>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
    );
}
