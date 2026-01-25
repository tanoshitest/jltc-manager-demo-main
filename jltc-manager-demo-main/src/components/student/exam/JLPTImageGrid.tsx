import React from 'react';
import { cn } from "@/lib/utils";

export interface ImageGridItem {
    imageUrl: string;
    label: string; // "1", "2", "3", "4"
}

export interface JLPTImageGridProps {
    images: ImageGridItem[];
    gridLayout?: '2x2' | '1x4'; // 2x2 grid hoặc 1 hàng 4 cột
    className?: string;
}

const JLPTImageGrid: React.FC<JLPTImageGridProps> = ({
    images,
    gridLayout = '2x2',
    className
}) => {
    const gridClass = gridLayout === '2x2'
        ? 'grid grid-cols-2 gap-6 md:gap-8'
        : 'grid grid-cols-4 gap-4 md:gap-6';

    return (
        <div className={cn("w-full max-w-2xl", className)}>
            <div className={gridClass}>
                {images.map((item, idx) => (
                    <div
                        key={idx}
                        className="border-2 border-black bg-white p-3 md:p-4 rounded-sm"
                    >
                        <div className="aspect-video w-full flex items-center justify-center bg-white border border-gray-300 rounded overflow-hidden">
                            <img
                                src={item.imageUrl}
                                alt={`Option ${item.label}`}
                                className="w-full h-full object-contain"
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default JLPTImageGrid;
