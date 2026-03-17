"use client";

import Image from "next/image";
import { Play } from "lucide-react";

interface VideoData {
    id: string;
    thumbnail: string;
    url: string;
}

export function VideoSlider({ videos }: { videos: VideoData[] }) {
    if (!videos || videos.length === 0) return null;

    return (
        <div className="flex gap-4 overflow-x-auto pb-4 snap-x hide-scrollbar scroll-smooth">
            {videos.map((vid) => (
                <a
                    key={vid.id}
                    href={vid.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative h-[300px] min-w-[180px] sm:min-w-[220px] snap-center overflow-hidden rounded-2xl bg-neutral-200"
                >
                    <Image
                        src={vid.thumbnail}
                        alt="Video Thumbnail"
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="(max-width: 768px) 180px, 220px"
                    />
                    <div className="absolute inset-0 bg-black/20 transition-colors group-hover:bg-black/40" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/30 backdrop-blur-sm transition-transform group-hover:scale-110">
                            <Play className="h-5 w-5 fill-white text-white ml-1" />
                        </div>
                    </div>
                </a>
            ))}
        </div>
    );
}
