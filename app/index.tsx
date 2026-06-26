// app/splash.tsx
import { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  Dimensions,
  StatusBar,
  Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import Svg, { Path, Circle, Rect, Defs, LinearGradient, Stop } from 'react-native-svg';

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

export default function SplashScreen() {
  const router = useRouter();

  // ── Logo Animations ──
  const logoScale = useRef(new Animated.Value(0.5)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoTranslateY = useRef(new Animated.Value(30)).current;

  // ── Text Animations ──
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleTranslateY = useRef(new Animated.Value(20)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const subtitleTranslateY = useRef(new Animated.Value(15)).current;

  // ── Characters Group Animation ──
  const groupOpacity = useRef(new Animated.Value(0)).current;
  const groupScale = useRef(new Animated.Value(0.5)).current;
  const groupTranslateY = useRef(new Animated.Value(80)).current;

  // ── Cloud Animations ──
  const cloud1Anim = useRef(new Animated.Value(-200)).current;
  const cloud2Anim = useRef(new Animated.Value(screenWidth + 200)).current;
  const cloud3Anim = useRef(new Animated.Value(-250)).current;
  const cloud4Anim = useRef(new Animated.Value(screenWidth + 250)).current;

  // ── Sun Glow Animation ──
  const sunAnim = useRef(new Animated.Value(0)).current;

  // ── Background Transition ──
  const bgOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // ── Start Cloud Animations ──
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

    // ── Animation Sequence ──
    let t1 = setTimeout(() => {
      // Logo and title appear
      Animated.parallel([
        Animated.timing(logoOpacity, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.spring(logoScale, { toValue: 1, friction: 6, tension: 40, useNativeDriver: true }),
        Animated.timing(logoTranslateY, { toValue: 0, duration: 800, easing: Easing.out(Easing.back(1.2)), useNativeDriver: true }),
        Animated.timing(titleOpacity, { toValue: 1, duration: 600, delay: 200, useNativeDriver: true }),
        Animated.timing(titleTranslateY, { toValue: 0, duration: 600, delay: 200, useNativeDriver: true }),
      ]).start();
    }, 400);

    let t2 = setTimeout(() => {
      // Subtitle appears
      Animated.parallel([
        Animated.timing(subtitleOpacity, { toValue: 1, duration: 500, delay: 100, useNativeDriver: true }),
        Animated.timing(subtitleTranslateY, { toValue: 0, duration: 500, delay: 100, useNativeDriver: true }),
      ]).start();
    }, 1200);

    let t3 = setTimeout(() => {
      // Characters group floats up from bottom
      Animated.parallel([
        Animated.timing(groupOpacity, { toValue: 1, duration: 1000, useNativeDriver: true }),
        Animated.spring(groupScale, { toValue: 1, friction: 5, tension: 40, useNativeDriver: true }),
        Animated.timing(groupTranslateY, { toValue: 0, duration: 1000, easing: Easing.out(Easing.back(1.2)), useNativeDriver: true }),
      ]).start();
    }, 1800);

    let t4 = setTimeout(() => {
      // Everything floats up with white fade
      Animated.parallel([
        Animated.timing(bgOpacity, { toValue: 1, duration: 800, useNativeDriver: false }),
        Animated.timing(logoTranslateY, { toValue: -60, duration: 1000, easing: Easing.in(Easing.ease), useNativeDriver: true }),
        Animated.timing(titleTranslateY, { toValue: -60, duration: 1000, easing: Easing.in(Easing.ease), useNativeDriver: true }),
        Animated.timing(groupTranslateY, { toValue: -40, duration: 1000, easing: Easing.in(Easing.ease), useNativeDriver: true }),
        Animated.timing(logoScale, { toValue: 0.8, duration: 1000, easing: Easing.in(Easing.ease), useNativeDriver: true }),
        Animated.timing(groupScale, { toValue: 0.9, duration: 1000, easing: Easing.in(Easing.ease), useNativeDriver: true }),
      ]).start();
    }, 3200);

    let t5 = setTimeout(() => {
      router.replace('/login');
    }, 4200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, []);

  // ── Sun Glow Interpolation ──
  const sunGlow = sunAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.8],
  });

  return (
    <View style={styles.container}>
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

      {/* ── White Overlay for Transition ── */}
      <Animated.View style={[styles.whiteOverlay, { opacity: bgOpacity }]} />

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
        {/* ── Logo - Animated ── */}
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: logoOpacity,
              transform: [
                { scale: logoScale },
                { translateY: logoTranslateY },
              ],
            },
          ]}
        >
          <Image
            source={require('../assets/images/new_characters/senya.png')}
            style={styles.logo}
            contentFit="contain"
          />
        </Animated.View>

        {/* ── App Name - Animated ── */}
        <Animated.View
          style={[
            styles.textContainer,
            {
              opacity: titleOpacity,
              transform: [{ translateY: titleTranslateY }],
            },
          ]}
        >
          <Text style={styles.title}>SEÑAS</Text>
          <Animated.Text
            style={[
              styles.subtitle,
              {
                opacity: subtitleOpacity,
                transform: [{ translateY: subtitleTranslateY }],
              },
            ]}
          >
            Filipino Sign Language
          </Animated.Text>
          <Animated.Text
            style={[
              styles.tagline,
              {
                opacity: subtitleOpacity,
                transform: [{ translateY: subtitleTranslateY }],
              },
            ]}
          >
            Learn · Practice · Connect
          </Animated.Text>
        </Animated.View>

        {/* ── Characters Group Photo - Animated ── */}
        <Animated.View
          style={[
            styles.groupContainer,
            {
              opacity: groupOpacity,
              transform: [
                { scale: groupScale },
                { translateY: groupTranslateY },
              ],
            },
          ]}
        >
          <Image
            source={require('../assets/images/new_characters/all.png')}
            style={styles.groupImage}
            contentFit="contain"
          />
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  whiteOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
    zIndex: 50,
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
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
    zIndex: 1,
  },

  // ── Logo ──
  logoContainer: {
    marginBottom: 8,
  },
  logo: {
    width: 70,
    height: 70,
  },

  // ── Text ──
  textContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 42,
    fontWeight: '900',
    letterSpacing: 6,
    color: '#1A2C3E',
    lineHeight: 42,
    textShadowColor: 'rgba(255,215,0,0.15)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 24,
  },
  subtitle: {
    color: '#4A5C6E',
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 2,
    marginTop: 6,
    textTransform: 'uppercase',
  },
  tagline: {
    color: '#8A9AAA',
    fontSize: 14,
    fontWeight: '500',
    marginTop: 8,
    letterSpacing: 1,
  },

  // ── Characters Group ──
  groupContainer: {
    width: screenWidth * 0.85,
    height: screenHeight * 0.35,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  groupImage: {
    width: '100%',
    height: '100%',
  },
});