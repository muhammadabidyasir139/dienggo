"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { X } from "lucide-react";
import Link from "next/link";

interface BookingButtonProps {
    slug: string;
    type: string;
    className?: string;
    children: React.ReactNode;
}

export function BookingButton({ slug, type, className, children }: BookingButtonProps) {
    const { data: session } = useSession();
    const router = useRouter();
    const [showPopup, setShowPopup] = useState(false);

    const bookingUrl = `/booking/${slug}?type=${type}`;

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        if (session) {
            router.push(bookingUrl);
        } else {
            setShowPopup(true);
        }
    };

    return (
        <>
            <button onClick={handleClick} className={className}>
                {children}
            </button>

            {showPopup && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl relative animate-in fade-in zoom-in duration-200">
                        <button 
                            onClick={() => setShowPopup(false)}
                            className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-full transition-colors"
                        >
                            <X size={20} />
                        </button>
                        
                        <h3 className="text-2xl font-black text-slate-900 mb-2">Masuk untuk Melanjutkan?</h3>
                        <p className="text-slate-500 mb-8">
                            Masuk ke akun Anda untuk melacak pesanan dengan mudah, atau lanjutkan sebagai tamu.
                        </p>
                        
                        <div className="flex flex-col gap-3">
                            <Link 
                                href={`/login?callbackUrl=${encodeURIComponent(bookingUrl)}`}
                                className="w-full bg-primary text-white font-bold py-3.5 rounded-xl text-center hover:bg-primary/90 transition-colors"
                            >
                                Masuk / Daftar
                            </Link>
                            <button 
                                onClick={() => router.push(bookingUrl)}
                                className="w-full bg-white text-slate-700 border border-slate-200 font-bold py-3.5 rounded-xl text-center hover:bg-slate-50 transition-colors"
                            >
                                Lanjutkan sebagai Tamu
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
