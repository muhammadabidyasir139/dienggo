import { LucideIcon } from "lucide-react";

interface FacilityBadgeProps {
    icon: LucideIcon;
    label: string;
}

export function FacilityBadge({ icon: Icon, label }: FacilityBadgeProps) {
    return (
        <div className="flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-xs font-medium text-neutral-600   ">
            <Icon size={14} className="text-primary " />
            {label}
        </div>
    );
}
