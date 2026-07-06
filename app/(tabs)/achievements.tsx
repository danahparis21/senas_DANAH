// app/(tabs)/achievements.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Pressable,
  ActivityIndicator,
  Dimensions,
  Animated,
  Easing,
  StatusBar
} from 'react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import Svg, { Path, Circle, Polyline, Rect, Defs, LinearGradient, Stop } from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

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

// ============================================
// MOCK DATA (Replaces API calls)
// ============================================

// Mock student data
const MOCK_STUDENT_DATA = {
  total_xp: 340,
  level: 2,
  streak_days: 5,
  first_name: 'John',
  last_name: 'Doe'
};

// Badge definitions with XP requirements
const BADGE_DEFINITIONS = [
  {
    id: 'first_step',
    name: "First Step",
    image: require('../../assets/images/img/first_step.png'),
    desc: "Complete your first lesson",
    xpRequired: 0,
    color: "#10B981"
  },
  {
    id: 'alphabet_star',
    name: "Alphabet Star",
    image: require('../../assets/images/img/alphabet_star.png'),
    desc: "Learn all 26 FSL alphabet signs",
    xpRequired: 50,
    color: "#F59E0B"
  },
  {
    id: 'streak_starter',
    name: "Streak Starter",
    image: require('../../assets/images/img/streak1.png'),
    desc: "Practice 3 days in a row",
    xpRequired: 30,
    color: "#EF4444"
  },
  {
    id: 'greeter',
    name: "Greeter",
    image: require('../../assets/images/img/greetings.png'),
    desc: "Complete the Greetings module",
    xpRequired: 100,
    color: "#06B6D4"
  },
  {
    id: 'quiz_whiz',
    name: "Quiz Whiz",
    image: require('../../assets/images/img/greetings.png'),
    desc: "Score 100% on any quiz",
    xpRequired: 150,
    color: "#8B5CF6"
  },
  {
    id: 'sign_detective',
    name: "Sign Detective",
    image: require('../../assets/images/img/first_step.png'),
    desc: "Use gesture recognition 10 times",
    xpRequired: 200,
    color: "#2563EB"
  },
  {
    id: 'number_ninja',
    name: "Number Ninja",
    image: require('../../assets/images/img/numbers.png'),
    desc: "Learn numbers 1–10",
    xpRequired: 80,
    color: "#F97316"
  },
  {
    id: 'week_warrior',
    name: "Week Warrior",
    image: require('../../assets/images/img/greetings.png'),
    desc: "7-day learning streak",
    xpRequired: 250,
    color: "#EC4899"
  },
];

const MILESTONES = [
  { label: "50 XP", xp: 50 },
  { label: "100 XP", xp: 100 },
  { label: "250 XP", xp: 250 },
  { label: "500 XP", xp: 500 },
  { label: "1000 XP", xp: 1000 },
];

function MilestoneIcon({ done }: { done: boolean }) {
  return (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      {done ? (
        <>
          <Circle cx="12" cy="12" r="10" fill="#D97706" />
          <Polyline points="8 12 11 15 16 9" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </>
      ) : (
        <>
          <Circle cx="12" cy="12" r="10" stroke="#9CA3AF" strokeWidth="2" />
          <Path d="M8 8L16 16M16 8L8 16" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" />
        </>
      )}
    </Svg>
  );
}

