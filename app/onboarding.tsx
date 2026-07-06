import React, { useState, useRef, useEffect } from 'react';
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
} from 'react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import Svg, { Path, Rect, Defs, LinearGradient, Stop, Circle } from 'react-native-svg';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// ── GRADIENT COLORS (unchanged) ──────────────────────────────────────
const GRADIENT = {
  start: '#87CEEB',
  mid: '#B3E5FC',
  mid2: '#E3F2FD',
  end: '#F5F9FF',
};

// ── CHARACTER COLORS ──────────────────────────────────────────────
const CHARACTERS = {
  senya: {
    accent: '#2E7FE8',
    accentLight: 'rgba(46, 127, 232, 0.10)',
    image: require('../assets/images/new_characters/senya.png'),
  },
  flora: {
    accent: '#FF6EB4',
    accentLight: 'rgba(255, 110, 180, 0.10)',
    image: require('../assets/images/new_characters/flora.png'),
  },
  catto: {
    accent: '#FFD700',
    accentLight: 'rgba(255, 215, 0, 0.10)',
    image: require('../assets/images/new_characters/catto.png'),
  },
};

// ── ANIMATED CLOUD (unchanged) ───────────────────────────────────────
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

// ── SLIDES DATA ─────────────────────────────────────────────────────
const SLIDES = [
  {
    id: 0,
    characterKey: 'senya',
    tag: 'Welcome',
    title: 'Your gateway to Filipino Sign Language',
    body: 'SEÑAS is a learning platform that makes FSL accessible to everyone — students, teachers, and curious learners alike.',
    bubbleText: "Hi, I'm Senya! I'll be with you every step of the way. 👋",
  },
  {
    id: 1,
    characterKey: 'flora',
    tag: 'Learn',
    title: 'Interactive lessons at your own pace',
    body: 'Work through structured modules on the FSL alphabet, greetings, numbers, and more. Each lesson builds on the last.',
    bubbleText: "Every expert was once a beginner. Let's start small! ✏️",
    highlights: ['FSL Alphabet', 'Greetings', 'Numbers', 'Classroom Signs'],
  },
  {
    id: 2,
    characterKey: 'senya',
    tag: 'Practice',
    title: 'Real-time hand sign recognition',
    body: 'Use your camera to practice hand signs. SEÑAS watches your gestures and gives you instant feedback on your form.',
    bubbleText: "Hold your hand steady and I'll tell you how you did! 🔍",
    highlights: ['Camera detection', 'Live scoring', 'Form feedback'],
  },
  {
    id: 3,
    characterKey: 'catto',
    tag: 'Achieve',
    title: 'Earn badges, level up, stay motivated',
    body: 'Track your XP, collect achievement badges, and maintain learning streaks. Celebrate every milestone on your FSL journey.',
    bubbleText: "We'll cheer you on every step of the way! 🏆",
    highlights: ['XP system', 'Achievement badges', 'Daily streaks'],
  },
];

