import React, { useEffect } from 'react';
import { cn } from "@/lib/utils";

interface JLPTSectionIntroProps {
    onNext: () => void;
    level?: string;
    sectionName?: string;
    subTitle?: string;
    variant?: 'white' | 'blue';
}

const JLPTSectionIntro: React.FC<JLPTSectionIntroProps> = ({
    onNext,
    level = "N5",
    sectionName = "言語知識（文字・語彙）",
    subTitle = "Language Knowledge (Vocabulary)",
    variant = "white"
}) => {
    // Allow clicking anywhere or pressing Enter to continue
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Enter' || e.key === ' ') {
                onNext();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onNext]);

    const isBlue = variant === 'blue';

    return (
        <div
            onClick={onNext}
            className={cn(
                "h-screen w-screen flex flex-col items-center justify-center cursor-pointer select-none",
                isBlue ? "bg-[#7da0c8] text-white" : "bg-white text-black"
            )}
        >
            <div className="space-y-16 text-center animate-in fade-in zoom-in duration-500">
                <div>
                    <h2 className="text-5xl md:text-6xl font-bold tracking-wider mb-2 font-sans">
                        問題例
                    </h2>
                    {/* Only show "Example Questions" if it matches the vocab section or we want it generic. 
                        Actually for blue section (Grammar), it usually just says "N5" then Section Name.
                        The image shows "問題例" at top. So we keep it. */}
                </div>

                <div>
                    <h1 className="text-8xl md:text-9xl font-bold tracking-widest font-sans">
                        {level}
                    </h1>
                </div>

                <div>
                    <h3 className="text-3xl md:text-5xl font-bold tracking-wide font-sans">
                        {sectionName}
                    </h3>
                    <p className={cn(
                        "text-xl md:text-2xl font-normal mt-4",
                        isBlue ? "text-white/90" : "text-gray-600"
                    )}>
                        {subTitle}
                    </p>
                </div>
            </div>

            <div className={cn(
                "absolute bottom-12 text-sm animate-pulse",
                isBlue ? "text-white/70" : "text-black/50"
            )}>
                Click anywhere to continue
            </div>
        </div>
    );
};

export default JLPTSectionIntro;
