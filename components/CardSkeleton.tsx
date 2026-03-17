export function CardSkeleton() {
    return (
        <div className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm dark:bg-slate-900 animate-pulse">
            {/* Image Skeleton */}
            <div className="h-56 w-full bg-neutral-200 dark:bg-slate-800" />

            {/* Content Skeleton */}
            <div className="p-5 flex flex-col gap-4">
                {/* Title */}
                <div className="h-6 w-3/4 rounded bg-neutral-200 dark:bg-slate-800" />

                {/* Subtitle / Location */}
                <div className="h-4 w-1/2 rounded bg-neutral-200 dark:bg-slate-800" />

                {/* Price */}
                <div className="h-6 w-1/3 rounded bg-neutral-200 dark:bg-slate-800 mt-2" />

                {/* Badges */}
                <div className="flex gap-2 mt-2">
                    <div className="h-6 w-16 rounded-full bg-neutral-200 dark:bg-slate-800" />
                    <div className="h-6 w-16 rounded-full bg-neutral-200 dark:bg-slate-800" />
                    <div className="h-6 w-16 rounded-full bg-neutral-200 dark:bg-slate-800" />
                </div>

                {/* Button */}
                <div className="h-10 w-full rounded-lg bg-neutral-200 dark:bg-slate-800 mt-4" />
            </div>
        </div>
    );
}

export function GridSkeleton({ count = 6 }: { count?: number }) {
    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: count }).map((_, i) => (
                <CardSkeleton key={i} />
            ))}
        </div>
    );
}
