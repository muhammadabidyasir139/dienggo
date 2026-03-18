"use client";

import { useState, useEffect } from "react";
import { CreditCard, Wallet, Lock, CheckCircle2, Loader2 } from "lucide-react";
import Image from "next/image";
import { formatCurrency } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import { X } from "lucide-react";

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
        checkIn: "",
        checkOut: "",
        tanggal: "",
    });

    const [nights, setNights] = useState(1);

    useEffect(() => {
        if ((type === "villa" || type === "hotel-cabin") && formData.checkIn && formData.checkOut) {
            const start = new Date(formData.checkIn);
            const end = new Date(formData.checkOut);
            const diffTime = Math.abs(end.getTime() - start.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            setNights(diffDays > 0 ? diffDays : 1);
        } else {
            setNights(1);
        }
    }, [formData.checkIn, formData.checkOut, type]);

    const subtotal = item.harga;
    const total = subtotal * nights;

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

    const [showLoginPopup, setShowLoginPopup] = useState(false);
    const { data: session } = useSession();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async () => {
        // Validate
        if (!formData.namaLengkap || !formData.email || !formData.telepon) {
            alert("Mohon lengkapi data pemesan (Nama, Email, Telepon).");
            return;
        }

        if ((type === "villa" || type === "hotel-cabin") && (!formData.checkIn || !formData.checkOut)) {
            alert("Mohon pilih tanggal Check-in dan Check-out.");
            return;
        }

        if ((type === "jeep" || type === "wisata") && !formData.tanggal) {
            alert("Mohon pilih tanggal kunjungan.");
            return;
        }

        if (total === 0) {
            alert("Item ini gratis, tidak perlu pembayaran.");
            return;
        }

        // Check if user is logged in
        if (!session) {
            setShowLoginPopup(true);
            return;
        }

        proceedToPayment();
    };

    const proceedToPayment = async () => {
        setIsLoading(true);
        setShowLoginPopup(false);
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
                <div className="bg-white  rounded-3xl p-6 md:p-8 shadow-sm border border-neutral-100 ">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <span className="bg-primary/10 text-primary   w-8 h-8 rounded-full flex items-center justify-center">1</span>
                        Data Pemesan
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-neutral-600 ">Nama Lengkap</label>
                            <input
                                type="text"
                                name="namaLengkap"
                                value={formData.namaLengkap}
                                onChange={handleChange}
                                placeholder="Sesuai KTP/Paspor"
                                className="bg-neutral-50  border border-neutral-200  rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary :ring-accent transition-all"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-neutral-600 ">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="contoh@email.com"
                                className="bg-neutral-50  border border-neutral-200  rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary :ring-accent transition-all"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-neutral-600 ">Nomor Telepon / WhatsApp</label>
                            <div className="flex">
                                <span className="bg-neutral-100  border border-r-0 border-neutral-200  rounded-l-xl px-4 py-3 text-neutral-500 font-medium">+62</span>
                                <input
                                    type="tel"
                                    name="telepon"
                                    value={formData.telepon}
                                    onChange={handleChange}
                                    placeholder="81234567890"
                                    className="w-full bg-neutral-50  border border-neutral-200  rounded-r-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary :ring-accent transition-all"
                                />
                            </div>
                        </div>
                        {(type === "villa" || type === "hotel-cabin") ? (
                            <>
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-bold text-neutral-600">Tanggal Check-in</label>
                                    <input
                                        type="date"
                                        name="checkIn"
                                        required
                                        value={formData.checkIn}
                                        onChange={handleChange}
                                        className="bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-all cursor-pointer"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-bold text-neutral-600">Tanggal Check-out</label>
                                    <input
                                        type="date"
                                        name="checkOut"
                                        required
                                        value={formData.checkOut}
                                        onChange={handleChange}
                                        className="bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-all cursor-pointer"
                                    />
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-bold text-neutral-600">Tanggal Kunjungan</label>
                                <input
                                    type="date"
                                    name="tanggal"
                                    required
                                    value={formData.tanggal}
                                    onChange={handleChange}
                                    className="bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-all cursor-pointer"
                                />
                            </div>
                        )}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-neutral-600 ">Permintaan Khusus (Opsional)</label>
                            <input
                                type="text"
                                name="permintaan"
                                value={formData.permintaan}
                                onChange={handleChange}
                                placeholder="Contoh: Bawa bayi, check-in telat"
                                className="bg-neutral-50  border border-neutral-200  rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary :ring-accent transition-all"
                            />
                        </div>
                    </div>
                </div>

                {/* Info Pembayaran */}
                <div className="bg-white  rounded-3xl p-6 md:p-8 shadow-sm border border-neutral-100 ">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <span className="bg-primary/10 text-primary   w-8 h-8 rounded-full flex items-center justify-center">2</span>
                        Metode Pembayaran
                    </h2>

                    <div className="flex flex-col gap-4">
                        <div className="relative flex items-center justify-between p-4 border-2 border-primary  bg-primary/5  rounded-2xl">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-primary/10  rounded-full flex items-center justify-center">
                                    <CreditCard className="text-primary " size={20} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-bold text-foreground">Midtrans Payment Gateway</span>
                                    <span className="text-xs text-neutral-500">VA, Gopay, QRIS, Dana, OVO, Kartu Kredit & Lainnya</span>
                                </div>
                            </div>
                            <CheckCircle2 className="text-primary " size={20} />
                        </div>

                        <div className="p-4 bg-blue-50  rounded-2xl border border-blue-100 ">
                            <p className="text-sm text-blue-700 ">
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
                    <div className="bg-green-50  border border-green-200  rounded-2xl p-6 text-center">
                        <CheckCircle2 className="mx-auto text-green-500 mb-3" size={48} />
                        <h3 className="font-bold text-green-700  text-lg">Pembayaran Berhasil! 🎉</h3>
                        <p className="text-sm text-green-600  mt-1">Anda akan diarahkan ke halaman pesanan...</p>
                    </div>
                )}
                {paymentStatus === "pending" && (
                    <div className="bg-yellow-50  border border-yellow-200  rounded-2xl p-6 text-center">
                        <Wallet className="mx-auto text-yellow-500 mb-3" size={48} />
                        <h3 className="font-bold text-yellow-700  text-lg">Menunggu Pembayaran</h3>
                        <p className="text-sm text-yellow-600  mt-1">Silakan selesaikan pembayaran sesuai instruksi yang diberikan.</p>
                    </div>
                )}
                {paymentStatus === "error" && (
                    <div className="bg-red-50  border border-red-200  rounded-2xl p-6 text-center">
                        <h3 className="font-bold text-red-700  text-lg">Pembayaran Gagal</h3>
                        <p className="text-sm text-red-600  mt-1">Terjadi kesalahan. Silakan coba lagi.</p>
                    </div>
                )}
            </div>

            {/* Kolom Kanan: Ringkasan Pesanan */}
            <div className="lg:col-span-1">
                <div className="sticky top-24 bg-white  rounded-3xl p-6 shadow-xl border border-neutral-100 ">
                    <h3 className="text-lg font-bold mb-4">Ringkasan Pesanan</h3>

                    <div className="flex gap-4 mb-6 pb-6 border-b border-neutral-100 ">
                        <div className="relative w-24 h-24 rounded-xl overflow-hidden shrink-0">
                            <Image src={item.foto_utama} alt={item.nama} fill className="object-cover" />
                        </div>
                        <div className="flex flex-col justify-center">
                            <span className="text-xs font-bold text-primary  uppercase tracking-wider mb-1">{type}</span>
                            <h4 className="font-bold text-foreground leading-snug line-clamp-2">{item.nama}</h4>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 mb-6">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-neutral-500">Harga per malam/paket</span>
                            <span className="font-medium">{formatCurrency(subtotal)}</span>
                        </div>
                        {(type === "villa" || type === "hotel-cabin") && (
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-neutral-500">Durasi Menginap</span>
                                <span className="font-medium">{nights} Malam</span>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-between items-center pb-6 border-b border-neutral-100 ">
                        <span className="font-bold">Total Pembayaran</span>
                        <span className="text-2xl font-black text-primary ">
                            {total === 0 ? "Gratis" : formatCurrency(total)}
                        </span>
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={isLoading || paymentStatus === "success"}
                        className="mt-6 w-full flex items-center justify-center gap-2 bg-primary text-white   font-bold py-4 rounded-xl hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:hover:scale-100 cursor-pointer"
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

            {/* Login Popup Modal */}
            {showLoginPopup && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl relative animate-in zoom-in-95 duration-200">
                        <button 
                            onClick={() => setShowLoginPopup(false)}
                            className="absolute right-6 top-6 text-neutral-400 hover:text-neutral-600 transition-colors"
                        >
                            <X size={24} />
                        </button>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Lock className="text-primary" size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-foreground mb-2">Simpan Pesanan Kamu</h3>
                            <p className="text-neutral-500 text-sm mb-8 leading-relaxed">
                                Login untuk menyimpan pesanan kamu agar dapat dilihat kembali di menu "Pesanan Saya".
                            </p>

                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={() => signIn(undefined, { callbackUrl: window.location.href })}
                                    className="w-full bg-primary text-white font-bold py-3.5 rounded-xl hover:scale-[1.02] transition-transform cursor-pointer"
                                >
                                    Login Sekarang
                                </button>
                                <button
                                    onClick={proceedToPayment}
                                    className="w-full bg-neutral-100 text-neutral-600 font-bold py-3.5 rounded-xl hover:bg-neutral-200 transition-colors cursor-pointer"
                                >
                                    Lewati (Lanjut Bayar)
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
