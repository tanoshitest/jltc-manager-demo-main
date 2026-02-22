export type JLPTLevel = 'N5' | 'N4' | 'N3' | 'N2' | 'N1';

// --- Interfaces ---

export interface EvaluationResult {
    passed: boolean;
    totalScore: number;
    totalMaxScore?: number;
    reason?: string;
    details?: Record<string, { score: number; max: number; passed: boolean }>;
}

export interface TestScores {
    vocab: number;
    grammar: number;
    reading: number;
    listening: number;
}

export type LessonTestScores = TestScores;
export type ComprehensiveTestScores = TestScores;
export type GeneralTestScores = TestScores;
export type JLPTSectionScores = TestScores;

// --- Constants ---

// Default weighting: Equal distribution for internal tests (100 total)
const LESSON_MAX_SCORES = { vocab: 25, grammar: 25, reading: 25, listening: 25 };
const COMP_MAX_SCORES = { vocab: 25, grammar: 25, reading: 25, listening: 25 };
const GENERAL_MAX_SCORES = { vocab: 25, grammar: 25, reading: 25, listening: 25 };

// --- Evaluation Functions ---

/**
 * 1. Lesson Test Evaluation
 * Rule: Pass if Total >= 70% AND No subject < 50% max score
 */
export function evaluateLessonTest(scores: LessonTestScores): EvaluationResult {
    const totalScore = scores.vocab + scores.grammar + scores.reading + scores.listening;
    const maxScore = 100;

    const passedTotal = totalScore >= 70;

    const passedVocab = scores.vocab >= (LESSON_MAX_SCORES.vocab * 0.5);
    const passedGrammar = scores.grammar >= (LESSON_MAX_SCORES.grammar * 0.5);
    const passedReading = scores.reading >= (LESSON_MAX_SCORES.reading * 0.5);
    const passedListening = scores.listening >= (LESSON_MAX_SCORES.listening * 0.5);

    const passed = passedTotal && passedVocab && passedGrammar && passedReading && passedListening;

    let reason = '';
    if (!passed) {
        const reasons = [];
        if (!passedTotal) reasons.push(`Total < 70 (${totalScore})`);
        if (!passedVocab) reasons.push(`Vocab < 50%`);
        if (!passedGrammar) reasons.push(`Grammar < 50%`);
        if (!passedReading) reasons.push(`Reading < 50%`);
        if (!passedListening) reasons.push(`Listening < 50%`);
        reason = reasons.join(', ');
    }

    return {
        passed,
        totalScore,
        totalMaxScore: maxScore,
        reason,
        details: {
            vocab: { score: scores.vocab, max: LESSON_MAX_SCORES.vocab, passed: passedVocab },
            grammar: { score: scores.grammar, max: LESSON_MAX_SCORES.grammar, passed: passedGrammar },
            reading: { score: scores.reading, max: LESSON_MAX_SCORES.reading, passed: passedReading },
            listening: { score: scores.listening, max: LESSON_MAX_SCORES.listening, passed: passedListening },
        }
    };
}

/**
 * 2. Comprehensive Test Evaluation
 * Rule: Pass if Total >= 70% AND No subject < 50% max score
 */
export function evaluateComprehensiveTest(scores: ComprehensiveTestScores): EvaluationResult {
    const totalScore = scores.vocab + scores.grammar + scores.reading + scores.listening;
    const maxScore = 100;

    const passedTotal = totalScore >= 70;

    const passedVocab = scores.vocab >= (COMP_MAX_SCORES.vocab * 0.5);
    const passedGrammar = scores.grammar >= (COMP_MAX_SCORES.grammar * 0.5);
    const passedReading = scores.reading >= (COMP_MAX_SCORES.reading * 0.5);
    const passedListening = scores.listening >= (COMP_MAX_SCORES.listening * 0.5);

    const passed = passedTotal && passedVocab && passedGrammar && passedReading && passedListening;

    let reason = '';
    if (!passed) {
        const reasons = [];
        if (!passedTotal) reasons.push(`Total < 70 (${totalScore})`);
        if (!passedVocab) reasons.push(`Vocab < 50%`);
        if (!passedGrammar) reasons.push(`Grammar < 50%`);
        if (!passedReading) reasons.push(`Reading < 50%`);
        if (!passedListening) reasons.push(`Listening < 50%`);
        reason = reasons.join(', ');
    }

    return {
        passed,
        totalScore,
        totalMaxScore: maxScore,
        reason,
        details: {
            vocab: { score: scores.vocab, max: COMP_MAX_SCORES.vocab, passed: passedVocab },
            grammar: { score: scores.grammar, max: COMP_MAX_SCORES.grammar, passed: passedGrammar },
            reading: { score: scores.reading, max: COMP_MAX_SCORES.reading, passed: passedReading },
            listening: { score: scores.listening, max: COMP_MAX_SCORES.listening, passed: passedListening },
        }
    };
}

