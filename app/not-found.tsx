import Link from "next/link";

export default function NotFound() {
    return (
        <div className="flex h-screen flex-col items-center justify-center bg-background px-4">
            <div className="text-center">
                <h1 className="mb-2 text-6xl font-black text-primary">404</h1>
                <h2 className="mb-4 text-2xl font-bold text-foreground">Halaman Tidak Ditemukan</h2>
                <p className="mb-8 text-neutral-500">
                    Oops! Halaman yang Anda cari mungkin telah dipindahkan atau tidak lagi tersedia.
                </p>
                <Link
                    href="/"
                    className="rounded-lg bg-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-primary/90"
                >
                    Kembali ke Beranda
                </Link>
            </div>
        </div>
    );
}
