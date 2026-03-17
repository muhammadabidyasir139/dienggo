import { LucideIcon } from "lucide-react";

interface FacilityBadgeProps {
    icon: LucideIcon;
    label: string;
}

export function FacilityBadge({ icon: Icon, label }: FacilityBadgeProps) {
    return (
        <div className="flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-xs font-medium text-neutral-600 dark:border-slate-700 dark:bg-slate-800 dark:text-neutral-300">
            <Icon size={14} className="text-primary dark:text-accent" />
            {label}
        </div>
    );
}
