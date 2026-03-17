export function PromoBanner({ text }: { text: string }) {
    return (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-blue-600 px-6 py-8 text-center shadow-lg  ">
            <div className="absolute -left-10 -top-10 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -bottom-10 -right-10 h-32 w-32 rounded-full bg-accent/20 blur-2xl" />

            <p className="relative z-10 text-xl font-bold tracking-tight text-white md:text-2xl">
                🎉 {text}
            </p>
        </div>
    );
}
