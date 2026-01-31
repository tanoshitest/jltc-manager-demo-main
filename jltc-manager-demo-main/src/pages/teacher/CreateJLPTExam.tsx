import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TeacherLayout from "@/components/TeacherLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
    ArrowLeft,
    Save,
    BookOpen,
    FileText,
    Headphones,
    GraduationCap,
    Plus,
    Trash2,
    Underline,
    Upload,
    X,
    Image as ImageIcon,
    Edit,
    Grid2x2,
    FileType
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface JLPTSection {
    name: string;
    duration: number;
    questionCount: number;
    description: string;
}

// Basic Question for Section 1 (Text-based)
interface Question {
    id: number;
    type?: 'text'; // Default type
    mondaiId?: number;
    content: string;
    answers: string[];
    correctAnswer: number;
}

// Extended Question Types for other sections
interface ImageQuestion {
    id: number;
    type: 'single-image';
    mondaiId: number;
    content: string;
    imageFile: File | null;
    imageUrl?: string;
    imagePosition: 'inline' | 'below-options';
    answers: string[];
    correctAnswer: number;
}

interface ImageGridQuestion {
    id: number;
    type: 'image-grid';
    mondaiId: number;
    content?: string;
    imageFiles: (File | null)[];
    imageUrls?: string[];
    correctAnswer: number;
}

interface PassageSubQuestion {
    id: number;
    content: string;
    answers: string[];
    correctAnswer: number;
}

interface PassageQuestion {
    id: number;
    type: 'passage';
    mondaiId: number;
    passage: string;
    subQuestions: PassageSubQuestion[];
}

