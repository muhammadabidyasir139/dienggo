import { ReactNode } from "react";

export function BentoGrid({ children, className = "" }: { children: ReactNode; className?: string }) {
    return (
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 auto-rows-[minmax(180px,auto)] ${className}`}>
            {children}
        </div>
    );
}

export function BentoCard({
    children,
    className = "",
    colSpan = 1,
    rowSpan = 1
}: {
    children: ReactNode;
    className?: string;
    colSpan?: 1 | 2 | 3;
    rowSpan?: 1 | 2;
}) {
    const colSpanClass = {
        1: "md:col-span-1",
        2: "md:col-span-2",
        3: "md:col-span-3",
    }[colSpan];

    const rowSpanClass = {
        1: "row-span-1",
        2: "row-span-2",
    }[rowSpan];

    return (
        <div className={`rounded-3xl bg-white p-6 shadow-sm border border-neutral-100 dark:bg-slate-900 dark:border-slate-800 ${colSpanClass} ${rowSpanClass} ${className}`}>
            {children}
        </div>
    );
}
