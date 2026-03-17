// We need to support receiving search params like ?type=villa
import { Navbar } from "@/components/Navbar";
import { CreditCard, Wallet, Lock, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import fs from "fs/promises";
import path from "path";
import { formatCurrency } from "@/lib/utils";

async function getBookingItem(slug: string, type: string) {
    try {
        const fileName = type === "hotel-cabin" ? "cabins.json" : `${type}s.json`;
        const fallbackFileName = type === "wisata" ? "wisata.json" : fileName;
        const filePath = path.join(process.cwd(), "data", fallbackFileName);
        const jsonData = await fs.readFile(filePath, "utf-8");
        const items = JSON.parse(jsonData);
        return items.find((item: { slug: string;[key: string]: unknown }) => item.slug === slug);
    } catch {
        return null;
    }
}

export default async function BookingPage({
    params,
    searchParams
}: {
    params: Promise<{ slug: string }>,
    searchParams: Promise<{ type?: string }>
}) {
    const { slug } = await params;
    const { type = "villa" } = await searchParams;

    const item = await getBookingItem(slug, type);

    return (
        <main className="min-h-screen bg-neutral-50 dark:bg-slate-950 pb-20">
            <Navbar />

            <div className="pt-24 md:pt-32 pb-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-black mb-8 text-foreground">Selesaikan Pemesanan Anda</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Kolom Kiri: Form */}
                    <div className="lg:col-span-2 flex flex-col gap-6">

                        {/* Form Data Tamu */}
                        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 shadow-sm border border-neutral-100 dark:border-slate-800">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <span className="bg-primary/10 text-primary dark:bg-accent/20 dark:text-accent w-8 h-8 rounded-full flex items-center justify-center">1</span>
                                Data Pemesan
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Nama Lengkap</label>
                                    <input type="text" placeholder="Sesuai KTP/Paspor" className="bg-neutral-50 dark:bg-slate-800 border border-neutral-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-accent transition-all" />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Email</label>
                                    <input type="email" placeholder="contoh@email.com" className="bg-neutral-50 dark:bg-slate-800 border border-neutral-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-accent transition-all" />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Nomor Telepon / WhatsApp</label>
                                    <div className="flex">
                                        <span className="bg-neutral-100 dark:bg-slate-700 border border-r-0 border-neutral-200 dark:border-slate-700 rounded-l-xl px-4 py-3 text-neutral-500 font-medium">+62</span>
                                        <input type="tel" placeholder="81234567890" className="w-full bg-neutral-50 dark:bg-slate-800 border border-neutral-200 dark:border-slate-700 rounded-r-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-accent transition-all" />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Permintaan Khusus (Opsional)</label>
                                    <input type="text" placeholder="Contoh: Bawa bayi, check-in telat" className="bg-neutral-50 dark:bg-slate-800 border border-neutral-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-accent transition-all" />
                                </div>
                            </div>
                        </div>

                        {/* Metode Pembayaran */}
                        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 shadow-sm border border-neutral-100 dark:border-slate-800">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <span className="bg-primary/10 text-primary dark:bg-accent/20 dark:text-accent w-8 h-8 rounded-full flex items-center justify-center">2</span>
                                Metode Pembayaran
                            </h2>

                            <div className="flex flex-col gap-4">
                                <label className="relative flex items-center justify-between p-4 border-2 border-primary dark:border-accent bg-primary/5 dark:bg-accent/5 rounded-2xl cursor-pointer">
                                    <div className="flex items-center gap-4">
                                        <input type="radio" name="payment" defaultChecked className="w-5 h-5 text-primary focus:ring-primary accent-primary" />
                                        <div className="flex flex-col">
                                            <span className="font-bold text-foreground">Transfer Bank (Virtual Account)</span>
                                            <span className="text-xs text-neutral-500">BCA, Mandiri, BNI, BRI</span>
                                        </div>
                                    </div>
                                    <CreditCard className="text-primary dark:text-accent opacity-50" />
                                </label>

                                <label className="relative flex items-center justify-between p-4 border border-neutral-200 dark:border-slate-700 rounded-2xl cursor-pointer hover:bg-neutral-50 dark:hover:bg-slate-800 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <input type="radio" name="payment" className="w-5 h-5 text-primary focus:ring-primary accent-primary" />
                                        <div className="flex flex-col">
                                            <span className="font-bold text-foreground">E-Wallet / QRIS</span>
                                            <span className="text-xs text-neutral-500">Gopay, OVO, Dana, ShopeePay</span>
                                        </div>
                                    </div>
                                    <Wallet className="text-neutral-400" />
                                </label>
                            </div>

                            <div className="mt-8 flex items-center justify-center gap-2 text-xs text-neutral-500">
                                <Lock size={14} className="text-green-500" /> Pembayaran Anda aman dan dienkripsi ujung ke ujung.
                            </div>
                        </div>

                    </div>

                    {/* Kolom Kanan: Ringkasan Pesanan */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl border border-neutral-100 dark:border-slate-800">
                            <h3 className="text-lg font-bold mb-4">Ringkasan Pesanan</h3>

                            {item ? (
                                <>
                                    <div className="flex gap-4 mb-6 pb-6 border-b border-neutral-100 dark:border-slate-800">
                                        <div className="relative w-24 h-24 rounded-xl overflow-hidden shrink-0">
                                            <Image src={item.foto_utama} alt={item.nama} fill className="object-cover" />
                                        </div>
                                        <div className="flex flex-col justify-center">
                                            <span className="text-xs font-bold text-primary dark:text-accent uppercase tracking-wider mb-1">{type}</span>
                                            <h4 className="font-bold text-foreground leading-snug line-clamp-2">{item.nama}</h4>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-3 mb-6">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-neutral-500">Harga per malam/paket</span>
                                            <span className="font-medium">{formatCurrency(item.harga)}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-neutral-500">Pajak aplikasi (11%)</span>
                                            <span className="font-medium">{formatCurrency(item.harga * 0.11)}</span>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center pb-6 border-b border-neutral-100 dark:border-slate-800">
                                        <span className="font-bold">Total Pembayaran</span>
                                        <span className="text-2xl font-black text-primary dark:text-accent">
                                            {item.harga === 0 ? "Gratis" : formatCurrency(item.harga + (item.harga * 0.11))}
                                        </span>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center py-8 text-neutral-500 text-sm">Item tidak ditemukan.</div>
                            )}

                            <button className="mt-6 w-full flex items-center justify-center gap-2 bg-primary text-white dark:bg-accent dark:text-neutral-900 font-bold py-4 rounded-xl hover:scale-[1.02] transition-transform">
                                <CheckCircle2 size={20} />
                                Selesaikan Pembayaran
                            </button>
                            <p className="mt-4 text-[10px] text-center text-neutral-400">
                                Dengan menyelesaikan pembayaran, Anda menyetujui Syarat dan Ketentuan Dienggo.
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </main>
    );
}
