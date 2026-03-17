"use client";

import { Navbar } from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        await signIn("google", { callbackUrl: "/" });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const result = await signIn("credentials", {
                email: formData.email,
                password: formData.password,
                redirect: false,
            });

            if (result?.error) {
                setError("Email atau password salah.");
            } else {
                router.push("/admin");
                router.refresh();
            }
        } catch (err) {
            setError("Terjadi kesalahan. Silakan coba lagi.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-neutral-50  flex flex-col">
            <Navbar />

            <div className="flex-1 flex items-center justify-center p-4 pt-20">
                <div className="w-full max-w-md bg-white  rounded-3xl p-8 shadow-xl border border-neutral-100  text-center">
                    <h1 className="text-3xl font-black mb-2">Masuk ke Dienggo</h1>
                    <p className="text-neutral-500 text-sm mb-8">Eksplorasi Dieng dengan pengalaman premium.</p>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50  border border-red-100  rounded-xl text-red-600  text-sm font-medium">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-neutral-600 ">Email</label>
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="contoh@email.com"
                                className="bg-neutral-50  border border-neutral-200  rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary :ring-accent transition-all"
                            />
                        </div>
                        <div className="flex flex-col gap-2 relative">
                            <label className="text-sm font-medium text-neutral-600 ">Password</label>
                            <div className="relative group">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    placeholder="••••••••"
                                    className="w-full bg-neutral-50  border border-neutral-200  rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary :ring-accent transition-all pr-12"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 :text-neutral-200 transition-colors cursor-pointer"
                                    title={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="mt-2 w-full bg-primary text-white   font-bold py-3.5 rounded-xl hover:scale-[1.02] transition-transform cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? "Memproses..." : "Masuk"}
                        </button>
                    </form>

                    <div className="mt-6 flex items-center gap-4 text-sm text-neutral-400">
                        <div className="flex-1 h-px bg-neutral-200 "></div>
                        <span>Atau</span>
                        <div className="flex-1 h-px bg-neutral-200 "></div>
                    </div>

                    <button
                        onClick={handleGoogleLogin}
                        disabled={isLoading}
                        className="mt-6 w-full flex items-center justify-center gap-3 bg-white  text-neutral-700  font-bold py-3.5 rounded-xl border border-neutral-200  hover:bg-neutral-50 :bg-slate-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Image src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" width={20} height={20} className="w-5 h-5" />
                        Lanjutkan dengan Google
                    </button>

                    <div className="mt-8">
                        <Link href="/" className="inline-flex items-center gap-2 text-sm text-primary  font-medium hover:underline cursor-pointer">
                            <ArrowLeft size={16} /> Kembali ke Beranda
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}
