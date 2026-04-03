import { getOrderByBookingCode } from "@/app/actions/orders";
import { Navbar } from "@/components/Navbar";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { id as idID } from "date-fns/locale";
import { CheckCircle2, Calendar, Users, MapPin, Phone, MessageSquare, ArrowLeft, Receipt, CreditCard } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { formatCurrency } from "@/lib/utils";

export default async function BookingInvoicePage({
    params,
}: {
    params: Promise<{ kodeBooking: string }>;
}) {
    const { kodeBooking } = await params;
    const booking = await getOrderByBookingCode(kodeBooking);

    if (!booking) {
        notFound();
    }

    const checkInDate = booking.checkIn ? new Date(booking.checkIn) : null;
    const checkOutDate = booking.checkOut ? new Date(booking.checkOut) : null;
    const visitDate = booking.tanggal ? new Date(booking.tanggal) : null;

    return (
        <main className="min-h-screen bg-neutral-50 pb-20">
            <Navbar />

            <div className="pt-24 md:pt-32 pb-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Status Card */}
                <div className="bg-white rounded-[3rem] p-10 md:p-16 shadow-2xl shadow-primary/5 border border-neutral-100 mb-10 relative overflow-hidden text-center">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl opacity-50"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl opacity-50"></div>
                    
                    <div className="relative z-10">
                        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce duration-[2000ms]">
                            <CheckCircle2 className="text-green-600" size={48} />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-neutral-900 mb-6 tracking-tight">
                            Pesanan Terkirim!
                        </h1>
                        <div className="max-w-2xl mx-auto space-y-6">
                            <p className="text-xl text-neutral-600 font-medium leading-relaxed">
                                Kami akan cek ketersediaan {booking.tipeItem === 'villa' ? 'villa' : booking.tipeItem}, kamu akan dihubungi oleh admin melalui <span className="text-green-600 font-bold decoration-wavy decoration-green-200 underline underline-offset-4">WhatsApp</span> untuk konfirmasi ketersediaan pemesanan.
                            </p>
                            <div className="inline-flex items-center gap-3 px-6 py-3 bg-amber-50 border border-amber-100 text-amber-700 rounded-full text-sm font-black tracking-widest uppercase animate-pulse">
                                <span className="w-2.5 h-2.5 bg-amber-500 rounded-full"></span>
                                Menunggu Konfirmasi Admin
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                    {/* Main Details (8 columns) */}
                    <div className="lg:col-span-8 space-y-10">
                        {/* Booking Details Section */}
                        <section className="bg-white rounded-[2.5rem] p-10 md:p-12 shadow-sm border border-neutral-100 hover:shadow-md transition-shadow duration-500">
                            <div className="flex items-center justify-between mb-10">
                                <h2 className="text-2xl font-black text-neutral-900 flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                                        <Receipt className="text-primary" size={28} />
                                    </div>
                                    Rincian Pemesanan
                                </h2>
                                <span className="text-xs font-black text-neutral-300 uppercase tracking-[0.2em]">{booking.kodeBooking}</span>
                            </div>

                            <div className="flex flex-col md:flex-row gap-8 mb-12 pb-12 border-b border-neutral-50 items-center md:items-start">
                                <div className="relative w-full md:w-56 h-56 rounded-[2rem] overflow-hidden shrink-0 shadow-lg group">
                                    {booking.itemFoto ? (
                                        <Image src={booking.itemFoto} alt={booking.itemName} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                                    ) : (
                                        <div className="w-full h-full bg-neutral-100 flex items-center justify-center">
                                            <Calendar className="text-neutral-300" size={48} />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6 md:hidden lg:flex">
                                        <span className="text-[10px] font-black tracking-widest text-white uppercase bg-primary/80 backdrop-blur-md px-3 py-1 rounded-full">
                                            {booking.tipeItem}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex flex-col justify-center text-center md:text-left">
                                    <span className="hidden md:block text-xs font-black text-primary uppercase tracking-[0.3em] mb-2">{booking.tipeItem}</span>
                                    <h3 className="text-3xl md:text-4xl font-black text-neutral-900 mb-3 leading-tight tracking-tight">{booking.itemName}</h3>
                                    <div className="flex items-center justify-center md:justify-start gap-2 text-neutral-500 font-medium">
                                        <MapPin size={18} className="text-primary" />
                                        <span>Dieng, Jawa Tengah</span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                                <div className="space-y-8">
                                    <div className="flex items-start gap-5 group">
                                        <div className="w-14 h-14 rounded-2xl bg-neutral-50 flex items-center justify-center shrink-0 border border-neutral-100 text-neutral-400 group-hover:border-primary/20 group-hover:bg-primary/5 group-hover:text-primary transition-all duration-300">
                                            <Calendar size={28} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-neutral-400 font-black uppercase tracking-[0.2em] mb-1">
                                                {booking.tanggal ? "Tanggal Kunjungan" : "Check-in"}
                                            </p>
                                            <p className="text-xl font-black text-neutral-800">
                                                {booking.tanggal 
                                                    ? format(visitDate!, "EEEE, d MMM yyyy", { locale: idID })
                                                    : format(checkInDate!, "EEEE, d MMM yyyy", { locale: idID })
                                                }
                                            </p>
                                        </div>
                                    </div>
                                    {booking.checkOut && (
                                        <div className="flex items-start gap-5 group">
                                            <div className="w-14 h-14 rounded-2xl bg-neutral-50 flex items-center justify-center shrink-0 border border-neutral-100 text-neutral-400 group-hover:border-primary/20 group-hover:bg-primary/5 group-hover:text-primary transition-all duration-300">
                                                <Calendar size={28} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-neutral-400 font-black uppercase tracking-[0.2em] mb-1">Check-out</p>
                                                <p className="text-xl font-black text-neutral-800">
                                                    {format(checkOutDate!, "EEEE, d MMM yyyy", { locale: idID })}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-8">
                                    <div className="flex items-start gap-5 group">
                                        <div className="w-14 h-14 rounded-2xl bg-neutral-50 flex items-center justify-center shrink-0 border border-neutral-100 text-neutral-400 group-hover:border-primary/20 group-hover:bg-primary/5 group-hover:text-primary transition-all duration-300">
                                            <Users size={28} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-neutral-400 font-black uppercase tracking-[0.2em] mb-1">Jumlah Tamu</p>
                                            <p className="text-xl font-black text-neutral-800">{booking.jumlahTamu} Tamu</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-5 group">
                                        <div className="w-14 h-14 rounded-2xl bg-neutral-50 flex items-center justify-center shrink-0 border border-neutral-100 text-neutral-400 group-hover:border-primary/20 group-hover:bg-primary/5 group-hover:text-primary transition-all duration-300">
                                            <Receipt size={28} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-neutral-400 font-black uppercase tracking-[0.2em] mb-1">Status Ketersediaan</p>
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                                                <p className="text-lg font-black text-amber-600">Mengecek...</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Customer Info Section */}
                        <section className="bg-white rounded-[2.5rem] p-10 md:p-12 shadow-sm border border-neutral-100">
                            <h2 className="text-2xl font-black text-neutral-900 mb-10 flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center">
                                    <Users className="text-blue-600" size={28} />
                                </div>
                                Informasi Pemesan
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                                <div className="bg-neutral-50/50 p-6 rounded-3xl border border-neutral-100">
                                    <p className="text-[10px] text-neutral-400 font-black uppercase tracking-[0.2em] mb-2">Nama Lengkap</p>
                                    <p className="text-lg font-black text-neutral-800 uppercase leading-none">{booking.namaLengkap}</p>
                                </div>
                                <div className="bg-neutral-50/50 p-6 rounded-3xl border border-neutral-100">
                                    <p className="text-[10px] text-neutral-400 font-black uppercase tracking-[0.2em] mb-2">Email</p>
                                    <p className="text-sm font-black text-neutral-700 lowercase leading-tight">{booking.email}</p>
                                </div>
                                <div className="bg-neutral-50/50 p-6 rounded-3xl border border-neutral-100">
                                    <p className="text-[10px] text-neutral-400 font-black uppercase tracking-[0.2em] mb-2">Nomor Telepon</p>
                                    <p className="text-lg font-black text-neutral-800 tracking-wider">+{booking.telepon}</p>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Sidebar: Payment Summary (4 columns) */}
                    <div className="lg:col-span-4 space-y-8 sticky top-32">
                        <div className="bg-white rounded-[3rem] p-10 shadow-2xl shadow-primary/10 border border-neutral-100 overflow-hidden relative">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
                            
                            <h3 className="text-2xl font-black text-neutral-900 mb-8 relative">Biaya & Pembayaran</h3>
                            
                            <div className="space-y-6 mb-10 pb-10 border-b border-dashed border-neutral-100">
                                <div className="flex justify-between items-center group">
                                    <span className="text-sm font-bold text-neutral-400 uppercase tracking-widest">Harga Dasar</span>
                                    <span className="text-lg font-black text-neutral-600">{formatCurrency(booking.subtotal)}</span>
                                </div>
                                <div className="flex flex-col gap-2 pt-4 group">
                                    <span className="text-xs font-black text-neutral-400 uppercase tracking-[0.2em]">Total Pembayaran</span>
                                    <span className="text-4xl font-black text-primary tracking-tighter drop-shadow-sm">
                                        {formatCurrency(booking.total)}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-8">
                                <div className="p-6 bg-primary/5 rounded-[2rem] border border-primary/10 relative overflow-hidden group">
                                    <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                        <CreditCard size={100} />
                                    </div>
                                    <p className="text-[10px] text-primary font-black uppercase tracking-[0.2em] mb-3">METODE PEMBAYARAN</p>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-primary border border-primary/5">
                                            <CreditCard size={24} />
                                        </div>
                                        <div>
                                            <p className="text-lg font-black text-neutral-900 leading-tight">Menunggu</p>
                                            <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest mt-0.5">Konfirmasi</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex flex-col gap-4">
                                    <Link 
                                        href="/"
                                        className="w-full py-5 bg-neutral-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-neutral-800 hover:scale-[1.02] active:scale-95 transition-all duration-300 shadow-lg shadow-neutral-200 cursor-pointer"
                                    >
                                        <ArrowLeft size={20} />
                                        Kembali Jelajah
                                    </Link>
                                    <Link 
                                        href="/pesanan"
                                        className="w-full py-5 bg-white border-2 border-neutral-100 text-neutral-400 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-neutral-50 hover:text-neutral-900 hover:border-neutral-200 transition-all duration-300 cursor-pointer"
                                    >
                                        <MessageSquare size={20} />
                                        Pesanan Saya
                                    </Link>
                                </div>
                            </div>

                            <div className="mt-10 pt-10 border-t border-neutral-100">
                                <div className="flex items-start gap-4 p-5 bg-neutral-50/50 rounded-3xl border border-neutral-100 group">
                                    <div className="w-10 h-10 rounded-xl bg-white border border-neutral-100 flex items-center justify-center text-neutral-400 shrink-0 group-hover:text-primary transition-colors">
                                        <Phone size={18} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-1">BANTUAN 24/7</p>
                                        <p className="text-sm font-bold text-neutral-800">+62 812-3456-7890</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
