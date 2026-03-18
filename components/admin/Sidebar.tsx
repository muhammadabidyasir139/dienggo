"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Home,
    Tent,
    Car,
    Map,
    CalendarCheck,
    Settings,
    LogOut,
} from "lucide-react";
import { signOut } from "next-auth/react";

const menuItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Villa", href: "/admin/villa", icon: Home },
    { name: "Cabin", href: "/admin/cabin", icon: Tent },
    { name: "Jeep", href: "/admin/jeep", icon: Car },
    { name: "Wisata", href: "/admin/wisata", icon: Map },
    { name: "Booking", href: "/admin/booking", icon: CalendarCheck },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-slate-900 text-white flex flex-col">
            <div className="p-6 border-b border-slate-800">
                <h1 className="text-2xl font-bold tracking-tight">
                    Dieng<span className="text-amber-500">go</span> Admin
                </h1>
            </div>

            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                    ? "bg-slate-800 text-amber-500 font-medium"
                                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                                }`}
                        >
                            <item.icon className="w-5 h-5" />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-slate-800 space-y-1">
                <Link
                    href="/admin/settings"
                    className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-slate-400 hover:bg-slate-800 hover:text-white"
                >
                    <Settings className="w-5 h-5" />
                    Settings
                </Link>
                <button
                    onClick={() => signOut({ callbackUrl: "/villa" })}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-red-400 hover:bg-slate-800 hover:text-red-300 cursor-pointer"
                >
                    <LogOut className="w-5 h-5" />
                    Logout
                </button>
            </div>
        </aside>
    );
}
