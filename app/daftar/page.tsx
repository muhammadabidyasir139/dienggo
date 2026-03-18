"use client";

import { Navbar } from "@/components/Navbar";
import Link from "next/link";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "@/app/actions/auth";

export default function RegisterPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        if (formData.password !== formData.confirmPassword) {
            setError("Password dan Konfirmasi Password tidak cocok.");
            setIsLoading(false);
            return;
        }

        try {
            const result = await registerUser({
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                password: formData.password,
            });

            if (result.error) {
                setError(result.error);
            } else {
                // Redirect to login page with success message
                router.push("/login?registered=true");
            }
        } catch (err) {
            setError("Terjadi kesalahan. Silakan coba lagi.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-neutral-50 flex flex-col">
            <Navbar />

            <div className="flex-1 flex items-center justify-center p-4 pt-24 pb-12">
                <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-xl border border-neutral-100 text-center">
                    <h1 className="text-3xl font-black mb-2">Daftar Akun</h1>
                    <p className="text-neutral-500 text-sm mb-8">Bergabunglah untuk pengalaman liburan terbaik di Dieng.</p>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-medium">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-neutral-600">Nama Lengkap</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Masukkan nama lengkap"
                                className="bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-neutral-600">Email</label>
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="contoh@email.com"
                                className="bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-neutral-600">No WhatsApp</label>
                            <input
                                type="tel"
                                required
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                placeholder="081234567890"
                                className="bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                            />
                        </div>

                        <div className="flex flex-col gap-2 relative">
                            <label className="text-sm font-medium text-neutral-600">Password</label>
                            <div className="relative group">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    placeholder="••••••••"
                                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-all pr-12"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors cursor-pointer"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 relative">
                            <label className="text-sm font-medium text-neutral-600">Konfirmasi Password</label>
                            <div className="relative group">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    required
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    placeholder="••••••••"
                                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-all pr-12"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors cursor-pointer"
                                >
                                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="mt-4 w-full bg-primary text-white font-bold py-3.5 rounded-xl hover:scale-[1.02] transition-transform cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? "Memproses..." : "Daftar Sekarang"}
                        </button>
                    </form>

                    <div className="mt-6 text-sm text-neutral-600">
                        Sudah punya akun? <Link href="/login" className="font-bold text-primary hover:underline">Masuk</Link>
                    </div>

                    <Link href="/" className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-neutral-500 hover:text-primary transition-colors">
                        <ArrowLeft size={16} />
                        Kembali ke Beranda
                    </Link>
                </div>
            </div>
        </main>
    );
}
