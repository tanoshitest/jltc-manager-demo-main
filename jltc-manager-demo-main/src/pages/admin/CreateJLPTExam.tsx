import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "@/components/AdminLayout";
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

        // Using the same key 'jlpt_exam_demo' so Admin and Student see the same data
        localStorage.setItem('jlpt_exam_demo', JSON.stringify(examData));

        toast({
            title: "Tạo đề thi thành công",
            description: `Đề thi JLPT "${basicInfo.title}" với ${totalQuestions} câu hỏi đã được tạo.`,
        });

        navigate("/admin/exams");
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
        <AdminLayout>
            <div className="space-y-6 max-w-5xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate("/admin/exams")}
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
                                                                                            } border`}
                                                                                    >
                                                                                        <span className="font-bold mr-1">{aIndex + 1}.</span> {ans}
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                        )}
                                                                    </div>

                                                                    <div className="flex flex-col gap-1">
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="icon"
                                                                            onClick={() => handleEditQuestion(index, qIndex)}
                                                                        >
                                                                            <Edit className="h-4 w-4 text-blue-500" />
                                                                        </Button>
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="icon"
                                                                            onClick={() => handleDeleteQuestion(index, qIndex)}
                                                                        >
                                                                            <Trash2 className="h-4 w-4 text-destructive" />
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            </Card>
                                                        );
                                                    })}
                                                </div>
                                            ) : (
                                                <div className="text-center py-8 border rounded-lg border-dashed text-muted-foreground">
                                                    Chưa có câu hỏi nào. Nhấn "Thêm câu hỏi" để bắt đầu.
                                                </div>
                                            );
                                        })()}
                                    </div>

                                    {/* Upload/Import placeholder */}
                                    {index === 2 && (
                                        <div className="mt-6 pt-4 border-t">
                                            <Label className="mb-2 block">File âm thanh (Audio)</Label>
                                            <div className="flex items-center gap-4">
                                                <Input
                                                    type="file"
                                                    accept="audio/*"
                                                    className="w-full"
                                                    onChange={(e) => setListeningAudioFile(e.target.files?.[0] || null)}
                                                />
                                                <Button variant="outline" size="icon">
                                                    <Upload className="h-4 w-4" />
                                                </Button>
                                            </div>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                Tải lên file âm thanh cho phần nghe hiểu (MP3, WAV)
                                            </p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* Question Dialog (Same as Teacher) */}
                <Dialog open={showQuestionDialog} onOpenChange={setShowQuestionDialog}>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                        <DialogHeader>
                            <DialogTitle>
                                {editingQuestionIndex !== null ? "Chỉnh sửa câu hỏi" : "Thêm câu hỏi mới"} - {
                                    currentSection === 0 ? "Phần 1: Từ vựng/Chữ Hán" :
                                        currentSection === 1 ? "Phần 2: Ngữ pháp/Đọc hiểu" :
                                            "Phần 3: Nghe hiểu"
                                }
                            </DialogTitle>
                            <DialogDescription>
                                {currentSection === 1 ? "Chọn 'Đoạn văn' cho bài đọc hiểu." :
                                    currentSection === 2 ? "Chọn 'Nghe nhìn (4 ảnh)' cho Mondai 1." :
                                        "Nhập thông tin câu hỏi và đáp án."}
                            </DialogDescription>
                        </DialogHeader>

                        <div className="flex-1 overflow-y-auto p-1 pr-2">
                            <div className="grid gap-4 py-4">
                                {/* Type Selection */}
                                <div className="space-y-3 p-4 border rounded-lg bg-muted/20">
                                    <Label>Loại câu hỏi</Label>
                                    <RadioGroup
                                        value={questionType}
                                        onValueChange={(val: any) => setQuestionType(val)}
                                        className="grid grid-cols-2 md:grid-cols-4 gap-4"
                                    >
                                        <div className="flex items-center space-x-2 border p-3 rounded-md bg-white hover:bg-accent cursor-pointer">
                                            <RadioGroupItem value="text" id="type-text" />
                                            <Label htmlFor="type-text" className="cursor-pointer flex items-center">
                                                <FileText className="w-4 h-4 mr-2" />
                                                Văn bản
                                            </Label>
                                        </div>
                                        <div className="flex items-center space-x-2 border p-3 rounded-md bg-white hover:bg-accent cursor-pointer">
                                            <RadioGroupItem value="single-image" id="type-single-image" />
                                            <Label htmlFor="type-single-image" className="cursor-pointer flex items-center">
                                                <ImageIcon className="w-4 h-4 mr-2" />
                                                Có 1 hình ảnh
                                            </Label>
                                        </div>
                                        <div className="flex items-center space-x-2 border p-3 rounded-md bg-white hover:bg-accent cursor-pointer">
                                            <RadioGroupItem value="image-grid" id="type-image-grid" />
                                            <Label htmlFor="type-image-grid" className="cursor-pointer flex items-center">
                                                <Grid2x2 className="w-4 h-4 mr-2" />
                                                Nghe nhìn (4 ảnh)
                                            </Label>
                                        </div>
                                        <div className="flex items-center space-x-2 border p-3 rounded-md bg-white hover:bg-accent cursor-pointer">
                                            <RadioGroupItem value="passage" id="type-passage" />
                                            <Label htmlFor="type-passage" className="cursor-pointer flex items-center">
                                                <FileType className="w-4 h-4 mr-2" />
                                                Đoạn văn
                                            </Label>
                                        </div>
                                    </RadioGroup>
                                </div>

                                {/* Dynamic Input Fields based on Type */}
                                {questionType === 'passage' ? (
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label>Nội dung đoạn văn *</Label>
                                            <Textarea
                                                placeholder="Nhập nội dung đoạn văn bài đọc..."
                                                value={currentPassageQuestion.passage}
                                                onChange={(e) => setCurrentPassageQuestion({ ...currentPassageQuestion, passage: e.target.value })}
                                                className="min-h-[150px]"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <Label>Danh sách câu hỏi con ({currentPassageQuestion.subQuestions.length})</Label>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => {
                                                        const newSubQ = {
                                                            id: Date.now(),
                                                            content: "",
                                                            answers: ["", "", "", ""],
                                                            correctAnswer: 0
                                                        };
                                                        setCurrentPassageQuestion({
                                                            ...currentPassageQuestion,
                                                            subQuestions: [...currentPassageQuestion.subQuestions, newSubQ]
                                                        });
                                                    }}
                                                >
                                                    <Plus className="w-4 h-4 mr-1" /> Thêm câu hỏi
                                                </Button>
                                            </div>

                                            <div className="space-y-4 border rounded-lg p-4 bg-muted/10">
                                                {currentPassageQuestion.subQuestions.map((subQ, idx) => (
                                                    <div key={idx} className="p-4 bg-white rounded border relative">
                                                        <Button
                                                            size="icon"
                                                            variant="ghost"
                                                            className="absolute top-2 right-2 text-destructive"
                                                            onClick={() => {
                                                                const updated = currentPassageQuestion.subQuestions.filter((_, i) => i !== idx);
                                                                setCurrentPassageQuestion({ ...currentPassageQuestion, subQuestions: updated });
                                                            }}
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                        <div className="space-y-3">
                                                            <Label>Câu hỏi {idx + 1}</Label>
                                                            <Input
                                                                value={subQ.content}
                                                                onChange={(e) => {
                                                                    const updated = [...currentPassageQuestion.subQuestions];
                                                                    updated[idx].content = e.target.value;
                                                                    setCurrentPassageQuestion({ ...currentPassageQuestion, subQuestions: updated });
                                                                }}
                                                                placeholder="Nội dung câu hỏi..."
                                                            />
                                                            <div className="grid grid-cols-2 gap-2">
                                                                {subQ.answers.map((ans, aIdx) => (
                                                                    <div key={aIdx} className="flex gap-2 items-center">
                                                                        <RadioGroup
                                                                            value={subQ.correctAnswer.toString()}
                                                                            onValueChange={(val) => {
                                                                                const updated = [...currentPassageQuestion.subQuestions];
                                                                                updated[idx].correctAnswer = parseInt(val);
                                                                                setCurrentPassageQuestion({ ...currentPassageQuestion, subQuestions: updated });
                                                                            }}
                                                                        >
                                                                            <RadioGroupItem value={aIdx.toString()} id={`subq-${idx}-ans-${aIdx}`} />
                                                                        </RadioGroup>
                                                                        <Input
                                                                            value={ans}
                                                                            onChange={(e) => {
                                                                                const updated = [...currentPassageQuestion.subQuestions];
                                                                                updated[idx].answers[aIdx] = e.target.value;
                                                                                setCurrentPassageQuestion({ ...currentPassageQuestion, subQuestions: updated });
                                                                            }}
                                                                            placeholder={`Đáp án ${aIdx + 1}`}
                                                                        />
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                                {currentPassageQuestion.subQuestions.length === 0 && (
                                                    <div className="text-center text-muted-foreground py-4">Chưa có câu hỏi con nào</div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        {/* Standard Content Input for non-passage */}
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <Label htmlFor="question-content">Nội dung câu hỏi *</Label>
                                                {/* Tool buttons like Bold/Underline could go here */}
                                                <Button variant="ghost" size="sm" onClick={handleUnderlineText} title="Gạch chân văn bản đã chọn">
                                                    <Underline className="h-4 w-4" />
                                                </Button>
                                            </div>
                                            {questionType === 'image-grid' ? (
                                                <div className="p-4 border rounded bg-muted/20 text-sm text-center">
                                                    Câu hỏi dạng lưới hình ảnh thường không có văn bản (chỉ có âm thanh).
                                                    <br />Bạn có thể nhập ghi chú hoặc để trống.
                                                    <Input
                                                        className="mt-2"
                                                        placeholder="Ghi chú (tùy chọn)..."
                                                        value={currentImageGridQuestion.content || ""}
                                                        onChange={(e) => setCurrentImageGridQuestion({ ...currentImageGridQuestion, content: e.target.value })}
                                                    />
                                                </div>
                                            ) : (
                                                <Textarea
                                                    id="question-content"
                                                    placeholder="Nhập nội dung câu hỏi..."
                                                    value={questionType === 'single-image' ? currentImageQuestion.content : currentQuestion.content}
                                                    onChange={(e) => {
                                                        if (questionType === 'single-image') {
                                                            setCurrentImageQuestion({ ...currentImageQuestion, content: e.target.value });
                                                        } else {
                                                            setCurrentQuestion({ ...currentQuestion, content: e.target.value });
                                                        }
                                                    }}
                                                    className="font-medium text-lg min-h-[100px]"
                                                />
                                            )}
                                        </div>

                                        {/* Image Upload for Single Image */}
                                        {questionType === 'single-image' && (
                                            <div className="space-y-3 p-4 border rounded bg-muted/10">
                                                <Label>Hình ảnh minh họa *</Label>
                                                <div className="flex items-center gap-4">
                                                    {currentImageQuestion.imageUrl ? (
                                                        <div className="relative group">
                                                            <img src={currentImageQuestion.imageUrl} alt="Preview" className="h-24 rounded border" />
                                                            <Button
                                                                variant="destructive"
                                                                size="icon"
                                                                className="absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                                                onClick={() => setCurrentImageQuestion({ ...currentImageQuestion, imageUrl: undefined, imageFile: null })}
                                                            >
                                                                <X className="h-3 w-3" />
                                                            </Button>
                                                        </div>
                                                    ) : (
                                                        <div className="h-24 w-24 border-2 border-dashed rounded flex flex-col items-center justify-center text-muted-foreground bg-white">
                                                            <ImageIcon className="h-6 w-6 mb-1" />
                                                            <span className="text-[10px]">Chưa có ảnh</span>
                                                        </div>
                                                    )}
                                                    <div className="flex-1">
                                                        <Input
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={(e) => {
                                                                const file = e.target.files?.[0];
                                                                if (file) {
                                                                    const url = URL.createObjectURL(file);
                                                                    setCurrentImageQuestion({ ...currentImageQuestion, imageFile: file, imageUrl: url });
                                                                }
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                                <RadioGroup
                                                    value={currentImageQuestion.imagePosition}
                                                    onValueChange={(val: 'inline' | 'below-options') => setCurrentImageQuestion({ ...currentImageQuestion, imagePosition: val })}
                                                    className="flex gap-6 pt-2"
                                                >
                                                    <div className="flex items-center space-x-2">
                                                        <RadioGroupItem value="below-options" id="pos-below" />
                                                        <Label htmlFor="pos-below">Hiện dưới đáp án</Label>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <RadioGroupItem value="inline" id="pos-inline" />
                                                        <Label htmlFor="pos-inline">Hiện sau câu hỏi</Label>
                                                    </div>
                                                </RadioGroup>
                                            </div>
                                        )}

                                        {/* Image Grid Uploads */}
                                        {questionType === 'image-grid' && (
                                            <div className="space-y-3 p-4 border rounded bg-muted/10">
                                                <Label>Bộ 4 hình ảnh * (Mondai 2)</Label>
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                    {[0, 1, 2, 3].map((idx) => (
                                                        <div key={idx} className="space-y-2">
                                                            <Label className="text-xs">Hình {idx + 1}</Label>
                                                            <div className="relative aspect-square border-2 border-dashed rounded-lg flex flex-col items-center justify-center bg-white overflow-hidden hover:bg-accent/50 transition-colors">
                                                                {currentImageGridQuestion.imageUrls && currentImageGridQuestion.imageUrls[idx] ? (
                                                                    <>
                                                                        <img
                                                                            src={currentImageGridQuestion.imageUrls[idx]}
                                                                            alt={`Img ${idx}`}
                                                                            className="w-full h-full object-cover"
                                                                        />
                                                                        <Button
                                                                            variant="destructive"
                                                                            size="icon"
                                                                            className="absolute top-1 right-1 h-6 w-6"
                                                                            onClick={() => {
                                                                                const newUrls = [...(currentImageGridQuestion.imageUrls || [])];
                                                                                newUrls[idx] = "";
                                                                                const newFiles = [...currentImageGridQuestion.imageFiles];
                                                                                newFiles[idx] = null;
                                                                                setCurrentImageGridQuestion({ ...currentImageGridQuestion, imageUrls: newUrls, imageFiles: newFiles });
                                                                            }}
                                                                        >
                                                                            <X className="h-3 w-3" />
                                                                        </Button>
                                                                    </>
                                                                ) : (
                                                                    <div className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer pointer-events-none">
                                                                        <Plus className="h-6 w-6 text-muted-foreground mb-1" />
                                                                        <span className="text-[10px] text-muted-foreground">Tải ảnh</span>
                                                                    </div>
                                                                )}
                                                                <Input
                                                                    type="file"
                                                                    accept="image/*"
                                                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                                                    onChange={(e) => {
                                                                        const file = e.target.files?.[0];
                                                                        if (file) {
                                                                            const url = URL.createObjectURL(file);
                                                                            const newUrls = [...(currentImageGridQuestion.imageUrls || [])];
                                                                            newUrls[idx] = url;
                                                                            const newFiles = [...currentImageGridQuestion.imageFiles];
                                                                            newFiles[idx] = file;
                                                                            setCurrentImageGridQuestion({ ...currentImageGridQuestion, imageUrls: newUrls, imageFiles: newFiles });
                                                                        }
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Answers - Shared by Text, SingleImage, ImageGrid */}
                                        <div className="space-y-3">
                                            <Label>Đáp án (Chọn đáp án đúng) *</Label>
                                            <RadioGroup
                                                value={
                                                    questionType === 'image-grid' ? currentImageGridQuestion.correctAnswer.toString() :
                                                        questionType === 'single-image' ? currentImageQuestion.correctAnswer.toString() :
                                                            currentQuestion.correctAnswer.toString()
                                                }
                                                onValueChange={(val) => {
                                                    const idx = parseInt(val);
                                                    if (questionType === 'image-grid') setCurrentImageGridQuestion({ ...currentImageGridQuestion, correctAnswer: idx });
                                                    else if (questionType === 'single-image') setCurrentImageQuestion({ ...currentImageQuestion, correctAnswer: idx });
                                                    else setCurrentQuestion({ ...currentQuestion, correctAnswer: idx });
                                                }}
                                            >
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    {[0, 1, 2, 3].map((index) => (
                                                        <div key={index} className="flex items-center gap-2 p-2 rounded-lg border bg-background hover:bg-accent/50">
                                                            <RadioGroupItem value={index.toString()} id={`ans-${index}`} />
                                                            <Label htmlFor={`ans-${index}`} className="font-bold w-6">
                                                                {index + 1}.
                                                            </Label>
                                                            {questionType === 'image-grid' ? (
                                                                <div className="flex-1 text-sm text-muted-foreground italic">
                                                                    (Hình {index + 1})
                                                                </div>
                                                            ) : (
                                                                <Input
                                                                    placeholder={`Nhập đáp án ${index + 1}`}
                                                                    value={
                                                                        questionType === 'single-image' ? currentImageQuestion.answers[index] :
                                                                            currentQuestion.answers[index]
                                                                    }
                                                                    onChange={(e) => {
                                                                        if (questionType === 'single-image') {
                                                                            const updated = [...currentImageQuestion.answers];
                                                                            updated[index] = e.target.value;
                                                                            setCurrentImageQuestion({ ...currentImageQuestion, answers: updated });
                                                                        } else {
                                                                            updateQuestionAnswer(index, e.target.value);
                                                                        }
                                                                    }}
                                                                    className="flex-1 border-0 bg-transparent focus-visible:ring-0 px-0 h-auto py-1"
                                                                />
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </RadioGroup>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        <DialogFooter className="pt-2 border-t mt-auto">
                            <Button variant="outline" onClick={() => setShowQuestionDialog(false)}>
                                Hủy
                            </Button>
                            <Button onClick={handleSaveQuestion}>
                                {editingQuestionIndex !== null ? "Cập nhật" : "Thêm câu hỏi"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AdminLayout>
    );
};

export default CreateJLPTExam;
