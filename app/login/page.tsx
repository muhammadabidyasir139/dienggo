import { Navbar } from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function LoginPage() {
    return (
        <main className="min-h-screen bg-neutral-50 dark:bg-slate-950 flex flex-col">
            <Navbar />

            <div className="flex-1 flex items-center justify-center p-4 pt-20">
                <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-xl border border-neutral-100 dark:border-slate-800 text-center">
                    <h1 className="text-3xl font-black mb-2">Masuk ke Dienggo</h1>
                    <p className="text-neutral-500 text-sm mb-8">Eksplorasi Dieng dengan pengalaman premium.</p>

                    <div className="flex flex-col gap-4 text-left">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Email</label>
                            <input type="email" placeholder="contoh@email.com" className="bg-neutral-50 dark:bg-slate-800 border border-neutral-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-accent transition-all" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Password</label>
                            <input type="password" placeholder="••••••••" className="bg-neutral-50 dark:bg-slate-800 border border-neutral-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-accent transition-all" />
                        </div>

                        <button className="mt-2 w-full bg-primary text-white dark:bg-accent dark:text-neutral-900 font-bold py-3.5 rounded-xl hover:scale-[1.02] transition-transform">
                            Masuk
                        </button>
                    </div>

                    <div className="mt-6 flex items-center gap-4 text-sm text-neutral-400">
                        <div className="flex-1 h-px bg-neutral-200 dark:bg-slate-800"></div>
                        <span>Atau</span>
                        <div className="flex-1 h-px bg-neutral-200 dark:bg-slate-800"></div>
                    </div>

                    <button className="mt-6 w-full flex items-center justify-center gap-3 bg-white dark:bg-slate-800 text-neutral-700 dark:text-neutral-300 font-bold py-3.5 rounded-xl border border-neutral-200 dark:border-slate-700 hover:bg-neutral-50 dark:hover:bg-slate-700 transition-colors">
                        <Image src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" width={20} height={20} className="w-5 h-5" />
                        Lanjutkan dengan Google
                    </button>

                    <div className="mt-8">
                        <Link href="/" className="inline-flex items-center gap-2 text-sm text-primary dark:text-accent font-medium hover:underline">
                            <ArrowLeft size={16} /> Kembali ke Beranda
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}
