// app/(tabs)/profile.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, SafeAreaView,
  Pressable, Switch, Modal, TextInput, ActivityIndicator,
  Dimensions, Animated, Easing, StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import Svg, {
  Path, Circle, Rect, Line, Polyline, Defs, LinearGradient, Stop,
} from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// ── SKY GRADIENT (matches onboarding) ────────────────────────────────
const GRADIENT = {
  start: '#87CEEB',
  mid: '#B3E5FC',
  mid2: '#E3F2FD',
  end: '#F5F9FF',
};

// ── PALETTE ──────────────────────────────────────────────────────────
const ACCENT = '#2E7FE8';         // Senya blue — primary
const ACCENT_SOFT = 'rgba(46,127,232,0.12)';
const INK = '#1A2C3E';            // dark ink for headings
const INK_SOFT = '#4A5C6E';       // secondary ink
const CARD_BG = 'rgba(255,255,255,0.85)';
const CARD_BORDER = 'rgba(255,255,255,0.9)';

// ── ANIMATED CLOUD (unchanged from onboarding) ───────────────────────
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

// ── SVG Icons ────────────────────────────────────────────────────────
function BellIcon({ size = 20 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke={ACCENT} strokeWidth="2" />
      <Path d="M13.73 21a2 2 0 0 1-3.46 0" stroke={ACCENT} strokeWidth="2" />
    </Svg>
  );
}
function SoundIcon({ size = 20 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M11 5L6 9H2v6h4l5 4V5z" stroke={ACCENT} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" stroke={ACCENT} strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
}
function HapticIcon({ size = 20 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="4" y="4" width="16" height="16" rx="3" stroke={ACCENT} strokeWidth="2" />
      <Rect x="9" y="9" width="6" height="6" rx="1" fill={ACCENT} fillOpacity="0.3" />
    </Svg>
  );
}
function TextSizeIcon({ size = 20 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M4 7V4h16v3M9 20h6M12 4v16" stroke={ACCENT} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
function LanguageIcon({ size = 20 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="9" stroke={ACCENT} strokeWidth="2" />
      <Path d="M3 12h18M12 3a15 15 0 0 0 0 18 15 15 0 0 0 0-18z" stroke={ACCENT} strokeWidth="2" />
    </Svg>
  );
}
function HelpIcon({ size = 20 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="10" stroke={ACCENT} strokeWidth="2" />
      <Path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" stroke={ACCENT} strokeWidth="2" strokeLinecap="round" />
      <Line x1="12" y1="17" x2="12.01" y2="17" stroke={ACCENT} strokeWidth="3" strokeLinecap="round" />
    </Svg>
  );
}
function InfoIcon({ size = 20 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="10" stroke={ACCENT} strokeWidth="2" />
      <Line x1="12" y1="8" x2="12" y2="8" stroke={ACCENT} strokeWidth="3" strokeLinecap="round" />
      <Line x1="12" y1="12" x2="12" y2="16" stroke={ACCENT} strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
}
function ChevronIcon() {
  return (
    <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <Path d="M9 18l6-6-6-6" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
function SignOutIcon() {
  return (
    <Svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <Path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <Polyline points="16 17 21 12 16 7" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <Line x1="21" y1="12" x2="9" y2="12" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
}
function ShareIcon() {
  return (
    <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <Path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7M16 6l-4-4-4 4M12 2v13"
        stroke={INK} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
function BackIcon() {
  return (
    <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <Path d="M19 12H5M12 19l-7-7 7-7" stroke={INK} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

// ── Helpers ──────────────────────────────────────────────────────────
function formatLearningGoal(g: string) { return !g ? 'Not set' : g.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()); }
function formatPracticeTime(t: string) { return !t ? 'Not set' : t.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()); }

// ── Sign Out Modal ───────────────────────────────────────────────────
function SignOutModal({ visible, onClose, onConfirm }: {
  visible: boolean; onClose: () => void; onConfirm: () => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <Pressable style={styles.signOutModal} onPress={e => e.stopPropagation()}>
          <View style={styles.signOutIconBox}><SignOutIcon /></View>
          <Text style={styles.signOutTitle}>Sign Out?</Text>
          <Text style={styles.signOutDesc}>
            You'll need to sign in again to continue your learning streak.
          </Text>
          <View style={styles.signOutBtns}>
            <Pressable style={styles.stayBtn} onPress={onClose}>
              <Text style={styles.stayBtnText}>Stay</Text>
            </Pressable>
            <Pressable style={styles.confirmSignOutBtn} onPress={onConfirm}>
              <Text style={styles.confirmSignOutText}>Sign Out</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

// ── Edit Profile Modal ───────────────────────────────────────────────
function EditProfileModal({ visible, onClose, userName, onSave }: {
  visible: boolean; onClose: () => void; userName: string; onSave: (name: string) => void;
}) {
  const [name, setName] = useState(userName);
  const [showBadges, setShowBadges] = useState(true);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <Pressable style={styles.editModal} onPress={e => e.stopPropagation()}>
          <View style={styles.editModalHeader}>
            <Text style={styles.editModalTitle}>Edit Profile</Text>
            <Pressable style={styles.closeBtn} onPress={onClose}>
              <Text style={styles.closeBtnText}>✕</Text>
            </Pressable>
          </View>

          <View style={styles.avatarEditCenter}>
            <View style={styles.avatarEditRing}>
              <Image
                source={require('../../assets/images/new_characters/senya.png')}
                style={styles.avatarEditImg}
                contentFit="cover"
              />
            </View>
            <Pressable style={styles.changePicBtn}>
              <Text style={styles.changePicText}>Change Avatar</Text>
            </Pressable>
          </View>

          <View style={styles.fieldBlock}>
            <Text style={styles.fieldLabel}>Display Name</Text>
            <TextInput
              style={styles.fieldInput}
              value={name}
              onChangeText={setName}
              placeholder="Enter a nickname"
              placeholderTextColor="#9CA3AF"
            />
            <Text style={styles.fieldNote}>*Your real name cannot be changed</Text>
          </View>

          <View style={styles.badgeToggleRow}>
            <View>
              <Text style={styles.badgeToggleLabel}>Show Badges</Text>
              <Text style={styles.badgeToggleSub}>Display your earned badges on profile</Text>
            </View>
            <Switch
              value={showBadges}
              onValueChange={setShowBadges}
              trackColor={{ false: '#ddd', true: ACCENT }}
              thumbColor="#fff"
            />
          </View>

          <View style={styles.editModalBtns}>
            <Pressable style={styles.cancelEditBtn} onPress={onClose}>
              <Text style={styles.cancelEditText}>Cancel</Text>
            </Pressable>
            <Pressable style={styles.saveBtn} onPress={() => { onSave(name); onClose(); }}>
              <Text style={styles.saveBtnText}>Save Changes</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

// ── MOCK DATA (unchanged) ────────────────────────────────────────────
const MOCK_PROFILE_DATA = {
  user: { first_name: 'John', last_name: 'Doe', fsl_mastery_level: 'Beginner' },
  student: { total_xp: 340, streak_days: 5, fsl_mastery_level: 'Beginner' },
  lessons: [
    { title: 'FSL Alphabet', status: 'completed' },
    { title: 'Greetings', status: 'completed' },
    { title: 'Numbers 1-20', status: 'in_progress' },
    { title: 'Classroom Words', status: 'pending' },
  ],
  learning_path: { learning_goal: 'Everything', practice_time: '30_min' },
};

// ── Main Profile Screen ──────────────────────────────────────────────
export default function Profile() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('Student');
  const [studentLevel, setStudentLevel] = useState('Beginner');
  const [learningGoal, setLearningGoal] = useState('Not set');
  const [practiceTime, setPracticeTime] = useState('Not set');
  const [memberSince] = useState('2026');
  const [totalXp, setTotalXp] = useState(0);
  const [streakDays, setStreakDays] = useState(0);
  const [totalLessons, setTotalLessons] = useState(0);
  const [totalBadges, setTotalBadges] = useState(0);
  const [progressData, setProgressData] = useState<{ name: string, pct: number, color: string }[]>([]);
  const [recentBadges, setRecentBadges] = useState<{ src: any, label: string, earned?: boolean }[]>([]);

  const [notifs, setNotifs] = useState(true);
  const [sound, setSound] = useState(true);
  const [haptic, setHaptic] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSignOutModal, setShowSignOutModal] = useState(false);

  const settingsItems = [
    { label: 'Daily Reminders', sub: 'Get notified to practice', val: notifs, set: setNotifs, Icon: BellIcon },
    { label: 'Sound Effects', sub: 'Play sounds during lessons', val: sound, set: setSound, Icon: SoundIcon },
    { label: 'Haptic Feedback', sub: 'Vibrate on interactions', val: haptic, set: setHaptic, Icon: HapticIcon },
    { label: 'Large Text Mode', sub: 'Bigger text for readability', val: largeText, set: setLargeText, Icon: TextSizeIcon },
  ];
  const accountItems = [
    { label: 'Language Preference', Icon: LanguageIcon },
    { label: 'Help & Support', Icon: HelpIcon },
    { label: 'About SEÑAS', Icon: InfoIcon },
  ];

  // ── Sky animations (matches onboarding) ──
  const cloud1Anim = useRef(new Animated.Value(-200)).current;
  const cloud2Anim = useRef(new Animated.Value(screenWidth + 200)).current;
  const cloud3Anim = useRef(new Animated.Value(-250)).current;
  const sunAnim = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = (anim: Animated.Value, from: number, to: number, dur: number) => {
      const run = () => {
        anim.setValue(from);
        Animated.timing(anim, { toValue: to, duration: dur, easing: Easing.linear, useNativeDriver: true })
          .start(() => run());
      };
      run();
    };
    loop(cloud1Anim, -200, screenWidth + 200, 45000);
    loop(cloud2Anim, screenWidth + 200, -200, 55000);
    loop(cloud3Anim, -250, screenWidth + 250, 50000);

    Animated.loop(Animated.sequence([
      Animated.timing(sunAnim, { toValue: 1, duration: 3000, easing: Easing.inOut(Easing.ease), useNativeDriver: false }),
      Animated.timing(sunAnim, { toValue: 0, duration: 3000, easing: Easing.inOut(Easing.ease), useNativeDriver: false }),
    ])).start();

    Animated.loop(Animated.sequence([
      Animated.timing(floatAnim, { toValue: 1, duration: 2400, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      Animated.timing(floatAnim, { toValue: 0, duration: 2400, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
    ])).start();
  }, []);

  const sunGlow = sunAnim.interpolate({ inputRange: [0, 1], outputRange: [0.3, 0.75] });
  const floatY = floatAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -8] });

  useEffect(() => { fetchProfileData(); }, []);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        const user = JSON.parse(userData);
        const student = user.student;
        const fullName = `${student?.first_name || ''} ${student?.last_name || ''}`.trim();
        setUserName(fullName || 'Student');
        setStudentLevel(student?.fsl_mastery_level || 'Beginner');
        setTotalXp(student?.total_xp || MOCK_PROFILE_DATA.student.total_xp);
        setStreakDays(student?.streak_days || MOCK_PROFILE_DATA.student.streak_days);
        useMockData(student?.total_xp || MOCK_PROFILE_DATA.student.total_xp);
      } else {
        useMockData(MOCK_PROFILE_DATA.student.total_xp);
        const defaultUser = {
          student: {
            first_name: MOCK_PROFILE_DATA.user.first_name,
            last_name: MOCK_PROFILE_DATA.user.last_name,
            fsl_mastery_level: MOCK_PROFILE_DATA.user.fsl_mastery_level,
            total_xp: MOCK_PROFILE_DATA.student.total_xp,
            streak_days: MOCK_PROFILE_DATA.student.streak_days,
          },
        };
        await AsyncStorage.setItem('userData', JSON.stringify(defaultUser));
        setUserName(`${MOCK_PROFILE_DATA.user.first_name} ${MOCK_PROFILE_DATA.user.last_name}`);
        setStudentLevel(MOCK_PROFILE_DATA.user.fsl_mastery_level);
      }
      if (MOCK_PROFILE_DATA.learning_path) {
        setLearningGoal(formatLearningGoal(MOCK_PROFILE_DATA.learning_path.learning_goal));
        setPracticeTime(formatPracticeTime(MOCK_PROFILE_DATA.learning_path.practice_time));
      }
    } catch (e) {
      console.error(e);
      useMockData(MOCK_PROFILE_DATA.student.total_xp);
      setUserName(`${MOCK_PROFILE_DATA.user.first_name} ${MOCK_PROFILE_DATA.user.last_name}`);
      setStudentLevel(MOCK_PROFILE_DATA.user.fsl_mastery_level);
      setLearningGoal(formatLearningGoal(MOCK_PROFILE_DATA.learning_path.learning_goal));
      setPracticeTime(formatPracticeTime(MOCK_PROFILE_DATA.learning_path.practice_time));
    } finally {
      setLoading(false);
    }
  };

  const useMockData = (xp: number) => {
    setTotalXp(xp);
    setStreakDays(MOCK_PROFILE_DATA.student.streak_days);
    const completed = MOCK_PROFILE_DATA.lessons.filter(l => l.status === 'completed');
    setTotalLessons(completed.length);
    const earned = Math.min(Math.floor(xp / 50) + 1, 8);
    setTotalBadges(earned > 0 ? Math.min(earned, 8) : 0);

    const colors = [ACCENT, '#10B981', '#F59E0B', '#8B5CF6'];
    const progressItems = MOCK_PROFILE_DATA.lessons.slice(0, 4).map((lesson, index) => ({
      name: lesson.title,
      pct: lesson.status === 'completed' ? 100 : lesson.status === 'in_progress' ? 50 : 0,
      color: colors[index % colors.length],
    }));
    setProgressData(progressItems);

    const badgeData = [
      { xp: 0, label: 'First Step', src: require('../../assets/images/img/first_step.png') },
      { xp: 50, label: 'Alphabet Star', src: require('../../assets/images/img/alphabet_star.png') },
      { xp: 100, label: 'Streak Starter', src: require('../../assets/images/img/streak1.png') },
      { xp: 150, label: 'Greeter', src: require('../../assets/images/img/greetings.png') },
      { xp: 200, label: 'Quiz Whiz', src: require('../../assets/images/img/locked.png') },
      { xp: 250, label: 'Sign Detective', src: require('../../assets/images/img/locked.png') },
      { xp: 300, label: 'Number Ninja', src: require('../../assets/images/img/locked.png') },
      { xp: 350, label: 'Week Warrior', src: require('../../assets/images/img/locked.png') },
    ];
    setRecentBadges(badgeData.map(b => ({ ...b, earned: xp >= b.xp })));
  };

  // XP progression (level = 100 XP per level, purely visual)
  const level = Math.max(1, Math.floor(totalXp / 100) + 1);
  const xpInLevel = totalXp % 100;
  const xpToNext = 100;
  const xpPct = Math.min(100, (xpInLevel / xpToNext) * 100);

  const stats = [
    { label: 'Lessons', value: totalLessons.toString(), icon: require('../../assets/images/img/lesson.png'), color: ACCENT },
    { label: 'Total XP', value: totalXp.toString(), icon: require('../../assets/images/img/energy.png'), color: '#F59E0B' },
    { label: 'Streak', value: `${streakDays}d`, icon: require('../../assets/images/img/streak.png'), color: '#EF4444' },
    { label: 'Badges', value: totalBadges.toString(), icon: require('../../assets/images/img/badges.png'), color: '#8B5CF6' },
  ];

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={ACCENT} />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      {/* ── Sky Gradient Background ── */}
      <View style={StyleSheet.absoluteFillObject}>
        <Svg width={screenWidth} height={screenHeight}>
          <Defs>
            <LinearGradient id="bgGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor={GRADIENT.start} stopOpacity="1" />
              <Stop offset="35%" stopColor={GRADIENT.mid} stopOpacity="0.9" />
              <Stop offset="70%" stopColor={GRADIENT.mid2} stopOpacity="0.85" />
              <Stop offset="100%" stopColor={GRADIENT.end} stopOpacity="0.95" />
            </LinearGradient>
          </Defs>
          <Rect width={screenWidth} height={screenHeight} fill="url(#bgGrad)" />
        </Svg>
      </View>

      {/* ── Sun with Glow ── */}
      <Animated.View style={[styles.sunContainer, { opacity: sunGlow }]} pointerEvents="none">
        <Svg width="120" height="120" viewBox="0 0 120 120">
          <Circle cx="60" cy="60" r="45" fill="#FCD34D" opacity="0.9" />
          <Circle cx="60" cy="60" r="55" fill="#FCD34D" opacity="0.3" />
          <Circle cx="60" cy="60" r="70" fill="#FCD34D" opacity="0.1" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((a, i) => (
            <Rect key={i} x="54" y="5" width="12" height="20" rx="6" fill="#FCD34D" opacity="0.6" transform={`rotate(${a}, 60, 60)`} />
          ))}
        </Svg>
      </Animated.View>

      {/* ── Floating Clouds ── */}
      <View style={styles.floatingSky} pointerEvents="none">
        <Animated.View style={[styles.cloudWrapper, { top: 90, transform: [{ translateX: cloud1Anim }] }]}>
          <AnimatedCloud scale={1.5} opacity={0.4} />
        </Animated.View>
        <Animated.View style={[styles.cloudWrapper, { top: 260, transform: [{ translateX: cloud2Anim }] }]}>
          <AnimatedCloud scale={1.2} opacity={0.3} />
        </Animated.View>
        <Animated.View style={[styles.cloudWrapper, { top: 460, transform: [{ translateX: cloud3Anim }] }]}>
          <AnimatedCloud scale={1.7} opacity={0.32} />
        </Animated.View>
      </View>

      <SafeAreaView style={{ flex: 1 }}>
        <EditProfileModal
          visible={showEditModal}
          onClose={() => setShowEditModal(false)}
          userName={userName}
          onSave={setUserName}
        />
        <SignOutModal
          visible={showSignOutModal}
          onClose={() => setShowSignOutModal(false)}
          onConfirm={() => { setShowSignOutModal(false); router.replace('/onboarding'); }}
        />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 110 }}>

          {/* ── Top Bar ── */}
          <View style={styles.topBar}>
            <Pressable style={styles.iconBtn} onPress={() => router.back?.()}>
              <BackIcon />
            </Pressable>
            <Text style={styles.topTitle}>My Profile</Text>
            <Pressable style={styles.iconBtn}>
              <ShareIcon />
            </Pressable>
          </View>

          {/* ── HERO: Avatar + Quick Pills (inspired layout) ── */}
          <View style={styles.heroRow}>
            {/* Avatar on the sky, no card */}
            <View style={styles.avatarSlot}>
              <Animated.View style={{ transform: [{ translateY: floatY }] }}>
                <Image
                  source={require('../../assets/images/new_characters/senya.png')}
                  style={styles.heroAvatar}
                  contentFit="contain"
                />
              </Animated.View>
              <View style={styles.avatarShadow} />
              <Pressable style={styles.editAvatarBtn} onPress={() => setShowEditModal(true)}>
                <Text style={styles.editAvatarIcon}>✎</Text>
              </Pressable>
            </View>

            {/* Right-side quick pills */}
            <View style={styles.pillsCol}>
              <Pressable style={styles.pill}>
                <View style={styles.pillTextCol}>
                  <Text style={styles.pillTitle}>Rank</Text>
                  <Text style={styles.pillSub}>#1,232</Text>
                </View>
                <ChevronIcon />
              </Pressable>
              <Pressable style={styles.pill}>
                <View style={styles.pillTextCol}>
                  <Text style={styles.pillTitle}>Shop</Text>
                  <Text style={styles.pillSub}>🎧 🧢 👕</Text>
                </View>
                <ChevronIcon />
              </Pressable>
              <Pressable style={styles.pill}>
                <View style={styles.pillTextCol}>
                  <Text style={styles.pillTitle}>Rewards</Text>
                  <Text style={styles.pillSub}>🏆 🎁</Text>
                </View>
                <ChevronIcon />
              </Pressable>
            </View>
          </View>

          {/* ── Name + Level bar ── */}
          <View style={styles.nameBlock}>
            <Text style={styles.userName}>{userName}</Text>
            <View style={styles.metaRow}>
              <View style={styles.levelPill}>
                <Text style={styles.levelPillText}>LVL {level}</Text>
              </View>
              <Text style={styles.metaText}>FSL {studentLevel} · Since {memberSince}</Text>
            </View>

            <View style={styles.xpTrack}>
              <View style={[styles.xpFill, { width: `${xpPct}%` as any }]} />
            </View>
            <Text style={styles.xpText}>{xpInLevel} / {xpToNext} XP to Level {level + 1}</Text>
          </View>

          {/* ── Stats strip (4 quick tiles) ── */}
          <View style={styles.statsStrip}>
            {stats.map((s, i) => (
              <View key={i} style={styles.statTile}>
                <View style={[styles.statIconBox, { backgroundColor: s.color + '22' }]}>
                  <Image source={s.icon} style={styles.statIcon} contentFit="contain" />
                </View>
                <Text style={styles.statValue}>{s.value}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
            ))}
          </View>

          {/* ── Achievements (hero section, horizontal scroll) ── */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Achievements</Text>
              <Text style={styles.sectionCount}>{totalBadges} / {recentBadges.length}</Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.badgeScroll}
            >
              {recentBadges.map((b, i) => (
                <View key={i} style={styles.badgeCard}>
                  <View style={[
                    styles.badgeRing,
                    b.earned
                      ? { borderColor: ACCENT, backgroundColor: '#FFFFFF' }
                      : { borderColor: 'rgba(15,49,114,0.10)', backgroundColor: 'rgba(255,255,255,0.6)' },
                  ]}>
                    <Image
                      source={b.src}
                      style={[styles.badgeImg, !b.earned && { opacity: 0.45 }]}
                      contentFit="contain"
                    />
                    {b.earned && (
                      <View style={styles.badgeCheck}>
                        <Text style={styles.badgeCheckMark}>✓</Text>
                      </View>
                    )}
                  </View>
                  <Text style={[
                    styles.badgeCardLabel,
                    !b.earned && { color: '#9CA3AF' },
                  ]} numberOfLines={2}>
                    {b.label}
                  </Text>
                </View>
              ))}
            </ScrollView>
          </View>

          {/* ── Learning Path ── */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Learning Path</Text>
            <View style={styles.glassCard}>
              <View style={styles.pathItem}>
                <View style={[styles.pathIconBox, { backgroundColor: ACCENT_SOFT }]}>
                  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="2">
                    <Path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </Svg>
                </View>
                <View style={styles.pathInfo}>
                  <Text style={styles.pathLabel}>Your Level</Text>
                  <Text style={styles.pathValue}>{studentLevel}</Text>
                </View>
              </View>
              <View style={styles.divider} />
              <View style={styles.pathItem}>
                <View style={[styles.pathIconBox, { backgroundColor: 'rgba(16,185,129,0.12)' }]}>
                  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2">
                    <Path d="M12 6V2l4 4-4 4V8c-3.3 0-6 2.7-6 6s2.7 6 6 6 6-2.7 6-6h2c0 4.4-3.6 8-8 8s-8-3.6-8-8 3.6-8 8-8z" />
                  </Svg>
                </View>
                <View style={styles.pathInfo}>
                  <Text style={styles.pathLabel}>Learning Goal</Text>
                  <Text style={styles.pathValue}>{learningGoal}</Text>
                </View>
              </View>
              <View style={styles.divider} />
              <View style={styles.pathItem}>
                <View style={[styles.pathIconBox, { backgroundColor: 'rgba(251,191,36,0.14)' }]}>
                  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2">
                    <Circle cx="12" cy="12" r="10" />
                    <Polyline points="12 6 12 12 16 14" />
                  </Svg>
                </View>
                <View style={styles.pathInfo}>
                  <Text style={styles.pathLabel}>Practice Time</Text>
                  <Text style={styles.pathValue}>{practiceTime}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* ── Learning Progress ── */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Learning Progress</Text>
            <View style={styles.glassCard}>
              {progressData.map((item, i) => (
                <View key={i} style={[styles.progressItem, i < progressData.length - 1 && styles.progressItemBorder]}>
                  <View style={styles.progressHeader}>
                    <Text style={styles.progressName}>{item.name}</Text>
                    <Text style={[styles.progressPct, { color: item.color }]}>{item.pct}%</Text>
                  </View>
                  <View style={styles.progressTrack}>
                    <View style={[styles.progressFill, { width: `${item.pct}%` as any, backgroundColor: item.color }]} />
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* ── Settings ── */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Settings</Text>
            <View style={[styles.glassCard, { padding: 0, overflow: 'hidden' }]}>
              {settingsItems.map(({ label, sub, val, set, Icon }, i) => (
                <View key={i} style={[styles.settingRow, i < settingsItems.length - 1 && styles.settingBorder]}>
                  <View style={styles.settingIconBox}><Icon size={20} /></View>
                  <View style={styles.settingText}>
                    <Text style={styles.settingLabel}>{label}</Text>
                    <Text style={styles.settingSub}>{sub}</Text>
                  </View>
                  <Switch
                    value={val}
                    onValueChange={set}
                    trackColor={{ false: 'rgba(15,49,114,0.15)', true: ACCENT }}
                    thumbColor="#fff"
                  />
                </View>
              ))}
            </View>
          </View>

          {/* ── Account ── */}
          <View style={styles.section}>
            <View style={[styles.glassCard, { padding: 0, overflow: 'hidden' }]}>
              {accountItems.map(({ label, Icon }, i) => (
                <Pressable key={i} style={[styles.accountRow, i < accountItems.length - 1 && styles.settingBorder]}>
                  <View style={styles.settingIconBox}><Icon size={20} /></View>
                  <Text style={styles.accountLabel}>{label}</Text>
                  <ChevronIcon />
                </Pressable>
              ))}
            </View>
          </View>

          {/* ── Sign Out ── */}
          <View style={[styles.section, { marginTop: 6 }]}>
            <Pressable style={styles.signOutBtn} onPress={() => setShowSignOutModal(true)}>
              <Text style={styles.signOutBtnText}>Sign Out</Text>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: GRADIENT.start },
  loadingContainer: { alignItems: 'center', justifyContent: 'center' },
  loadingText: { marginTop: 16, fontSize: 14, color: INK_SOFT },

  // Sky
  sunContainer: { position: 'absolute', top: 30, right: -20, zIndex: 0 },
  floatingSky: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0, overflow: 'hidden' },
  cloudWrapper: { position: 'absolute', left: 0 },

  // Top bar
  topBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: 8, paddingBottom: 4,
  },
  topTitle: { fontSize: 15, fontWeight: '800', color: INK, letterSpacing: 0.3 },
  iconBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.85)',
    alignItems: 'center', justifyContent: 'center',
  },

  // Hero row (avatar left, pills right)
  heroRow: {
    flexDirection: 'row',
    paddingHorizontal: 18,
    paddingTop: 10,
    gap: 12,
    alignItems: 'center',
  },
  avatarSlot: {
    width: 150, height: 170,
    alignItems: 'center', justifyContent: 'flex-end',
    position: 'relative',
  },
  heroAvatar: { width: 150, height: 160 },
  avatarShadow: {
    position: 'absolute', bottom: 4, alignSelf: 'center',
    width: 110, height: 14, borderRadius: 999,
    backgroundColor: 'rgba(26,44,62,0.18)',
    transform: [{ scaleX: 1.1 }],
  },
  editAvatarBtn: {
    position: 'absolute', bottom: 12, right: 10,
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: '#FBBF24',
    borderWidth: 3, borderColor: '#FFFFFF',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#0F3172', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2, shadowRadius: 8, elevation: 6,
  },
  editAvatarIcon: { color: INK, fontSize: 15, fontWeight: '800' },

  pillsCol: { flex: 1, gap: 10 },
  pill: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 22,
    paddingVertical: 10, paddingHorizontal: 16,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.9)',
    shadowColor: '#0F3172', shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.10, shadowRadius: 14, elevation: 4,
  },
  pillTextCol: { flex: 1 },
  pillTitle: { fontSize: 13, fontWeight: '800', color: INK },
  pillSub: { fontSize: 11, fontWeight: '600', color: INK_SOFT, marginTop: 2 },

  // Name + XP
  nameBlock: { paddingHorizontal: 20, marginTop: 14 },
  userName: { fontSize: 26, fontWeight: '900', color: INK, letterSpacing: -0.3 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 6 },
  levelPill: {
    backgroundColor: ACCENT,
    paddingVertical: 3, paddingHorizontal: 10,
    borderRadius: 999,
  },
  levelPillText: { color: '#fff', fontSize: 11, fontWeight: '800', letterSpacing: 1 },
  metaText: { fontSize: 12, color: INK_SOFT, fontWeight: '600' },
  xpTrack: {
    marginTop: 12, height: 10, borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.9)',
    overflow: 'hidden',
  },
  xpFill: {
    height: '100%', borderRadius: 999,
    backgroundColor: ACCENT,
  },
  xpText: { fontSize: 11, fontWeight: '700', color: INK_SOFT, marginTop: 6 },

  // Stats strip
  statsStrip: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: 18,
    gap: 8,
  },
  statTile: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: 20,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.9)',
    paddingVertical: 12, alignItems: 'center', gap: 4,
    shadowColor: '#0F3172', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08, shadowRadius: 10, elevation: 3,
  },
  statIconBox: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  statIcon: { width: 22, height: 22 },
  statValue: { fontSize: 17, fontWeight: '800', color: INK },
  statLabel: { fontSize: 10, color: INK_SOFT, fontWeight: '700' },

  // Sections
  section: { paddingHorizontal: 16, marginTop: 22 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 },
  sectionTitle: { fontSize: 17, fontWeight: '800', color: INK },
  sectionCount: { fontSize: 12, fontWeight: '700', color: INK_SOFT },

  // Achievements
  badgeScroll: { gap: 12, paddingRight: 8, paddingLeft: 2 },
  badgeCard: { width: 88, alignItems: 'center', gap: 6 },
  badgeRing: {
    width: 78, height: 78, borderRadius: 24,
    borderWidth: 2,
    alignItems: 'center', justifyContent: 'center',
    position: 'relative',
    shadowColor: '#0F3172', shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.10, shadowRadius: 12, elevation: 4,
  },
  badgeImg: { width: 54, height: 54 },
  badgeCheck: {
    position: 'absolute', top: -6, right: -6,
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: '#10B981',
    borderWidth: 2, borderColor: '#fff',
    alignItems: 'center', justifyContent: 'center',
  },
  badgeCheckMark: { color: '#fff', fontSize: 12, fontWeight: '900', marginTop: -1 },
  badgeCardLabel: { fontSize: 11, fontWeight: '700', color: INK, textAlign: 'center' },

  // Glass card
  glassCard: {
    backgroundColor: CARD_BG,
    borderWidth: 1, borderColor: CARD_BORDER,
    borderRadius: 22, padding: 18,
    shadowColor: '#0F3172', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.10, shadowRadius: 16, elevation: 4,
  },

  // Learning path
  pathItem: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  pathIconBox: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  pathInfo: { flex: 1 },
  pathLabel: { fontSize: 11, color: INK_SOFT, fontWeight: '600' },
  pathValue: { fontSize: 15, fontWeight: '800', color: INK, marginTop: 2 },
  divider: { height: 1, backgroundColor: 'rgba(15,49,114,0.08)', marginVertical: 12 },

  // Progress
  progressItem: { paddingBottom: 14, marginBottom: 14 },
  progressItemBorder: { borderBottomWidth: 1, borderBottomColor: 'rgba(15,49,114,0.08)' },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  progressName: { fontSize: 13, fontWeight: '700', color: INK },
  progressPct: { fontSize: 12, fontWeight: '800' },
  progressTrack: { backgroundColor: 'rgba(15,49,114,0.10)', borderRadius: 99, height: 6, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 99 },

  // Settings & Account
  settingRow: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 14, paddingHorizontal: 18 },
  settingBorder: { borderBottomWidth: 1, borderBottomColor: 'rgba(15,49,114,0.08)' },
  settingIconBox: { width: 40, height: 40, borderRadius: 12, backgroundColor: ACCENT_SOFT, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  settingText: { flex: 1 },
  settingLabel: { fontSize: 14, fontWeight: '700', color: INK },
  settingSub: { fontSize: 11, color: INK_SOFT, fontWeight: '500', marginTop: 2 },
  accountRow: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 16, paddingHorizontal: 18 },
  accountLabel: { flex: 1, fontSize: 14, fontWeight: '700', color: INK },

  // Sign out
  signOutBtn: {
    paddingVertical: 14, borderRadius: 60,
    backgroundColor: 'rgba(239,68,68,0.10)',
    borderWidth: 1, borderColor: 'rgba(239,68,68,0.25)',
    alignItems: 'center',
  },
  signOutBtnText: { fontSize: 15, fontWeight: '700', color: '#DC2626' },

  // Modals
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center', padding: 20 },
  signOutModal: {
    width: '88%', maxWidth: 340,
    backgroundColor: 'rgba(255,255,255,0.97)',
    borderRadius: 28, padding: 28, alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 20 }, shadowOpacity: 0.18, shadowRadius: 48, elevation: 24,
  },
  signOutIconBox: {
    width: 60, height: 60, borderRadius: 30,
    backgroundColor: 'rgba(239,68,68,0.10)',
    borderWidth: 1.5, borderColor: 'rgba(239,68,68,0.18)',
    alignItems: 'center', justifyContent: 'center', marginBottom: 16,
  },
  signOutTitle: { fontSize: 20, fontWeight: '800', color: INK, marginBottom: 8 },
  signOutDesc: { fontSize: 13, color: INK_SOFT, fontWeight: '500', lineHeight: 20, marginBottom: 24, textAlign: 'center' },
  signOutBtns: { flexDirection: 'row', gap: 12, width: '100%' },
  stayBtn: {
    flex: 1, paddingVertical: 13,
    backgroundColor: 'rgba(15,49,114,0.07)',
    borderWidth: 1, borderColor: 'rgba(15,49,114,0.10)',
    borderRadius: 40, alignItems: 'center',
  },
  stayBtnText: { fontSize: 14, fontWeight: '700', color: INK },
  confirmSignOutBtn: {
    flex: 1.3, paddingVertical: 13,
    backgroundColor: '#DC2626', borderRadius: 40, alignItems: 'center',
    shadowColor: '#DC2626', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 14, elevation: 8,
  },
  confirmSignOutText: { fontSize: 14, fontWeight: '700', color: '#fff' },

  editModal: {
    width: '90%', maxWidth: 380,
    backgroundColor: 'rgba(255,255,255,0.97)',
    borderRadius: 32, padding: 24,
    shadowColor: '#000', shadowOffset: { width: 0, height: 20 }, shadowOpacity: 0.2, shadowRadius: 40, elevation: 24,
  },
  editModalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  editModalTitle: { fontSize: 20, fontWeight: '800', color: INK },
  closeBtn: { width: 32, height: 32, borderRadius: 12, backgroundColor: 'rgba(0,0,0,0.05)', alignItems: 'center', justifyContent: 'center' },
  closeBtnText: { fontSize: 16, color: INK_SOFT },
  avatarEditCenter: { alignItems: 'center', marginBottom: 24, gap: 12 },
  avatarEditRing: {
    width: 100, height: 100, borderRadius: 50,
    borderWidth: 3, borderColor: 'rgba(255,255,255,0.5)',
    overflow: 'hidden', backgroundColor: ACCENT,
    shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.15, shadowRadius: 20, elevation: 8,
  },
  avatarEditImg: { width: '100%', height: '100%' },
  changePicBtn: {
    backgroundColor: ACCENT_SOFT,
    borderWidth: 1, borderColor: 'rgba(46,127,232,0.3)',
    borderRadius: 40, paddingVertical: 8, paddingHorizontal: 16,
  },
  changePicText: { fontSize: 12, fontWeight: '700', color: ACCENT },
  fieldBlock: { marginBottom: 20 },
  fieldLabel: { fontSize: 13, fontWeight: '700', color: INK, marginBottom: 6 },
  fieldInput: {
    borderWidth: 1, borderColor: 'rgba(0,0,0,0.1)', borderRadius: 16,
    paddingVertical: 12, paddingHorizontal: 16, fontSize: 14,
    backgroundColor: 'rgba(255,255,255,0.9)', color: INK,
  },
  fieldNote: { fontSize: 10, color: '#9CA3AF', marginTop: 4 },
  badgeToggleRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 12,
    borderTopWidth: 1, borderBottomWidth: 1, borderColor: 'rgba(0,0,0,0.05)',
    marginBottom: 24,
  },
  badgeToggleLabel: { fontSize: 14, fontWeight: '700', color: INK },
  badgeToggleSub: { fontSize: 11, color: INK_SOFT, marginTop: 2 },
  editModalBtns: { flexDirection: 'row', gap: 12 },
  cancelEditBtn: {
    flex: 1, paddingVertical: 12,
    backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: 40, alignItems: 'center',
  },
  cancelEditText: { fontSize: 14, fontWeight: '700', color: INK_SOFT },
  saveBtn: {
    flex: 1.5, paddingVertical: 12,
    backgroundColor: ACCENT, borderRadius: 40, alignItems: 'center',
    shadowColor: ACCENT, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 14, elevation: 8,
  },
  saveBtnText: { fontSize: 14, fontWeight: '700', color: '#fff' },
});
