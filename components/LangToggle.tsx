"use client";

import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { Globe } from "lucide-react";

export function LangToggle() {
    const locale = useLocale();
    const router = useRouter();

    const toggleLocale = () => {
        const nextLocale = locale === "id" ? "en" : "id";
        // We update the cookie that request.ts reads
        document.cookie = `locale=${nextLocale}; path=/; max-age=31536000`;
        router.refresh();
    };

    return (
        <button
            onClick={toggleLocale}
            className="flex h-9 items-center gap-2 rounded-full bg-neutral-100 px-3 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-200   :bg-neutral-700"
            aria-label="Toggle language"
        >
            <Globe size={16} />
            <span className="uppercase">{locale}</span>
        </button>
    );
}