const CreateJLPTExam = () => {
    const navigate = useNavigate();

    const [basicInfo, setBasicInfo] = useState({
        title: "",
        level: "N5",
        description: "",
        totalDuration: 105, // Default for N5
    });

    const [sections, setSections] = useState<JLPTSection[]>([
        {
            name: "文字・語彙 (Chữ Hán - Từ vựng)",
            duration: 25,
            questionCount: 0,
            description: "Phần kiểm tra chữ Hán và từ vựng",
        },
        {
            name: "文法・読解 (Ngữ pháp - Đọc hiểu)",
            duration: 50,
            questionCount: 0,
            description: "Phần kiểm tra ngữ pháp và đọc hiểu",
        },
        {
            name: "聴解 (Nghe hiểu)",
            duration: 30,
            questionCount: 0,
            description: "Phần kiểm tra nghe hiểu",
        },
    ]);

    // Questions for Section 1 (can be text, image, image-grid, or passage questions)
    const [section1Questions, setSection1Questions] = useState<(Question | ImageQuestion | ImageGridQuestion | PassageQuestion)[]>([]);
    const [section2Questions, setSection2Questions] = useState<(Question | ImageQuestion | ImageGridQuestion | PassageQuestion)[]>([]);
    const [section3Questions, setSection3Questions] = useState<(Question | ImageQuestion | ImageGridQuestion | PassageQuestion)[]>([]);

    const [showQuestionDialog, setShowQuestionDialog] = useState(false);
    const [currentSection, setCurrentSection] = useState<number>(0);
    const [questionType, setQuestionType] = useState<'text' | 'single-image' | 'image-grid' | 'passage'>('text');
    const [currentQuestion, setCurrentQuestion] = useState<Question>({
        id: 0,
        content: "",
        answers: ["", "", "", ""],
        correctAnswer: 0,
    });
    const [currentImageQuestion, setCurrentImageQuestion] = useState<ImageQuestion>({
        id: 0,
        type: 'single-image',
        mondaiId: 1,
        content: "",
        imageFile: null,
        imagePosition: 'below-options',
        answers: ["", "", "", ""],
        correctAnswer: 0,
    });
    const [currentImageGridQuestion, setCurrentImageGridQuestion] = useState<ImageGridQuestion>({
        id: 0,
        type: 'image-grid',
        mondaiId: 1,
        content: "",
        imageFiles: [null, null, null, null],
        imageUrls: [],
        correctAnswer: 0,
    });
    const [currentPassageQuestion, setCurrentPassageQuestion] = useState<PassageQuestion>({
        id: 0,
        type: 'passage',
        mondaiId: 1,
        passage: "",
        subQuestions: [],
    });
    const [listeningAudioFile, setListeningAudioFile] = useState<File | null>(null);
    const [editingQuestionIndex, setEditingQuestionIndex] = useState<number | null>(null);

    const updateSection = (index: number, field: keyof JLPTSection, value: string | number) => {
        const updated = [...sections];
        updated[index] = { ...updated[index], [field]: value };
        setSections(updated);
    };

    const handleSave = () => {
        if (!basicInfo.title) {
            toast({
                title: "Lỗi",
                description: "Vui lòng nhập tên đề thi",
                variant: "destructive",
            });
            return;
        }

        const totalQuestions = sections.reduce((sum, section) => sum + section.questionCount, 0);

        if (totalQuestions === 0) {
            toast({
                title: "Lỗi",
                description: "Vui lòng nhập số câu hỏi cho ít nhất một phần thi",
                variant: "destructive",
            });
            return;
        }

        // Construct and save exam data for demo
        const examData = {
            id: Date.now().toString(),
            basicInfo,
            sections: [
                { ...sections[0], questions: section1Questions },
                { ...sections[1], questions: section2Questions },
                { ...sections[2], questions: section3Questions }
            ],
            createdAt: new Date().toISOString()
        };

        localStorage.setItem('jlpt_exam_demo', JSON.stringify(examData));

        toast({
            title: "Tạo đề thi thành công",
            description: `Đề thi JLPT "${basicInfo.title}" với ${totalQuestions} câu hỏi đã được tạo.`,
        });

        navigate("/teacher/exams");
    };

    const getLevelDuration = (level: string) => {
        const durations: Record<string, number> = {
            N5: 105,
            N4: 125,
            N3: 140,
            N2: 155,
            N1: 170,
        };
        return durations[level] || 105;
    };

    const handleLevelChange = (level: string) => {
        setBasicInfo({ ...basicInfo, level, totalDuration: getLevelDuration(level) });
    };

    // Question management functions
    const handleAddQuestion = (sectionIndex: number) => {
        setCurrentSection(sectionIndex);
        setQuestionType('text');
        setCurrentQuestion({
            id: Date.now(),
            content: "",
            answers: ["", "", "", ""],
            correctAnswer: 0,
        });
        setCurrentImageQuestion({
            id: Date.now(),
            type: 'single-image',
            mondaiId: 1,
            content: "",
            imageFile: null,
            imagePosition: 'below-options',
            answers: ["", "", "", ""],
            correctAnswer: 0,
        });
        setCurrentImageGridQuestion({
            id: Date.now(),
            type: 'image-grid',
            mondaiId: 1,
            content: "",
            imageFiles: [null, null, null, null],
            imageUrls: [],
            correctAnswer: 0,
        });
        setCurrentPassageQuestion({
            id: Date.now(),
            type: 'passage',
            mondaiId: 1,
            passage: "",
            subQuestions: [],
        });
        setEditingQuestionIndex(null);
        setShowQuestionDialog(true);
    };

    const handleEditQuestion = (sectionIndex: number, questionIndex: number) => {
        setCurrentSection(sectionIndex);

        const getSectionQuestions = () => {
            switch (sectionIndex) {
                case 0: return section1Questions;
                case 1: return section2Questions;
                case 2: return section3Questions;
                default: return section1Questions;
            }
        };

        const question = getSectionQuestions()[questionIndex];

        if ('type' in question && question.type === 'single-image') {
            // It's an ImageQuestion
            setQuestionType('single-image');
            setCurrentImageQuestion({ ...question as ImageQuestion });
        } else if ('type' in question && question.type === 'image-grid') {
            // It's an ImageGridQuestion
            setQuestionType('image-grid');
            setCurrentImageGridQuestion({ ...question as ImageGridQuestion });
        } else if ('type' in question && question.type === 'passage') {
            // It's a PassageQuestion
            setQuestionType('passage');
            setCurrentPassageQuestion({ ...question as PassageQuestion });
        } else {
            // It's a text Question
            setQuestionType('text');
            setCurrentQuestion({ ...question as Question });
        }

        setEditingQuestionIndex(questionIndex);
        setShowQuestionDialog(true);
    };

    const handleSaveQuestion = () => {
        const getSectionQuestions = () => {
            switch (currentSection) {
                case 0: return section1Questions;
                case 1: return section2Questions;
                case 2: return section3Questions;
                default: return section1Questions;
            }
        };

        const setSectionQuestions = (questions: (Question | ImageQuestion | ImageGridQuestion | PassageQuestion)[]) => {
            switch (currentSection) {
                case 0: setSection1Questions(questions); break;
                case 1: setSection2Questions(questions); break;
                case 2: setSection3Questions(questions); break;
            }
        };

        let questionToSave: Question | ImageQuestion | ImageGridQuestion | PassageQuestion;

        // Validate based on question type
        if (questionType === 'text') {
            if (!currentQuestion.content.trim()) {
                toast({
                    title: "Lỗi",
                    description: "Vui lòng nhập nội dung câu hỏi",
                    variant: "destructive",
                });
                return;
            }

            const emptyAnswers = currentQuestion.answers.filter(a => !a.trim());
            if (emptyAnswers.length > 0) {
                toast({
                    title: "Lỗi",
                    description: "Vui lòng nhập đầy đủ 4 đáp án",
                    variant: "destructive",
                });
                return;
            }
            questionToSave = currentQuestion;

        } else if (questionType === 'single-image') {
            if (!currentImageQuestion.content.trim()) {
                toast({
                    title: "Lỗi",
                    description: "Vui lòng nhập nội dung câu hỏi",
                    variant: "destructive",
                });
                return;
            }

            // Check if file exists or URL exists (for editing)
            if (!currentImageQuestion.imageFile && !currentImageQuestion.imageUrl) {
                toast({
                    title: "Lỗi",
                    description: "Vui lòng tải lên hình ảnh",
                    variant: "destructive",
                });
                return;
            }

            const emptyAnswers = currentImageQuestion.answers.filter(a => !a.trim());
            if (emptyAnswers.length > 0) {
                toast({
                    title: "Lỗi",
                    description: "Vui lòng nhập đầy đủ 4 đáp án",
                    variant: "destructive",
                });
                return;
            }
            questionToSave = currentImageQuestion;

        } else if (questionType === 'image-grid') {
            // Validate image grid question
            // Check files and existing URLs
            const emptyImages = currentImageGridQuestion.imageFiles.map((file, i) => file === null && !currentImageGridQuestion.imageUrls[i]).filter(Boolean);

            if (emptyImages.length > 0) {
                toast({
                    title: "Lỗi",
                    description: `Vui lòng tải lên đầy đủ 4 hình ảnh`,
                    variant: "destructive",
                });
                return;
            }
            questionToSave = currentImageGridQuestion;

        } else if (questionType === 'passage') {
            // Validate passage question
            if (!currentPassageQuestion.passage.trim()) {
                toast({
                    title: "Lỗi",
                    description: "Vui lòng nhập đoạn văn",
                    variant: "destructive",
                });
                return;
            }

            if (currentPassageQuestion.subQuestions.length === 0) {
                toast({
                    title: "Lỗi",
                    description: "Vui lòng thêm ít nhất 1 câu hỏi con",
                    variant: "destructive",
                });
                return;
            }

            // Validate all sub-questions
            for (let i = 0; i < currentPassageQuestion.subQuestions.length; i++) {
                const subQ = currentPassageQuestion.subQuestions[i];
                if (!subQ.content.trim()) {
                    toast({
                        title: "Lỗi",
                        description: `Câu hỏi ${i + 1}: Vui lòng nhập nội dung`,
                        variant: "destructive",
                    });
                    return;
                }
                const emptyAnswers = subQ.answers.filter(a => !a.trim());
                if (emptyAnswers.length > 0) {
                    toast({
                        title: "Lỗi",
                        description: `Câu hỏi ${i + 1}: Vui lòng nhập đầy đủ 4 đáp án`,
                        variant: "destructive",
                    });
                    return;
                }
            }
            questionToSave = currentPassageQuestion;
        } else {
            return;
        }

        const sectionQuestions = getSectionQuestions();

        if (editingQuestionIndex !== null) {
            const updated = [...sectionQuestions];
            updated[editingQuestionIndex] = questionToSave;
            setSectionQuestions(updated);
        } else {
            const updated = [...sectionQuestions, questionToSave];
            setSectionQuestions(updated);
            updateSection(currentSection, "questionCount", updated.length);
        }

        setShowQuestionDialog(false);
        toast({
            title: "Thành công",
            description: editingQuestionIndex !== null ? "Đã cập nhật câu hỏi" : "Đã thêm câu hỏi mới",
        });
    };

    const handleDeleteQuestion = (sectionIndex: number, questionIndex: number) => {
        const getSectionQuestions = () => {
            switch (sectionIndex) {
                case 0: return section1Questions;
                case 1: return section2Questions;
                case 2: return section3Questions;
                default: return section1Questions;
            }
        };

        const setSectionQuestions = (questions: (Question | ImageQuestion | ImageGridQuestion | PassageQuestion)[]) => {
            switch (sectionIndex) {
                case 0: setSection1Questions(questions); break;
                case 1: setSection2Questions(questions); break;
                case 2: setSection3Questions(questions); break;
            }
        };

        const sectionQuestions = getSectionQuestions();
        const updated = sectionQuestions.filter((_, i) => i !== questionIndex);
        setSectionQuestions(updated);
        updateSection(sectionIndex, "questionCount", updated.length);

        toast({
            title: "Đã xóa",
            description: "Câu hỏi đã được xóa",
        });
    };

    const handleUnderlineText = () => {
        const textarea = document.getElementById("question-content") as HTMLTextAreaElement;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = currentQuestion.content.substring(start, end);

        if (selectedText) {
            const beforeText = currentQuestion.content.substring(0, start);
            const afterText = currentQuestion.content.substring(end);
            const newContent = `${beforeText}<u>${selectedText}</u>${afterText}`;

            setCurrentQuestion({ ...currentQuestion, content: newContent });

            // Set cursor position after the underlined text
            setTimeout(() => {
                textarea.focus();
                const newPosition = start + selectedText.length + 7; // +7 for <u></u>
                textarea.setSelectionRange(newPosition, newPosition);
            }, 0);
        }
    };

    const updateQuestionAnswer = (index: number, value: string) => {
        const updated = [...currentQuestion.answers];
        updated[index] = value;
        setCurrentQuestion({ ...currentQuestion, answers: updated });
    };

    const sectionIcons = [BookOpen, FileText, Headphones];

    return (
        <TeacherLayout>
            <div className="space-y-6 max-w-5xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate("/teacher/exams")}
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div className="flex-1">
                        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
                            Tạo đề thi JLPT mới
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Thiết lập đề thi JLPT theo cấu trúc chuẩn
                        </p>
                    </div>
                    <Button onClick={handleSave}>
                        <Save className="h-4 w-4 mr-2" />
                        Lưu đề thi
                    </Button>
                </div>

                {/* Basic Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>Thông tin cơ bản</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Tên đề thi *</Label>
                                <Input
                                    id="title"
                                    placeholder="VD: JLPT N5 - Đề thi thử tháng 12"
                                    value={basicInfo.title}
                                    onChange={(e) =>
                                        setBasicInfo({ ...basicInfo, title: e.target.value })
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="level">Cấp độ JLPT *</Label>
                                <Select value={basicInfo.level} onValueChange={handleLevelChange}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn cấp độ" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="N5">N5 (Sơ cấp)</SelectItem>
                                        <SelectItem value="N4">N4 (Sơ cấp cao)</SelectItem>
                                        <SelectItem value="N3">N3 (Trung cấp)</SelectItem>
                                        <SelectItem value="N2">N2 (Trung cấp cao)</SelectItem>
                                        <SelectItem value="N1">N1 (Cao cấp)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Mô tả</Label>
                            <Textarea
                                id="description"
                                placeholder="Mô tả nội dung đề thi..."
                                value={basicInfo.description}
                                onChange={(e) =>
                                    setBasicInfo({ ...basicInfo, description: e.target.value })
                                }
                                rows={3}
                            />
                        </div>

                        <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                            <Badge variant="secondary" className="text-base px-3 py-1">
                                Tổng thời gian: {basicInfo.totalDuration} phút
                            </Badge>
                        </div>
                    </CardContent>
                </Card>

                {/* JLPT Sections */}
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Cấu trúc đề thi JLPT</h2>

                    {sections.map((section, index) => {
                        const Icon = sectionIcons[index];
                        return (
                            <Card key={index}>
                                <CardHeader>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-primary/10 rounded-lg">
                                            <Icon className="h-5 w-5 text-primary" />
                                        </div>
                                        <div className="flex-1">
                                            <CardTitle className="text-lg">{section.name}</CardTitle>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                {section.description}
                                            </p>
                                        </div>
                                        <Badge variant="outline" className="text-sm">
                                            Phần {index + 1}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor={`section-${index}-duration`}>
                                                Thời gian (phút)
                                            </Label>
                                            <Input
                                                id={`section-${index}-duration`}
                                                type="number"
                                                min={0}
                                                max={180}
                                                value={section.duration}
                                                onChange={(e) =>
                                                    updateSection(index, "duration", parseInt(e.target.value) || 0)
                                                }
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor={`section-${index}-questions`}>
                                                Số câu hỏi
                                            </Label>
                                            <Input
                                                id={`section-${index}-questions`}
                                                type="number"
                                                min={0}
                                                max={200}
                                                value={section.questionCount}
                                                onChange={(e) =>
                                                    updateSection(index, "questionCount", parseInt(e.target.value) || 0)
                                                }
                                                disabled // Always calculated from questions now
                                            />
                                            <p className="text-xs text-muted-foreground">
                                                Tự động tính từ số câu hỏi đã tạo
                                            </p>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Tổng điểm</Label>
                                            <div className="h-10 flex items-center px-3 bg-muted rounded-md">
                                                <span className="font-medium">
                                                    {section.questionCount} điểm
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Questions List for All Sections */}
                                    <div className="mt-4 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <Label className="text-base">Danh sách câu hỏi</Label>
                                            <Button onClick={() => handleAddQuestion(index)} size="sm">
                                                <Plus className="h-4 w-4 mr-2" />
                                                Thêm câu hỏi
                                            </Button>
                                        </div>

                                        {(() => {
                                            const sectionQuestions = index === 0 ? section1Questions
                                                : index === 1 ? section2Questions
                                                    : section3Questions;

                                            return sectionQuestions.length > 0 ? (
                                                <div className="space-y-2">
                                                    {sectionQuestions.map((q, qIndex) => {
                                                        const isImageQuestion = 'type' in q && q.type === 'single-image';
                                                        const isImageGridQuestion = 'type' in q && q.type === 'image-grid';
                                                        const isPassageQuestion = 'type' in q && q.type === 'passage';
                                                        const imageQ = isImageQuestion ? q as ImageQuestion : null;
                                                        const gridQ = isImageGridQuestion ? q as ImageGridQuestion : null;
                                                        const passageQ = isPassageQuestion ? q as PassageQuestion : null;

                                                        return (
                                                            <Card key={q.id} className="p-3 bg-muted/30">
                                                                <div className="flex items-start gap-3">
                                                                    <div className="flex flex-col gap-2">
                                                                        <Badge variant="outline" className="mt-1">
                                                                            {qIndex + 1}
                                                                        </Badge>
                                                                        {isImageQuestion && (
                                                                            <Badge variant="secondary" className="text-xs">
                                                                                <ImageIcon className="h-3 w-3 mr-1" />
                                                                                1 Ảnh
                                                                            </Badge>
                                                                        )}
                                                                        {isImageGridQuestion && (
                                                                            <Badge variant="secondary" className="text-xs">
                                                                                <Grid2x2 className="h-3 w-3 mr-1" />
                                                                                4 Ảnh
                                                                            </Badge>
                                                                        )}
                                                                        {isPassageQuestion && (
                                                                            <Badge variant="secondary" className="text-xs">
                                                                                <FileType className="h-3 w-3 mr-1" />
                                                                                Đoạn văn
                                                                            </Badge>
                                                                        )}
                                                                    </div>

                                                                    <div className="flex-1 min-w-0">
                                                                        {/* Content display - different for passage */}
                                                                        {isPassageQuestion ? (
                                                                            <div className="mb-2">
                                                                                <p className="text-sm font-medium mb-1">Đoạn văn đọc hiểu</p>
                                                                                <div className="bg-background p-2 rounded border max-h-20 overflow-y-auto">
                                                                                    <p className="text-xs line-clamp-3">{passageQ?.passage}</p>
                                                                                </div>
                                                                                <p className="text-xs text-muted-foreground mt-1">
                                                                                    {passageQ?.subQuestions.length} câu hỏi con
                                                                                </p>
                                                                            </div>
                                                                        ) : (
                                                                            <p
                                                                                className="text-sm font-medium mb-2"
                                                                                dangerouslySetInnerHTML={{
                                                                                    __html: ('content' in q ? q.content : '') || '(Câu hỏi nghe)'
                                                                                }}
                                                                            />
                                                                        )}

                                                                        {/* Show image preview for single image questions */}
                                                                        {imageQ?.imageUrl && (
                                                                            <div className="mb-2">
                                                                                <img
                                                                                    src={imageQ.imageUrl}
                                                                                    alt="Question"
                                                                                    className="max-h-24 rounded border"
                                                                                />
                                                                                <p className="text-xs text-muted-foreground mt-1">
                                                                                    Vị trí: {imageQ.imagePosition === 'inline' ? 'Trong câu hỏi' : 'Dưới đáp án'}
                                                                                </p>
                                                                            </div>
                                                                        )}

                                                                        {/* Show image grid for grid questions */}
                                                                        {gridQ?.imageUrls && gridQ.imageUrls.length > 0 && (
                                                                            <div className="mb-2">
                                                                                <div className="grid grid-cols-2 gap-2">
                                                                                    {gridQ.imageUrls.map((url, idx) => (
                                                                                        <div key={idx} className="relative">
                                                                                            <img
                                                                                                src={url}
                                                                                                alt={`Grid ${idx + 1}`}
                                                                                                className="w-full aspect-square object-cover rounded border"
                                                                                            />
                                                                                            {idx === gridQ.correctAnswer && (
                                                                                                <div className="absolute top-1 right-1 bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                                                                                                    ✓
                                                                                                </div>
                                                                                            )}
                                                                                        </div>
                                                                                    ))}
                                                                                </div>
                                                                                <p className="text-xs text-muted-foreground mt-1">
                                                                                    Đáp án đúng: Hình {gridQ.correctAnswer + 1}
                                                                                </p>
                                                                            </div>
                                                                        )}

                                                                        {/* Show answers for text and single-image questions */}
                                                                        {'answers' in q && (
                                                                            <div className="grid grid-cols-2 gap-2 text-xs">
                                                                                {q.answers.map((ans, aIndex) => (
                                                                                    <div
                                                                                        key={aIndex}
                                                                                        className={`p-2 rounded ${aIndex === q.correctAnswer
                                                                                            ? 'bg-green-100 dark:bg-green-900/30 border border-green-500'
                                                                                            : 'bg-background'
                                                                                            }`}
                                                                                    >
                                                                                        <span className="font-semibold">{aIndex + 1}.</span> {ans}
                                                                                        {aIndex === q.correctAnswer && (
                                                                                            <span className="ml-2 text-green-600 dark:text-green-400">✓</span>
                                                                                        )}
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                    <div className="flex gap-1">
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="icon"
                                                                            onClick={() => handleEditQuestion(index, qIndex)}
                                                                        >
                                                                            <Edit className="h-4 w-4" />
                                                                        </Button>
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="icon"
                                                                            onClick={() => handleDeleteQuestion(index, qIndex)}
                                                                            className="text-destructive hover:text-destructive"
                                                                        >
                                                                            <Trash2 className="h-4 w-4" />
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            </Card>
                                                        );
                                                    })}
                                                </div>
                                            ) : (
                                                <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                                                    Chưa có câu hỏi nào. Click "Thêm câu hỏi" để bắt đầu.
                                                </div>
                                            );
                                        })()}
                                    </div>

                                    {/* Section 3 Audio Upload */}
                                    {index === 2 && (
                                        <div className="mt-4 space-y-3">
                                            <Label className="text-base">File nghe (Audio)</Label>

                                            {!listeningAudioFile ? (
                                                <div className="border-2 border-dashed rounded-lg p-6 text-center">
                                                    <input
                                                        type="file"
                                                        id="audio-upload"
                                                        accept="audio/*"
                                                        className="hidden"
                                                        onChange={(e) => {
                                                            const file = e.target.files?.[0];
                                                            if (file) {
                                                                setListeningAudioFile(file);
                                                                toast({
                                                                    title: "Đã tải file",
                                                                    description: `File "${file.name}" đã được tải lên`,
                                                                });
                                                            }
                                                        }}
                                                    />
                                                    <label
                                                        htmlFor="audio-upload"
                                                        className="cursor-pointer flex flex-col items-center gap-2"
                                                    >
                                                        <Upload className="h-8 w-8 text-muted-foreground" />
                                                        <p className="text-sm font-medium">
                                                            Click để tải file nghe
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">
                                                            Hỗ trợ: MP3, WAV, M4A (Tối đa 50MB)
                                                        </p>
                                                    </label>
                                                </div>
                                            ) : (
                                                <Card className="p-4 bg-muted/30">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-primary/10 rounded-lg">
                                                            <Headphones className="h-5 w-5 text-primary" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-medium truncate">
                                                                {listeningAudioFile.name}
                                                            </p>
                                                            <p className="text-xs text-muted-foreground">
                                                                {(listeningAudioFile.size / 1024 / 1024).toFixed(2)} MB
                                                            </p>
                                                        </div>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => {
                                                                setListeningAudioFile(null);
                                                                toast({
                                                                    title: "Đã xóa file",
                                                                    description: "File nghe đã được xóa",
                                                                });
                                                            }}
                                                            className="text-destructive hover:text-destructive"
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </Card>
                                            )}
                                        </div>
                                    )}

                                    {/* Mondai breakdown for each section */}
                                    <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                                        <p className="text-sm font-medium mb-2">Cấu trúc Mondai (問題):</p>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-muted-foreground">
                                            {index === 0 && (
                                                <>
                                                    <div>• Mondai 1: Đọc chữ Hán</div>
                                                    <div>• Mondai 2: Viết chữ Hán</div>
                                                    <div>• Mondai 3: Từ đồng nghĩa</div>
                                                    <div>• Mondai 4: Cách dùng từ</div>
                                                </>
                                            )}
                                            {index === 1 && (
                                                <>
                                                    <div>• Mondai 1: Chọn ngữ pháp</div>
                                                    <div>• Mondai 2: Sắp xếp câu</div>
                                                    <div>• Mondai 3: Văn phạm</div>
                                                    <div>• Mondai 4: Đọc hiểu ngắn</div>
                                                    <div>• Mondai 5: Đọc hiểu trung</div>
                                                    <div>• Mondai 6: Đọc hiểu dài</div>
                                                    <div>• Mondai 7: Thông tin</div>
                                                </>
                                            )}
                                            {index === 2 && (
                                                <>
                                                    <div>• Mondai 1: Câu hỏi - Đáp</div>
                                                    <div>• Mondai 2: Câu hỏi - Chọn</div>
                                                    <div>• Mondai 3: Hội thoại</div>
                                                    <div>• Mondai 4: Nội dung</div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* Summary */}
                <Card className="bg-primary/5 border-primary/20">
                    <CardContent className="p-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                            <div>
                                <p className="text-sm text-muted-foreground">Tổng số câu</p>
                                <p className="text-2xl font-bold text-primary">
                                    {sections.reduce((sum, s) => sum + s.questionCount, 0)}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Tổng thời gian</p>
                                <p className="text-2xl font-bold text-primary">
                                    {basicInfo.totalDuration} phút
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Số phần thi</p>
                                <p className="text-2xl font-bold text-primary">3</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Cấp độ</p>
                                <p className="text-2xl font-bold text-primary">{basicInfo.level}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pb-6">
                    <Button variant="outline" onClick={() => navigate("/teacher/exams")}>
                        Hủy
                    </Button>
                    <Button onClick={handleSave}>
                        <Save className="h-4 w-4 mr-2" />
                        Lưu đề thi
                    </Button>
                </div>
            </div>

            {/* Question Dialog */}
            <Dialog open={showQuestionDialog} onOpenChange={setShowQuestionDialog}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            {editingQuestionIndex !== null ? "Chỉnh sửa câu hỏi" : "Thêm câu hỏi mới"}
                            <span className="ml-2 font-normal text-muted-foreground">
                                - {currentSection === 0 ? "Phần 1: Từ vựng & Kanji"
                                    : currentSection === 1 ? "Phần 2: Ngữ pháp & Đọc hiểu"
                                        : "Phần 3: Nghe hiểu"}
                            </span>
                        </DialogTitle>
                        <DialogDescription>
                            {currentSection === 0 && "Nhập nội dung câu hỏi và 4 đáp án. Có thể dùng Text, Ảnh hoặc Grid 4 ảnh."}
                            {currentSection === 1 && "Nhập nội dung câu hỏi. Khuyên dùng Text cho ngữ pháp và Đoạn văn (Passage) cho bài đọc hiểu."}
                            {currentSection === 2 && "Nhập nội dung câu hỏi. Khuyên dùng Image Grid cho Mondai 1 (nghe nhìn hình) và Text cho các phần khác."}
                        </DialogDescription>
                    </DialogHeader>

                    {/* Question Type Selector */}
                    <div className="border-b">
                        <div className="grid grid-cols-4 gap-2 p-1">
                            <Button
                                type="button"
                                variant={questionType === 'text' ? 'default' : 'ghost'}
                                size="sm"
                                onClick={() => setQuestionType('text')}
                            >
                                <FileText className="h-4 w-4 mr-1" />
                                Text
                            </Button>
                            <Button
                                type="button"
                                variant={questionType === 'single-image' ? 'default' : 'ghost'}
                                size="sm"
                                onClick={() => setQuestionType('single-image')}
                            >
                                <ImageIcon className="h-4 w-4 mr-1" />
                                1 Ảnh
                            </Button>
                            <Button
                                type="button"
                                variant={questionType === 'image-grid' ? 'default' : 'ghost'}
                                size="sm"
                                onClick={() => setQuestionType('image-grid')}
                            >
                                <Grid2x2 className="h-4 w-4 mr-1" />
                                4 Ảnh
                            </Button>
                            <Button
                                type="button"
                                variant={questionType === 'passage' ? 'default' : 'ghost'}
                                size="sm"
                                onClick={() => setQuestionType('passage')}
                            >
                                <FileType className="h-4 w-4 mr-1" />
                                Đoạn văn
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-4 py-4">
                        {/* TEXT QUESTION FORM */}
                        {questionType === 'text' && (
                            <>
                                {/* Question Content */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="question-content">Nội dung câu hỏi *</Label>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={handleUnderlineText}
                                        >
                                            <Underline className="h-4 w-4 mr-2" />
                                            Gạch chân
                                        </Button>
                                    </div>
                                    <Textarea
                                        id="question-content"
                                        placeholder="Nhập câu hỏi... (Chọn văn bản và click 'Gạch chân' để gạch chân cụm từ)"
                                        value={currentQuestion.content}
                                        onChange={(e) =>
                                            setCurrentQuestion({ ...currentQuestion, content: e.target.value })
                                        }
                                        rows={4}
                                        className="font-japanese"
                                    />
                                    <div className="text-xs text-muted-foreground">
                                        Preview: <span dangerouslySetInnerHTML={{ __html: currentQuestion.content }} />
                                    </div>
                                </div>

                                {/* Answers */}
                                <div className="space-y-3">
                                    <Label>Đáp án (chọn đáp án đúng) *</Label>
                                    <RadioGroup
                                        value={currentQuestion.correctAnswer.toString()}
                                        onValueChange={(value) =>
                                            setCurrentQuestion({ ...currentQuestion, correctAnswer: parseInt(value) })
                                        }
                                    >
                                        <div className="space-y-3">
                                            {currentQuestion.answers.map((answer, index) => (
                                                <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                                                    <RadioGroupItem value={index.toString()} id={`answer-${index}`} />
                                                    <Label htmlFor={`answer-${index}`} className="font-semibold w-8">
                                                        {index + 1}.
                                                    </Label>
                                                    <Input
                                                        placeholder={`Nhập đáp án ${index + 1}`}
                                                        value={answer}
                                                        onChange={(e) => updateQuestionAnswer(index, e.target.value)}
                                                        className="flex-1"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </RadioGroup>
                                </div>
                            </>
                        )}

                        {/* IMAGE QUESTION FORM */}
                        {questionType === 'single-image' && (
                            <>
                                {/* Question Content */}
                                <div className="space-y-2">
                                    <Label htmlFor="image-question-content">Nội dung câu hỏi *</Label>
                                    <Textarea
                                        id="image-question-content"
                                        placeholder="Nhập câu hỏi..."
                                        value={currentImageQuestion.content}
                                        onChange={(e) =>
                                            setCurrentImageQuestion({ ...currentImageQuestion, content: e.target.value })
                                        }
                                        rows={3}
                                        className="font-japanese"
                                    />
                                </div>

                                {/* Image Upload */}
                                <div className="space-y-2">
                                    <Label>Hình ảnh *</Label>
                                    {!currentImageQuestion.imageFile ? (
                                        <div className="border-2 border-dashed rounded-lg p-6 text-center">
                                            <input
                                                type="file"
                                                id="question-image-upload"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        const imageUrl = URL.createObjectURL(file);
                                                        setCurrentImageQuestion({
                                                            ...currentImageQuestion,
                                                            imageFile: file,
                                                            imageUrl
                                                        });
                                                    }
                                                }}
                                            />
                                            <label
                                                htmlFor="question-image-upload"
                                                className="cursor-pointer flex flex-col items-center gap-2"
                                            >
                                                <Upload className="h-8 w-8 text-muted-foreground" />
                                                <p className="text-sm font-medium">Click để tải hình ảnh</p>
                                                <p className="text-xs text-muted-foreground">
                                                    PNG, JPG, GIF (Tối đa 5MB)
                                                </p>
                                            </label>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            <div className="relative border rounded-lg p-2">
                                                <img
                                                    src={currentImageQuestion.imageUrl}
                                                    alt="Preview"
                                                    className="max-h-48 mx-auto rounded"
                                                />
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="icon"
                                                    className="absolute top-2 right-2"
                                                    onClick={() => {
                                                        if (currentImageQuestion.imageUrl) {
                                                            URL.revokeObjectURL(currentImageQuestion.imageUrl);
                                                        }
                                                        setCurrentImageQuestion({
                                                            ...currentImageQuestion,
                                                            imageFile: null,
                                                            imageUrl: undefined
                                                        });
                                                    }}
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Image Position */}
                                <div className="space-y-2">
                                    <Label>Vị trí hình ảnh</Label>
                                    <RadioGroup
                                        value={currentImageQuestion.imagePosition}
                                        onValueChange={(value: 'inline' | 'below-options') =>
                                            setCurrentImageQuestion({ ...currentImageQuestion, imagePosition: value })
                                        }
                                    >
                                        <div className="flex gap-4">
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="inline" id="pos-inline" />
                                                <Label htmlFor="pos-inline">Trong câu hỏi</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="below-options" id="pos-below" />
                                                <Label htmlFor="pos-below">Dưới đáp án</Label>
                                            </div>
                                        </div>
                                    </RadioGroup>
                                </div>

                                {/* Answers */}
                                <div className="space-y-3">
                                    <Label>Đáp án (chọn đáp án đúng) *</Label>
                                    <RadioGroup
                                        value={currentImageQuestion.correctAnswer.toString()}
                                        onValueChange={(value) =>
                                            setCurrentImageQuestion({ ...currentImageQuestion, correctAnswer: parseInt(value) })
                                        }
                                    >
                                        <div className="space-y-3">
                                            {currentImageQuestion.answers.map((answer, index) => (
                                                <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                                                    <RadioGroupItem value={index.toString()} id={`img-answer-${index}`} />
                                                    <Label htmlFor={`img-answer-${index}`} className="font-semibold w-8">
                                                        {index + 1}.
                                                    </Label>
                                                    <Input
                                                        placeholder={`Nhập đáp án ${index + 1}`}
                                                        value={answer}
                                                        onChange={(e) => {
                                                            const updated = [...currentImageQuestion.answers];
                                                            updated[index] = e.target.value;
                                                            setCurrentImageQuestion({ ...currentImageQuestion, answers: updated });
                                                        }}
                                                        className="flex-1"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </RadioGroup>
                                </div>
                            </>
                        )}

                        {/* IMAGE GRID QUESTION FORM */}
                        {questionType === 'image-grid' && (
                            <>
                                {/* Question Content (Optional) */}
                                <div className="space-y-2">
                                    <Label htmlFor="grid-question-content">
                                        Nội dung câu hỏi (tùy chọn)
                                    </Label>
                                    <Textarea
                                        id="grid-question-content"
                                        placeholder="Nhập câu hỏi (có thể để trống cho câu hỏi nghe)"
                                        value={currentImageGridQuestion.content}
                                        onChange={(e) =>
                                            setCurrentImageGridQuestion({ ...currentImageGridQuestion, content: e.target.value })
                                        }
                                        rows={2}
                                        className="font-japanese"
                                    />
                                </div>

                                {/* 4 Image Grid Upload */}
                                <div className="space-y-3">
                                    <Label>4 Hình ảnh (Grid 2x2) *</Label>
                                    <div className="grid grid-cols-2 gap-4">
                                        {[0, 1, 2, 3].map((index) => (
                                            <div key={index} className="space-y-2">
                                                <Label className="text-xs text-muted-foreground">
                                                    Hình {index + 1}
                                                </Label>
                                                {!currentImageGridQuestion.imageFiles[index] ? (
                                                    <div className="border-2 border-dashed rounded-lg p-4 text-center aspect-square flex flex-col items-center justify-center">
                                                        <input
                                                            type="file"
                                                            id={`grid-image-${index}`}
                                                            accept="image/*"
                                                            className="hidden"
                                                            onChange={(e) => {
                                                                const file = e.target.files?.[0];
                                                                if (file) {
                                                                    const imageUrl = URL.createObjectURL(file);
                                                                    const newFiles = [...currentImageGridQuestion.imageFiles];
                                                                    const newUrls = [...(currentImageGridQuestion.imageUrls || [])];
                                                                    newFiles[index] = file;
                                                                    newUrls[index] = imageUrl;
                                                                    setCurrentImageGridQuestion({
                                                                        ...currentImageGridQuestion,
                                                                        imageFiles: newFiles,
                                                                        imageUrls: newUrls
                                                                    });
                                                                }
                                                            }}
                                                        />
                                                        <label
                                                            htmlFor={`grid-image-${index}`}
                                                            className="cursor-pointer flex flex-col items-center gap-1"
                                                        >
                                                            <Upload className="h-6 w-6 text-muted-foreground" />
                                                            <p className="text-xs">Tải ảnh</p>
                                                        </label>
                                                    </div>
                                                ) : (
                                                    <div className="relative border rounded-lg p-1 aspect-square">
                                                        <img
                                                            src={currentImageGridQuestion.imageUrls?.[index]}
                                                            alt={`Grid ${index + 1}`}
                                                            className="w-full h-full object-cover rounded"
                                                        />
                                                        <Button
                                                            type="button"
                                                            variant="destructive"
                                                            size="icon"
                                                            className="absolute top-1 right-1 h-6 w-6"
                                                            onClick={() => {
                                                                if (currentImageGridQuestion.imageUrls?.[index]) {
                                                                    URL.revokeObjectURL(currentImageGridQuestion.imageUrls[index]);
                                                                }
                                                                const newFiles = [...currentImageGridQuestion.imageFiles];
                                                                const newUrls = [...(currentImageGridQuestion.imageUrls || [])];
                                                                newFiles[index] = null;
                                                                newUrls[index] = '';
                                                                setCurrentImageGridQuestion({
                                                                    ...currentImageGridQuestion,
                                                                    imageFiles: newFiles,
                                                                    imageUrls: newUrls
                                                                });
                                                            }}
                                                        >
                                                            <X className="h-3 w-3" />
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Correct Answer Selection */}
                                <div className="space-y-2">
                                    <Label>Đáp án đúng *</Label>
                                    <RadioGroup
                                        value={currentImageGridQuestion.correctAnswer.toString()}
                                        onValueChange={(value) =>
                                            setCurrentImageGridQuestion({ ...currentImageGridQuestion, correctAnswer: parseInt(value) })
                                        }
                                    >
                                        <div className="grid grid-cols-2 gap-3">
                                            {[0, 1, 2, 3].map((index) => (
                                                <div key={index} className="flex items-center space-x-2 p-3 border rounded-lg">
                                                    <RadioGroupItem value={index.toString()} id={`grid-answer-${index}`} />
                                                    <Label htmlFor={`grid-answer-${index}`} className="cursor-pointer">
                                                        Hình {index + 1}
                                                    </Label>
                                                </div>
                                            ))}
                                        </div>
                                    </RadioGroup>
                                </div>
                            </>
                        )}

                        {/* PASSAGE QUESTION FORM */}
                        {questionType === 'passage' && (
                            <>
                                {/* Passage Text */}
                                <div className="space-y-2">
                                    <Label htmlFor="passage-text">Đoạn văn *</Label>
                                    <Textarea
                                        id="passage-text"
                                        placeholder="Nhập đoạn văn đọc hiểu..."
                                        value={currentPassageQuestion.passage}
                                        onChange={(e) =>
                                            setCurrentPassageQuestion({ ...currentPassageQuestion, passage: e.target.value })
                                        }
                                        rows={8}
                                        className="font-japanese"
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Đoạn văn dài cho bài đọc hiểu
                                    </p>
                                </div>

                                {/* Sub Questions */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <Label>Câu hỏi con ({currentPassageQuestion.subQuestions.length})</Label>
                                        <Button
                                            type="button"
                                            size="sm"
                                            onClick={() => {
                                                const newSubQ: PassageSubQuestion = {
                                                    id: Date.now(),
                                                    content: "",
                                                    answers: ["", "", "", ""],
                                                    correctAnswer: 0,
                                                };
                                                setCurrentPassageQuestion({
                                                    ...currentPassageQuestion,
                                                    subQuestions: [...currentPassageQuestion.subQuestions, newSubQ]
                                                });
                                            }}
                                        >
                                            <Plus className="h-4 w-4 mr-1" />
                                            Thêm câu hỏi
                                        </Button>
                                    </div>

                                    {currentPassageQuestion.subQuestions.length === 0 ? (
                                        <div className="text-center py-8 border-2 border-dashed rounded-lg text-muted-foreground">
                                            Chưa có câu hỏi con. Click "Thêm câu hỏi" để bắt đầu.
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {currentPassageQuestion.subQuestions.map((subQ, subIndex) => (
                                                <Card key={subQ.id} className="p-4">
                                                    <div className="space-y-3">
                                                        {/* Sub Question Header */}
                                                        <div className="flex items-center justify-between">
                                                            <Badge>Câu {subIndex + 1}</Badge>
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => {
                                                                    const updated = currentPassageQuestion.subQuestions.filter((_, i) => i !== subIndex);
                                                                    setCurrentPassageQuestion({
                                                                        ...currentPassageQuestion,
                                                                        subQuestions: updated
                                                                    });
                                                                }}
                                                                className="text-destructive"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>

                                                        {/* Sub Question Content */}
                                                        <div className="space-y-2">
                                                            <Label>Nội dung câu hỏi</Label>
                                                            <Input
                                                                placeholder="Nhập câu hỏi..."
                                                                value={subQ.content}
                                                                onChange={(e) => {
                                                                    const updated = [...currentPassageQuestion.subQuestions];
                                                                    updated[subIndex].content = e.target.value;
                                                                    setCurrentPassageQuestion({
                                                                        ...currentPassageQuestion,
                                                                        subQuestions: updated
                                                                    });
                                                                }}
                                                                className="font-japanese"
                                                            />
                                                        </div>

                                                        {/* Sub Question Answers */}
                                                        <div className="space-y-2">
                                                            <Label>Đáp án</Label>
                                                            <RadioGroup
                                                                value={subQ.correctAnswer.toString()}
                                                                onValueChange={(value) => {
                                                                    const updated = [...currentPassageQuestion.subQuestions];
                                                                    updated[subIndex].correctAnswer = parseInt(value);
                                                                    setCurrentPassageQuestion({
                                                                        ...currentPassageQuestion,
                                                                        subQuestions: updated
                                                                    });
                                                                }}
                                                            >
                                                                <div className="space-y-2">
                                                                    {subQ.answers.map((answer, ansIndex) => (
                                                                        <div key={ansIndex} className="flex items-center gap-3 p-2 border rounded-lg">
                                                                            <RadioGroupItem value={ansIndex.toString()} id={`sub-${subIndex}-ans-${ansIndex}`} />
                                                                            <Label htmlFor={`sub-${subIndex}-ans-${ansIndex}`} className="font-semibold w-8">
                                                                                {ansIndex + 1}.
                                                                            </Label>
                                                                            <Input
                                                                                placeholder={`Đáp án ${ansIndex + 1}`}
                                                                                value={answer}
                                                                                onChange={(e) => {
                                                                                    const updated = [...currentPassageQuestion.subQuestions];
                                                                                    updated[subIndex].answers[ansIndex] = e.target.value;
                                                                                    setCurrentPassageQuestion({
                                                                                        ...currentPassageQuestion,
                                                                                        subQuestions: updated
                                                                                    });
                                                                                }}
                                                                                className="flex-1"
                                                                            />
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </RadioGroup>
                                                        </div>
                                                    </div>
                                                </Card>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowQuestionDialog(false)}>
                            Hủy
                        </Button>
                        <Button onClick={handleSaveQuestion}>
                            {editingQuestionIndex !== null ? "Cập nhật" : "Thêm câu hỏi"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </TeacherLayout>
    );
};

export default CreateJLPTExam;

