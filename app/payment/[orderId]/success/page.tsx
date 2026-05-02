import Link from "next/link";
import { CheckCircle2, ArrowRight, ShoppingBag } from "lucide-react";
import { Navbar } from "@/components/Navbar";

export default async function PaymentSuccessPage({ params }: { params: Promise<{ orderId: string }> }) {
    const { orderId } = await params;

    return (
        <main className="min-h-screen bg-background">
            <Navbar />
            
            <div className="container mx-auto px-4 py-24 max-w-3xl flex flex-col items-center justify-center">
                <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-neutral-100 w-full text-center">
                    <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                        <CheckCircle2 className="text-emerald-500 w-12 h-12" />
                    </div>
                    
                    <h1 className="text-4xl font-black text-neutral-900 mb-4">
                        Pembayaran Berhasil!
                    </h1>
                    
                    <p className="text-xl text-neutral-600 mb-10 max-w-lg mx-auto">
                        Selamat! Pembayaran untuk pesanan <span className="font-bold text-emerald-600">{orderId}</span> telah kami terima dan status pesanan Anda kini sudah <span className="font-bold text-emerald-600">Lunas</span>.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Link 
                            href="/pesanan" 
                            className="flex items-center justify-center gap-2 bg-emerald-500 text-white font-bold py-4 px-8 rounded-xl hover:bg-emerald-600 hover:scale-[1.02] transition-all shadow-lg shadow-emerald-200"
                        >
                            <ShoppingBag size={20} />
                            Lihat Pesanan Saya
                        </Link>
                        
                        <Link 
                            href="/" 
                            className="flex items-center justify-center gap-2 bg-white text-neutral-700 font-bold py-4 px-8 rounded-xl border-2 border-neutral-100 hover:bg-neutral-50 hover:scale-[1.02] transition-all"
                        >
                            Kembali ke Beranda
                            <ArrowRight size={20} />
                        </Link>
                    </div>

                    <div className="mt-12 pt-8 border-t border-neutral-100">
                        <p className="text-sm text-neutral-400">
                            E-ticket dan rincian pesanan telah dikirimkan ke email Anda. 
                            Silakan tunjukkan kode booking saat melakukan check-in atau memulai aktivitas.
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}
