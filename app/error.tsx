"use client";

import { useEffect } from "react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="flex h-screen flex-col items-center justify-center bg-background px-4">
            <div className="text-center">
                <h2 className="mb-4 text-3xl font-bold text-foreground">Aduh, terjadi kesalahan!</h2>
                <p className="mb-8 text-neutral-500">
                    Maaf, sistem kami mengalami gangguan sementara saat memproses permintaan Anda.
                </p>
                <button
                    onClick={() => reset()}
                    className="rounded-lg bg-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-primary/90"
                >
                    Coba Lagi
                </button>
            </div>
        </div>
    );
}
