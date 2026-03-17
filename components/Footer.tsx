import Image from "next/image";
import Link from "next/link";
import { Facebook, Instagram, Twitter } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-slate-900 text-white">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Logo & Description */}
                    <div className="col-span-1 md:col-span-2">
                        <Link href="/" className="flex items-center mb-4">
                            <Image
                                src="/asset/Logo-removebg-preview.png"
                                alt="Dienggo Logo"
                                width={140}
                                height={50}
                                className="h-12 w-auto object-contain"
                            />
                        </Link>
                        <p className="text-slate-400 max-w-md">
                            Platform pemesanan villa, kabin, dan tur jeep premium di Dataran Tinggi Dieng. Nikmati pengalaman menginap dan berpetualang yang tak terlupakan.
                        </p>
                    </div>

                    {/* Navigation Links */}
                    <div>
                        <h3 className="text-lg font-bold mb-4">Navigasi</h3>
                        <ul className="space-y-2">
                            <li><Link href="/villa" className="text-slate-400 hover:text-white transition-colors">Villa</Link></li>
                            <li><Link href="/hotel-cabin" className="text-slate-400 hover:text-white transition-colors">Hotel Kabin</Link></li>
                            <li><Link href="/jeep" className="text-slate-400 hover:text-white transition-colors">Wisata Jeep</Link></li>
                            <li><Link href="/aktivitas" className="text-slate-400 hover:text-white transition-colors">Aktivitas</Link></li>
                        </ul>
                    </div>

                    {/* Social Media */}
                    <div>
                        <h3 className="text-lg font-bold mb-4">Ikuti Kami</h3>
                        <div className="flex items-center gap-4">
                            <a href="#" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors"><Facebook size={24} /></a>
                            <a href="#" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors"><Instagram size={24} /></a>
                            <a href="#" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors"><Twitter size={24} /></a>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-8 border-t border-slate-800 pt-8 text-center text-slate-500">
                    <p>&copy; {new Date().getFullYear()} Dienggo. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
