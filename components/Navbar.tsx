"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { LangToggle } from "./LangToggle";
import { Menu, X } from "lucide-react";

export function Navbar() {
    const t = useTranslations("Navigation");
    const pathname = usePathname();
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { href: "/villa", label: t("villa") },
        { href: "/hotel-cabin", label: t("hotel-cabin") },
        { href: "/jeep", label: t("jeep") },
        { href: "/wisata", label: t("wisata") },
    ];

    const isTransparentBase = pathname === "/villa" || pathname === "/hotel-cabin" || pathname === "/jeep" || pathname === "/wisata";
    const navBgClass = isScrolled || !isTransparentBase
        ? "bg-primary-light/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm border-b border-neutral-200 dark:border-neutral-800"
        : "bg-transparent";

    const textColorClass = isScrolled || !isTransparentBase
        ? "text-neutral-800 dark:text-neutral-100"
        : "text-white";

    return (
        <header className={`fixed top-0 z-50 w-full transition-all duration-300 ${navBgClass}`}>
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

                {/* Logo */}
                <Link href="/" className="flex items-center">
                    <Image
                        src="/asset/Logo-removebg-preview.png"
                        alt="Dienggo Logo"
                        width={120}
                        height={40}
                        className="h-10 w-auto object-contain"
                        priority
                    />
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => {
                        const isActive = pathname.startsWith(link.href);
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`text-sm font-medium transition-colors hover:opacity-70 ${isActive
                                        ? (isScrolled || !isTransparentBase ? "text-primary dark:text-accent font-bold" : "text-white font-bold")
                                        : textColorClass
                                    }`}
                            >
                                {link.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Actions */}
                <div className="hidden md:flex items-center gap-4">
                    <LangToggle />

                    <Link
                        href="/login"
                        className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white transition-transform hover:scale-105 dark:bg-accent dark:text-neutral-900"
                    >
                        {t("login")}
                    </Link>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className={`md:hidden p-2 ${textColorClass}`}
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="absolute top-16 left-0 w-full bg-primary-light dark:bg-slate-900 shadow-xl border-t border-neutral-100 dark:border-neutral-800 p-4 md:hidden flex flex-col gap-4">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className="px-4 py-3 text-base font-medium text-neutral-800 dark:text-neutral-100 hover:bg-neutral-50 dark:hover:bg-slate-800 rounded-lg"
                        >
                            {link.label}
                        </Link>
                    ))}
                    <div className="flex items-center justify-end px-4 py-2 mt-4 border-t border-neutral-100 dark:border-neutral-800">
                        <LangToggle />
                    </div>
                    <Link
                        href="/login"
                        onClick={() => setMobileMenuOpen(false)}
                        className="mx-4 mt-2 text-center rounded-lg bg-primary py-3 font-semibold text-white dark:bg-accent dark:text-neutral-900"
                    >
                        {t("login")}
                    </Link>
                </div>
            )}
        </header>
    );
}
