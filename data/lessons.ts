import { Lesson, MapNode, Badge, PracticeCategory } from '../types';

export const INITIAL_USER_STATE = {
    name: "Maria Maria",
    enrollmentNo: "1075121286",
    accessPin: "1234",
    school: "Nasugbu West Central School",
    streak: 12,
    progress: 10,
    performanceRate: 94,
    lessonsCompletedCount: 1,
    familiarity: null, // to be determined by assessment
    earnedBadges: ['early_bird', 'ten_day', 'high_flyer'], // pre-unlocked as per screenshot showing 6/24 total badges (wait, the screen shows 6 badges in the visual: Early Bird, 10-day streak, High flyer, Master signer, Perfect score, First sign badge (the outline represents unlocked or highlighting? Let's make "early_bird", "ten_day", "high_flyer" unlocked by default, and user unlocks "first_sign" on lesson completion!))
    tutorialsCompleted: [],
    currentUnit: "Unit 1: Basics",
};

export const ALL_BADGES: Badge[] = [
    {
        id: 'early_bird',
        name: 'EARLY BIRD',
        description: 'Complete a sign language lesson before 8:00 AM!',
        category: 'Daily Routine',
        unlockedAt: '2026-06-20',
        iconType: 'early_bird'
    },
    {
        id: 'ten_day',
        name: '10-DAY STREAK',
        description: 'Keep your sign practice sharp for 10 consecutive days.',
        category: 'Consistency',
        unlockedAt: '2026-06-15',
        iconType: 'ten_day'
    },
    {
        id: 'high_flyer',
        name: 'HIGH FLYER',
        description: 'Score 100% on any five fingerspelling quizzes.',
        category: 'Precision',
        unlockedAt: '2026-06-18',
        iconType: 'high_flyer'
    },
    {
        id: 'master_signer',
        name: 'MASTER SIGNER',
        description: 'Complete all levels in the FSL basic module.',
        category: 'Progress',
        unlockedAt: null,
        iconType: 'master_signer'
    },
    {
        id: 'perfect_score',
        name: 'PERFECT SCORE',
        description: 'Get a flawless score in any FSL conversation quiz.',
        category: 'Precision',
        unlockedAt: null,
        iconType: 'perfect_score'
    },
    {
        id: 'first_sign',
        name: 'FIRST SIGN',
        description: 'Complete your first ever Filipino Sign Language lesson.',
        category: 'Milestones',
        unlockedAt: null, // to be unlocked by user
        iconType: 'first_sign'
    }
];

export const MAP_NODES: MapNode[] = [
    {
        id: 'node_1',
        title: 'ALPHABETS (PART 1)',
        type: 'alphabet',
        status: 'completed',
        icon: 'AB'
    },
    {
        id: 'node_2',
        title: 'ALPHABETS (PART 2)',
        type: 'alphabet',
        status: 'completed',
        icon: 'CD'
    },
    {
        id: 'node_3',
        title: 'GREETINGS',
        type: 'greetings',
        status: 'active',
        icon: '👋'
    },
    {
        id: 'node_4',
        title: 'CHEST CHALLENGE',
        type: 'challenge',
        status: 'locked',
        icon: '🎁'
    }
];

export const PRACTICE_CATEGORIES: PracticeCategory[] = [
    {
        id: 'prac_alphabet',
        title: 'Alphabet',
        subtitle: 'Fingerspelling',
        shortLabel: 'ABC',
        progress: 20,
        isLocked: false,
        totalItems: 26,
        iconName: 'book-open'
    },
    {
        id: 'prac_numbers',
        title: 'Numbers',
        subtitle: 'Counting 1-100',
        shortLabel: '123',
        progress: 1,
        isLocked: false,
        totalItems: 100,
        iconName: 'hash'
    },
    {
        id: 'prac_words',
        title: 'Basic Words',
        subtitle: 'Everyday greetings & descriptors',
        shortLabel: '💬',
        progress: 0,
        isLocked: true,
        totalItems: 45,
        iconName: 'message-circle'
    },
    {
        id: 'prac_sentences',
        title: 'Sentences',
        subtitle: 'Structuring basic phrases',
        shortLabel: '📝',
        progress: 0,
        isLocked: true,
        totalItems: 20,
        iconName: 'file-text'
    }
];

// Complete Module 1 details and quiz configuration
export const MODULE_1_LESSON: Lesson = {
    id: 'lesson_module_1',
    moduleNo: 1,
    title: 'Alphabets (Part 1)',
    subtitle: 'Begin with lessons matched to your skill level.',
    type: 'alphabet',
    durationMin: 5,
    badgeReward: {
        id: 'first_sign',
        name: 'First Sign Badge',
        emoji: '⭐'
    },
    steps: [
        {
            id: 'step_intro',
            type: 'intro',
            title: 'Module 1',
            subtitle: 'What is FSL?',
            illustrationType: 'fsl_intro',
            headingText: 'FSL Alphabets',
            bodyText: 'Filipino Sign Language (FSL) is a visual language used by the Deaf community in the Philippines. In FSL, each letter has a hand sign. These are used for spelling names and words.\n\nLet\'s learn how to communicate using Filipino sign language!'
        },
        {
            id: 'step_letter_a',
            type: 'teaching_card',
            title: 'Letter A',
            illustrationType: 'letter_a',
            bodyText: 'This is how you sign the letter A.'
        },
        {
            id: 'step_letter_b',
            type: 'teaching_card',
            title: 'Letter B',
            illustrationType: 'letter_b',
            bodyText: 'This is how you sign the letter B.'
        },
        {
            id: 'step_quiz_1',
            type: 'quiz',
            title: 'Practice Quiz',
            quizQuestion: {
                id: 'quiz_a',
                signType: 'Alphabet',
                targetValue: 'A',
                signImageName: 'letter_a',
                questionText: 'What letter is this sign?',
                options: [
                    { id: 'opt_a', text: "Letter 'A'", isCorrect: true },
                    { id: 'opt_b', text: "Letter 'B'", isCorrect: false },
                    { id: 'opt_c', text: "Letter 'C'", isCorrect: false }
                ],
                successMessage: 'Good Job! That is how we sign A!'
            }
        }
    ]
};
