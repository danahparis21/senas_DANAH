// app/(tabs)/dashboard.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Pressable,
  ActivityIndicator,
  FlatList,
  Dimensions,
  Animated
} from 'react-native';
import { useRouter, Href } from 'expo-router';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Circle, Line, Polyline, Rect, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width: screenWidth } = Dimensions.get('window');

// ── CHARACTER COLOR PALETTE ──────────────────────────────────────────
const COLORS = {
  senyaYellow: '#FFD700',
  senyaYellowLight: '#FFE44D',
  senyaYellowGlow: 'rgba(255, 215, 0, 0.20)',
  senyaOrange: '#F7C500',
  senyaBlue: '#2E7FE8',
  senyaBlueLight: '#1B6FD8',
  senyaBlueGlow: 'rgba(46, 127, 232, 0.12)',
  floraPink: '#FF6EB4',
  floraPinkLight: '#F94F9F',
  floraPinkGlow: 'rgba(255, 110, 180, 0.12)',
  cattoSky: '#4FC3F7',
  cattoSoftPink: '#FFB3D1',
  cattoWarm: '#FFF8F0',
  bgMain: '#E8F4FD',
  bgCard: '#FFFFFF',
  bgCardFrost: 'rgba(255, 255, 255, 0.85)',
  textDark: '#1A2C3E',
  textMedium: '#4A5C6E',
  textLight: '#8A9AAA',
  textWhite: '#FFFFFF',
  statusGreen: '#22C55E',
  statusGreenLight: '#DCFCE7',
  statusOrange: '#F59E0B',
  statusOrangeLight: '#FEF3C7',
  statusGray: '#9CA3AF',
  statusGrayLight: '#F3F4F6',
};

// ── BACKGROUND GRADIENT ──────────────────────────────────────────────
const GRADIENT = {
  start: '#87CEEB',
  mid: '#B3E5FC',
  mid2: '#E3F2FD',
  end: '#F5F9FF',
};

// ── SVG ICONS ──────────────────────────────────────────────────────────
function SparklesIcon({ size = 20, color = '#fff' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 3L13.5 9L19.5 10.5L13.5 12L12 18L10.5 12L4.5 10.5L10.5 9L12 3Z" fill={color} />
      <Path d="M19 7L19.75 10.25L23 11L19.75 11.75L19 15L18.25 11.75L15 11L18.25 10.25L19 7Z" fill={color} opacity="0.5" />
      <Path d="M5 17L5.5 19.5L8 20L5.5 20.5L5 23L4.5 20.5L2 20L4.5 19.5L5 17Z" fill={color} opacity="0.5" />
    </Svg>
  );
}

function ChevronRightIcon({ size = 16, color = '#fff' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M9 18L15 12L9 6" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function StarIcon({ size = 16, color = '#FFD700' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill={color} />
    </Svg>
  );
}

