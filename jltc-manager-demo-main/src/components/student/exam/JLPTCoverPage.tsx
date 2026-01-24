import React from 'react';

interface JLPTCoverPageProps {
    onStart: () => void;
    level?: string;
    sectionName?: string; // Used for main title/description
    title?: string; // Optional override
    subTitle?: string;
    examineeNumber?: string;
    examineeName?: string;
    variant?: 'white' | 'blue';
    section?: number;
}

const JLPTCoverPage: React.FC<JLPTCoverPageProps> = ({
    onStart,
    level = "N5",
    sectionName = "言語知識（文字・語彙）",
    title,
    subTitle,
    examineeNumber = "",
    examineeName = "",
    variant = "white",
    section
}) => {
    // Colors
    const isBlue = variant === 'blue';
    const bgColor = isBlue ? "bg-[#7494c0]" : "bg-white";
    const textColor = isBlue ? "text-white" : "text-black";
    const borderColor = isBlue ? "border-white" : "border-black";
    const subTextColor = isBlue ? "text-gray-100" : "text-gray-500";
    const btnBg = isBlue ? "bg-white" : "bg-black";
    const btnText = isBlue ? "text-[#7494c0]" : "text-white";
    const btnHover = isBlue ? "hover:bg-gray-100" : "hover:bg-gray-800";

    return (
        <div className={`h-screen w-screen ${bgColor} ${textColor} p-4 md:p-8 flex items-center justify-center select-none font-serif overflow-hidden`}
            style={{ fontFamily: '"MS Mincho", "Hiragino Mincho ProN", serif' }}>

            <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-stretch">

                {/* Left Column: Notes Section (Chuu-i) - Only show for Section 1 or White variant usually, but keeping it for consistency if needed. 
                    However, the Listening cover image is very simple. 
                    If user wants EXACT content, the image only showed the text. 
                    But typically Cover pages have instructions. I will keep instructions but style them.
                */}
                <div className="w-full h-full flex flex-col">
                    <div className={`${borderColor} border p-6 md:p-8 relative shadow-sm h-full flex flex-col justify-center`}>
                        <div className="text-center mb-6">
                            <h3 className="text-2xl md:text-3xl font-bold tracking-widest inline-block">
                                ちゅうい
                            </h3>
                        </div>

                        <div className="space-y-4">
                            {[
                                { jp: "しけんがはじまるまで、このもんだいようしをあけないでください。" },
                                { jp: "このもんだいようしを、もちかえることはできません。" },
                                { jp: "じゅけんばんごうとなまえを、したのらんにかいてください。" },
                                { jp: "このもんだいようしのなかに、かいとうようしがはいっています。" },
                                { jp: "しけんがはじまるまで、しずかにまってください。" }
                            ].map((item, idx) => (
                                <div key={idx} className="flex gap-3 items-start leading-relaxed">
                                    <span className="font-bold text-lg">{idx + 1}.</span>
                                    <div>
                                        <p className="text-lg font-bold leading-snug">{item.jp}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Header, Inputs, Button */}
                <div className="flex flex-col h-full justify-between pb-0 space-y-8">

                    {/* Header Section */}
                    {isBlue ? (
                        // Special Layout for Listening (Blue)
                        <div className="text-center space-y-8 py-12">
                            <h2 className="text-4xl md:text-5xl font-bold tracking-widest leading-none">問題例</h2>
                            <h1 className="text-8xl md:text-9xl font-bold tracking-widest leading-none">{level}</h1>
                            {/* Listening Title */}
                            <h2 className="text-4xl md:text-5xl font-bold tracking-widest leading-none mt-4">
                                {title || "聴解"}
                            </h2>
                        </div>
                    ) : (
                        // Standard Layout
                        <div className="text-center space-y-2">
                            <h1 className="text-8xl md:text-9xl font-bold tracking-widest leading-none">{level}</h1>
                            <h2 className="text-2xl md:text-3xl font-bold mt-2 tracking-wide">
                                {sectionName || title}
                            </h2>
                            {subTitle && <div className="text-lg mt-2">{subTitle}</div>}
                        </div>
                    )}

                    {/* Input Boxes Section */}
                    <div className="w-full space-y-4">
                        {/* Examinee Number */}
                        <div className={`flex border ${borderColor} h-16 md:h-20`}>
                            <div className={`w-[40%] border-r ${borderColor} flex flex-col justify-center items-center p-2 ` + (isBlue ? "bg-white/20" : "bg-gray-50/30")}>
                                <span className="font-bold text-lg md:text-xl">じゅけんばんごう</span>
                            </div>
                            <div className="w-[60%] flex items-center justify-center px-4 font-mono text-xl md:text-2xl tracking-widest uppercase">
                                {examineeNumber || "0000-0000"}
                            </div>
                        </div>

                        {/* Name */}
                        <div className={`flex border ${borderColor} h-16 md:h-20`}>
                            <div className={`w-[20%] border-r ${borderColor} flex flex-col justify-center items-center p-2 ` + (isBlue ? "bg-white/20" : "bg-gray-50/30")}>
                                <span className="font-bold text-lg md:text-xl">なまえ</span>
                            </div>
                            <div className="w-[80%] flex items-center px-4 font-serif text-xl md:text-2xl uppercase">
                                {examineeName || "NGUYEN VAN A"}
                            </div>
                        </div>
                    </div>

                    {/* Start Button */}
                    <div className="flex justify-center">
                        <button
                            onClick={onStart}
                            className={`group w-full max-w-md px-8 py-4 ${btnBg} ${btnText} text-lg md:text-xl font-bold tracking-widest ${btnHover} transition-colors shadow-2xl animate-pulse hover:animate-none`}
                        >
                            <span className="block">試験を始める</span>
                        </button>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default JLPTCoverPage;
