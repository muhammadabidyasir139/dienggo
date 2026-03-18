"use client";

import { useState } from "react";
import { User, Mail, Phone, Camera, Save, CheckCircle2, AlertCircle } from "lucide-react";
import Image from "next/image";
import { updateProfile } from "@/app/actions/profile";

interface ProfileFormProps {
    user: {
        id: string;
        name: string;
        email: string;
        phone: string | null;
        image: string | null;
    };
}

export function ProfileForm({ user }: ProfileFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const [formData, setFormData] = useState({
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        image: user.image || "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage(null);

        const result = await updateProfile(user.id, {
            ...formData,
            phone: formData.phone || null,
            image: formData.image || null,
        });

        if (result.success) {
            setMessage({ type: "success", text: "Profil Anda berhasil diperbarui!" });
        } else {
            setMessage({ type: "error", text: result.error || "Terjadi kesalahan" });
        }
        setIsLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-10">
            {/* Foto Profile Section */}
            <div className="flex flex-col items-center sm:flex-row gap-8 pb-10 border-b border-neutral-100">
                <div className="relative group">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary-light shadow-inner bg-neutral-100 flex items-center justify-center">
                        {formData.image ? (
                            <Image
                                src={formData.image}
                                alt="Profile Avatar"
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <span className="text-4xl font-black text-neutral-300">
                                {formData.name[0].toUpperCase()}
                            </span>
                        )}
                    </div>
                    <button
                        type="button"
                        className="absolute bottom-0 right-0 p-2.5 bg-primary text-white rounded-full shadow-lg hover:scale-110 transition-transform cursor-pointer"
                        onClick={() => {
                            const url = prompt("Masukkan URL foto profil baru Anda:", formData.image);
                            if (url !== null) setFormData({ ...formData, image: url });
                        }}
                    >
                        <Camera size={18} />
                    </button>
                    <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-[10px] text-white font-bold tracking-widest px-2">KLIK ICON KAERA</span>
                    </div>
                </div>
                <div className="flex-1 text-center sm:text-left">
                    <h3 className="text-xl font-black text-foreground mb-1">Foto Profil Anda</h3>
                    <p className="text-sm text-neutral-500 max-w-xs">Tekan tombol kamera untuk memperbarui foto profil Anda.</p>
                </div>
            </div>

            {/* Input Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                {/* Nama Lengkap */}
                <div className="flex flex-col gap-2.5">
                    <label className="text-sm font-bold text-neutral-600 ml-1">Nama Lengkap</label>
                    <div className="relative group">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-primary transition-colors" size={20} />
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full bg-neutral-50 border border-neutral-200 rounded-2xl px-12 py-3.5 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-foreground font-medium"
                            placeholder="Masukkan nama lengkap Anda"
                        />
                    </div>
                </div>

                {/* Email Address */}
                <div className="flex flex-col gap-2.5">
                    <label className="text-sm font-bold text-neutral-600 ml-1">Email</label>
                    <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-primary transition-colors" size={20} />
                        <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full bg-neutral-50 border border-neutral-200 rounded-2xl px-12 py-3.5 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-foreground font-medium"
                            placeholder="Masukkan alamat email Anda"
                        />
                    </div>
                </div>

                {/* No WA (WhatsApp) */}
                <div className="flex flex-col gap-2.5">
                    <label className="text-sm font-bold text-neutral-600 ml-1">Nomor WhatsApp</label>
                    <div className="relative group">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-primary transition-colors" size={20} />
                        <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full bg-neutral-50 border border-neutral-200 rounded-2xl px-12 py-3.5 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-foreground font-medium"
                            placeholder="Contoh: 081234567890"
                        />
                    </div>
                </div>
            </div>

            {/* Notification Message */}
            {message && (
                <div className={`p-5 rounded-2xl flex items-center gap-4 animate-in fade-in duration-300 ${message.type === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-red-50 text-red-700 border border-red-100"}`}>
                    {message.type === "success" ? <CheckCircle2 size={24} className="shrink-0" /> : <AlertCircle size={24} className="shrink-0" />}
                    <p className="text-sm font-bold">{message.text}</p>
                </div>
            )}

            {/* Submit Button */}
            <div className="pt-6 border-t border-neutral-100 flex justify-end">
                <button
                    type="submit"
                    disabled={isLoading}
                    className="flex items-center gap-3 px-10 py-4 bg-primary text-white rounded-2xl font-black shadow-lg shadow-primary/25 hover:scale-[1.03] active:scale-95 transition-all text-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? "Menyimpan..." : (
                        <>
                            <Save size={22} />
                            Simpan Perubahan
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}
