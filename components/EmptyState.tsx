import { Loader2 } from "lucide-react";

interface EmptyStateProps {
    title?: string;
    message?: string;
    onReset?: () => void;
}

export function EmptyState({
    title = "Oops! Data Tidak Ditemukan",
    message = "Coba ubah filter atau gunakan kata kunci lain untuk pencarian.",
    onReset
}: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-6 rounded-full bg-neutral-100 p-6 ">
                <Loader2 className="h-12 w-12 text-primary  animate-pulse" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-foreground">{title}</h3>
            <p className="mb-6 max-w-sm text-neutral-500 ">
                {message}
            </p>
            {onReset && (
                <button
                    onClick={onReset}
                    className="rounded-lg border border-primary px-6 py-2 font-medium text-primary transition-colors hover:bg-primary hover:text-white   :bg-accent :text-neutral-900"
                >
                    Reset Pencarian
                </button>
            )}
        </div>
    );
}