/**
 * 3. General Test Evaluation (New)
 * Rule: Pass if Total >= 70% AND No subject < 50% max score
 */
export function evaluateGeneralTest(scores: GeneralTestScores): EvaluationResult {
    const totalScore = scores.vocab + scores.grammar + scores.reading + scores.listening;
    const maxScore = 100;

    const passedTotal = totalScore >= 70;

    const passedVocab = scores.vocab >= (GENERAL_MAX_SCORES.vocab * 0.5);
    const passedGrammar = scores.grammar >= (GENERAL_MAX_SCORES.grammar * 0.5);
    const passedReading = scores.reading >= (GENERAL_MAX_SCORES.reading * 0.5);
    const passedListening = scores.listening >= (GENERAL_MAX_SCORES.listening * 0.5);

    const passed = passedTotal && passedVocab && passedGrammar && passedReading && passedListening;

    let reason = '';
    if (!passed) {
        const reasons = [];
        if (!passedTotal) reasons.push(`Total < 70 (${totalScore})`);
        if (!passedVocab) reasons.push(`Vocab < 50%`);
        if (!passedGrammar) reasons.push(`Grammar < 50%`);
        if (!passedReading) reasons.push(`Reading < 50%`);
        if (!passedListening) reasons.push(`Listening < 50%`);
        reason = reasons.join(', ');
    }

    return {
        passed,
        totalScore,
        totalMaxScore: maxScore,
        reason,
        details: {
            vocab: { score: scores.vocab, max: GENERAL_MAX_SCORES.vocab, passed: passedVocab },
            grammar: { score: scores.grammar, max: GENERAL_MAX_SCORES.grammar, passed: passedGrammar },
            reading: { score: scores.reading, max: GENERAL_MAX_SCORES.reading, passed: passedReading },
            listening: { score: scores.listening, max: GENERAL_MAX_SCORES.listening, passed: passedListening },
        }
    };
}

/**
 * 3. JLPT Evaluation
 */
export function evaluateJLPTTest(level: JLPTLevel, scores: JLPTSectionScores): EvaluationResult {
    // Reading is now merged into Grammar per user request
    const totalScore = scores.vocab + scores.grammar + scores.listening;
    const totalMaxScore = 180;

    // Pass Thresholds
    let passThreshold = 100; // Default N1
    if (level === 'N5') passThreshold = 80;
    else if (level === 'N4') passThreshold = 90;
    else if (level === 'N3') passThreshold = 95;
    else if (level === 'N2') passThreshold = 90;

    // Component Thresholds (Simplified to 3 sections)
    // For 180 total, common min is 19/60 per section for N1-N3, but since it's gộp we'll use a consistent min
    const componentThreshold = 19;

    const passedTotal = totalScore >= passThreshold;
    const passedVocab = scores.vocab >= componentThreshold;
    const passedGrammar = scores.grammar >= componentThreshold;
    const passedListening = scores.listening >= componentThreshold;

    const passed = passedTotal && passedVocab && passedGrammar && passedListening;

    let reason = '';
    if (!passed) {
        const reasons = [];
        if (!passedTotal) reasons.push(`Total < ${passThreshold} (${totalScore})`);
        if (!passedVocab) reasons.push(`Vocab < ${componentThreshold}`);
        if (!passedGrammar) reasons.push(`Grammar < ${componentThreshold}`);
        if (!passedListening) reasons.push(`Listening < ${componentThreshold}`);
        reason = reasons.join(', ');
    }

    // Simplified Max Scores for UI details (60 per section)
    const maxVocab = 60, maxGrammar = 60, maxListening = 60;

    return {
        passed,
        totalScore,
        totalMaxScore,
        reason,
        details: {
            vocab: { score: scores.vocab, max: maxVocab, passed: passedVocab },
            grammar: { score: scores.grammar, max: maxGrammar, passed: passedGrammar },
            listening: { score: scores.listening, max: maxListening, passed: passedListening },
        }
    };
}
