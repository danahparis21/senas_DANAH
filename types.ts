/**
 * Types and interfaces for the Señas Filipino Sign Language (FSL) application.
 */

export type UserRole = 'Student' | 'Teacher' | null;

export type FamiliarityLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export type ActiveScreen =
    | 'splash'
    | 'userSelection'
    | 'studentLogin'
    | 'teacherLogin'
    | 'familiarityAssessment'
    | 'levelConfirmation'
    | 'appShell' // Main tabbed shell
    | 'activeLesson'; // Full screen lesson view

export type MainTab = 'home' | 'map' | 'practice' | 'achievements' | 'profile';

export interface UserState {
    name: string;
    enrollmentNo: string; // LRN
    accessPin: string;
    school: string;
    streak: number;
    progress: number; // overall percentage (0 - 100)
    performanceRate: number; // e.g., 94%
    lessonsCompletedCount: number;
    familiarity: FamiliarityLevel | null;
    earnedBadges: string[]; // Badge IDs
    tutorialsCompleted: string[]; // Keep track of onboarding steps shown
    currentUnit: string;
}

export interface QuizOption {
    id: string;
    text: string;
    isCorrect: boolean;
}

export interface QuizQuestion {
    id: string;
    signType: string; // e.g. "Alphabet"
    targetValue: string; // e.g. "A"
    signImageName: string; // name key for matching hand sign drawing
    questionText: string;
    options: QuizOption[];
    successMessage?: string;
}

export interface LessonStep {
    id: string;
    type: 'intro' | 'teaching_card' | 'quiz';
    title: string;
    subtitle?: string;
    illustrationType?: 'fsl_intro' | 'letter_a' | 'letter_b' | 'letter_c' | 'letter_d' | 'letter_e';
    headingText?: string;
    bodyText?: string;
    quizQuestion?: QuizQuestion;
}

export interface Lesson {
    id: string;
    moduleNo: number;
    title: string;
    subtitle: string;
    type: 'alphabet' | 'numbers' | 'greetings' | 'sentences';
    durationMin: number;
    badgeReward: {
        id: string;
        name: string;
        emoji: string;
    };
    steps: LessonStep[];
}

export interface PracticeCategory {
    id: string;
    title: string;
    subtitle: string;
    shortLabel: string; // ABC, 123, emoji
    progress: number; // 0 - 100
    isLocked: boolean;
    totalItems: number;
    iconName: string;
}

export interface MapNode {
    id: string;
    title: string;
    type: 'alphabet' | 'numbers' | 'greetings' | 'challenge';
    status: 'completed' | 'active' | 'locked';
    icon: string; // Lucide or custom emoji tag
}

export interface Badge {
    id: string;
    name: string;
    description: string;
    category: string;
    unlockedAt: string | null;
    iconType: 'early_bird' | 'ten_day' | 'high_flyer' | 'master_signer' | 'perfect_score' | 'first_sign';
}