export default function Achievements() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [totalXP, setTotalXP] = useState(0);
  const [level, setLevel] = useState(1);
  const [streakDays, setStreakDays] = useState(0);
  const [studentName, setStudentName] = useState('');
  const [filter, setFilter] = useState('all');
  const [earnedBadges, setEarnedBadges] = useState<string[]>([]);

  // ── Cloud Animations ──
  const cloud1Anim = useRef(new Animated.Value(-200)).current;
  const cloud2Anim = useRef(new Animated.Value(screenWidth + 200)).current;
  const cloud3Anim = useRef(new Animated.Value(-250)).current;
  const cloud4Anim = useRef(new Animated.Value(screenWidth + 250)).current;

  // ── Sun Glow Animation ──
  const sunAnim = useRef(new Animated.Value(0)).current;

  // ── Card Entrance Animation ──
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const cardTranslateY = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    fetchStudentData();
  }, []);

  // ── CLOUD & SUN EFFECTS ──
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

    const startCloud2 = () => {
      cloud2Anim.setValue(screenWidth + 200);
      Animated.timing(cloud2Anim, {
        toValue: -200,
        duration: 55000,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start(() => startCloud2());
    };

    const startCloud3 = () => {
      cloud3Anim.setValue(-250);
      Animated.timing(cloud3Anim, {
        toValue: screenWidth + 250,
        duration: 50000,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start(() => startCloud3());
    };

    const startCloud4 = () => {
      cloud4Anim.setValue(screenWidth + 250);
      Animated.timing(cloud4Anim, {
        toValue: -250,
        duration: 60000,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start(() => startCloud4());
    };

    startCloud1();
    startCloud2();
    startCloud3();
    startCloud4();

    Animated.loop(
      Animated.sequence([
        Animated.timing(sunAnim, {
          toValue: 1,
          duration: 3000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
        Animated.timing(sunAnim, {
          toValue: 0,
          duration: 3000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
      ])
    ).start();

    // ── Card Entrance Animation ──
    Animated.parallel([
      Animated.timing(cardOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(cardTranslateY, {
        toValue: 0,
        duration: 500,
        easing: Easing.out(Easing.back(1.2)),
        useNativeDriver: true,
      }),
    ]).start();

    return () => {
      // Cleanup
    };
  }, []);

  // 🎯 REPLACED: No API calls, using mock data + AsyncStorage
  const fetchStudentData = async () => {
    try {
      setLoading(true);

      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        const user = JSON.parse(userData);
        const student = user.student;
        setStudentName(`${student?.first_name || ''} ${student?.last_name || ''}`.trim());

        const xp = student?.total_xp || MOCK_STUDENT_DATA.total_xp;
        const levelNum = student?.level || MOCK_STUDENT_DATA.level;
        const streak = student?.streak_days || MOCK_STUDENT_DATA.streak_days;

        setTotalXP(xp);
        setLevel(levelNum);
        setStreakDays(streak);
        calculateEarnedBadges(xp);
      } else {
        setStudentName(`${MOCK_STUDENT_DATA.first_name} ${MOCK_STUDENT_DATA.last_name}`);
        setTotalXP(MOCK_STUDENT_DATA.total_xp);
        setLevel(MOCK_STUDENT_DATA.level);
        setStreakDays(MOCK_STUDENT_DATA.streak_days);
        calculateEarnedBadges(MOCK_STUDENT_DATA.total_xp);

        const defaultUser = {
          student: {
            first_name: MOCK_STUDENT_DATA.first_name,
            last_name: MOCK_STUDENT_DATA.last_name,
            total_xp: MOCK_STUDENT_DATA.total_xp,
            level: MOCK_STUDENT_DATA.level,
            streak_days: MOCK_STUDENT_DATA.streak_days
          }
        };
        await AsyncStorage.setItem('userData', JSON.stringify(defaultUser));
      }
    } catch (error) {
      console.error('Error fetching student data:', error);
      setStudentName(`${MOCK_STUDENT_DATA.first_name} ${MOCK_STUDENT_DATA.last_name}`);
      setTotalXP(MOCK_STUDENT_DATA.total_xp);
      setLevel(MOCK_STUDENT_DATA.level);
      setStreakDays(MOCK_STUDENT_DATA.streak_days);
      calculateEarnedBadges(MOCK_STUDENT_DATA.total_xp);
    } finally {
      setLoading(false);
    }
  };

  const calculateEarnedBadges = (xp: number) => {
    const earned = BADGE_DEFINITIONS
      .filter(badge => xp >= badge.xpRequired)
      .map(badge => badge.id);
    setEarnedBadges(earned);
  };

  const isBadgeEarned = (badgeId: string) => earnedBadges.includes(badgeId);

  const xpToNext = 500 - totalXP;
  const earned = earnedBadges.length;

  const filteredBadges = BADGE_DEFINITIONS.filter(b =>
    filter === "all" ? true :
      filter === "earned" ? isBadgeEarned(b.id) :
        !isBadgeEarned(b.id)
  );

  // ── Sun Glow Interpolation ──
  const sunGlow = sunAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.8],
  });

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2E7FE8" />
        <Text style={styles.loadingText}>Loading achievements...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      {/* ── Gradient Background ── */}
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

      {/* ── Sun with Glow ── */}
      <Animated.View style={[styles.sunContainer, { opacity: sunGlow }]}>
        <Svg width="120" height="120" viewBox="0 0 120 120">
          <Circle cx="60" cy="60" r="45" fill="#FCD34D" opacity="0.9" />
          <Circle cx="60" cy="60" r="55" fill="#FCD34D" opacity="0.3" />
          <Circle cx="60" cy="60" r="70" fill="#FCD34D" opacity="0.1" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
            <Rect
              key={i}
              x="54"
              y="5"
              width="12"
              height="20"
              rx="6"
              fill="#FCD34D"
              opacity="0.6"
              transform={`rotate(${angle}, 60, 60)`}
            />
          ))}
        </Svg>
      </Animated.View>

      {/* ── Floating Clouds ── */}
      <View style={styles.floatingSky} pointerEvents="none">
        <Animated.View style={[styles.cloudWrapper, { top: 40, transform: [{ translateX: cloud1Anim }] }]}>
          <AnimatedCloud scale={1.5} opacity={0.4} />
        </Animated.View>
        <Animated.View style={[styles.cloudWrapper, { top: 180, transform: [{ translateX: cloud2Anim }] }]}>
          <AnimatedCloud scale={1.2} opacity={0.3} />
        </Animated.View>
        <Animated.View style={[styles.cloudWrapper, { top: 350, transform: [{ translateX: cloud3Anim }] }]}>
          <AnimatedCloud scale={1.8} opacity={0.35} />
        </Animated.View>
        <Animated.View style={[styles.cloudWrapper, { top: 500, transform: [{ translateX: cloud4Anim }] }]}>
          <AnimatedCloud scale={1.3} opacity={0.3} />
        </Animated.View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Top Bar */}
        <View style={styles.topBar}>
          <Text style={styles.logoText}>SEÑAS</Text>
          <View style={styles.topBarRight}>
            <View style={styles.streakBadge}>
              <Ionicons name="flame" size={14} color="#fb923c" />
              <Text style={styles.streakText}>{streakDays}</Text>
            </View>
          </View>
        </View>

        {/* Hero Card - Animated */}
        <Animated.View
          style={[
            styles.heroCard,
            {
              opacity: cardOpacity,
              transform: [{ translateY: cardTranslateY }]
            }
          ]}
        >
          <View style={styles.heroContent}>
            <View style={styles.heroTextContent}>
              <Text style={styles.heroSubtitle}>{studentName}'s collection</Text>
              <Text style={styles.heroTitle}>Achievements</Text>
              <View style={styles.heroBadgesRow}>
                <View style={[styles.heroBadge, styles.heroBadgeOrange]}>
                  <Image source={require('../../assets/images/img/badges.png')} style={styles.heroBadgeIcon} contentFit="contain" />
                  <Text style={styles.heroBadgeTextOrange}>{earned}/{BADGE_DEFINITIONS.length} badges</Text>
                </View>
                <View style={[styles.heroBadge, styles.heroBadgeBlue]}>
                  <Ionicons name="flash" size={14} color="#2E7FE8" />
                  <Text style={styles.heroBadgeTextBlue}>{totalXP} XP</Text>
                </View>
                <View style={[styles.heroBadge, styles.heroBadgeRed]}>
                  <Text style={styles.heroBadgeTextRed}>Level {level}</Text>
                </View>
              </View>
            </View>
            <Image
              source={require('../../assets/images/new_characters/senya.png')}
              style={styles.senyaHero}
              contentFit="contain"
            />
          </View>
        </Animated.View>

        {/* XP Milestones */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>XP Milestones</Text>
            <View style={styles.xpToNextBadge}>
              <Text style={styles.xpToNextText}>{xpToNext > 0 ? `${xpToNext} XP to next` : '🎉 Max Level!'}</Text>
            </View>
          </View>
          <View style={styles.milestoneCard}>
            <View style={styles.milestoneRow}>
              {MILESTONES.map((m, i) => {
                const done = totalXP >= m.xp;
                return (
                  <View key={i} style={[styles.milestoneItem, i < MILESTONES.length - 1 && { flex: 1 }]}>
                    <View style={[styles.milestoneCircle, done ? styles.milestoneDone : styles.milestoneUndone]}>
                      <MilestoneIcon done={done} />
                    </View>
                    {i < MILESTONES.length - 1 && (
                      <View style={[styles.milestoneLine, MILESTONES[i + 1]?.xp <= totalXP && styles.milestoneLineDone]} />
                    )}
                  </View>
                );
              })}
            </View>
            <View style={styles.milestoneLabelsRow}>
              {MILESTONES.map((m, i) => (
                <Text key={i} style={[styles.milestoneLabel, totalXP >= m.xp ? { color: '#92400E' } : { color: '#9CA3AF' }, i < MILESTONES.length - 1 && { flex: 1 }]}>{m.label}</Text>
              ))}
            </View>

            <View style={styles.progressSection}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressTitle}>CURRENT PROGRESS</Text>
                <Text style={styles.progressValue}>{totalXP} / 500 XP</Text>
              </View>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${Math.min((totalXP / 500) * 100, 100)}%` }]} />
              </View>
            </View>
          </View>
        </View>

        {/* Filters */}
        <View style={styles.filterSection}>
          {[
            { key: "all", label: `All (${BADGE_DEFINITIONS.length})` },
            { key: "earned", label: `Earned (${earned})` },
            { key: "locked", label: `Locked (${BADGE_DEFINITIONS.length - earned})` },
          ].map(tab => (
            <Pressable
              key={tab.key}
              onPress={() => setFilter(tab.key)}
              style={[styles.filterBtn, filter === tab.key && styles.filterBtnActive]}
            >
              <Text style={[styles.filterText, filter === tab.key && styles.filterTextActive]}>{tab.label}</Text>
            </Pressable>
          ))}
        </View>

        {/* Badges List */}
        <View style={styles.listSection}>
          {filteredBadges.map((b, i) => {
            const earned = isBadgeEarned(b.id);
            return (
              <View key={i} style={[styles.badgeListItem, earned && styles.badgeListItemEarned]}>
                <View style={styles.badgeListIcon}>
                  {earned ? (
                    <View style={[styles.badgeIconCircle, { backgroundColor: b.color + '15' }]}>
                      <Image source={b.image as any} style={styles.badgeListImage} contentFit="contain" />
                    </View>
                  ) : (
                    <View style={[styles.badgeIconCircle, styles.badgeIconLocked]}>
                      <Ionicons name="lock-closed" size={20} color="#9CA3AF" />
                    </View>
                  )}
                </View>

                <View style={styles.badgeListContent}>
                  <View style={styles.badgeListHeader}>
                    <Text style={[styles.badgeListName, earned ? { color: '#1A2C3E' } : { color: '#9CA3AF' }]}>
                      {b.name}
                    </Text>
                    {earned && (
                      <View style={styles.earnedBadge}>
                        <Ionicons name="checkmark-circle" size={14} color="#10B981" />
                        <Text style={styles.earnedBadgeText}>Earned</Text>
                      </View>
                    )}
                  </View>
                  <Text style={[styles.badgeListDesc, earned ? { color: '#4A5C6E' } : { color: '#9CA3AF' }]}>
                    {b.desc}
                  </Text>
                  <View style={[styles.badgeListXp, earned ? { backgroundColor: b.color + '15' } : { backgroundColor: 'rgba(26,44,62,0.06)' }]}>
                    <Text style={[styles.badgeListXpText, earned ? { color: b.color } : { color: '#9CA3AF' }]}>
                      {earned ? '✅ ' : '🔒 '}{b.xpRequired} XP required
                    </Text>
                  </View>
                </View>

                {earned && (
                  <View style={[styles.badgeListCheck, { backgroundColor: b.color }]}>
                    <Ionicons name="checkmark" size={16} color="#fff" />
                  </View>
                )}
              </View>
            );
          })}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
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
  scrollContent: {
    paddingBottom: 100,
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eaf5fd',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 14,
    color: '#4A5C6E',
  },

  // Top Bar
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 16,
    paddingBottom: 12,
  },
  logoText: {
    color: '#1A2C3E',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 3,
    textShadowColor: 'rgba(255,215,0,0.08)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 12,
  },
  topBarRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  streakBadge: {
    backgroundColor: 'rgba(255,255,255,0.75)',
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  streakText: {
    color: '#1A2C3E',
    fontSize: 13,
    fontWeight: '700',
  },

  // Hero Card
  heroCard: {
    backgroundColor: 'rgba(255,255,255,0.75)',
    borderRadius: 28,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 20,
    elevation: 4,
  },
  heroContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroTextContent: {
    flex: 1,
    paddingRight: 8,
  },
  heroSubtitle: {
    color: '#4A5C6E',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1A2C3E',
    marginBottom: 10,
  },
  heroBadgesRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  heroBadge: {
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  heroBadgeOrange: {
    backgroundColor: 'rgba(245,158,11,0.13)',
  },
  heroBadgeTextOrange: {
    fontSize: 12,
    fontWeight: '800',
    color: '#92400E',
  },
  heroBadgeBlue: {
    backgroundColor: 'rgba(46,127,232,0.10)',
  },
  heroBadgeTextBlue: {
    fontSize: 12,
    fontWeight: '800',
    color: '#2E7FE8',
  },
  heroBadgeRed: {
    backgroundColor: 'rgba(239,68,68,0.10)',
  },
  heroBadgeTextRed: {
    fontSize: 12,
    fontWeight: '800',
    color: '#EF4444',
  },
  heroBadgeIcon: {
    width: 16,
    height: 16,
  },
  senyaHero: {
    width: 80,
    height: 80,
  },

  // Section
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1A2C3E',
  },
  xpToNextBadge: {
    backgroundColor: 'rgba(46,127,232,0.08)',
    borderRadius: 99,
    paddingVertical: 3,
    paddingHorizontal: 10,
  },
  xpToNextText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2E7FE8',
  },

  // Milestone Card
  milestoneCard: {
    backgroundColor: 'rgba(255,255,255,0.75)',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  milestoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  milestoneItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  milestoneCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  milestoneDone: {
    backgroundColor: '#D97706',
  },
  milestoneUndone: {
    backgroundColor: 'rgba(26,44,62,0.08)',
    borderWidth: 2,
    borderColor: 'rgba(26,44,62,0.15)',
  },
  milestoneLine: {
    flex: 1,
    height: 4,
    backgroundColor: 'rgba(26,44,62,0.10)',
    borderRadius: 99,
  },
  milestoneLineDone: {
    backgroundColor: '#F59E0B',
  },
  milestoneLabelsRow: {
    flexDirection: 'row',
    marginTop: 8,
  },
  milestoneLabel: {
    fontSize: 9,
    fontWeight: '700',
    textAlign: 'center',
    minWidth: 36,
  },

  progressSection: {
    marginTop: 14,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  progressTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: '#4A5C6E',
    letterSpacing: 0.8,
  },
  progressValue: {
    fontSize: 11,
    fontWeight: '800',
    color: '#1A2C3E',
  },
  progressTrack: {
    backgroundColor: 'rgba(26,44,62,0.10)',
    borderRadius: 99,
    height: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#F59E0B',
    borderRadius: 99,
  },

  // Filters
  filterSection: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  filterBtn: {
    flex: 1,
    paddingVertical: 9,
    backgroundColor: 'rgba(255,255,255,0.75)',
    borderColor: 'rgba(255,255,255,0.3)',
    borderWidth: 1,
    borderRadius: 12,
    alignItems: 'center',
  },
  filterBtnActive: {
    backgroundColor: '#2E7FE8',
    borderWidth: 0,
  },
  filterText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4A5C6E',
  },
  filterTextActive: {
    color: '#fff',
  },

  // Badges List
  listSection: {
    gap: 10,
    paddingBottom: 10,
  },
  badgeListItem: {
    backgroundColor: 'rgba(255,255,255,0.75)',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  badgeListItemEarned: {
    borderColor: 'rgba(46,127,232,0.2)',
  },
  badgeListIcon: {
    marginRight: 14,
  },
  badgeIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeIconLocked: {
    backgroundColor: 'rgba(26,44,62,0.06)',
  },
  badgeListImage: {
    width: 32,
    height: 32,
  },
  badgeListContent: {
    flex: 1,
  },
  badgeListHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  badgeListName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1A2C3E',
  },
  earnedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(16,185,129,0.10)',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  earnedBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#10B981',
  },
  badgeListDesc: {
    fontSize: 12,
    color: '#4A5C6E',
    lineHeight: 16,
    marginBottom: 4,
  },
  badgeListXp: {
    alignSelf: 'flex-start',
    borderRadius: 99,
    paddingVertical: 2,
    paddingHorizontal: 10,
  },
  badgeListXpText: {
    fontSize: 10,
    fontWeight: '700',
  },
  badgeListCheck: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
});