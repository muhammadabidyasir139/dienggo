"use client";

import { useState } from "react";
import Image from "next/image";
import { BentoCard } from "./BentoGrid";
import { GalleryLightbox } from "./GalleryLightbox";

interface BentoGalleryProps {
    images: string[];
    title: string;
}

export function BentoGallery({ images, title }: BentoGalleryProps) {
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [initialIndex, setInitialIndex] = useState(0);

    if (!images || images.length === 0) return null;

    const openLightbox = (index: number) => {
        setInitialIndex(index);
        setLightboxOpen(true);
    };

    const mainImage = images[0];
    const smallImage1 = images[1] || mainImage;
    const smallImage2 = images[2] || images[1] || mainImage;
    const remainingCount = images.length > 3 ? images.length - 3 : 0;

    return (
        <>
            {/* GALERI - Foto Utama (Besar) */}
            <BentoCard
                colSpan={2}
                rowSpan={2}
                className="relative overflow-hidden p-0 h-[300px] md:h-auto group cursor-pointer"
            >
                <div onClick={() => openLightbox(0)} className="w-full h-full">
                    <Image
                        src={mainImage}
                        alt={title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        priority
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                </div>
            </BentoCard>

            {/* GALERI - Foto Kecil 1 */}
            <BentoCard
                colSpan={1}
                className="relative overflow-hidden p-0 h-[150px] md:h-auto group hidden md:block cursor-pointer"
            >
                <div onClick={() => openLightbox(1)} className="w-full h-full">
                    <Image
                        src={smallImage1}
                        alt={`${title} gallery 1`}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                </div>
            </BentoCard>

            {/* GALERI - Foto Kecil 2 */}
            <BentoCard
                colSpan={1}
                className="relative overflow-hidden p-0 h-[150px] md:h-auto group hidden md:block cursor-pointer"
            >
                <div onClick={() => openLightbox(2)} className="w-full h-full">
                    <Image
                        src={smallImage2}
                        alt={`${title} gallery 2`}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    {remainingCount > 0 ? (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center transition-colors hover:bg-black/50">
                            <span className="text-white font-bold text-xl">
                                +{remainingCount} Foto
                            </span>
                        </div>
                    ) : (
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                    )}
                </div>
            </BentoCard>

            <GalleryLightbox 
                images={images} 
                isOpen={lightboxOpen} 
                onClose={() => setLightboxOpen(false)} 
                initialIndex={initialIndex} 
            />
        </>
    );
}
