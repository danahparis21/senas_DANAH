import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  Pressable,
  Animated,
  Easing,
  StatusBar,
  Modal,
  Linking
} from 'react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import Svg, { Path, Rect, Defs, LinearGradient, Stop, Circle } from 'react-native-svg';

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

export default function RoleSelect() {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);

  // ── Animations ──
  const scaleStudent = useState(new Animated.Value(1))[0];
  const scaleTeacher = useState(new Animated.Value(1))[0];

  // ── Cloud Animations ──
  const cloud1Anim = useState(new Animated.Value(-200))[0];
  const cloud2Anim = useState(new Animated.Value(screenWidth + 200))[0];
  const cloud3Anim = useState(new Animated.Value(-250))[0];
  const cloud4Anim = useState(new Animated.Value(screenWidth + 250))[0];

  // ── Sun Glow Animation ──
  const sunAnim = useState(new Animated.Value(0))[0];

  // ── Cloud Loops ──
  React.useEffect(() => {
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

    // ── Sun Glow Loop ──
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

    return () => {
      // Cleanup not needed for looping animations
    };
  }, []);

  const pickRole = (role: string) => {
    setSelected(role);

    // Animate the selected card
    if (role === 'student') {
      Animated.spring(scaleStudent, {
        toValue: 1.05,
        friction: 5,
        tension: 80,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.spring(scaleTeacher, {
        toValue: 1.05,
        friction: 5,
        tension: 80,
        useNativeDriver: true,
      }).start();
    }

    if (role === 'teacher') {
      setTimeout(() => setShowPopup(true), 400);
    }
    if (role === 'student') {
      setTimeout(() => router.replace('/login'), 400);
    }
  };

  // ── Sun Glow Interpolation ──
  const sunGlow = sunAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.8],
  });

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

      {/* ── Main Content ── */}
      <View style={styles.content}>
        {/* Top Bar */}
        <View style={styles.topBar}>
          <Text style={styles.logoText}>SEÑAS</Text>
        </View>

        {/* Hero Section */}
        <View style={styles.hero}>
          <View style={styles.heroImageContainer}>
            <Image
              source={require('../assets/images/new_characters/senya.png')}
              style={styles.heroImage}
              contentFit="contain"
            />
          </View>

          <View style={styles.badgeContainer}>
            <View style={styles.badgeDot} />
            <Text style={styles.badgeText}>CHOOSE YOUR ROLE</Text>
          </View>

          <Text style={styles.title}>Who are you?</Text>
          <Text style={styles.subtitle}>Select your role to get started</Text>
        </View>

        {/* ── Circular Cards ── */}
        <View style={styles.cardsContainer}>
          {/* STUDENT CARD */}
          <Pressable
            onPress={() => pickRole('student')}
            style={({ pressed }) => ({
              opacity: pressed ? 0.8 : 1,
            })}
          >
            <Animated.View
              style={[
                styles.roleCard,
                styles.studentCard,
                selected === 'student' && styles.roleCardSelectedStudent,
                (selected && selected !== 'student') && styles.roleCardFaded,
                { transform: [{ scale: selected === 'student' ? scaleStudent : 1 }] }
              ]}
            >
              <View style={styles.cardCircle}>
                <View style={[styles.cardCircleInner, { backgroundColor: 'rgba(46, 127, 232, 0.10)' }]}>
                  <Image
                    source={require('../assets/images/img/student.png')}
                    style={styles.cardIcon}
                    contentFit="contain"
                  />
                </View>
              </View>
              <View style={styles.cardLabelContainer}>
                <View style={[styles.cardLabel, { backgroundColor: 'rgba(46, 127, 232, 0.10)' }]}>
                  <Text style={[styles.cardLabelText, { color: '#2E7FE8' }]}>STUDENT</Text>
                </View>
              </View>
              <Text style={styles.cardTitle}>I'm here to learn</Text>
              <Text style={styles.cardDesc}>Access lessons, quizzes, gesture recognition, and earn badges.</Text>
            </Animated.View>
          </Pressable>

          {/* TEACHER CARD */}
          <Pressable
            onPress={() => pickRole('teacher')}
            style={({ pressed }) => ({
              opacity: pressed ? 0.8 : 1,
            })}
          >
            <Animated.View
              style={[
                styles.roleCard,
                styles.teacherCard,
                selected === 'teacher' && styles.roleCardSelectedTeacher,
                (selected && selected !== 'teacher') && styles.roleCardFaded,
                { transform: [{ scale: selected === 'teacher' ? scaleTeacher : 1 }] }
              ]}
            >
              <View style={styles.cardCircle}>
                <View style={[styles.cardCircleInner, { backgroundColor: 'rgba(5, 150, 105, 0.10)' }]}>
                  <Image
                    source={require('../assets/images/img/teacher.png')}
                    style={styles.cardIcon}
                    contentFit="contain"
                  />
                </View>
              </View>
              <View style={styles.cardLabelContainer}>
                <View style={[styles.cardLabel, { backgroundColor: 'rgba(5, 150, 105, 0.10)' }]}>
                  <Text style={[styles.cardLabelText, { color: '#059669' }]}>TEACHER</Text>
                </View>
              </View>
              <Text style={styles.cardTitle}>I'm here to teach</Text>
              <Text style={styles.cardDesc}>Manage classes, monitor student progress from a web dashboard.</Text>
            </Animated.View>
          </Pressable>
        </View>

        <Text style={styles.footerNote}>You can always change your role in Settings later.</Text>
      </View>

      {/* Teacher Popup Modal */}
      <Modal visible={showPopup} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHandle} />
            <Image
              source={require('../assets/images/new_characters/senya.png')}
              style={styles.modalLogo}
              contentFit="contain"
            />
            <Text style={styles.modalTitle}>You're heading to the teacher portal!</Text>
            <Text style={styles.modalDesc}>
              The SEÑAS teacher dashboard is a web-based platform. You'll be redirected to log in and manage your classes.
            </Text>
            <View style={styles.modalUrlBox}>
              <Text style={styles.modalUrlText}>teacher.senas.edu.ph</Text>
            </View>
            <View style={styles.modalActions}>
              <Pressable
                style={[styles.modalBtn, styles.modalBackBtn]}
                onPress={() => { setShowPopup(false); setSelected(null); }}
              >
                <Text style={styles.modalBackBtnText}>← Back</Text>
              </Pressable>
              <Pressable
                style={[styles.modalBtn, styles.modalPrimaryBtn]}
                onPress={() => {
                  Linking.openURL('https://teacher.senas.edu.ph');
                  setShowPopup(false);
                  setSelected(null);
                }}
              >
                <Text style={styles.modalPrimaryBtnText}>Open Dashboard →</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
    zIndex: 1,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    marginBottom: 8,
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
  hero: {
    alignItems: 'center',
    marginBottom: 20,
  },
  heroImageContainer: {
    marginBottom: 12,
  },
  heroImage: {
    width: 80,
    height: 80,
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(46, 127, 232, 0.08)',
    borderRadius: 99,
    paddingVertical: 4,
    paddingHorizontal: 14,
    marginBottom: 8,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#2E7FE8',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#2E7FE8',
    letterSpacing: 0.8,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1A2C3E',
    marginBottom: 4,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#4A5C6E',
    fontWeight: '500',
    textAlign: 'center',
  },
  cardsContainer: {
    flex: 1,
    gap: 16,
    justifyContent: 'center',
    paddingVertical: 8,
  },
  roleCard: {
    backgroundColor: 'rgba(255,255,255,0.75)',
    backdropFilter: 'blur(20px)',
    borderRadius: 28,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 4,
  },
  studentCard: {
    borderColor: 'rgba(46, 127, 232, 0.15)',
  },
  teacherCard: {
    borderColor: 'rgba(5, 150, 105, 0.15)',
  },
  roleCardSelectedStudent: {
    borderColor: '#2E7FE8',
    borderWidth: 2.5,
    backgroundColor: 'rgba(46, 127, 232, 0.04)',
    shadowColor: '#2E7FE8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  roleCardSelectedTeacher: {
    borderColor: '#059669',
    borderWidth: 2.5,
    backgroundColor: 'rgba(5, 150, 105, 0.04)',
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  roleCardFaded: {
    opacity: 0.5,
  },
  cardCircle: {
    marginBottom: 12,
  },
  cardCircleInner: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardIcon: {
    width: 56,
    height: 56,
  },
  cardLabelContainer: {
    alignItems: 'center',
    marginBottom: 6,
  },
  cardLabel: {
    borderRadius: 6,
    paddingVertical: 2,
    paddingHorizontal: 12,
  },
  cardLabelText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1A2C3E',
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 12.5,
    color: '#4A5C6E',
    lineHeight: 20,
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  footerNote: {
    textAlign: 'center',
    fontSize: 11,
    color: '#8A9AAA',
    fontWeight: '500',
    marginTop: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15,30,80,0.45)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'rgba(255,255,255,0.96)',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    paddingBottom: 40,
    alignItems: 'center',
    backdropFilter: 'blur(20px)',
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 99,
    backgroundColor: '#E5E7EB',
    marginBottom: 20,
  },
  modalLogo: {
    width: 80,
    height: 80,
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1A2C3E',
    textAlign: 'center',
    marginBottom: 8,
  },
  modalDesc: {
    fontSize: 13,
    color: '#4A5C6E',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  modalUrlBox: {
    backgroundColor: 'rgba(5,150,105,0.06)',
    borderColor: 'rgba(5,150,105,0.15)',
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  modalUrlText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#059669',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  modalBtn: {
    flex: 1,
    borderRadius: 60,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBackBtn: {
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
  },
  modalBackBtnText: {
    color: '#1A2C3E',
    fontSize: 14,
    fontWeight: '700',
  },
  modalPrimaryBtn: {
    backgroundColor: '#059669',
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },
  modalPrimaryBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
});