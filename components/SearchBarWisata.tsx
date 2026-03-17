"use client";

import { Search } from "lucide-react";
import { useState } from "react";

export function SearchBarWisata() {
    const [keyword, setKeyword] = useState("");

    return (
        <div className="w-full max-w-lg mt-8 relative">
            <div className="relative flex items-center w-full h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/30 overflow-hidden pl-4 pr-1 focus-within:ring-2 focus-within:ring-white/50 transition-all">
                <Search className="text-white w-5 h-5 mr-2 opacity-80" />
                <input
                    type="text"
                    placeholder="Cari nama tempat wisata..."
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    className="w-full bg-transparent text-white font-medium placeholder-white/70 focus:outline-none"
                />
                <button className="h-11 px-6 rounded-full bg-white text-primary font-bold hover:bg-neutral-100 transition-colors">
                    Cari
                </button>
            </div>
        </div>
    );
}
