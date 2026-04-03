"use client";

import { useState, useEffect, useRef } from "react";
import { CreditCard, Wallet, Lock, CheckCircle2, Loader2, Calendar as CalendarIcon } from "lucide-react";
import Image from "next/image";
import { formatCurrency } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import { X } from "lucide-react";
import { format, startOfDay } from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

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
    const [showCheckInPicker, setShowCheckInPicker] = useState(false);
    const [showCheckOutPicker, setShowCheckOutPicker] = useState(false);
    const [showTanggalPicker, setShowTanggalPicker] = useState(false);

    const checkInRef = useRef<HTMLDivElement>(null);
    const checkOutRef = useRef<HTMLDivElement>(null);
    const tanggalRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (checkInRef.current && !checkInRef.current.contains(event.target as Node)) {
                setShowCheckInPicker(false);
            }
            if (checkOutRef.current && !checkOutRef.current.contains(event.target as Node)) {
                setShowCheckOutPicker(false);
            }
            if (tanggalRef.current && !tanggalRef.current.contains(event.target as Node)) {
                setShowTanggalPicker(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const [formData, setFormData] = useState({
        namaLengkap: "",
        email: "",
        telepon: "",
        permintaan: "",
        checkIn: "",
        checkOut: "",
        tanggal: "",
    });

    const [errors, setErrors] = useState<Record<string, boolean>>({});

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
        const { name, value } = e.target;
        
        // Validate booked dates
        if ((name === "checkIn" || name === "checkOut" || name === "tanggal") && value) {
            const bookedDates = (item.bookedDates as string[]) || [];
            if (bookedDates.includes(value)) {
                alert(`Tanggal ${value} sudah dipesan. Silakan pilih tanggal lain.`);
                return;
            }
            
            // For checkOut, also validate dates between checkIn and checkOut
            if (name === "checkOut" && formData.checkIn) {
                const start = new Date(formData.checkIn);
                const end = new Date(value);
                
                if (end <= start) {
                    alert("Tanggal Check-out harus setelah tanggal Check-in.");
                    return;
                }
                
                // Check if any date in between is booked
                let currentDate = new Date(start);
                currentDate.setDate(currentDate.getDate() + 1); // Start checking from day after check-in
                
                while (currentDate < end) {
                    const dateStr = currentDate.toISOString().split('T')[0];
                    if (bookedDates.includes(dateStr)) {
                        alert(`Ada tanggal yang sudah dipesan di antara ${formData.checkIn} dan ${value}. Silakan pilih rentang tanggal lain.`);
                        return;
                    }
                    currentDate.setDate(currentDate.getDate() + 1);
                }
            }
            
            // For checkIn, if checkOut is already selected, validate the range
            if (name === "checkIn" && formData.checkOut) {
                const start = new Date(value);
                const end = new Date(formData.checkOut);
                
                if (end <= start) {
                    // Reset checkout if it's before or equal to new checkin
                    setFormData((prev) => ({ ...prev, [name]: value, checkOut: "" }));
                    return;
                }
                
                // Check if any date in between is booked
                let currentDate = new Date(start);
                currentDate.setDate(currentDate.getDate() + 1);
                
                while (currentDate < end) {
                    const dateStr = currentDate.toISOString().split('T')[0];
                    if (bookedDates.includes(dateStr)) {
                        alert(`Ada tanggal yang sudah dipesan di antara ${value} dan ${formData.checkOut}. Silakan pilih rentang tanggal lain.`);
                        // Reset checkout
                        setFormData((prev) => ({ ...prev, [name]: value, checkOut: "" }));
                        return;
                    }
                    currentDate.setDate(currentDate.getDate() + 1);
                }
            }
        }

        setFormData((prev) => ({ ...prev, [name]: value }));
        // Clear error when user changes value
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: false }));
        }
    };

    const handleDateSelect = (name: string, date: Date | undefined) => {
        if (!date) return;
        const dateString = format(date, "yyyy-MM-dd");
        
        // Pass to handleChange to trigger the validations
        handleChange({
            target: { name, value: dateString }
        } as unknown as React.ChangeEvent<HTMLInputElement>);

        if (name === "checkIn") {
            setShowCheckInPicker(false);
            if (!formData.checkOut) {
                setShowCheckOutPicker(true);
            }
        }
        if (name === "checkOut") setShowCheckOutPicker(false);
        if (name === "tanggal") setShowTanggalPicker(false);
    };

    const getDisabledDates = (type: "checkIn" | "checkOut" | "tanggal") => {
        return (date: Date): boolean => {
            // Disable past dates
            if (startOfDay(date) < startOfDay(new Date())) return true;
            
            // Disable booked dates
            const dateString = format(date, "yyyy-MM-dd");
            if ((item.bookedDates as string[] || []).includes(dateString)) return true;
            
            // Custom logic for checkOut
            if (type === "checkOut" && formData.checkIn) {
                const minCheckOut = startOfDay(new Date(formData.checkIn));
                minCheckOut.setDate(minCheckOut.getDate() + 1); // Minimum 1 night
                if (startOfDay(date) < minCheckOut) return true;

                // Disable any dates after the nearest booked date
                if (startOfDay(date) >= minCheckOut) {
                    let currentDate = new Date(formData.checkIn);
                    currentDate.setDate(currentDate.getDate() + 1);
                    while (currentDate < date) {
                        if ((item.bookedDates as string[] || []).includes(format(currentDate, "yyyy-MM-dd"))) {
                            return true;
                        }
                        currentDate.setDate(currentDate.getDate() + 1);
                    }
                }
            }
            
            return false;
        };
    };

    const handleSubmit = async () => {
        // Validate
        const newErrors: Record<string, boolean> = {};
        let isValid = true;

        if (!formData.namaLengkap) { newErrors.namaLengkap = true; isValid = false; }
        if (!formData.email) { newErrors.email = true; isValid = false; }
        if (!formData.telepon) { newErrors.telepon = true; isValid = false; }

        if ((type === "villa" || type === "hotel-cabin")) {
            if (!formData.checkIn) { newErrors.checkIn = true; isValid = false; }
            if (!formData.checkOut) { newErrors.checkOut = true; isValid = false; }
        }

        if ((type === "jeep" || type === "wisata") && !formData.tanggal) {
            newErrors.tanggal = true;
            isValid = false;
        }

        setErrors(newErrors);

        if (!isValid) {
            const firstErrorField = Object.keys(newErrors)[0];
            alert("Mohon lengkapi data yang wajib diisi (bertanda *).");
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

            // Handle redirection for Villa, Cabin, and Jeep
            if (type === "villa" || type === "hotel-cabin" || type === "cabin" || type === "jeep") {
                router.push(`/booking/invoice/${data.orderId}`);
                return;
            }

            // Open Snap popup for other types (default flow)
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
                            <label className={`text-sm font-medium ${errors.namaLengkap ? "text-red-500" : "text-neutral-600"} `}>
                                Nama Lengkap <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="namaLengkap"
                                value={formData.namaLengkap}
                                onChange={handleChange}
                                placeholder="Sesuai KTP/Paspor"
                                className={`bg-neutral-50 border ${errors.namaLengkap ? "border-red-500 ring-1 ring-red-500" : "border-neutral-200"} rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-all`}
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className={`text-sm font-medium ${errors.email ? "text-red-500" : "text-neutral-600"} `}>
                                Email <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="contoh@email.com"
                                className={`bg-neutral-50 border ${errors.email ? "border-red-500 ring-1 ring-red-500" : "border-neutral-200"} rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-all`}
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className={`text-sm font-medium ${errors.telepon ? "text-red-500" : "text-neutral-600"} `}>
                                Nomor Telepon / WhatsApp <span className="text-red-500">*</span>
                            </label>
                            <div className="flex">
                                <span className={`bg-neutral-100 border border-r-0 ${errors.telepon ? "border-red-500 text-red-500" : "border-neutral-200 text-neutral-500"} rounded-l-xl px-4 py-3 font-medium transition-colors`}>+62</span>
                                <input
                                    type="tel"
                                    name="telepon"
                                    value={formData.telepon}
                                    onChange={handleChange}
                                    placeholder="81234567890"
                                    className={`w-full bg-neutral-50 border ${errors.telepon ? "border-red-500 ring-1 ring-red-500" : "border-neutral-200"} rounded-r-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-all`}
                                />
                            </div>
                        </div>
                        {(type === "villa" || type === "hotel-cabin") ? (
                            <>
                                <div className="flex flex-col gap-2 relative" ref={checkInRef}>
                                    <label className={`text-sm font-bold ${errors.checkIn ? "text-red-500" : "text-neutral-600"}`}>
                                        Tanggal Check-in <span className="text-red-500">*</span>
                                    </label>
                                    <div
                                        onClick={() => { setShowCheckInPicker(!showCheckInPicker); setShowCheckOutPicker(false); }}
                                        className={`bg-neutral-50 border ${errors.checkIn ? "border-red-500 ring-1 ring-red-500" : "border-neutral-200"} rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-primary transition-all cursor-pointer flex items-center justify-between`}
                                    >
                                        <span className={formData.checkIn ? "text-neutral-900" : "text-neutral-400"}>
                                            {formData.checkIn ? format(new Date(formData.checkIn), "dd/MM/yyyy") : "dd/mm/yyyy"}
                                        </span>
                                        <CalendarIcon size={20} className={errors.checkIn ? "text-red-500" : "text-neutral-500"} />
                                    </div>
                                    {showCheckInPicker && (
                                        <div className="absolute top-[100%] mt-2 left-0 z-50 rounded-xl bg-white p-4 shadow-xl border border-neutral-100">
                                            <DayPicker
                                                mode="single"
                                                selected={formData.checkIn ? new Date(formData.checkIn) : undefined}
                                                defaultMonth={formData.checkIn ? new Date(formData.checkIn) : new Date()}
                                                onSelect={(date) => handleDateSelect("checkIn", date)}
                                                disabled={getDisabledDates("checkIn")}
                                            />
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-col gap-2 relative" ref={checkOutRef}>
                                    <label className={`text-sm font-bold ${errors.checkOut ? "text-red-500" : "text-neutral-600"}`}>
                                        Tanggal Check-out <span className="text-red-500">*</span>
                                    </label>
                                    <div
                                        onClick={() => { setShowCheckOutPicker(!showCheckOutPicker); setShowCheckInPicker(false); }}
                                        className={`bg-neutral-50 border ${errors.checkOut ? "border-red-500 ring-1 ring-red-500" : "border-neutral-200"} rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-primary transition-all cursor-pointer flex items-center justify-between`}
                                    >
                                        <span className={formData.checkOut ? "text-neutral-900" : "text-neutral-400"}>
                                            {formData.checkOut ? format(new Date(formData.checkOut), "dd/MM/yyyy") : "dd/mm/yyyy"}
                                        </span>
                                        <CalendarIcon size={20} className={errors.checkOut ? "text-red-500" : "text-neutral-500"} />
                                    </div>
                                    {showCheckOutPicker && (
                                        <div className="absolute top-[100%] mt-2 left-0 z-50 rounded-xl bg-white p-4 shadow-xl border border-neutral-100">
                                            <DayPicker
                                                mode="single"
                                                selected={formData.checkOut ? new Date(formData.checkOut) : undefined}
                                                defaultMonth={formData.checkOut ? new Date(formData.checkOut) : (formData.checkIn ? new Date(formData.checkIn) : new Date())}
                                                onSelect={(date) => handleDateSelect("checkOut", date)}
                                                disabled={getDisabledDates("checkOut")}
                                            />
                                        </div>
                                    )}
                                </div>
                                {item.bookedDates && (item.bookedDates as string[]).length > 0 && (
                                    <div className="col-span-1 md:col-span-2 mt-1 p-3 bg-amber-50 border border-amber-100 rounded-xl">
                                        <p className="text-xs text-amber-800 font-medium flex items-center gap-1.5">
                                            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                                            Tanggal yang sudah dipesan (tidak tersedia):
                                        </p>
                                        <div className="flex flex-wrap gap-1.5 mt-2">
                                            {(item.bookedDates as string[]).sort().map((date, i) => (
                                                <span key={i} className="text-[10px] bg-white border border-amber-200 text-amber-700 px-2 py-0.5 rounded-md font-medium">
                                                    {new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="flex flex-col gap-2 relative" ref={tanggalRef}>
                                <label className={`text-sm font-bold ${errors.tanggal ? "text-red-500" : "text-neutral-600"}`}>
                                    Tanggal Kunjungan <span className="text-red-500">*</span>
                                </label>
                                <div
                                    onClick={() => setShowTanggalPicker(!showTanggalPicker)}
                                    className={`bg-neutral-50 border ${errors.tanggal ? "border-red-500 ring-1 ring-red-500" : "border-neutral-200"} rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-primary transition-all cursor-pointer flex items-center justify-between`}
                                >
                                    <span className={formData.tanggal ? "text-neutral-900" : "text-neutral-400"}>
                                        {formData.tanggal ? format(new Date(formData.tanggal), "dd/MM/yyyy") : "dd/mm/yyyy"}
                                    </span>
                                    <CalendarIcon size={20} className={errors.tanggal ? "text-red-500" : "text-neutral-500"} />
                                </div>
                                {showTanggalPicker && (
                                    <div className="absolute top-[100%] mt-2 left-0 z-50 rounded-xl bg-white p-4 shadow-xl border border-neutral-100">
                                        <DayPicker
                                            mode="single"
                                            selected={formData.tanggal ? new Date(formData.tanggal) : undefined}
                                            onSelect={(date) => handleDateSelect("tanggal", date)}
                                            disabled={getDisabledDates("tanggal")}
                                        />
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Notice availability */}
                        {(type === "villa" || type === "hotel-cabin" || type === "cabin") && (
                            <div className="col-span-1 md:col-span-2 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex gap-3 shadow-sm">
                                <div className="bg-amber-100 text-amber-600 p-2 rounded-lg h-fit">
                                    <CalendarIcon size={18} />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <p className="text-xs font-bold text-amber-800 uppercase tracking-widest flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                                        Informasi Penting
                                    </p>
                                    <p className="text-sm text-amber-900 leading-relaxed font-medium">
                                        Data ketersediaan belum terupdate secara realtime. Pilih tanggal check-in dan check out untuk info harga sesuai tanggal, kemudian klik <span className="font-bold underline decoration-amber-300">Cek Ketersediaan</span> admin akan mengirimkan konfirmasi pemesanan.
                                    </p>
                                </div>
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
                                Cek Ketersediaan
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
