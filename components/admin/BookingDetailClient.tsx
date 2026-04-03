"use client";

import { useState } from "react";
import { 
    Phone, Mail, MessageSquare, CreditCard, Receipt, 
    Calendar, Users, Clock, Home, MapPin, 
    ExternalLink, CheckCircle2, XCircle, Loader2 
} from "lucide-react";
import { format } from "date-fns";
import { id as idID } from "date-fns/locale";
import { formatCurrency } from "@/lib/utils";
import { updateBookingStatus } from "@/app/admin/actions/booking";
import { useRouter } from "next/navigation";

interface BookingDetailClientProps {
    booking: any;
}

export default function BookingDetailClient({ booking }: BookingDetailClientProps) {
    const router = useRouter();
    const [isUpdating, setIsUpdating] = useState(false);

    const handleUpdateStatus = async (newStatus: string) => {
        if (!confirm(`Apakah Anda yakin ingin mengubah status menjadi ${newStatus}?`)) return;
        
        setIsUpdating(true);
        try {
            await updateBookingStatus(booking.id, newStatus);
            router.refresh();
        } catch (error) {
            console.error(error);
            alert("Gagal mengupdate status");
        } finally {
            setIsUpdating(false);
        }
    };

    const formatDate = (date: any) => {
        if (!date) return "-";
        return format(new Date(date), "EEEE, d MMMM yyyy", { locale: idID });
    };

    const cleanPhone = (phone: string) => {
        let p = phone.replace(/[^0-9]/g, "");
        if (p.startsWith("0")) p = "62" + p.slice(1);
        if (!p.startsWith("62")) p = "62" + p;
        return p;
    };

    const waOwnerLink = () => {
        const phone = cleanPhone(booking.whatsappOwner || "");
        const dateStr = booking.tanggal ? formatDate(booking.tanggal) : `${formatDate(booking.checkIn)} - ${formatDate(booking.checkOut)}`;
        const text = encodeURIComponent(`Halo, saya Admin Dienggo. Ada pesanan baru untuk *${booking.itemName}* pada tanggal *${dateStr}*. Mohon konfirmasi ketersediaannya ya. Terima kasih!`);
        return `https://wa.me/${phone}?text=${text}`;
    };

    const waCustomerLink = () => {
        const phone = cleanPhone(booking.telepon);
        const dateStr = booking.tanggal ? formatDate(booking.tanggal) : `${formatDate(booking.checkIn)} - ${formatDate(booking.checkOut)}`;
        const text = encodeURIComponent(`Halo *${booking.namaLengkap}*, kami dari Dienggo. Pesanan Anda untuk *${booking.itemName}* pada tanggal *${dateStr}* tersedia/available! 
        
Silakan selesaikan pembayaran melalui link resmi berikut:
${booking.paymentUrl || '(Link pembayaran belum tersedia)'}

Terima kasih telah mempercayakan perjalanan Anda kepada kami.`);
        return `https://wa.me/${phone}?text=${text}`;
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: Data Details */}
            <div className="lg:col-span-2 space-y-8">
                
                {/* 1. Item Details */}
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                    <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
                        <Home className="text-primary" size={20} />
                        Layanan yang Dipesan
                    </h3>
                    <div className="flex flex-col md:flex-row gap-6">
                        <div className="bg-slate-50 p-6 rounded-2xl flex-1 border border-slate-100">
                            <span className="text-[10px] font-black tracking-widest text-primary uppercase bg-primary/10 px-2 py-0.5 rounded-full block w-fit mb-2">
                                {booking.tipeItem}
                            </span>
                            <h4 className="text-xl font-bold text-slate-900 mb-2">{booking.itemName}</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">WAKTU / TANGGAL</p>
                                    <p className="text-sm font-bold text-slate-700 flex items-center gap-2 leading-tight">
                                        <Calendar size={14} className="text-slate-400 shrink-0" />
                                        {booking.tanggal ? formatDate(booking.tanggal) : `${formatDate(booking.checkIn)} - ${formatDate(booking.checkOut)}`}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">JUMLAH TAMU</p>
                                    <p className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                        <Users size={14} className="text-slate-400" />
                                        {booking.jumlahTamu} Tamu
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-900 p-6 rounded-2xl md:w-64 flex flex-col justify-between text-white shadow-lg shadow-slate-200">
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">KODE BOOKING</p>
                                <p className="text-2xl font-black text-primary font-mono">{booking.kodeBooking}</p>
                            </div>
                            <div className="mt-6 flex flex-col gap-2">
                                <a 
                                    href={waOwnerLink()}
                                    target="_blank"
                                    className="w-full flex items-center justify-center gap-2 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold transition-all border border-white/10 cursor-pointer"
                                >
                                    <MessageSquare size={14} /> Hubungi Owner
                                </a>
                                <p className="text-[10px] text-center text-slate-400 italic">WhatsApp Owner: {booking.whatsappOwner || '-'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Customer Details */}
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                    <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
                        <User className="text-primary" size={20} />
                        Data Pelanggan (Customer)
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="flex gap-4 items-start">
                            <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 shrink-0 border border-slate-100">
                                <User size={24} />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">NAMA LENGKAP</p>
                                <p className="text-lg font-bold text-slate-900">{booking.namaLengkap}</p>
                            </div>
                        </div>
                        <div className="flex gap-4 items-start">
                            <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 shrink-0 border border-slate-100">
                                <Mail size={24} />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">EMAIL</p>
                                <p className="text-lg font-bold text-slate-900 break-all">{booking.email}</p>
                            </div>
                        </div>
                        <div className="flex gap-4 items-start">
                            <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 shrink-0 border border-slate-100">
                                <Phone size={24} />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">TELEPON / WA</p>
                                <div className="flex items-center gap-3">
                                    <p className="text-lg font-bold text-slate-900">{booking.telepon}</p>
                                    <a 
                                        href={waCustomerLink()}
                                        target="_blank"
                                        className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors border border-green-100 cursor-pointer"
                                        title="Kirim Pesan Ketersediaan"
                                    >
                                        <MessageSquare size={16} />
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-4 items-start">
                            <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 shrink-0 border border-slate-100">
                                <Clock size={24} />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">PERMINTAAN KHUSUS</p>
                                <p className="text-sm font-medium text-slate-600 italic">"{booking.permintaan || 'Tidak ada permintaan khusus'}"</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Column: Actions & Summary */}
            <div className="space-y-6">
                {/* Payment Summary */}
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                    <h3 className="text-lg font-black text-slate-800 mb-6">Ringkasan Biaya</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center text-sm py-3 border-b border-slate-50">
                            <span className="text-slate-500">Subtotal</span>
                            <span className="font-bold text-slate-700">{formatCurrency(booking.total)}</span>
                        </div>
                        <div className="flex justify-between items-center py-4">
                            <span className="text-sm font-black text-slate-500 uppercase">Total Bayar</span>
                            <span className="text-2xl font-black text-primary">{formatCurrency(booking.total)}</span>
                        </div>
                        
                        <div className="pt-4 flex flex-col gap-3">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">STATUS PEMBAYARAN</p>
                            {booking.status === "paid" ? (
                                <div className="w-full py-4 bg-green-50 text-green-700 rounded-2xl font-black flex items-center justify-center gap-2 border border-green-100">
                                    <CheckCircle2 size={20} /> LUNAS
                                </div>
                            ) : (
                                <div className="w-full py-4 bg-amber-50 text-amber-700 rounded-2xl font-black flex items-center justify-center gap-2 border border-amber-100">
                                    <Clock size={20} /> MENUNGGU PEMBAYARAN
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Status Actions */}
                <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200">
                    <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest mb-6">Aksi Cepat Admin</h3>
                    <div className="flex flex-col gap-3">
                        {booking.status !== "paid" && (
                            <button
                                onClick={() => handleUpdateStatus("paid")}
                                disabled={isUpdating}
                                className="w-full py-4 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 cursor-pointer"
                            >
                                {isUpdating ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle2 size={18} />}
                                Tandai Sudah Lunas
                            </button>
                        )}
                        {booking.status !== "cancelled" && (
                            <button
                                onClick={() => handleUpdateStatus("cancelled")}
                                disabled={isUpdating}
                                className="w-full py-4 bg-white border border-red-200 text-red-600 hover:bg-red-50 rounded-2xl font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 cursor-pointer"
                            >
                                {isUpdating ? <Loader2 className="animate-spin" size={18} /> : <XCircle size={18} />}
                                Batalkan Pesanan
                            </button>
                        )}
                        
                        <a 
                            href={waCustomerLink()}
                            target="_blank"
                            className="w-full py-4 bg-green-100 hover:bg-green-200 text-green-700 rounded-2xl font-bold flex items-center justify-center gap-2 transition-colors mt-2 cursor-pointer"
                        >
                            <MessageSquare size={18} />
                            WhatsApp Template (Customer)
                        </a>
                        <p className="text-[10px] text-center text-slate-500 leading-relaxed px-4">
                            Template WhatsApp Customer akan mencantumkan link pembayaran resmi otomatis.
                        </p>
                    </div>
                </div>
            </div>

        </div>
    );
}

// Minimal placeholder icons moved to local scope to prevent import confusion
function User({ size, className }: { size: number, className?: string }) { 
    return <Users size={size} className={className} />;
}
