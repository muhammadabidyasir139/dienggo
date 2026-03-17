"use client";

import { useState, useEffect } from "react";
import { CreditCard, Wallet, Lock, CheckCircle2, Loader2 } from "lucide-react";
import Image from "next/image";
import { formatCurrency } from "@/lib/utils";
import { useRouter } from "next/navigation";

declare global {
    interface Window {
        snap: {
            pay: (token: string, options: {
                onSuccess: (result: any) => void;
                onPending: (result: any) => void;
                onError: (result: any) => void;
                onClose: () => void;
            }) => void;
        };
    }
}

interface BookingFormProps {
    item: {
        slug: string;
        nama: string;
        foto_utama: string;
        harga: number;
        id?: string;
        [key: string]: unknown;
    };
    type: string;
}

export function BookingForm({ item, type }: BookingFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState<"idle" | "success" | "pending" | "error">("idle");
    const [formData, setFormData] = useState({
        namaLengkap: "",
        email: "",
        telepon: "",
        permintaan: "",
    });

    const subtotal = item.harga;
    const pajak = Math.round(subtotal * 0.11);
    const total = subtotal + pajak;

    // Load Midtrans Snap.js
    useEffect(() => {
        const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY;
        const midtransUrl = process.env.MIDTRANS_IS_PRODUCTION === "true"
            ? "https://app.midtrans.com/snap/snap.js"
            : "https://app.sandbox.midtrans.com/snap/snap.js";

        // Check if script already loaded
        if (document.querySelector(`script[src="${midtransUrl}"]`)) return;

        const script = document.createElement("script");
        script.src = midtransUrl;
        script.setAttribute("data-client-key", clientKey || "");
        script.async = true;
        document.head.appendChild(script);

        return () => {
            // Don't remove on cleanup — Snap needs to stay loaded
        };
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async () => {
        // Validate
        if (!formData.namaLengkap || !formData.email || !formData.telepon) {
            alert("Mohon lengkapi data pemesan (Nama, Email, Telepon).");
            return;
        }

        if (total === 0) {
            alert("Item ini gratis, tidak perlu pembayaran.");
            return;
        }

        setIsLoading(true);
        setPaymentStatus("idle");

        try {
            const res = await fetch("/api/midtrans/create-transaction", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    slug: item.slug,
                    type: type,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Gagal membuat transaksi");
            }

            // Open Snap popup
            if (window.snap) {
                window.snap.pay(data.token, {
                    onSuccess: (result: any) => {
                        console.log("Payment success:", result);
                        setPaymentStatus("success");
                        setTimeout(() => {
                            router.push("/pesanan");
                        }, 2000);
                    },
                    onPending: (result: any) => {
                        console.log("Payment pending:", result);
                        setPaymentStatus("pending");
                    },
                    onError: (result: any) => {
                        console.error("Payment error:", result);
                        setPaymentStatus("error");
                    },
                    onClose: () => {
                        console.log("Payment popup closed");
                        setIsLoading(false);
                    },
                });
            } else {
                throw new Error("Midtrans Snap belum dimuat. Coba muat ulang halaman.");
            }
        } catch (error: any) {
            console.error("Booking error:", error);
            alert(error.message || "Terjadi kesalahan. Silakan coba lagi.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
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
                            <input
                                type="text"
                                name="namaLengkap"
                                value={formData.namaLengkap}
                                onChange={handleChange}
                                placeholder="Sesuai KTP/Paspor"
                                className="bg-neutral-50 dark:bg-slate-800 border border-neutral-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-accent transition-all"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="contoh@email.com"
                                className="bg-neutral-50 dark:bg-slate-800 border border-neutral-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-accent transition-all"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Nomor Telepon / WhatsApp</label>
                            <div className="flex">
                                <span className="bg-neutral-100 dark:bg-slate-700 border border-r-0 border-neutral-200 dark:border-slate-700 rounded-l-xl px-4 py-3 text-neutral-500 font-medium">+62</span>
                                <input
                                    type="tel"
                                    name="telepon"
                                    value={formData.telepon}
                                    onChange={handleChange}
                                    placeholder="81234567890"
                                    className="w-full bg-neutral-50 dark:bg-slate-800 border border-neutral-200 dark:border-slate-700 rounded-r-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-accent transition-all"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Permintaan Khusus (Opsional)</label>
                            <input
                                type="text"
                                name="permintaan"
                                value={formData.permintaan}
                                onChange={handleChange}
                                placeholder="Contoh: Bawa bayi, check-in telat"
                                className="bg-neutral-50 dark:bg-slate-800 border border-neutral-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-accent transition-all"
                            />
                        </div>
                    </div>
                </div>

                {/* Info Pembayaran */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 shadow-sm border border-neutral-100 dark:border-slate-800">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <span className="bg-primary/10 text-primary dark:bg-accent/20 dark:text-accent w-8 h-8 rounded-full flex items-center justify-center">2</span>
                        Metode Pembayaran
                    </h2>

                    <div className="flex flex-col gap-4">
                        <div className="relative flex items-center justify-between p-4 border-2 border-primary dark:border-accent bg-primary/5 dark:bg-accent/5 rounded-2xl">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-primary/10 dark:bg-accent/10 rounded-full flex items-center justify-center">
                                    <CreditCard className="text-primary dark:text-accent" size={20} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-bold text-foreground">Midtrans Payment Gateway</span>
                                    <span className="text-xs text-neutral-500">VA, Gopay, QRIS, Dana, OVO, Kartu Kredit & Lainnya</span>
                                </div>
                            </div>
                            <CheckCircle2 className="text-primary dark:text-accent" size={20} />
                        </div>

                        <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-2xl border border-blue-100 dark:border-blue-900/50">
                            <p className="text-sm text-blue-700 dark:text-blue-300">
                                💡 Anda dapat memilih metode pembayaran di halaman pembayaran Midtrans (Virtual Account, e-Wallet, QRIS, Kartu Kredit, dll.)
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 flex items-center justify-center gap-2 text-xs text-neutral-500">
                        <Lock size={14} className="text-green-500" /> Pembayaran Anda aman dan dienkripsi ujung ke ujung.
                    </div>
                </div>

                {/* Payment Status Messages */}
                {paymentStatus === "success" && (
                    <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-2xl p-6 text-center">
                        <CheckCircle2 className="mx-auto text-green-500 mb-3" size={48} />
                        <h3 className="font-bold text-green-700 dark:text-green-300 text-lg">Pembayaran Berhasil! 🎉</h3>
                        <p className="text-sm text-green-600 dark:text-green-400 mt-1">Anda akan diarahkan ke halaman pesanan...</p>
                    </div>
                )}
                {paymentStatus === "pending" && (
                    <div className="bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 rounded-2xl p-6 text-center">
                        <Wallet className="mx-auto text-yellow-500 mb-3" size={48} />
                        <h3 className="font-bold text-yellow-700 dark:text-yellow-300 text-lg">Menunggu Pembayaran</h3>
                        <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-1">Silakan selesaikan pembayaran sesuai instruksi yang diberikan.</p>
                    </div>
                )}
                {paymentStatus === "error" && (
                    <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-2xl p-6 text-center">
                        <h3 className="font-bold text-red-700 dark:text-red-300 text-lg">Pembayaran Gagal</h3>
                        <p className="text-sm text-red-600 dark:text-red-400 mt-1">Terjadi kesalahan. Silakan coba lagi.</p>
                    </div>
                )}
            </div>

            {/* Kolom Kanan: Ringkasan Pesanan */}
            <div className="lg:col-span-1">
                <div className="sticky top-24 bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl border border-neutral-100 dark:border-slate-800">
                    <h3 className="text-lg font-bold mb-4">Ringkasan Pesanan</h3>

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
                            <span className="font-medium">{formatCurrency(subtotal)}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-neutral-500">Pajak aplikasi (11%)</span>
                            <span className="font-medium">{formatCurrency(pajak)}</span>
                        </div>
                    </div>

                    <div className="flex justify-between items-center pb-6 border-b border-neutral-100 dark:border-slate-800">
                        <span className="font-bold">Total Pembayaran</span>
                        <span className="text-2xl font-black text-primary dark:text-accent">
                            {total === 0 ? "Gratis" : formatCurrency(total)}
                        </span>
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={isLoading || paymentStatus === "success"}
                        className="mt-6 w-full flex items-center justify-center gap-2 bg-primary text-white dark:bg-accent dark:text-neutral-900 font-bold py-4 rounded-xl hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:hover:scale-100 cursor-pointer"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 size={20} className="animate-spin" />
                                Memproses...
                            </>
                        ) : paymentStatus === "success" ? (
                            <>
                                <CheckCircle2 size={20} />
                                Pembayaran Berhasil
                            </>
                        ) : (
                            <>
                                <CheckCircle2 size={20} />
                                Bayar Sekarang
                            </>
                        )}
                    </button>
                    <p className="mt-4 text-[10px] text-center text-neutral-400">
                        Dengan menyelesaikan pembayaran, Anda menyetujui Syarat dan Ketentuan Dienggo.
                    </p>
                </div>
            </div>

        </div>
    );
}
