"use client";

import { useTranslations } from "next-intl";
import { formatCurrency } from "@/lib/utils";

interface StickyBookingBarProps {
    price: number;
    label: string;
    onBook: () => void;
}

export function StickyBookingBar({ price, label, onBook }: StickyBookingBarProps) {
    const t = useTranslations("Common");

    return (
        <div className="fixed bottom-0 left-0 z-40 w-full border-t border-neutral-200 bg-white/90 p-4 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/90 sm:hidden">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
                <div>
                    <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Mulai dari</p>
                    <p className="text-lg font-bold text-foreground">
                        {formatCurrency(price)}
                        <span className="text-xs font-normal text-neutral-500"> {label}</span>
                    </p>
                </div>
                <button
                    onClick={onBook}
                    className="rounded-xl bg-[#1a90ec] px-6 py-3 font-bold text-white transition-transform hover:scale-105 active:scale-95"
                >
                    {t("book_now")}
                </button>
            </div>
        </div>
    );
}
