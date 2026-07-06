// app/lesson/[id].tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, Pressable,
  ScrollView, Modal, ActivityIndicator, Animated, Dimensions, StatusBar, Easing
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Image } from 'expo-image';
import Svg, { Path, Circle, Polyline, Line, Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import ConfettiCannon from 'react-native-confetti-cannon';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// ── GRADIENT COLORS ──────────────────────────────────────────────────
const GRADIENT = {
  start: '#87CEEB',
  mid: '#B3E5FC',
  mid2: '#E3F2FD',
  end: '#F5F9FF',
};

// ── ANIMATED CLOUD ───────────────────────────────────────────────────
function AnimatedCloud({ scale = 1, opacity = 0.4 }) {
  return (
    <Svg width={120 * scale} height={60 * scale} viewBox="0 0 120 60" opacity={opacity}>
      <Defs>
        <LinearGradient id="cloudGrad" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
          <Stop offset="100%" stopColor="#E0F2FE" stopOpacity="0.5" />
        </LinearGradient>
      </Defs>
      <Path
        d="M20 40 C10 40 5 30 12 22 C8 12 20 5 30 10 C38 2 52 2 60 8 C68 3 80 5 85 14 C95 12 105 18 100 28 C110 35 108 48 95 50 L25 50 C18 50 14 45 20 40Z"
        fill="url(#cloudGrad)"
      />
    </Svg>
  );
}

// ─── CHARACTERS ──────────────────────────────────────────────────────
const CHARACTERS = {
  senya: {
    name: 'Senya',
    image: require('../../assets/images/new_characters/senya.png'),
    accent: '#2E7FE8',
    accentLight: 'rgba(46, 127, 232, 0.10)',
  },
  flora: {
    name: 'Flora',
    image: require('../../assets/images/new_characters/flora.png'),
    accent: '#FF6EB4',
    accentLight: 'rgba(255, 110, 180, 0.10)',
  },
  catto: {
    name: 'Catto',
    image: require('../../assets/images/new_characters/catto.png'),
    accent: '#FFD700',
    accentLight: 'rgba(255, 215, 0, 0.10)',
  },
};

// ─── QUIZ RESULT SOUND ──────────────────────────────────────────────
const QUIZ_RESULT_SOUND = require('../../assets/music/quiz-result.mp3');
const CORRECT_SOUND = require('../../assets/music/correct.mp3');
const WRONG_SOUND = require('../../assets/music/wrong.mp3');

// ─── MOCK DATA ──────────────────────────────────────────────────────
const MOCK_LESSON = {
  lesson_id: 1,
  title: 'Introduction to FSL',
  description: 'Learn the basics of Filipino Sign Language',
  lesson_type: 'alphabet',
  difficulty: 'Beginner',
  status: 'active',
  total_steps: 5,
  assignment_status: 'assigned',
  progress: {
    current_step: 0,
    lesson_completed: false,
    quiz_completed: false,
    quiz_score: null,
  },
  contents: [
    {
      content_id: 1,
      step_number: 1,
      content_type: 'text',
      title: 'What is FSL?',
      content_text: 'Filipino Sign Language (FSL) is the official sign language of the Philippines, recognized by law in 2018. It is a complete, natural language with its own grammar and vocabulary — distinct from English or American Sign Language.',
      media_url: null,
      gesture_name: null,
    },
    {
      content_id: 2,
      step_number: 2,
      content_type: 'text',
      title: 'The FSL Alphabet',
      content_text: 'The FSL manual alphabet uses handshapes to represent each letter. Fingerspelling allows you to spell out words letter-by-letter — it\'s the foundation for learning FSL vocabulary.',
      media_url: null,
      gesture_name: null,
    },
    {
      content_id: 3,
      step_number: 3,
      content_type: 'text',
      title: 'Greetings in FSL',
      content_text: 'Common greetings like "Hello", "Goodbye", "Thank You", and "Please" are among the first signs to learn. They open the door to everyday conversation with the Deaf community.',
      media_url: null,
      gesture_name: null,
    },
    {
      content_id: 4,
      step_number: 4,
      content_type: 'text',
      title: 'Why Learn FSL?',
      content_text: 'There are over 1 million Deaf Filipinos. Learning FSL promotes inclusion, bridges communication gaps, and shows respect for Deaf culture. Even basic signs can make a meaningful difference.',
      media_url: null,
      gesture_name: null,
    },
  ],
  quiz: {
    quiz_id: 1,
    title: 'FSL Basics Quiz',
    description: 'Test your knowledge of FSL basics',
    total_points: 5,
    passing_score: 60,
    questions: [
      {
        question_id: 1,
        question_number: 1,
        question_type: 'multiple_choice',
        question_text: "Which sign represents the letter 'A' in FSL?",
        media_url: null,
        points: 1,
        options: [
          { option_id: 1, option_text: 'Closed fist, thumb on side', is_correct: true },
          { option_id: 2, option_text: 'Open hand, fingers spread', is_correct: false },
          { option_id: 3, option_text: 'Index finger pointing up', is_correct: false },
          { option_id: 4, option_text: 'Peace sign', is_correct: false },
        ]
      },
      {
        question_id: 2,
        question_number: 2,
        question_type: 'multiple_choice',
        question_text: 'What does the open hand wave gesture mean?',
        media_url: null,
        points: 1,
        options: [
          { option_id: 5, option_text: 'Goodbye', is_correct: false },
          { option_id: 6, option_text: 'Hello / Hi', is_correct: true },
          { option_id: 7, option_text: 'Thank you', is_correct: false },
          { option_id: 8, option_text: 'I love you', is_correct: false },
        ]
      },
      {
        question_id: 3,
        question_number: 3,
        question_type: 'multiple_choice',
        question_text: "Which sign means 'Thank You' in FSL?",
        media_url: null,
        points: 1,
        options: [
          { option_id: 9, option_text: 'Clapping hands', is_correct: false },
          { option_id: 10, option_text: 'Open hand moving forward from chin', is_correct: true },
          { option_id: 11, option_text: 'Thumbs up', is_correct: false },
          { option_id: 12, option_text: 'Index finger tapping chest', is_correct: false },
        ]
      },
      {
        question_id: 4,
        question_number: 4,
        question_type: 'multiple_choice',
        question_text: "How do you sign the letter 'B' in FSL?",
        media_url: null,
        points: 1,
        options: [
          { option_id: 13, option_text: 'Closed fist', is_correct: false },
          { option_id: 14, option_text: 'Four fingers up, thumb across palm', is_correct: true },
          { option_id: 15, option_text: 'Peace sign', is_correct: false },
          { option_id: 16, option_text: 'OK sign', is_correct: false },
        ]
      },
      {
        question_id: 5,
        question_number: 5,
        question_type: 'multiple_choice',
        question_text: "What is the sign for 'Please' in FSL?",
        media_url: null,
        points: 1,
        options: [
          { option_id: 17, option_text: 'Flat hand circling chest', is_correct: true },
          { option_id: 18, option_text: 'Fist pounding chest', is_correct: false },
          { option_id: 19, option_text: 'Two fingers tapping chin', is_correct: false },
          { option_id: 20, option_text: 'Open hand waving', is_correct: false },
        ]
      },
    ]
  }
};

// ─── SVG Icons ──────────────────────────────────────────────────────────────
function CheckCircleIcon({ color = '#10B981' }: { color?: string }) {
  return <Svg width="18" height="18" viewBox="0 0 24 24" fill="none"><Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" /><Polyline points="8 12 11 15 16 9" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></Svg>;
}
function XCircleIcon({ color = '#EF4444' }: { color?: string }) {
  return <Svg width="18" height="18" viewBox="0 0 24 24" fill="none"><Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" /><Line x1="15" y1="9" x2="9" y2="15" stroke={color} strokeWidth="2.5" strokeLinecap="round" /><Line x1="9" y1="9" x2="15" y2="15" stroke={color} strokeWidth="2.5" strokeLinecap="round" /></Svg>;
}
function HomeIcon({ size = 16, color = '#fff' }: { size?: number; color?: string }) {
  return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><Path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><Polyline points="9 22 9 12 15 12 15 22" /></Svg>;
}
function RefreshIcon({ size = 15, color = '#2E7FE8' }: { size?: number; color?: string }) {
  return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><Path d="M23 4v6h-6" /><Path d="M1 20v-6h6" /><Path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" /></Svg>;
}
function BookIcon({ size = 16, color = '#2E7FE8' }: { size?: number; color?: string }) {
  return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><Path d="M4 6h16v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6z" /><Path d="M8 2v4" /><Path d="M16 2v4" /></Svg>;
}

// ─── Exit Modal ──────────────────────────────────────────────────────────────
function ExitModal({ visible, onClose, onConfirm }: { visible: boolean; onClose: () => void; onConfirm: () => void }) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={s.overlay} onPress={onClose}>
        <Pressable style={s.exitModal} onPress={e => e.stopPropagation()}>
          <View style={s.exitIconBox}>
            <Ionicons name="exit-outline" size={28} color="#DC2626" />
          </View>
          <Text style={s.exitTitle}>Exit Lesson?</Text>
          <Text style={s.exitDesc}>Your progress will be saved. Are you sure you want to exit?</Text>
          <View style={s.exitBtns}>
            <Pressable style={s.stayBtn} onPress={onClose}>
              <Text style={s.stayText}>Stay</Text>
            </Pressable>
            <Pressable style={s.exitConfirmBtn} onPress={onConfirm}>
              <Text style={s.exitConfirmText}>Exit</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function LessonViewer() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [loading, setLoading] = useState<boolean>(false);
  const [lesson, setLesson] = useState<any>(null);
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [quizResult, setQuizResult] = useState<{
    score: number; total: number; percentage: number;
    xpEarned: number; totalXp: number; level: number; streakDays: number;
  } | null>(null);
  const [showExitModal, setShowExitModal] = useState<boolean>(false);
  const [confettiFired, setConfettiFired] = useState(false);
  const confettiRef = useRef<any>(null);
  const resultsFadeAnim = useRef(new Animated.Value(0)).current;
  const resultsScaleAnim = useRef(new Animated.Value(0.85)).current;
  const parallelScrollY = useRef(new Animated.Value(0)).current;
  const resultsScrollRef = useRef<any>(null);

  // ── Audio state ──
  const [resultSound, setResultSound] = useState<Audio.Sound | null>(null);
  const [correctSound, setCorrectSound] = useState<Audio.Sound | null>(null);
  const [wrongSound, setWrongSound] = useState<Audio.Sound | null>(null);

  // Mock leaderboard
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [userRank, setUserRank] = useState<number | null>(null);

  // Quiz state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [questionRevealed, setQuestionRevealed] = useState<boolean>(false);
  const [currentScore, setCurrentScore] = useState<number>(0);
  const [isSoundPlaying, setIsSoundPlaying] = useState<boolean>(false);

  // ── Play correct answer sound ──
  async function playCorrectSound() {
    try {
      // Don't play if a sound is already playing
      if (isSoundPlaying) return;

      setIsSoundPlaying(true);

      // Unload any existing sound
      if (correctSound) {
        await correctSound.unloadAsync();
      }

      const { sound } = await Audio.Sound.createAsync(
        CORRECT_SOUND,
        {
          shouldPlay: true,
          isLooping: false,
          volume: 0.7,
        }
      );

      setCorrectSound(sound);

      // Auto-cleanup after playback
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          sound.unloadAsync();
          setCorrectSound(null);
          setIsSoundPlaying(false);
        }
      });

    } catch (error) {
      console.error('Failed to play correct sound:', error);
      setIsSoundPlaying(false);
    }
  }

  // ── Play wrong answer sound ──
  async function playWrongSound() {
    try {
      // Don't play if a sound is already playing
      if (isSoundPlaying) return;

      setIsSoundPlaying(true);

      // Unload any existing sound
      if (wrongSound) {
        await wrongSound.unloadAsync();
      }

      const { sound } = await Audio.Sound.createAsync(
        WRONG_SOUND,
        {
          shouldPlay: true,
          isLooping: false,
          volume: 0.7,
        }
      );

      setWrongSound(sound);

      // Auto-cleanup after playback
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          sound.unloadAsync();
          setWrongSound(null);
          setIsSoundPlaying(false);
        }
      });

    } catch (error) {
      console.error('Failed to play wrong sound:', error);
      setIsSoundPlaying(false);
    }
  }

  // ── Play quiz result sound ──
  async function playResultSound() {
    try {
      // Unload any existing sound
      if (resultSound) {
        await resultSound.unloadAsync();
      }

      const { sound } = await Audio.Sound.createAsync(
        QUIZ_RESULT_SOUND,
        {
          shouldPlay: true,
          isLooping: false,
          volume: 0.8,
        }
      );

      setResultSound(sound);

      // Auto-cleanup after playback
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          sound.unloadAsync();
          setResultSound(null);
        }
      });

    } catch (error) {
      console.error('Failed to play result sound:', error);
    }
  }

  // ── Cloud Animations ──
  const cloud1Anim = useRef(new Animated.Value(-200)).current;
  const cloud2Anim = useRef(new Animated.Value(screenWidth + 200)).current;
  const cloud3Anim = useRef(new Animated.Value(-250)).current;
  const cloud4Anim = useRef(new Animated.Value(screenWidth + 250)).current;
  const sunAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const startCloud1 = () => {
      cloud1Anim.setValue(-200);
      Animated.timing(cloud1Anim, {
        toValue: screenWidth + 200,
        duration: 45000,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start(() => startCloud1());
    };
    startCloud1();

    Animated.loop(
      Animated.sequence([
        Animated.timing(sunAnim, { toValue: 1, duration: 3000, easing: Easing.inOut(Easing.ease), useNativeDriver: false }),
        Animated.timing(sunAnim, { toValue: 0, duration: 3000, easing: Easing.inOut(Easing.ease), useNativeDriver: false }),
      ])
    ).start();

    setLesson(MOCK_LESSON);

    const mockLeaderboard = [
      { rank: 1, student_id: 1, name: 'Maria Santos', username: 'maria_s', best_score: 100, attempts: 1, is_me: false, initials: 'MS', xp_earned: 50 },
      { rank: 2, student_id: 2, name: 'Juan Dela Cruz', username: 'juan_d', best_score: 96, attempts: 2, is_me: false, initials: 'JD', xp_earned: 48 },
      { rank: 3, student_id: 3, name: 'Jose Rizal', username: 'jose_r', best_score: 90, attempts: 1, is_me: false, initials: 'JR', xp_earned: 45 },
      { rank: 4, student_id: 4, name: 'Andres Bonifacio', username: 'andres_b', best_score: 84, attempts: 3, is_me: false, initials: 'AB', xp_earned: 42 },
      { rank: 5, student_id: 5, name: 'Gabriela Silang', username: 'gabriela_s', best_score: 80, attempts: 2, is_me: false, initials: 'GS', xp_earned: 40 },
      { rank: 6, student_id: 6, name: 'You', username: 'student', best_score: 0, attempts: 0, is_me: true, initials: '👤', xp_earned: 0 },
    ];
    setLeaderboard(mockLeaderboard);
    setUserRank(null);

    // ── Cleanup sounds on unmount ──
    return () => {
      if (resultSound) {
        resultSound.unloadAsync();
      }
      if (correctSound) {
        correctSound.unloadAsync();
      }
      if (wrongSound) {
        wrongSound.unloadAsync();
      }
    };
  }, []);

  useEffect(() => {
    if (quizSubmitted && quizResult) {
      // ── Play the result sound when quiz results are shown ──
      playResultSound();

      resultsFadeAnim.setValue(0);
      resultsScaleAnim.setValue(0.85);

      Animated.parallel([
        Animated.timing(resultsFadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true
        }),
        Animated.spring(resultsScaleAnim, {
          toValue: 1,
          friction: 6,
          tension: 80,
          useNativeDriver: true
        }),
      ]).start();

      if (quizResult.percentage >= 60 && !confettiFired) {
        setTimeout(() => {
          confettiRef.current?.start();
          setConfettiFired(true);
        }, 400);
      }

      const updatedLeaderboard = leaderboard.map(item => {
        if (item.is_me) {
          return { ...item, best_score: quizResult.percentage, attempts: item.attempts + 1 };
        }
        return item;
      }).sort((a, b) => b.best_score - a.best_score)
        .map((item, index) => ({ ...item, rank: index + 1 }));

      setLeaderboard(updatedLeaderboard);
      const userRank = updatedLeaderboard.findIndex(item => item.is_me) + 1;
      setUserRank(userRank > 0 ? userRank : null);
    }
  }, [quizSubmitted, quizResult]);

  const handleSlideChange = async (newSlide: number): Promise<void> => {
    setCurrentSlide(newSlide);
  };

  const handleExit = () => {
    setShowExitModal(false);
    router.dismiss();
  };

  const handleOptionSelect = async (optionIndex: number) => {
    if (questionRevealed) return;
    setSelectedOption(optionIndex);
    setQuestionRevealed(true);

    const questions = lesson?.quiz?.questions || [];
    const currentQ = questions[currentQuestionIndex];
    const isCorrect = optionIndex === currentQ?.options.findIndex((o: any) => o.is_correct);

    // ── Play the appropriate sound based on correctness ──
    if (isCorrect) {
      await playCorrectSound();
      setCurrentScore(s => s + 1);
    } else {
      await playWrongSound();
    }
  };

  const handleNextQuestion = () => {
    const questions = lesson?.quiz?.questions || [];
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(i => i + 1);
      setSelectedOption(null);
      setQuestionRevealed(false);
    } else {
      submitQuiz();
    }
  };

  const submitQuiz = async (): Promise<void> => {
    if (!lesson || !lesson.quiz) return;
    const questions = lesson.quiz.questions;
    const score = currentScore;
    const totalPoints = questions.length;
    const percentage = Math.round((score / totalPoints) * 100);
    const xpEarned = score * 10;

    setQuizResult({
      score,
      total: totalPoints,
      percentage,
      xpEarned,
      totalXp: 100 + xpEarned,
      level: 2,
      streakDays: 3,
    });
    setQuizSubmitted(true);
  };

  // ─── Loading ─────────────────────────────────────────────────────
  if (loading) {
    return (
      <SafeAreaView style={s.loadingContainer}>
        <View style={s.loadingInner}>
          <ActivityIndicator size="large" color="#2E7FE8" />
          <Text style={s.loadingText}>Loading lesson...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!lesson) {
    return (
      <SafeAreaView style={s.loadingContainer}>
        <Text style={s.errorText}>Lesson not found</Text>
        <Pressable onPress={() => router.back()} style={s.errorBackBtn}>
          <Text style={s.errorBackBtnText}>← Go Back</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const totalSlides = lesson.total_steps;
  const isQuizSlide = currentSlide >= lesson.contents.length;
  const passed = (quizResult?.percentage || 0) >= 60;
  const currentQuestion = lesson.quiz?.questions[currentQuestionIndex];
  const slideColor = '#2E7FE8';

  // ─── RENDER: Content Slides ──────────────────────────────────────────────
  const renderContentSlides = () => {
    const content = lesson.contents[currentSlide];
    const character = CHARACTERS.senya;

    return (
      <>
        <View style={s.glassCard}>
          <View style={s.heroRow}>
            <View style={{ flex: 1 }}>
              <View style={[s.moduleBadge, { backgroundColor: character.accentLight }]}>
                <Text style={[s.moduleBadgeText, { color: character.accent }]}>LESSON</Text>
              </View>
              <Text style={s.heroTitle}>{lesson.title}</Text>
              <Text style={s.heroSub}>{lesson.contents.length} slides · {lesson.difficulty || 'Beginner'}</Text>
            </View>
            <Image source={character.image} style={s.senyaHero} contentFit="contain" />
          </View>
        </View>

        <View style={s.dotsRow}>
          {lesson.contents.map((_: any, i: number) => (
            <Pressable key={i} onPress={() => handleSlideChange(i)}>
              <View style={[s.dot, {
                width: i === currentSlide ? 22 : 8,
                backgroundColor: i <= currentSlide ? slideColor : 'rgba(26,44,62,0.15)'
              }]} />
            </Pressable>
          ))}
        </View>

        <View style={[s.glassCard, { minHeight: 180 }]}>
          <View style={[s.slideAccent, { backgroundColor: slideColor }]} />
          <Text style={[s.slideTitle, { color: slideColor }]}>{content.title}</Text>
          <Text style={s.slideBody}>{content.content_text}</Text>
          <Text style={s.slideCounter}>{currentSlide + 1} / {lesson.contents.length}</Text>
        </View>

        <View style={s.tipRow}>
          <Image source={CHARACTERS.senya.image} style={s.tipLogoSm} contentFit="contain" />
          <View style={[s.tipBubble, { borderColor: CHARACTERS.senya.accent + '30' }]}>
            <Text style={s.tipBubbleText}>
              {currentSlide === 0 ? "Hi! I'm Senya. Let's learn about this lesson! 🌟" :
                currentSlide === lesson.contents.length - 1 ? "You're almost ready for the quiz. You've got this! 💪" :
                  "Keep going! You're doing great! ✨"}
            </Text>
          </View>
        </View>

        <View style={s.navRow}>
          {currentSlide > 0 && (
            <Pressable style={s.ghostBtn} onPress={() => handleSlideChange(currentSlide - 1)}>
              <Text style={s.ghostBtnText}>← Back</Text>
            </Pressable>
          )}
          <Pressable
            style={[s.primaryBtn, { backgroundColor: slideColor }, currentSlide === lesson.contents.length - 1 && s.goldBtn, currentSlide > 0 ? { flex: 2 } : { flex: 1 }]}
            onPress={() => {
              if (currentSlide === lesson.contents.length - 1) {
                setCurrentSlide(totalSlides);
              } else {
                handleSlideChange(currentSlide + 1);
              }
            }}
          >
            <Text style={s.primaryBtnText}>
              {currentSlide === lesson.contents.length - 1 ? '🧠 Start Quiz' : 'Next →'}
            </Text>
          </Pressable>
        </View>
      </>
    );
  };

  // ─── RENDER: Quiz ──────────────────────────────────────────
  const renderQuiz = () => {
    if (!lesson.quiz || !currentQuestion) return null;

    if (quizSubmitted) {
      return renderResults();
    }

    const isCorrect = selectedOption !== null && selectedOption === currentQuestion.options.findIndex((o: any) => o.is_correct);
    const totalQuestions = lesson.quiz.questions.length;
    const character = CHARACTERS.senya;

    return (
      <>
        <Pressable style={s.backToLessonBtn} onPress={() => setCurrentSlide(0)}>
          <BookIcon size={16} color="#2E7FE8" />
          <Text style={s.backToLessonText}>← Back to Lesson</Text>
        </Pressable>

        <View style={s.glassCard}>
          <View style={s.progressHeader}>
            <Text style={s.progressLabel}>Question {currentQuestionIndex + 1} of {totalQuestions}</Text>
            <View style={[s.xpBadge, { backgroundColor: character.accentLight }]}>
              <Text style={[s.xpText, { color: character.accent }]}>⚡ {currentScore * 10} XP</Text>
            </View>
          </View>
          <View style={s.progressDots}>
            {lesson.quiz.questions.map((_: any, i: number) => (
              <View key={i} style={[s.progressDot, {
                backgroundColor: i < currentQuestionIndex ? '#22c55e' :
                  i === currentQuestionIndex ? '#2E7FE8' : 'rgba(26,44,62,0.10)'
              }]} />
            ))}
          </View>
        </View>

        <View style={[s.glassCard, s.questionCard]}>
          <Text style={s.questionEmojiSmall}>❓</Text>
          <Text style={s.questionText}>{currentQuestion.question_text}</Text>
        </View>

        {currentQuestion.options.map((opt: any, i: number) => {
          const isSel = selectedOption === i;
          const isCorr = i === currentQuestion.options.findIndex((o: any) => o.is_correct);
          let bgColor = 'rgba(255,255,255,0.62)';
          let borderColor = 'rgba(255,255,255,0.85)';
          let textColor = '#1A2C3E';
          let circleBg = 'rgba(26,44,62,0.08)';

          if (questionRevealed) {
            if (isCorr) { bgColor = 'rgba(236,253,245,0.9)'; borderColor = '#6EE7B7'; textColor = '#065F46'; circleBg = '#10B981'; }
            else if (isSel) { bgColor = 'rgba(254,242,242,0.9)'; borderColor = '#FCA5A5'; textColor = '#991B1B'; circleBg = '#EF4444'; }
            else { bgColor = 'rgba(255,255,255,0.35)'; textColor = '#9CA3AF'; }
          } else if (isSel) {
            bgColor = 'rgba(239,246,255,0.9)'; borderColor = '#93C5FD'; textColor = '#1D4ED8'; circleBg = '#2E7FE8';
          }

          return (
            <Pressable key={`${currentQuestionIndex}-${i}`} style={[s.optionCard, { backgroundColor: bgColor, borderColor }]}
              onPress={() => handleOptionSelect(i)} disabled={questionRevealed}>
              <View style={[s.optionCircle, { backgroundColor: circleBg }]}>
                {questionRevealed && isCorr ? <CheckCircleIcon color="#fff" /> :
                  questionRevealed && isSel && !isCorr ? <XCircleIcon color="#fff" /> :
                    <Text style={[s.optionLetter, { color: isSel ? '#fff' : '#4A5C6E' }]}>{String.fromCharCode(65 + i)}</Text>}
              </View>
              <Text style={[s.optionText, { color: textColor }]}>{opt.option_text}</Text>
            </Pressable>
          );
        })}

        <View style={s.feedbackRow}>
          <Image source={CHARACTERS.senya.image} style={s.senyaFeedback} contentFit="contain" />
          <View style={[s.feedbackBubble, questionRevealed && isCorrect ? s.feedbackCorrect : questionRevealed && !isCorrect ? s.feedbackWrong : {}]}>
            {questionRevealed && isCorrect && <CheckCircleIcon />}
            {questionRevealed && !isCorrect && <XCircleIcon />}
            <Text style={[s.feedbackText, questionRevealed && isCorrect ? { color: '#065f46' } : questionRevealed ? { color: '#991b1b' } : {}]}>
              {questionRevealed
                ? (isCorrect
                  ? (currentQuestion.options.find((o: any) => o.is_correct)?.option_text || 'Correct! 🎉')
                  : (currentQuestion.options.find((o: any) => o.is_correct)?.option_text || 'Incorrect! 😅'))
                : 'Read carefully and pick the best answer!'}
            </Text>
          </View>
        </View>

        {questionRevealed && (
          <Pressable style={[s.primaryBtn, { backgroundColor: '#2E7FE8' }, isCorrect && s.goldBtn]} onPress={handleNextQuestion}>
            <Text style={s.primaryBtnText}>
              {currentQuestionIndex < totalQuestions - 1 ? 'Next Question →' : 'See Results →'}
            </Text>
          </Pressable>
        )}
      </>
    );
  };

  // ─── RENDER: Results ──────────────────────────────────────────
  const renderScoreView = () => {
    const score = quizResult?.score || 0;
    const total = quizResult?.total || 0;
    const pct = quizResult?.percentage || 0;
    const xpEarned = quizResult?.xpEarned || 0;
    const stars = pct === 100 ? 3 : pct >= 80 ? 2 : pct >= 50 ? 1 : 0;

    const { label, color } =
      pct === 100 ? { label: 'Perfect Score!', color: '#F59E0B' } :
        pct >= 80 ? { label: 'Excellent!', color: '#10B981' } :
          pct >= 60 ? { label: 'Good Job!', color: '#2E7FE8' } :
            { label: 'Keep Practicing!', color: '#8B5CF6' };

    return (
      <Animated.View style={[s.resultsContainer, {
        opacity: resultsFadeAnim,
        transform: [{ scale: resultsScaleAnim }],
      }]}>
        <Pressable style={s.backToLessonBtn} onPress={() => {
          setQuizSubmitted(false);
          setCurrentQuestionIndex(0);
          setSelectedOption(null);
          setQuestionRevealed(false);
          setCurrentScore(0);
          setQuizResult(null);
          setConfettiFired(false);
          resultsFadeAnim.setValue(0);
          resultsScaleAnim.setValue(0.85);
          setCurrentSlide(0);
        }}>
          <BookIcon size={16} color="#2E7FE8" />
          <Text style={s.backToLessonText}>← Back to Lesson</Text>
        </Pressable>

        <View style={[s.glassCard, { alignItems: 'center', paddingVertical: 28 }]}>
          <Image source={CHARACTERS.senya.image} style={s.resultSenya} contentFit="contain" />

          <View style={[s.scoreCircleBadge, { borderColor: color }]}>
            <Text style={[s.scoreCircleText, { color }]}>{pct}%</Text>
            <Text style={s.scoreCircleSub}>Score</Text>
          </View>

          <View style={s.starsRow}>
            {[1, 2, 3].map(i => (
              <Text key={i} style={[s.star, { opacity: i <= stars ? 1 : 0.15, transform: [{ scale: i <= stars ? 1.25 : 1 }] }]}>
                ⭐
              </Text>
            ))}
          </View>

          <Text style={[s.resultLabel, { color }]}>{label}</Text>
          <Text style={s.scoreSubtitle}>{score} out of {total} correct answers</Text>

          <View style={s.xpEarnedBadge}>
            <Text style={s.xpEarnedText}>⚡ +{xpEarned} XP Earned!</Text>
          </View>

          {userRank && (
            <View style={s.userRankBadge}>
              <Text style={s.userRankText}>🏆 Rank #{userRank} on Leaderboard</Text>
            </View>
          )}
        </View>

        <View style={s.scrollHintContainer}>
          <View style={s.scrollHintPill}>
            <Text style={s.scrollHintText}>👆 Swipe up for the Leaderboard</Text>
            <Svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2E7FE8" strokeWidth="2.5" strokeLinecap="round">
              <Path d="M12 19V5M5 12l7-7 7 7" />
            </Svg>
          </View>
        </View>
      </Animated.View>
    );
  };

  const renderLeaderboardView = () => {
    const rankings = leaderboard;
    const rest = rankings.slice(3);

    const rank1 = rankings.find((r: any) => r.rank === 1) || null;
    const rank2 = rankings.find((r: any) => r.rank === 2) || null;
    const rank3 = rankings.find((r: any) => r.rank === 3) || null;

    let rankPercentileText = "Complete the quiz to see your ranking!";
    let rankNumText = "#—";

    if (userRank && rankings.length > 0) {
      rankNumText = `#${userRank}`;
      const peopleBelow = rankings.length - userRank;
      const percentile = Math.round((peopleBelow / rankings.length) * 100);

      if (userRank === 1) {
        rankPercentileText = `🥇 You're #1! You outscored everyone else!`;
      } else if (userRank === 2) {
        rankPercentileText = `🥈 You're #2! You're in the top tier!`;
      } else if (userRank === 3) {
        rankPercentileText = `🥉 You're #3! Amazing performance!`;
      } else {
        const topPercent = Math.round((userRank / rankings.length) * 100);
        if (topPercent <= 25) {
          rankPercentileText = `📈 You're in the top ${100 - percentile}% — keep pushing!`;
        } else if (topPercent <= 50) {
          rankPercentileText = `👏 You're doing better than ${percentile}% of your classmates!`;
        } else {
          rankPercentileText = `💪 Keep practicing! You're improving!`;
        }
      }
    } else if (rankings.length > 0) {
      rankPercentileText = "You haven't ranked on this leaderboard yet. Try again!";
    }

    // ─── FLAT LEADERBOARD (like [id].tsx) ──────────────────────────────
    return (
      <View style={s.leaderboardContainer}>
        <View style={s.leaderboardHeader}>
          <Text style={s.leaderboardHeaderTitle}>🏆 Leaderboard</Text>
        </View>

        {userRank ? (
          <View style={s.rankBanner}>
            <View style={s.rankBannerLeft}>
              <View style={s.rankBannerNumContainer}>
                <Text style={s.rankBannerNum}>{rankNumText}</Text>
              </View>
              <View style={s.rankBannerDivider} />
              <View style={s.rankBannerContent}>
                <Text style={s.rankBannerMessage}>{rankPercentileText}</Text>
              </View>
            </View>
          </View>
        ) : (
          <View style={[s.rankBanner, { backgroundColor: 'rgba(255,255,255,0.08)' }]}>
            <Text style={[s.rankBannerMessage, { textAlign: 'center', marginBottom: 0 }]}>
              {rankPercentileText}
            </Text>
          </View>
        )}

        {/* ─── FLAT PODIUM ROW ─────────────────────────────────────────── */}
        <View style={s.podiumRow}>
          {/* Rank 2 */}
          <View style={s.podiumCol}>
            {rank2 ? (
              <>
                <Pressable onPress={() => { }}>
                  <View style={[s.podiumAvatar, { backgroundColor: '#9CA3AF' }]}>
                    <Text style={s.podiumAvatarInitials}>{rank2.initials}</Text>
                  </View>
                </Pressable>
                <Text style={s.podiumName} numberOfLines={1}>{rank2.is_me ? 'You' : rank2.name}</Text>
                <View style={s.podiumScoreBadge}>
                  <Text style={s.podiumScoreText}>{rank2.best_score}%</Text>
                </View>
                <View style={[s.podiumBlock, s.podiumBlockSilver]}>
                  <Text style={s.podiumBlockNumber}>2</Text>
                </View>
              </>
            ) : (
              <>
                <View style={[s.podiumAvatar, s.podiumAvatarPlaceholder]}>
                  <Text style={s.podiumAvatarPlaceholderText}>—</Text>
                </View>
                <Text style={s.podiumNamePlaceholder}>TBD</Text>
                <View style={s.podiumScoreBadgePlaceholder}>
                  <Text style={s.podiumScoreTextPlaceholder}>—</Text>
                </View>
                <View style={[s.podiumBlock, s.podiumBlockSilver]}>
                  <Text style={s.podiumBlockNumber}>2</Text>
                </View>
              </>
            )}
          </View>

          {/* Rank 1 */}
          <View style={s.podiumCol}>
            {rank1 ? (
              <>
                <Pressable onPress={() => { }}>
                  <View style={s.crownContainer}>
                    <Text style={{ fontSize: 22 }}>👑</Text>
                  </View>
                  <View style={[s.podiumAvatar, s.podiumAvatarFirst, { backgroundColor: '#F59E0B' }]}>
                    <Text style={s.podiumAvatarInitials}>{rank1.initials}</Text>
                  </View>
                </Pressable>
                <Text style={[s.podiumName, { fontWeight: '800' }]} numberOfLines={1}>{rank1.is_me ? 'You' : rank1.name}</Text>
                <View style={[s.podiumScoreBadge, s.podiumScoreBadgeGold]}>
                  <Text style={[s.podiumScoreText, { color: '#D97706' }]}>{rank1.best_score}%</Text>
                </View>
                <View style={[s.podiumBlock, s.podiumBlockGold]}>
                  <Text style={s.podiumBlockNumber}>1</Text>
                </View>
              </>
            ) : (
              <>
                <View style={[s.podiumAvatar, s.podiumAvatarFirst, s.podiumAvatarPlaceholder]}>
                  <Text style={s.podiumAvatarPlaceholderText}>—</Text>
                </View>
                <Text style={s.podiumNamePlaceholder}>TBD</Text>
                <View style={s.podiumScoreBadgePlaceholder}>
                  <Text style={s.podiumScoreTextPlaceholder}>—</Text>
                </View>
                <View style={[s.podiumBlock, s.podiumBlockGold]}>
                  <Text style={s.podiumBlockNumber}>1</Text>
                </View>
              </>
            )}
          </View>

          {/* Rank 3 */}
          <View style={s.podiumCol}>
            {rank3 ? (
              <>
                <Pressable onPress={() => { }}>
                  <View style={[s.podiumAvatar, { backgroundColor: '#C2410C' }]}>
                    <Text style={s.podiumAvatarInitials}>{rank3.initials}</Text>
                  </View>
                </Pressable>
                <Text style={s.podiumName} numberOfLines={1}>{rank3.is_me ? 'You' : rank3.name}</Text>
                <View style={s.podiumScoreBadge}>
                  <Text style={s.podiumScoreText}>{rank3.best_score}%</Text>
                </View>
                <View style={[s.podiumBlock, s.podiumBlockBronze]}>
                  <Text style={s.podiumBlockNumber}>3</Text>
                </View>
              </>
            ) : (
              <>
                <View style={[s.podiumAvatar, s.podiumAvatarPlaceholder]}>
                  <Text style={s.podiumAvatarPlaceholderText}>—</Text>
                </View>
                <Text style={s.podiumNamePlaceholder}>TBD</Text>
                <View style={s.podiumScoreBadgePlaceholder}>
                  <Text style={s.podiumScoreTextPlaceholder}>—</Text>
                </View>
                <View style={[s.podiumBlock, s.podiumBlockBronze]}>
                  <Text style={s.podiumBlockNumber}>3</Text>
                </View>
              </>
            )}
          </View>
        </View>

        {/* White Curved Card for Rank 4+ */}
        <View style={s.leaderboardListCard}>
          <Text style={s.leaderboardListTitle}>All Rankings</Text>

          {rest.length === 0 ? (
            <Text style={s.noRankingsText}>Only the top 3 are on the board so far!</Text>
          ) : (
            rest.map((r: any, index: number) => (
              <View key={r.student_id} style={[s.rankRow, r.is_me && s.rankRowMe, index < rest.length - 1 && s.rankRowBorder]}>
                <View style={s.listRankCircle}>
                  <Text style={s.listRankText}>{r.rank}</Text>
                </View>

                <View style={[s.listAvatar, r.is_me && { backgroundColor: '#2E7FE8' }]}>
                  <Text style={s.listAvatarText}>{r.initials}</Text>
                </View>

                <View style={s.listNameContainer}>
                  <Text style={[s.listName, r.is_me && s.listNameMe]}>
                    {r.is_me ? 'You' : r.name}
                  </Text>
                  <Text style={s.listAttempts}>{r.attempts} {r.attempts === 1 ? 'try' : 'tries'}</Text>
                </View>

                <Text style={[s.listScoreText, r.is_me && s.listScoreTextMe]}>
                  {r.best_score}%
                </Text>
              </View>
            ))
          )}

          <View style={s.leaderboardActions}>
            <Pressable style={[s.smallBtn, s.smallGhostBtn]} onPress={() => {
              resultsFadeAnim.setValue(0);
              resultsScaleAnim.setValue(0.85);
              setQuizSubmitted(false);
              setCurrentQuestionIndex(0);
              setSelectedOption(null);
              setQuestionRevealed(false);
              setCurrentScore(0);
              setQuizResult(null);
              setConfettiFired(false);
              setCurrentSlide(0);
              resultsScrollRef.current?.scrollTo?.({ y: 0, animated: true });
            }}>
              <RefreshIcon size={14} color="#1A2C3E" />
              <Text style={s.smallBtnText}>Try Again</Text>
            </Pressable>

            <Pressable style={[s.smallBtn, s.smallPrimaryBtn, { backgroundColor: '#2E7FE8' }]} onPress={() => {
              setQuizSubmitted(false);
              setCurrentQuestionIndex(0);
              setSelectedOption(null);
              setQuestionRevealed(false);
              setCurrentScore(0);
              setQuizResult(null);
              setConfettiFired(false);
              resultsFadeAnim.setValue(0);
              resultsScaleAnim.setValue(0.85);
              setCurrentSlide(0);
              router.push('/(tabs)/dashboard');
            }}>
              <HomeIcon size={14} color="#fff" />
              <Text style={[s.smallBtnText, { color: '#fff' }]}>Dashboard</Text>
            </Pressable>
          </View>
        </View>
      </View>
    );
  };

  const renderResults = () => {
    const SCREEN_HEIGHT = Dimensions.get('window').height;
    const scoreTranslateY = parallelScrollY.interpolate({
      inputRange: [0, SCREEN_HEIGHT],
      outputRange: [0, -SCREEN_HEIGHT * 0.15],
      extrapolate: 'clamp',
    });
    const scoreOpacity = parallelScrollY.interpolate({
      inputRange: [0, SCREEN_HEIGHT * 0.25, SCREEN_HEIGHT * 0.5],
      outputRange: [1, 0.75, 0],
      extrapolate: 'clamp',
    });
    const scoreScale = parallelScrollY.interpolate({
      inputRange: [0, SCREEN_HEIGHT * 0.5],
      outputRange: [1, 0.95],
      extrapolate: 'clamp',
    });
    const bgColor = parallelScrollY.interpolate({
      inputRange: [0, SCREEN_HEIGHT * 0.4],
      outputRange: ['#eaf5fd', '#2E7FE8'],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View style={{ flex: 1, backgroundColor: bgColor }}>
        <Animated.ScrollView
          ref={resultsScrollRef}
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 0 }}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: parallelScrollY } } }],
            { useNativeDriver: false }
          )}
        >
          <View style={[s.topBar, { paddingHorizontal: 16, paddingTop: 8 }]}>
            <Text style={[s.logoText, { color: '#1A2C3E' }]}>SEÑAS</Text>
            <Pressable style={s.exitBtn} onPress={() => router.push('/(tabs)/dashboard')}>
              <Text style={s.exitBtnText}>✕ Exit</Text>
            </Pressable>
          </View>

          <Animated.View style={{
            paddingHorizontal: 16,
            paddingBottom: 8,
            opacity: scoreOpacity,
            transform: [{ translateY: scoreTranslateY }, { scale: scoreScale }],
          }}>
            {renderScoreView()}
          </Animated.View>

          <View style={[s.leaderboardSheet, { backgroundColor: '#2E7FE8' }]}>
            <View style={s.sheetHandle} />
            {renderLeaderboardView()}
          </View>
        </Animated.ScrollView>
      </Animated.View>
    );
  };

  const sunGlow = sunAnim.interpolate({ inputRange: [0, 1], outputRange: [0.3, 0.8] });

  return (
    <SafeAreaView style={s.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      {passed && (
        <View style={s.confettiWrapper}>
          <ConfettiCannon
            ref={confettiRef}
            count={160}
            origin={{ x: screenWidth / 2, y: 0 }}
            autoStart={false}
            fadeOut
            explosionSpeed={500}
            fallSpeed={2800}
            colors={['#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF', '#FF6FC8', '#845EC2']}
          />
        </View>
      )}

      <View style={StyleSheet.absoluteFillObject}>
        <Svg width={screenWidth} height={screenHeight}>
          <Defs>
            <LinearGradient id="bgGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor={GRADIENT.start} stopOpacity="1" />
              <Stop offset="30%" stopColor={GRADIENT.mid} stopOpacity="0.9" />
              <Stop offset="70%" stopColor={GRADIENT.mid2} stopOpacity="0.8" />
              <Stop offset="100%" stopColor={GRADIENT.end} stopOpacity="0.9" />
            </LinearGradient>
          </Defs>
          <Rect width={screenWidth} height={screenHeight} fill="url(#bgGrad)" />
        </Svg>
      </View>

      <Animated.View style={[s.sunContainer, { opacity: sunGlow }]}>
        <Svg width="120" height="120" viewBox="0 0 120 120">
          <Circle cx="60" cy="60" r="45" fill="#FCD34D" opacity="0.9" />
          <Circle cx="60" cy="60" r="55" fill="#FCD34D" opacity="0.3" />
          <Circle cx="60" cy="60" r="70" fill="#FCD34D" opacity="0.1" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
            <Rect key={i} x="54" y="5" width="12" height="20" rx="6" fill="#FCD34D" opacity="0.6" transform={`rotate(${angle}, 60, 60)`} />
          ))}
        </Svg>
      </Animated.View>

      <View style={s.floatingSky} pointerEvents="none">
        <Animated.View style={[s.cloudWrapper, { top: 40, transform: [{ translateX: cloud1Anim }] }]}>
          <AnimatedCloud scale={1.5} opacity={0.4} />
        </Animated.View>
        <Animated.View style={[s.cloudWrapper, { top: 180, transform: [{ translateX: cloud2Anim }] }]}>
          <AnimatedCloud scale={1.2} opacity={0.3} />
        </Animated.View>
        <Animated.View style={[s.cloudWrapper, { top: 350, transform: [{ translateX: cloud3Anim }] }]}>
          <AnimatedCloud scale={1.8} opacity={0.35} />
        </Animated.View>
        <Animated.View style={[s.cloudWrapper, { top: 500, transform: [{ translateX: cloud4Anim }] }]}>
          <AnimatedCloud scale={1.3} opacity={0.3} />
        </Animated.View>
      </View>

      <ExitModal visible={showExitModal} onClose={() => setShowExitModal(false)} onConfirm={handleExit} />

      {quizSubmitted ? (
        renderResults()
      ) : (
        <ScrollView contentContainerStyle={s.moduleScroll}>
          <View style={s.topBar}>
            <Text style={s.logoText}>SEÑAS</Text>
            <Pressable style={s.exitBtn} onPress={() => setShowExitModal(true)}>
              <Text style={s.exitBtnText}>✕ Exit</Text>
            </Pressable>
          </View>
          {!isQuizSlide ? renderContentSlides() : renderQuiz()}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent' },

  confettiWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
    pointerEvents: 'none',
    elevation: 9999,
  },

  sunContainer: {
    position: 'absolute',
    top: 40,
    right: -20,
    zIndex: 0,
  },
  floatingSky: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
    overflow: 'hidden',
  },
  cloudWrapper: {
    position: 'absolute',
    left: 0,
  },

  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#eaf5fd' },
  loadingInner: { alignItems: 'center', gap: 12 },
  loadingText: { fontSize: 15, fontWeight: '600', color: '#4A5C6E' },
  errorText: { fontSize: 18, color: '#DC2626', marginBottom: 16, fontWeight: '700' },
  errorBackBtn: { backgroundColor: '#2E7FE8', borderRadius: 12, paddingVertical: 10, paddingHorizontal: 24 },
  errorBackBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },

  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', alignItems: 'center', justifyContent: 'center', padding: 20 },
  exitModal: { width: '88%', maxWidth: 340, backgroundColor: '#FFFFFF', borderRadius: 28, padding: 28, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 20 }, shadowOpacity: 0.18, shadowRadius: 48, elevation: 24 },
  exitIconBox: { width: 60, height: 60, borderRadius: 30, backgroundColor: 'rgba(239,68,68,0.10)', borderWidth: 1.5, borderColor: 'rgba(239,68,68,0.18)', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  exitTitle: { fontSize: 20, fontWeight: '800', color: '#1A2C3E', marginBottom: 8 },
  exitDesc: { fontSize: 13, color: '#6B7280', fontWeight: '500', lineHeight: 20, marginBottom: 24, textAlign: 'center' },
  exitBtns: { flexDirection: 'row', gap: 12, width: '100%' },
  stayBtn: { flex: 1, paddingVertical: 13, backgroundColor: 'rgba(26,44,62,0.07)', borderWidth: 1, borderColor: 'rgba(26,44,62,0.10)', borderRadius: 40, alignItems: 'center' },
  stayText: { fontSize: 14, fontWeight: '700', color: '#1A2C3E' },
  exitConfirmBtn: { flex: 1.3, paddingVertical: 13, backgroundColor: '#DC2626', borderRadius: 40, alignItems: 'center', shadowColor: '#DC2626', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 14, elevation: 8 },
  exitConfirmText: { fontSize: 14, fontWeight: '700', color: '#fff' },

  moduleScroll: { padding: 16, paddingBottom: 60 },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  logoText: { color: '#1A2C3E', fontSize: 22, fontWeight: '900', letterSpacing: 3 },
  exitBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(255,255,255,0.7)', borderRadius: 12, paddingVertical: 6, paddingHorizontal: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.85)' },
  exitBtnText: { fontSize: 13, fontWeight: '700', color: '#4A5C6E' },

  backToLessonBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 4,
    marginBottom: 4,
  },
  backToLessonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2E7FE8',
  },

  glassCard: { backgroundColor: 'rgba(255,255,255,0.75)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)', borderRadius: 20, padding: 18, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 4 },

  heroRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  moduleBadge: { backgroundColor: 'rgba(46,127,232,0.08)', borderRadius: 8, paddingVertical: 4, paddingHorizontal: 10, alignSelf: 'flex-start', marginBottom: 8 },
  moduleBadgeText: { fontSize: 11, fontWeight: '800', color: '#2E7FE8', letterSpacing: 0.5 },
  heroTitle: { fontSize: 20, fontWeight: '800', color: '#1A2C3E', marginBottom: 4 },
  heroSub: { fontSize: 12, color: '#4A5C6E', fontWeight: '500' },
  senyaHero: { width: 80, height: 80, flexShrink: 0 },
  dotsRow: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginBottom: 12 },
  dot: { height: 8, borderRadius: 99 },
  slideAccent: { height: 4, borderRadius: 4, marginBottom: 14, marginHorizontal: -18, marginTop: -18 },
  slideTitle: { fontSize: 17, fontWeight: '800', marginBottom: 10 },
  slideBody: { fontSize: 14, color: '#4A5C6E', lineHeight: 22 },
  slideCounter: { fontSize: 11, color: '#9CA3AF', fontWeight: '600', marginTop: 12, textAlign: 'right' },
  tipRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 10, marginBottom: 14 },
  tipLogoSm: { width: 56, height: 56, flexShrink: 0 },
  tipBubble: { flex: 1, backgroundColor: 'rgba(255,255,255,0.75)', borderWidth: 1, borderRadius: 14, padding: 12 },
  tipBubbleText: { fontSize: 12, color: '#1A2C3E', fontWeight: '500', lineHeight: 18 },
  navRow: { flexDirection: 'row', gap: 10 },
  primaryBtn: { flex: 1, borderRadius: 60, paddingVertical: 14, alignItems: 'center', shadowColor: '#2E7FE8', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 12, elevation: 4 },
  goldBtn: { backgroundColor: '#F59E0B' },
  primaryBtnText: { fontSize: 15, fontWeight: '700', color: '#fff' },
  ghostBtn: { flex: 1, backgroundColor: 'rgba(255,255,255,0.7)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.85)', borderRadius: 60, paddingVertical: 14, alignItems: 'center' },
  ghostBtnText: { fontSize: 15, fontWeight: '700', color: '#1A2C3E' },

  questionEmojiSmall: { fontSize: 28, marginBottom: 8 },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  progressLabel: { fontSize: 12, fontWeight: '700', color: '#1A2C3E' },
  xpBadge: { borderRadius: 99, paddingVertical: 4, paddingHorizontal: 10 },
  xpText: { fontSize: 12, fontWeight: '800' },
  progressDots: { flexDirection: 'row', gap: 4 },
  progressDot: { flex: 1, height: 5, borderRadius: 99 },
  questionCard: { alignItems: 'center', paddingVertical: 24 },
  questionText: { fontSize: 16, fontWeight: '800', color: '#1A2C3E', textAlign: 'center', lineHeight: 24 },
  optionCard: { flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1.5, borderRadius: 16, padding: 13, marginBottom: 8 },
  optionCircle: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  optionLetter: { fontSize: 13, fontWeight: '800' },
  optionText: { flex: 1, fontSize: 14, fontWeight: '600', lineHeight: 20 },
  feedbackRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 10, marginVertical: 12 },
  senyaFeedback: { width: 80, height: 80, flexShrink: 0 },
  feedbackBubble: { flex: 1, flexDirection: 'row', alignItems: 'flex-start', gap: 7, backgroundColor: 'rgba(255,255,255,0.75)', borderWidth: 1, borderRadius: 16, padding: 12 },
  feedbackCorrect: { backgroundColor: 'rgba(236,253,245,0.88)', borderColor: '#a7f3d0' },
  feedbackWrong: { backgroundColor: 'rgba(254,242,242,0.88)', borderColor: '#fecaca' },
  feedbackText: { flex: 1, fontSize: 12.5, fontWeight: '500', color: '#1A2C3E', lineHeight: 18 },

  resultsContainer: { gap: 8 },
  resultSenya: { width: 90, height: 90, marginBottom: 4 },
  starsRow: { flexDirection: 'row', gap: 4, marginVertical: 6 },
  star: { fontSize: 28 },
  resultLabel: { fontSize: 22, fontWeight: '800', marginBottom: 2 },
  scoreSubtitle: { fontSize: 14, color: '#6B7280', fontWeight: '500', marginBottom: 8 },
  xpEarnedBadge: { backgroundColor: 'rgba(245,158,11,0.15)', borderRadius: 99, paddingVertical: 6, paddingHorizontal: 18 },
  xpEarnedText: { fontSize: 14, fontWeight: '800', color: '#92400E' },
  userRankBadge: { marginTop: 6, backgroundColor: 'rgba(245,158,11,0.15)', borderRadius: 99, paddingVertical: 4, paddingHorizontal: 16 },
  userRankText: { fontSize: 14, fontWeight: '700', color: '#D97706' },

  scoreCircleBadge: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#EFF6FF',
    borderWidth: 5,
    borderColor: '#2E7FE8',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    shadowColor: '#2E7FE8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  scoreCircleText: {
    fontSize: 26,
    fontWeight: '900',
    color: '#2E7FE8',
  },
  scoreCircleSub: {
    fontSize: 10,
    fontWeight: '700',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  leaderboardContainer: { flex: 1 },
  leaderboardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
  },
  leaderboardHeaderTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#fff',
    textAlign: 'center',
    letterSpacing: 0.5,
  },

  rankBanner: {
    marginHorizontal: 20,
    marginBottom: 16,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  rankBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  rankBannerNumContainer: {
    minWidth: 48,
    alignItems: 'center',
  },
  rankBannerNum: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FBBF24',
    textShadowColor: 'rgba(251,191,36,0.4)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  rankBannerDivider: {
    width: 1.5,
    height: 36,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  rankBannerContent: {
    flex: 1,
  },
  rankBannerMessage: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fff',
    lineHeight: 18,
    flexShrink: 1,
  },

  podiumRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginHorizontal: 16,
    paddingBottom: 16,
    height: 200,
  },
  podiumCol: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  crownContainer: {
    position: 'absolute',
    top: -16,
    zIndex: 10,
  },
  podiumAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2.5,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  podiumAvatarFirst: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: '#FBBF24',
  },
  podiumAvatarInitials: {
    fontSize: 14,
    fontWeight: '800',
    color: '#fff',
  },
  podiumAvatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: 'rgba(255,255,255,0.4)',
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  podiumAvatarPlaceholderText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.4)',
    fontWeight: 'bold',
  },
  podiumBadge: {
    position: 'absolute',
    bottom: -6,
    right: -4,
    fontSize: 14,
  },
  podiumName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
    marginTop: 4,
    textAlign: 'center',
    width: 80,
  },
  podiumNamePlaceholder: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.4)',
    marginTop: 4,
    textAlign: 'center',
  },
  podiumScoreBadge: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginTop: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  podiumScoreBadgeGold: {
    backgroundColor: '#FFFBEB',
  },
  podiumScoreBadgePlaceholder: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginTop: 4,
  },
  podiumScoreText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#2E7FE8',
  },
  podiumScoreTextPlaceholder: {
    fontSize: 10,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.3)',
  },
  podiumBlock: {
    width: '90%',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 12,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  podiumBlockGold: {
    height: 100,
    backgroundColor: 'rgba(255, 215, 0, 0.3)',
  },
  podiumBlockSilver: {
    height: 80,
    backgroundColor: 'rgba(192, 192, 192, 0.2)',
  },
  podiumBlockBronze: {
    height: 60,
    backgroundColor: 'rgba(205, 127, 50, 0.15)',
  },
  podiumBlockNumber: {
    fontSize: 24,
    fontWeight: '900',
    color: '#fff',
  },

  leaderboardListCard: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 30,
    minHeight: 200,
  },
  leaderboardListTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1A2C3E',
    marginBottom: 16,
  },
  noRankingsText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    paddingVertical: 20,
  },

  rankRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 4,
  },
  rankRowMe: {
    backgroundColor: 'rgba(46,127,232,0.06)',
    borderRadius: 10,
    paddingHorizontal: 8,
    marginHorizontal: -4,
  },
  rankRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(26,44,62,0.06)',
  },
  rankNum: {
    fontSize: 13,
    width: 28,
    textAlign: 'center',
  },
  listRankCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  listRankText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6B7280',
  },
  rankAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(26,44,62,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankAvatarText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#fff',
  },
  listAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#9CA3AF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  listAvatarText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#fff',
  },
  rankName: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#1F2937',
  },
  listNameContainer: {
    flex: 1,
  },
  listName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  listNameMe: {
    fontWeight: '800',
    color: '#2E7FE8',
  },
  rankScore: {
    fontSize: 13,
    fontWeight: '700',
    color: '#F59E0B',
  },
  listScoreText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#3B82F6',
  },
  listScoreTextMe: {
    color: '#2E7FE8',
  },
  listAttempts: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 2,
  },

  scrollHintContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 12,
    paddingBottom: 16,
    marginBottom: 0,
  },
  scrollHintPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255,255,255,0.85)',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.95)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  scrollHintText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2E7FE8',
    letterSpacing: 0.3,
  },

  leaderboardSheet: {
    backgroundColor: '#2E7FE8',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: -8,
    paddingBottom: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -12 },
    shadowOpacity: 0.22,
    shadowRadius: 24,
    elevation: 20,
    overflow: 'hidden',
  },
  sheetHandle: {
    alignSelf: 'center',
    width: 44,
    height: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.45)',
    marginTop: 10,
    marginBottom: 4,
  },

  leaderboardActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 18,
  },
  smallBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  smallPrimaryBtn: {
    backgroundColor: '#2E7FE8',
    shadowColor: '#2E7FE8',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  smallGhostBtn: {
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: 'rgba(15,30,80,0.08)',
  },
  smallBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1A2C3E',
  },
});