export default function Onboarding() {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const slide = SLIDES[current];
  const character = CHARACTERS[slide.characterKey as keyof typeof CHARACTERS];
  const isLast = current === SLIDES.length - 1;

  const next = () => {
    if (isLast) router.replace('/role');
    else setCurrent(current + 1);
  };
  const back = () => {
    if (current > 0) setCurrent(current - 1);
  };

  // ── Cloud Animations (unchanged) ──
  const cloud1Anim = useRef(new Animated.Value(-200)).current;
  const cloud2Anim = useRef(new Animated.Value(screenWidth + 200)).current;
  const cloud3Anim = useRef(new Animated.Value(-250)).current;
  const cloud4Anim = useRef(new Animated.Value(screenWidth + 250)).current;
  const sunAnim = useRef(new Animated.Value(0)).current;

  // ── Character float animation (subtle bob) ──
  const floatAnim = useRef(new Animated.Value(0)).current;
  // ── Badge pulse ──
  const badgePulse = useRef(new Animated.Value(0)).current;
  // ── Content fade on slide change ──
  const contentAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loop = (anim: Animated.Value, from: number, to: number, dur: number) => {
      const run = () => {
        anim.setValue(from);
        Animated.timing(anim, {
          toValue: to,
          duration: dur,
          easing: Easing.linear,
          useNativeDriver: true,
        }).start(() => run());
      };
      run();
    };

    loop(cloud1Anim, -200, screenWidth + 200, 45000);
    loop(cloud2Anim, screenWidth + 200, -200, 55000);
    loop(cloud3Anim, -250, screenWidth + 250, 50000);
    loop(cloud4Anim, screenWidth + 250, -250, 60000);

    Animated.loop(
      Animated.sequence([
        Animated.timing(sunAnim, { toValue: 1, duration: 3000, easing: Easing.inOut(Easing.ease), useNativeDriver: false }),
        Animated.timing(sunAnim, { toValue: 0, duration: 3000, easing: Easing.inOut(Easing.ease), useNativeDriver: false }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, { toValue: 1, duration: 2200, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(floatAnim, { toValue: 0, duration: 2200, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(badgePulse, { toValue: 1, duration: 1400, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(badgePulse, { toValue: 0, duration: 1400, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    ).start();
  }, []);

  // Fade content whenever the slide changes
  useEffect(() => {
    contentAnim.setValue(0);
    Animated.timing(contentAnim, {
      toValue: 1,
      duration: 380,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [current]);

  const sunGlow = sunAnim.interpolate({ inputRange: [0, 1], outputRange: [0.3, 0.8] });
  const floatY = floatAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -14] });
  const badgeScale = badgePulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.08] });
  const contentTranslate = contentAnim.interpolate({ inputRange: [0, 1], outputRange: [16, 0] });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      {/* ── Gradient Background (unchanged) ── */}
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

      {/* ── Sun with Glow (unchanged) ── */}
      <Animated.View style={[styles.sunContainer, { opacity: sunGlow }]}>
        <Svg width="120" height="120" viewBox="0 0 120 120">
          <Circle cx="60" cy="60" r="45" fill="#FCD34D" opacity="0.9" />
          <Circle cx="60" cy="60" r="55" fill="#FCD34D" opacity="0.3" />
          <Circle cx="60" cy="60" r="70" fill="#FCD34D" opacity="0.1" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
            <Rect key={i} x="54" y="5" width="12" height="20" rx="6" fill="#FCD34D" opacity="0.6" transform={`rotate(${angle}, 60, 60)`} />
          ))}
        </Svg>
      </Animated.View>

      {/* ── Floating Clouds (unchanged) ── */}
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
          <View style={styles.brandRow}>
            <View style={[styles.brandDot, { backgroundColor: character.accent }]} />
            <Text style={styles.logoText}>SEÑAS</Text>
          </View>
          {!isLast && (
            <Pressable style={styles.skipBtn} onPress={() => router.replace('/role')}>
              <Text style={styles.skipText}>Skip</Text>
            </Pressable>
          )}
        </View>

        {/* ── Hero Character (floating on sky, no card) ── */}
        <View style={styles.heroWrapper} pointerEvents="none">
          {/* Soft ground shadow */}
          <View style={styles.characterShadow} />
          <Animated.View style={{ transform: [{ translateY: floatY }] }}>
            <Image
              source={character.image}
              style={styles.heroCharacter}
              contentFit="contain"
            />
          </Animated.View>
        </View>

        {/* ── Bottom Floating Sheet ── */}
        <Animated.View
          style={[
            styles.sheetWrapper,
            { opacity: contentAnim, transform: [{ translateY: contentTranslate }] },
          ]}
        >
          {/* Circular accent badge notch */}
          <Pressable onPress={next} style={styles.badgeHitbox}>
            <Animated.View
              style={[
                styles.badge,
                {
                  backgroundColor: character.accent,
                  shadowColor: character.accent,
                  transform: [{ scale: badgeScale }],
                },
              ]}
            >
              <Text style={styles.badgeArrow}>→</Text>
            </Animated.View>
          </Pressable>

          <View style={styles.sheet}>
            {/* Tag pill */}
            <View style={[styles.tagContainer, { backgroundColor: character.accentLight }]}>
              <View style={[styles.tagDot, { backgroundColor: character.accent }]} />
              <Text style={[styles.tagText, { color: character.accent }]}>
                {slide.tag.toUpperCase()}
              </Text>
            </View>

            <Text style={styles.title}>{slide.title}</Text>
            <Text style={styles.body}>{slide.body}</Text>

            {slide.highlights && (
              <View style={styles.highlightsContainer}>
                {slide.highlights.map((h, i) => (
                  <View
                    key={i}
                    style={[
                      styles.highlightChip,
                      { backgroundColor: character.accentLight, borderColor: `${character.accent}44` },
                    ]}
                  >
                    <Text style={[styles.highlightText, { color: character.accent }]}>✦ {h}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Dots */}
            <View style={styles.dotsContainer}>
              {SLIDES.map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.dot,
                    {
                      width: i === current ? 22 : 8,
                      backgroundColor: i === current ? character.accent : 'rgba(15,49,114,0.18)',
                    },
                  ]}
                />
              ))}
            </View>

            {/* Buttons */}
            <View style={styles.navContainer}>
              <Pressable
                style={[styles.ghostBtn, current === 0 && { opacity: 0.5 }]}
                onPress={back}
                disabled={current === 0}
              >
                <Text style={styles.ghostBtnText}>Back</Text>
              </Pressable>
              <Pressable
                style={({ pressed }) => [
                  styles.primaryBtn,
                  { backgroundColor: character.accent, shadowColor: character.accent, opacity: pressed ? 0.92 : 1 },
                ]}
                onPress={next}
              >
                <Text style={styles.primaryBtnText}>
                  {isLast ? 'Get Started' : 'Continue'}
                </Text>
              </Pressable>
            </View>
          </View>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent' },

  sunContainer: { position: 'absolute', top: 40, right: -20, zIndex: 0 },
  floatingSky: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0, overflow: 'hidden' },
  cloudWrapper: { position: 'absolute', left: 0 },

  content: { flex: 1, paddingHorizontal: 20, paddingVertical: 16, zIndex: 1 },

  // Top bar
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
  },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  brandDot: { width: 10, height: 10, borderRadius: 5 },
  logoText: {
    color: '#1A2C3E',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 3,
  },
  skipBtn: {
    backgroundColor: 'rgba(255,255,255,0.55)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.85)',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 18,
  },
  skipText: { color: '#4A5C6E', fontSize: 13, fontWeight: '600' },

  // Hero character floating on the sky
  heroWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  characterShadow: {
    position: 'absolute',
    bottom: 24,
    width: 180,
    height: 22,
    borderRadius: 999,
    backgroundColor: 'rgba(26,44,62,0.18)',
    // fake blur via low opacity + scale
    transform: [{ scaleX: 1.1 }],
  },
  heroCharacter: {
    width: 240,
    height: 240,
  },

  // Bottom sheet
  sheetWrapper: {
    marginTop: 8,
    paddingTop: 34, // space for the badge overhang
  },
  badgeHitbox: {
    position: 'absolute',
    top: 0,
    alignSelf: 'center',
    zIndex: 3,
  },
  badge: {
    width: 62,
    height: 62,
    borderRadius: 31,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 8,
  },
  badgeArrow: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '800',
    lineHeight: 28,
    marginTop: -2,
  },

  sheet: {
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: 32,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 22,
    paddingTop: 40,
    paddingBottom: 22,
    shadowColor: '#0F3172',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 10,
    alignItems: 'center',
  },

  tagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 999,
    marginBottom: 12,
  },
  tagDot: { width: 6, height: 6, borderRadius: 3 },
  tagText: { fontSize: 11, fontWeight: '800', letterSpacing: 1 },

  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1A2C3E',
    lineHeight: 28,
    textAlign: 'center',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  body: {
    fontSize: 14,
    color: '#4A5C6E',
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 14,
    paddingHorizontal: 4,
  },

  highlightsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    justifyContent: 'center',
    marginBottom: 14,
  },
  highlightChip: {
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  highlightText: { fontSize: 11.5, fontWeight: '700' },

  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginBottom: 16,
  },
  dot: { height: 8, borderRadius: 99 },

  navContainer: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  ghostBtn: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.75)',
    borderColor: 'rgba(15,49,114,0.12)',
    borderWidth: 1,
    borderRadius: 60,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ghostBtnText: { color: '#1A2C3E', fontSize: 15, fontWeight: '700' },
  primaryBtn: {
    flex: 2,
    borderRadius: 60,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 14,
    elevation: 6,
  },
  primaryBtnText: { color: '#fff', fontSize: 15, fontWeight: '800', letterSpacing: 0.3 },
});
