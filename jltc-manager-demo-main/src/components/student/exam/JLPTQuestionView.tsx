import React, { useEffect } from 'react';
import { cn } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import JLPTImageGrid from "./JLPTImageGrid";

export interface JLPTExample {
    questionText: React.ReactNode;
    options: string[];
    correctAnswer: number; // 1-based index for the example visual
}

export interface JLPTQuestion {
    id: number;
    mondaiId: number; // 1, 2, 3...
    questionText: React.ReactNode;
    imageUrl?: string;
    imageGridUrls?: string[]; // For 4-image grid questions (Mondai 1)
    imagePosition?: 'bottom' | 'inline'; // 'bottom' is default
    optionsLayout?: '1-col' | '2-col' | '4-col';
    options: React.ReactNode[];
    correctAnswer: number;
}

export interface JLPTMondai {
    id: number;
    instruction: React.ReactNode;
    passage?: React.ReactNode;
    example?: JLPTExample;
    customExample?: React.ReactNode;
    questions: JLPTQuestion[];
}

export interface JLPTQuestionViewProps {
    mondaiList: JLPTMondai[];
    answers: Record<number, string | string[] | null>;
    onAnswer?: (questionId: number, answer: string) => void;
    hideQuestionId?: boolean;
    showResults?: boolean;
}

