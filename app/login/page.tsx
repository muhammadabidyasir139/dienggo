"use client";

import { Navbar } from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { signIn } from "next-auth/react";

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        await signIn("google", { callbackUrl: "/" });
    };

    return (
        <main className="min-h-screen bg-neutral-50 dark:bg-slate-950 flex flex-col">
            <Navbar />

            <div className="flex-1 flex items-center justify-center p-4 pt-20">
                <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-xl border border-neutral-100 dark:border-slate-800 text-center">
                    <h1 className="text-3xl font-black mb-2">Masuk ke Dienggo</h1>
                    <p className="text-neutral-500 text-sm mb-8">Eksplorasi Dieng dengan pengalaman premium.</p>

                    <form className="flex flex-col gap-4 text-left">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Email</label>
                            <input
                                type="email"
                                placeholder="contoh@email.com"
                                className="bg-neutral-50 dark:bg-slate-800 border border-neutral-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-accent transition-all"
                            />
                        </div>
                        <div className="flex flex-col gap-2 relative">
                            <label className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Password</label>
                            <div className="relative group">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    className="w-full bg-neutral-50 dark:bg-slate-800 border border-neutral-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-accent transition-all pr-12"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors cursor-pointer"
                                    title={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="mt-2 w-full bg-primary text-white dark:bg-accent dark:text-neutral-900 font-bold py-3.5 rounded-xl hover:scale-[1.02] transition-transform cursor-pointer"
                        >
                            Masuk
                        </button>
                    </form>

                    <div className="mt-6 flex items-center gap-4 text-sm text-neutral-400">
                        <div className="flex-1 h-px bg-neutral-200 dark:bg-slate-800"></div>
                        <span>Atau</span>
                        <div className="flex-1 h-px bg-neutral-200 dark:bg-slate-800"></div>
                    </div>

                    <button
                        onClick={handleGoogleLogin}
                        disabled={isLoading}
                        className="mt-6 w-full flex items-center justify-center gap-3 bg-white dark:bg-slate-800 text-neutral-700 dark:text-neutral-300 font-bold py-3.5 rounded-xl border border-neutral-200 dark:border-slate-700 hover:bg-neutral-50 dark:hover:bg-slate-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Image src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" width={20} height={20} className="w-5 h-5" />
                        Lanjutkan dengan Google
                    </button>

                    <div className="mt-8">
                        <Link href="/" className="inline-flex items-center gap-2 text-sm text-primary dark:text-accent font-medium hover:underline cursor-pointer">
                            <ArrowLeft size={16} /> Kembali ke Beranda
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}