function LockIcon({ size = 20, color = '#9CA3AF' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="3" y="11" width="18" height="11" rx="2" stroke={color} strokeWidth="2" />
      <Path d="M7 11V7C7 4.23858 9.23858 2 12 2C14.7614 2 17 4.23858 17 7V11" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
}

function CheckCircleIcon({ size = 20, color = '#22C55E' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" />
      <Path d="M8 12L11 15L16 9" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function PlayIcon({ size = 20, color = '#2E7FE8' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" />
      <Path d="M10 8L16 12L10 16V8Z" fill={color} />
    </Svg>
  );
}

function BookOpenIcon({ size = 20, color = '#2E7FE8' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M4 19.5C4 18.1193 5.11929 17 6.5 17H20" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <Path d="M6.5 2H20V22H6.5C5.11929 22 4 20.8807 4 19.5V4.5C4 3.11929 5.11929 2 6.5 2Z" stroke={color} strokeWidth="2" />
    </Svg>
  );
}

function RotateIcon({ size = 20, color = '#22C55E' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M1 4V10H7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M3.51152 15.0116C4.58236 17.9936 7.19873 20.2399 10.3603 20.9112C13.5218 21.5825 16.7999 20.7732 19.3062 18.6978C21.8124 16.6224 23.0937 13.4861 22.7848 10.2937C22.4759 7.10132 20.8164 4.24008 18.1952 2.5427" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
}

function ClockIcon({ size = 20, color = '#F59E0B' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" />
      <Path d="M12 6V12L16 14" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function FlameIcon({ size = 16, color = '#F59E0B' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 2C12 2 4 8 4 15C4 19.4183 7.58172 23 12 23C16.4183 23 20 19.4183 20 15C20 8 12 2 12 2Z" stroke={color} strokeWidth="2" />
      <Path d="M12 7C12 7 9 9.5 9 13C9 15.5 11 17.5 12 18" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
}

// ── MOCK DATA ──────────────────────────────────────────────────────────
const MOCK_TEACHER_LESSONS = [
  {
    lesson_id: 1,
    title: "FSL Alphabet",
    difficulty: "Beginner",
    status: "in_progress",
    assigned_at: "2026-06-20T08:00:00Z",
    has_quiz: true,
    total_steps: 12,
    progress: { current_step: 8, lesson_completed: false, quiz_completed: false, quiz_score: null },
  },
  {
    lesson_id: 2,
    title: "Everyday Greetings",
    difficulty: "Beginner",
    status: "in_progress",
    assigned_at: "2026-06-21T08:00:00Z",
    has_quiz: true,
    total_steps: 10,
    progress: { current_step: 4, lesson_completed: false, quiz_completed: false, quiz_score: null },
  },
  {
    lesson_id: 3,
    title: "Numbers 1-20",
    difficulty: "Beginner",
    status: "pending",
    assigned_at: "2026-06-22T08:00:00Z",
    has_quiz: true,
    total_steps: 8,
    progress: null,
  },
  {
    lesson_id: 4,
    title: "Classroom Words",
    difficulty: "Intermediate",
    status: "completed",
    assigned_at: "2026-06-18T08:00:00Z",
    has_quiz: true,
    total_steps: 15,
    progress: { current_step: 15, lesson_completed: true, quiz_completed: true, quiz_score: 95 },
  },
];

const MOCK_LESSONS = [
  { title: "FSL Alphabet", progress: 65, tag: "In Progress" },
  { title: "Greetings", progress: 40, tag: "In Progress" },
  { title: "Numbers 1–10", progress: 30, tag: "In Progress" },
  { title: "Classroom Words", progress: 100, tag: "Completed" },
  { title: "Family Members", progress: 0, tag: "Locked" },
];

const QUICK_ACTIONS = [
  { label: "Multiple\nChoice", icon: require('../../assets/images/img/multiple_choice.png'), color: COLORS.senyaBlue, screen: "/quiz/mc" as Href },
  { label: "Drag &\nDrop", icon: require('../../assets/images/img/dragNdrop.png'), color: COLORS.floraPink, screen: "/quiz/dnd" as Href },
  { label: "Gesture\nCam", icon: require('../../assets/images/img/camera.png'), color: COLORS.senyaBlueLight, screen: "/(tabs)/gesture" as Href },
  { label: "My\nBadges", icon: require('../../assets/images/img/badges.png'), color: COLORS.senyaYellow, screen: "/(tabs)/achievements" as Href },
];

const STREAK_MILESTONES = [
  { day: 3, label: "3 days" },
  { day: 7, label: "1 week" },
  { day: 14, label: "2 weeks" },
  { day: 30, label: "1 month" },
];

interface Lesson {
  lesson_id: number;
  title: string;
  difficulty: string;
  status: string;
  assigned_at: string;
  has_quiz: boolean;
  total_steps: number;
  progress: {
    current_step: number;
    lesson_completed: boolean;
    quiz_completed: boolean;
    quiz_score: number | null;
  } | null;
}

// ── MOTIVATIONAL MESSAGES ─────────────────────────────────────────────
const MOTIVATIONAL_MESSAGES = [
  "Keep going, you're doing great! 🌟",
  "You're on fire today! 🔥",
  "Every sign you learn opens a new door! 🚪",
  "You're becoming a signing superstar! ⭐",
  "The FSL community welcomes you! 🤟",
  "Your dedication is inspiring! 💪",
];

function getMotivationalMessage(): string {
  return MOTIVATIONAL_MESSAGES[Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length)];
}

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning!";
  if (h < 17) return "Good afternoon!";
  return "Good evening!";
}

// ── MAIN COMPONENT ────────────────────────────────────────────────────
export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [studentName, setStudentName] = useState('Student');
  const [studentLevel, setStudentLevel] = useState('Beginner');
  const [xp, setXp] = useState(340);
  const [xpMax, setXpMax] = useState(500);
  const [streak, setStreak] = useState(5);
  const [teacherLessons, setTeacherLessons] = useState<Lesson[]>([]);
  const [loadingLessons, setLoadingLessons] = useState(true);
  const [motivationalMessage, setMotivationalMessage] = useState('');
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    setMotivationalMessage(getMotivationalMessage());
    fetchStudentData();
    fetchTeacherLessons();
  }, []);

  const fetchStudentData = async () => {
    try {
      setLoading(true);
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        const user = JSON.parse(userData);
        const student = user.student;
        setStudentName(`${student?.first_name || 'John'} ${student?.last_name || 'Doe'}`.trim());
        setStudentLevel(student?.fsl_mastery_level || 'Beginner');
        setXp(student?.total_xp || 340);
        setStreak(student?.streak_days || 5);
      }
    } catch (error) {
      console.error('Error fetching student data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeacherLessons = async () => {
    try {
      setLoadingLessons(true);
      await new Promise(resolve => setTimeout(resolve, 600));
      setTeacherLessons(MOCK_TEACHER_LESSONS);
    } catch (error) {
      console.error('Error fetching teacher lessons:', error);
    } finally {
      setLoadingLessons(false);
    }
  };

  const navigateToLesson = (lessonId: number, lessonTitle: string) => {
    router.push(`/quiz/mc?lessonId=${lessonId}&lessonTitle=${encodeURIComponent(lessonTitle)}` as Href);
  };

  const xpPct = Math.min((xp / xpMax) * 100, 100);

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.loadingContainer]}>
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color={COLORS.senyaYellow} />
        </View>
        <Text style={styles.loadingText}>Loading SEÑAS...</Text>
      </SafeAreaView>
    );
  }

  return (
    <LinearGradient
      colors={[GRADIENT.start, GRADIENT.mid, GRADIENT.mid2, GRADIENT.end]}
      locations={[0, 0.25, 0.55, 1]}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Top Bar */}
          <View style={styles.topBar}>
            <Text style={styles.logoText}>SEÑAS</Text>
            <View style={styles.streakBadge}>
              <FlameIcon size={14} color={COLORS.senyaYellow} />
              <Text style={styles.streakText}>{streak}</Text>
            </View>
          </View>

          {/* Hero Greeting Card with Senya + Speech Bubble - FIXED POSITION */}
          <View style={styles.heroCard}>
            <View style={styles.heroContent}>
              <View style={styles.heroText}>
                <Text style={styles.greetingText}>{getGreeting()}</Text>
                <Text style={styles.nameText}>{studentName}</Text>
                <View style={styles.heroBadgeRow}>
                  <View style={[styles.heroBadge, { backgroundColor: COLORS.senyaYellowGlow }]}>
                    <StarIcon size={12} color={COLORS.senyaYellow} />
                    <Text style={[styles.heroBadgeText, { color: COLORS.textDark }]}>{studentLevel}</Text>
                  </View>
                  <View style={[styles.heroBadge, { backgroundColor: COLORS.floraPinkGlow }]}>
                    <FlameIcon size={12} color={COLORS.floraPink} />
                    <Text style={[styles.heroBadgeText, { color: COLORS.floraPink }]}>{streak} days</Text>
                  </View>
                </View>
              </View>
              <Image
                source={require('../../assets/images/new_characters/senya.png')}
                style={styles.senyaHero}
                contentFit="contain"
              />
            </View>

            {/* Speech Bubble moved to below the hero content - smaller and more compact */}
            <View style={styles.speechBubbleContainer}>
              <View style={styles.speechBubble}>
                <Text style={styles.speechBubbleText}>{motivationalMessage}</Text>
              </View>
            </View>

            <View style={styles.xpSection}>
              <View style={styles.xpHeader}>
                <Text style={styles.xpLabel}>LEVEL 1 · Novice Signer</Text>
                <Text style={styles.xpPercent}>{Math.round(xpPct)}%</Text>
              </View>
              <View style={styles.xpProgressTrack}>
                <View style={[styles.xpProgressFill, { width: `${xpPct}%`, backgroundColor: COLORS.senyaYellow }]} />
              </View>
              <Text style={styles.xpStatus}>{xp} / {xpMax} XP · {xpMax - xp} XP to next level</Text>
            </View>
          </View>

          {/* Daily Challenge - FIXED: proper gradient fill */}
          <View style={styles.section}>
            <Pressable style={styles.dailyCard} onPress={() => router.push('/assessment' as Href)}>
              {/* Gradient Background - properly fills the card */}
              <LinearGradient
                colors={['#FFD700', '#F7C500', '#FB923C']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.dailyGradient}
              />

              {/* Decorative circles */}
              <View style={styles.dailyCardBg1} />
              <View style={styles.dailyCardBg2} />

              <View style={styles.dailyHeader}>
                <View style={styles.dailyIconBox}>
                  <SparklesIcon size={18} color="#fff" />
                </View>
                <View>
                  <Text style={styles.dailyTitleText}>Daily Challenge</Text>
                  <Text style={styles.dailySubText}>+50 XP bonus</Text>
                </View>
                <View style={styles.dailyChevron}>
                  <ChevronRightIcon size={18} color="rgba(255,255,255,0.7)" />
                </View>
              </View>
              <Text style={styles.dailyDescText}>Practice 5 Alphabet Signs — Sign A through E!</Text>
              <View style={styles.dailyDotsRow}>
                {[1, 2, 3, 4, 5].map((_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.dailyDotItem,
                      i < 2 ? styles.dailyDotCompleted : styles.dailyDotPending
                    ]}
                  >
                    {i < 2 ? (
                      <StarIcon size={12} color={COLORS.senyaYellow} />
                    ) : (
                      <Text style={styles.dailyDotNumber}>{i + 1}</Text>
                    )}
                  </View>
                ))}
              </View>
              <Text style={styles.dailyStatusText}>2 of 5 completed</Text>
            </Pressable>
          </View>

          {/* Quick Practice */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Practice</Text>
            <View style={styles.quickGrid}>
              {QUICK_ACTIONS.map((action, i) => (
                <Pressable
                  key={i}
                  style={styles.quickCard}
                  onPress={() => router.push(action.screen)}
                >
                  <View style={[styles.quickIconBox, { backgroundColor: action.color + '20' }]}>
                    <Image source={action.icon} style={styles.quickIcon} contentFit="contain" />
                  </View>
                  <Text style={styles.quickLabel}>{action.label}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Teacher Lessons */}
          {!loadingLessons && teacherLessons.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionHeaderLeft}>
                  <BookOpenIcon size={18} color={COLORS.senyaBlue} />
                  <Text style={styles.sectionTitle}>From Teacher</Text>
                </View>
                {teacherLessons.length > 2 && (
                  <Pressable onPress={() => router.push('/teacher-lessons' as Href)}>
                    <Text style={styles.seeAllText}>See All →</Text>
                  </Pressable>
                )}
              </View>
              <FlatList
                data={teacherLessons.slice(0, 4)}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.teacherCarousel}
                renderItem={({ item }) => {
                  const progress = item.progress;
                  const pct = progress ? Math.round((progress.current_step / item.total_steps) * 100) : 0;
                  const isCompleted = item.status === 'completed';
                  const diffColor = item.difficulty === 'Beginner' ? COLORS.statusGreen : COLORS.senyaYellow;
                  const diffBg = item.difficulty === 'Beginner' ? COLORS.statusGreenLight : COLORS.statusOrangeLight;

                  let StatusIcon = BookOpenIcon;
                  let statusColor = COLORS.senyaBlue;
                  let statusLabel = 'New';
                  if (item.status === 'completed') {
                    StatusIcon = CheckCircleIcon;
                    statusColor = COLORS.statusGreen;
                    statusLabel = 'Completed';
                  } else if (item.status === 'in_progress') {
                    StatusIcon = ClockIcon;
                    statusColor = COLORS.statusOrange;
                    statusLabel = 'In Progress';
                  }

                  return (
                    <Pressable
                      style={styles.teacherCard}
                      onPress={() => navigateToLesson(item.lesson_id, item.title)}
                    >
                      <View style={styles.teacherCardHeader}>
                        <View style={[styles.teacherCardBadge, { backgroundColor: diffBg }]}>
                          <Text style={[styles.teacherCardBadgeText, { color: diffColor }]}>
                            {item.difficulty}
                          </Text>
                        </View>
                        {item.has_quiz && (
                          <View style={[styles.teacherCardBadge, { backgroundColor: COLORS.floraPinkGlow }]}>
                            <Text style={[styles.teacherCardBadgeText, { color: COLORS.floraPink }]}>Quiz</Text>
                          </View>
                        )}
                      </View>
                      <Text style={styles.teacherCardTitle} numberOfLines={2}>{item.title}</Text>
                      <View style={styles.teacherCardProgress}>
                        <View style={styles.teacherCardProgressHeader}>
                          <View style={styles.teacherCardStatus}>
                            <StatusIcon size={14} color={statusColor} />
                            <Text style={[styles.teacherCardStatusText, { color: statusColor }]}>
                              {statusLabel}
                            </Text>
                          </View>
                          <Text style={styles.teacherCardProgressText}>{pct}%</Text>
                        </View>
                        <View style={styles.teacherCardProgressTrack}>
                          <View
                            style={[
                              styles.teacherCardProgressFill,
                              {
                                width: `${pct}%`,
                                backgroundColor: isCompleted ? COLORS.statusGreen : COLORS.senyaBlue
                              }
                            ]}
                          />
                        </View>
                      </View>
                      <View style={styles.teacherCardFooter}>
                        {progress?.quiz_completed && progress?.quiz_score !== null ? (
                          <Text style={styles.teacherCardScore}>
                            {progress.quiz_score === 100 ? '🌟 ' : ''}{progress.quiz_score}% score
                          </Text>
                        ) : (
                          <Text style={styles.teacherCardSteps}>{item.total_steps} steps</Text>
                        )}
                        <View style={[styles.teacherCardAction, { backgroundColor: isCompleted ? COLORS.statusGreenLight : COLORS.senyaBlueGlow }]}>
                          {isCompleted ? (
                            <RotateIcon size={16} color={COLORS.statusGreen} />
                          ) : (
                            <PlayIcon size={16} color={COLORS.senyaBlue} />
                          )}
                        </View>
                      </View>
                    </Pressable>
                  );
                }}
                keyExtractor={(item) => item.lesson_id.toString()}
              />
            </View>
          )}

          {/* Continue Learning */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Continue Learning</Text>
              <Pressable onPress={() => router.push('/lessons' as Href)}>
                <Text style={styles.seeAllText}>See All →</Text>
              </Pressable>
            </View>
            <FlatList
              data={MOCK_LESSONS}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.lessonsCarousel}
              renderItem={({ item }) => {
                const isLocked = item.tag === 'Locked';
                const isCompleted = item.tag === 'Completed';
                const colors = isCompleted ? COLORS.statusGreen : isLocked ? COLORS.textLight : COLORS.senyaBlue;
                const bgColor = isCompleted ? COLORS.statusGreenLight : isLocked ? COLORS.statusGrayLight : COLORS.senyaBlueGlow;

                return (
                  <Pressable
                    style={[styles.lessonCard, isLocked && styles.lessonCardLocked]}
                    disabled={isLocked}
                    onPress={() => router.push('/lessons' as Href)}
                  >
                    <View style={[styles.lessonCardIcon, { backgroundColor: bgColor }]}>
                      {isCompleted ? (
                        <CheckCircleIcon size={24} color={COLORS.statusGreen} />
                      ) : isLocked ? (
                        <LockIcon size={24} color={COLORS.textLight} />
                      ) : (
                        <Image
                          source={require('../../assets/images/img/alphabet.png')}
                          style={styles.lessonCardEmoji}
                          contentFit="contain"
                        />
                      )}
                    </View>
                    <Text style={styles.lessonCardTitle} numberOfLines={2}>{item.title}</Text>
                    <View style={[styles.lessonCardTag, { backgroundColor: bgColor }]}>
                      <Text style={[styles.lessonCardTagText, { color: colors }]}>{item.tag}</Text>
                    </View>
                    {!isLocked && !isCompleted && (
                      <View style={styles.lessonCardProgress}>
                        <View style={styles.lessonCardProgressTrack}>
                          <View style={[styles.lessonCardProgressFill, { width: `${item.progress}%`, backgroundColor: COLORS.senyaBlue }]} />
                        </View>
                        <Text style={styles.lessonCardProgressText}>{item.progress}%</Text>
                      </View>
                    )}
                    {isCompleted && (
                      <Text style={styles.lessonCardCompleteText}>100% ✨</Text>
                    )}
                  </Pressable>
                );
              }}
              keyExtractor={(item) => item.title}
            />
          </View>

          {/* Streak Milestones */}
          <View style={styles.section}>
            <View style={styles.streakCard}>
              <View style={styles.streakCardHeader}>
                <View style={styles.streakCardTitleRow}>
                  <FlameIcon size={18} color={COLORS.statusOrange} />
                  <Text style={styles.streakCardTitle}>Streak Milestones</Text>
                </View>
                <View style={styles.streakCardBadge}>
                  <Text style={styles.streakCardBadgeText}>{streak} days 🔥</Text>
                </View>
              </View>
              <View style={styles.streakMilestones}>
                {STREAK_MILESTONES.map((m, i) => {
                  const reached = streak >= m.day;
                  return (
                    <View key={i} style={styles.streakMilestoneItem}>
                      <View style={[styles.streakMilestoneCircle, reached && styles.streakMilestoneReached]}>
                        <FlameIcon size={16} color={reached ? '#fff' : COLORS.textLight} />
                      </View>
                      <Text style={[styles.streakMilestoneLabel, reached && styles.streakMilestoneLabelReached]}>
                        {m.label}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>
          </View>

        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

// ── STYLES ─────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent' },
  scrollContent: { paddingBottom: 120 },
  loadingContainer: { alignItems: 'center', justifyContent: 'center' },
  loadingBox: { width: 48, height: 48, borderRadius: 16, backgroundColor: COLORS.senyaYellowGlow, alignItems: 'center', justifyContent: 'center' },
  loadingText: { marginTop: 12, fontSize: 13, fontWeight: '700', color: COLORS.textLight },

  // Top Bar
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12 },
  logoText: { color: COLORS.textDark, fontSize: 22, fontWeight: '800', letterSpacing: 2 },
  streakBadge: { backgroundColor: 'rgba(255,255,255,0.85)', borderRadius: 20, paddingVertical: 5, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', gap: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3, borderWidth: 1, borderColor: 'rgba(255,255,255,0.9)' },
  streakText: { color: COLORS.textDark, fontSize: 13, fontWeight: '700' },

  // Hero Card
  heroCard: { marginHorizontal: 16, backgroundColor: 'rgba(255,255,255,0.88)', borderRadius: 28, padding: 20, shadowColor: '#2E7FE8', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.10, shadowRadius: 24, elevation: 4, borderWidth: 1, borderColor: 'rgba(255,255,255,0.9)' },
  heroContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  heroText: { flex: 1, paddingRight: 12 },
  greetingText: { color: COLORS.textMedium, fontSize: 13, fontWeight: '600' },
  nameText: { color: COLORS.textDark, fontSize: 24, fontWeight: '800', marginTop: 2, marginBottom: 8 },
  heroBadgeRow: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  heroBadge: { borderRadius: 8, paddingVertical: 3, paddingHorizontal: 10, flexDirection: 'row', alignItems: 'center', gap: 4 },
  heroBadgeText: { fontSize: 11, fontWeight: '700' },
  senyaHero: { width: 80, height: 80 },

  // Speech Bubble - moved below hero content
  speechBubbleContainer: { marginTop: 6, marginBottom: 2, alignItems: 'center' },
  speechBubble: {
    backgroundColor: COLORS.senyaYellowGlow,
    borderRadius: 14,
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(255,215,0,0.4)',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 6,
    elevation: 2,
  },
  speechBubbleText: { fontSize: 12, fontWeight: '600', color: COLORS.textDark, textAlign: 'center' },

  xpSection: { marginTop: 8, paddingTop: 12, borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.05)' },
  xpHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  xpLabel: { fontSize: 11, fontWeight: '700', color: COLORS.textMedium },
  xpPercent: { fontSize: 11, fontWeight: '700', color: COLORS.textMedium },
  xpProgressTrack: { backgroundColor: COLORS.senyaBlueGlow, borderRadius: 99, height: 6, overflow: 'hidden' },
  xpProgressFill: { height: '100%', borderRadius: 99 },
  xpStatus: { fontSize: 10, color: COLORS.textLight, fontWeight: '500', marginTop: 4 },

  // Daily Challenge - FIXED
  section: { marginHorizontal: 16, marginTop: 16 },
  dailyCard: {
    borderRadius: 24,
    padding: 20,
    overflow: 'hidden',
    shadowColor: '#F7C500',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 8,
    minHeight: 150,
    position: 'relative',
  },
  dailyGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 24,
  },
  dailyCardBg1: { position: 'absolute', top: -20, right: -20, width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.12)', zIndex: 1 },
  dailyCardBg2: { position: 'absolute', bottom: -10, left: -10, width: 50, height: 50, borderRadius: 25, backgroundColor: 'rgba(255,255,255,0.08)', zIndex: 1 },
  dailyHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10, zIndex: 2 },
  dailyIconBox: { width: 32, height: 32, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  dailyTitleText: { fontSize: 15, fontWeight: '800', color: '#fff' },
  dailySubText: { fontSize: 11, fontWeight: '600', color: 'rgba(255,255,255,0.7)' },
  dailyChevron: { marginLeft: 'auto', width: 28, height: 28, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  dailyDescText: { fontSize: 13, fontWeight: '600', color: 'rgba(255,255,255,0.9)', marginBottom: 12, zIndex: 2 },
  dailyDotsRow: { flexDirection: 'row', gap: 6, marginBottom: 8, zIndex: 2 },
  dailyDotItem: { width: 32, height: 32, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  dailyDotCompleted: { backgroundColor: '#fff' },
  dailyDotPending: { backgroundColor: 'rgba(255,255,255,0.2)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)' },
  dailyDotNumber: { fontSize: 12, fontWeight: '700', color: 'rgba(255,255,255,0.5)' },
  dailyStatusText: { fontSize: 11, fontWeight: '700', color: 'rgba(255,255,255,0.8)', zIndex: 2 },

  // Section Headers
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sectionTitle: { fontSize: 17, fontWeight: '800', color: COLORS.textDark },
  seeAllText: { fontSize: 13, fontWeight: '700', color: COLORS.senyaBlue },

  // Quick Practice
  quickGrid: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.80)', borderRadius: 22, padding: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.9)', shadowColor: '#2E7FE8', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.06, shadowRadius: 10, elevation: 2 },
  quickCard: { alignItems: 'center', gap: 8, flex: 1 },
  quickIconBox: { width: 60, height: 60, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  quickIcon: { width: 32, height: 32 },
  quickLabel: { fontSize: 10, fontWeight: '700', color: COLORS.textMedium, textAlign: 'center' },

  // Teacher Lessons
  teacherCarousel: { paddingRight: 16, gap: 12 },
  teacherCard: { width: 220, backgroundColor: 'rgba(255,255,255,0.90)', borderRadius: 22, padding: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.8)', shadowColor: '#2E7FE8', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.07, shadowRadius: 12, elevation: 2 },
  teacherCardHeader: { flexDirection: 'row', gap: 6, marginBottom: 8 },
  teacherCardBadge: { paddingVertical: 2, paddingHorizontal: 8, borderRadius: 6 },
  teacherCardBadgeText: { fontSize: 9, fontWeight: '700' },
  teacherCardTitle: { fontSize: 14, fontWeight: '800', color: COLORS.textDark, marginBottom: 8 },
  teacherCardProgress: { marginBottom: 10 },
  teacherCardProgressHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  teacherCardStatus: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  teacherCardStatusText: { fontSize: 10, fontWeight: '600' },
  teacherCardProgressText: { fontSize: 10, fontWeight: '700', color: COLORS.textDark },
  teacherCardProgressTrack: { height: 4, backgroundColor: COLORS.statusGrayLight, borderRadius: 99, overflow: 'hidden' },
  teacherCardProgressFill: { height: '100%', borderRadius: 99 },
  teacherCardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  teacherCardScore: { fontSize: 11, fontWeight: '700', color: COLORS.statusGreen },
  teacherCardSteps: { fontSize: 10, color: COLORS.textLight, fontWeight: '500' },
  teacherCardAction: { width: 30, height: 30, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },

  // Continue Learning
  lessonsCarousel: { paddingRight: 16, gap: 12 },
  lessonCard: { width: 120, backgroundColor: 'rgba(255,255,255,0.90)', borderRadius: 22, padding: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.8)', shadowColor: '#2E7FE8', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.07, shadowRadius: 10, elevation: 2, alignItems: 'center' },
  lessonCardLocked: { opacity: 0.6 },
  lessonCardIcon: { width: 48, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  lessonCardEmoji: { width: 28, height: 28 },
  lessonCardTitle: { fontSize: 12, fontWeight: '700', color: COLORS.textDark, textAlign: 'center', marginBottom: 6 },
  lessonCardTag: { paddingVertical: 2, paddingHorizontal: 10, borderRadius: 20 },
  lessonCardTagText: { fontSize: 9, fontWeight: '700' },
  lessonCardProgress: { marginTop: 8, alignItems: 'center', width: '100%' },
  lessonCardProgressTrack: { width: '100%', height: 4, backgroundColor: COLORS.statusGrayLight, borderRadius: 99, overflow: 'hidden' },
  lessonCardProgressFill: { height: '100%', borderRadius: 99 },
  lessonCardProgressText: { fontSize: 9, fontWeight: '600', color: COLORS.textLight, marginTop: 2 },
  lessonCardCompleteText: { fontSize: 11, fontWeight: '700', color: COLORS.statusGreen, textAlign: 'center', marginTop: 4 },

  // Streak Milestones
  streakCard: { backgroundColor: 'rgba(255,255,255,0.90)', borderRadius: 22, padding: 18, borderWidth: 1.5, borderColor: 'rgba(255,215,0,0.25)', shadowColor: '#F7C500', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.12, shadowRadius: 14, elevation: 3 },
  streakCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  streakCardTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  streakCardTitle: { fontSize: 14, fontWeight: '800', color: COLORS.textDark },
  streakCardBadge: { backgroundColor: COLORS.statusOrangeLight, paddingVertical: 3, paddingHorizontal: 10, borderRadius: 20 },
  streakCardBadgeText: { fontSize: 11, fontWeight: '700', color: COLORS.statusOrange },
  streakMilestones: { flexDirection: 'row', justifyContent: 'space-between' },
  streakMilestoneItem: { alignItems: 'center', gap: 4 },
  streakMilestoneCircle: { width: 40, height: 40, borderRadius: 16, backgroundColor: COLORS.statusGrayLight, alignItems: 'center', justifyContent: 'center' },
  streakMilestoneReached: { backgroundColor: COLORS.statusOrange },
  streakMilestoneLabel: { fontSize: 9, fontWeight: '600', color: COLORS.textLight },
  streakMilestoneLabelReached: { color: COLORS.textDark },
});