const JLPTQuestionView: React.FC<JLPTQuestionViewProps> = ({
    mondaiList,
    answers,
    onAnswer,
    hideQuestionId = false,
    showResults = false,
}) => {

    const getGridCols = (layout?: '1-col' | '2-col' | '4-col') => {
        switch (layout) {
            case '4-col': return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";
            case '2-col': return "grid-cols-1 md:grid-cols-2";
            case '1-col': return "grid-cols-1";
            default: return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8 font-serif bg-white text-black leading-relaxed select-none"
            style={{ fontFamily: '"MS Mincho", "Hiragino Mincho ProN", serif' }}>

            {mondaiList.map((mondai) => (
                <div key={mondai.id} className="mb-12">
                    {/* Mondai Header */}
                    <div className="mb-8 pl-4">
                        <div className="flex items-start gap-4 text-lg md:text-xl font-medium whitespace-pre-wrap leading-loose">
                            <div>{mondai.instruction}</div>
                        </div>
                    </div>

                    {/* Example Section (Standard or Custom) */}
                    {(mondai.example || mondai.customExample) && !showResults && (
                        <div className="mb-12 mx-4">
                            <div className="border-t-2 border-black my-6"></div>

                            {mondai.customExample ? (
                                <div className="pl-4 md:pl-8">
                                    {mondai.customExample}
                                </div>
                            ) : mondai.example ? (
                                <div className="pl-4 md:pl-8">
                                    <div className="flex gap-4 text-xl mb-4">
                                        <span className="font-bold">（れい）</span>
                                        <div>{mondai.example.questionText}</div>
                                    </div>
                                    <div className="flex gap-8 pl-20 mb-6 text-xl">
                                        {mondai.example.options.map((opt, idx) => (
                                            <div key={idx} className="flex gap-2">
                                                <span>{opt}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex gap-4 items-center pl-8 text-xl">
                                        <span>（かいとうようし）</span>
                                        <div className="border border-black px-4 py-1 flex gap-2 items-center">
                                            <span className="font-bold">（れい）</span>
                                            <div className="flex gap-1 text-lg">
                                                {[1, 2, 3, 4].map((num) => (
                                                    <div key={num} className="w-8 h-8 flex items-center justify-center">
                                                        {num === mondai.example?.correctAnswer ? (
                                                            <div className="w-6 h-6 bg-black rounded-full" />
                                                        ) : (
                                                            <span className="border border-black rounded-full w-6 h-6 flex items-center justify-center text-sm font-sans font-bold">
                                                                {num}
                                                            </span>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : null}

                            <div className="border-t-2 border-black my-6"></div>
                        </div>
                    )}

                    {/* Reading Passage Section */}
                    {mondai.passage && (
                        <div className="mb-12 mx-2 md:mx-6 text-xl leading-relaxed">
                            {mondai.passage}
                        </div>
                    )}

                    {/* Questions List */}
                    <div className="space-y-12">
                        {mondai.questions.map((question) => {
                            const selectedValue = answers[question.id]?.toString();
                            const imagePos = question.imagePosition || 'below-options';
                            const isCorrectAnswer = (idx: number) => idx === question.correctAnswer;
                            const isSelected = (idx: number) => selectedValue === idx.toString();

                            return (
                                <div key={question.id} className="pl-2 md:pl-6">
                                    {/* Question Sentence */}
                                    <div className="flex items-start gap-4 mb-6 text-xl md:text-2xl font-medium">
                                        {!hideQuestionId && (
                                            <div className="pt-1 min-w-[40px]">
                                                <span className="border border-black px-1 font-bold inline-block text-center min-w-[30px]">
                                                    {question.id}
                                                </span>
                                            </div>
                                        )}
                                        <div className="pt-1 leading-loose w-full space-y-4">
                                            {question.questionText}
                                            {question.imageUrl && imagePos === 'inline' && (
                                                <div className="mt-6 flex justify-center">
                                                    <img
                                                        src={question.imageUrl}
                                                        alt={`Question ${question.id}`}
                                                        className="max-w-full md:max-w-sm border-none mix-blend-multiply grayscale contrast-125 brightness-110"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* 4-Image Grid for Mondai 1 type questions - Outside text container for alignment */}
                                    {question.imageGridUrls && question.imageGridUrls.length === 4 && (
                                        <div className="my-8 -ml-2 md:-ml-6">
                                            <JLPTImageGrid
                                                images={question.imageGridUrls.map((url, idx) => ({
                                                    imageUrl: url,
                                                    label: (idx + 1).toString()
                                                }))}
                                                gridLayout="2x2"
                                            />
                                        </div>
                                    )}

                                    {/* Options */}
                                    <div className="w-full max-w-2xl mt-6">
                                        <RadioGroup
                                            value={selectedValue || ""}
                                            onValueChange={(val) => !showResults && onAnswer && onAnswer(question.id, val)}
                                            className={cn(
                                                "grid gap-y-4 gap-x-8 text-lg md:text-xl place-items-center",
                                                getGridCols(question.optionsLayout)
                                            )}
                                            disabled={showResults}
                                        >
                                            {question.options.map((option, idx) => {
                                                // Check if option is just the number itself (as string) to prevent "1 1" duplication
                                                const isSameNumber = typeof option === 'string' && option.trim() === (idx + 1).toString();
                                                const correct = isCorrectAnswer(idx);

                                                return (
                                                    <div key={idx} className={cn(
                                                        "flex items-center space-x-3 p-2 rounded -ml-2",
                                                        !showResults && "cursor-pointer hover:bg-black/5"
                                                    )}>
                                                        <RadioGroupItem value={idx.toString()} id={`q${question.id}-opt${idx}`} className="border-black text-black" disabled={showResults} />
                                                        <Label htmlFor={`q${question.id}-opt${idx}`} className={cn("font-normal text-lg md:text-xl flex items-center", !showResults && "cursor-pointer")}>
                                                            <span className={cn("relative inline-flex items-center justify-center min-w-[1.5rem]", !isSameNumber && "mr-3")}>
                                                                {isSameNumber ? option : (idx + 1)}

                                                                {/* Red Circle aligned to the number */}
                                                                {showResults && correct && (
                                                                    <div className="absolute border-4 border-red-500 rounded-full w-8 h-8 md:w-10 md:h-10 opacity-70 pointer-events-none"
                                                                        style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
                                                                    </div>
                                                                )}
                                                            </span>
                                                            {!isSameNumber && option}
                                                        </Label>
                                                    </div>
                                                );
                                            })}
                                        </RadioGroup>
                                    </div>

                                    {/* Image below options */}
                                    {question.imageUrl && imagePos === 'below-options' && (
                                        <div className="mt-4 flex justify-center">
                                            <img
                                                src={question.imageUrl}
                                                alt={`Question ${question.id}`}
                                                className="max-w-full md:max-w-md border-none mix-blend-multiply grayscale contrast-125 brightness-110"
                                            />
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default JLPTQuestionView;

