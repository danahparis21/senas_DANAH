// app/assessment.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Pressable,
  Dimensions,
  Animated,
  Easing,
  StatusBar,
  ActivityIndicator,
  Alert,
  ScrollView
} from 'react-native';
import { Href, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import Svg, { Path, Polyline, Circle, Rect, Defs, LinearGradient, Stop } from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// ── CHARACTER DATA ─────────────────────────────────────────────────────
const CHARACTERS = {
  senya: {
    id: 'beginner',
    label: 'Beginner',
    character: 'Senya',
    characterEmoji: '🌟',
    description: 'New to Filipino Sign Language. Learn the alphabet, numbers, and essential everyday phrases.',
    modules: ['Alphabet & Numbers', 'Basic Greetings', 'Common Words'],
    pathTitle: 'Starting Your FSL Journey',
    bgStart: '#87CEEB',
    bgMid: '#B3E5FC',
    bgEnd: '#E3F2FD',
    accent: '#2E7FE8',
    accentGlow: 'rgba(46, 127, 232, 0.15)',
    image: require('../assets/images/new_characters/senya.png'),
  },
  flora: {
    id: 'intermediate',
    label: 'Intermediate',
    character: 'Flora',
    characterEmoji: '🌸',
    description: 'Know some signs and can follow basic conversations. Ready to expand vocabulary and fluency.',
    modules: ['Everyday Conversations', 'Classroom Words', 'Family & Friends'],
    pathTitle: 'Building Your FSL Skills',
    bgStart: '#FFE0F0',
    bgMid: '#FFB3D1',
    bgEnd: '#FFE0F0',
    accent: '#FF6EB4',
    accentGlow: 'rgba(255, 110, 180, 0.15)',
    image: require('../assets/images/new_characters/flora.png'),
  },
  catto: {
    id: 'advanced',
    label: 'Advanced',
    character: 'Catto',
    characterEmoji: '🎯',
    description: 'Comfortable with FSL. Ready for complex grammar, storytelling, and professional settings.',
    modules: ['Advanced Grammar', 'Storytelling', 'Professional Settings'],
    pathTitle: 'Mastering FSL',
    bgStart: '#FFF8F0',
    bgMid: '#FFE44D',
    bgEnd: '#FFF8F0',
    accent: '#FFD700',
    accentGlow: 'rgba(255, 215, 0, 0.15)',
    image: require('../assets/images/new_characters/catto.png'),
  },
};

const ALL_CHARACTERS = [CHARACTERS.senya, CHARACTERS.flora, CHARACTERS.catto];

// ── SVG Components ────────────────────────────────────────────────────
function ChevronLeftIcon({ color = '#1A2C3E' }) {
  return (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Path d="M15 18L9 12L15 6" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function ChevronRightIcon({ color = '#1A2C3E' }) {
  return (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Path d="M9 6L15 12L9 18" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

// ── Main Component ────────────────────────────────────────────────────
export default function Assessment() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [showPath, setShowPath] = useState(false);
  const [userName, setUserName] = useState('Student');
  const [direction, setDirection] = useState(0);

  // ── Animations ──
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const checkUser = async () => {
      try {
        const userData = await AsyncStorage.getItem('userData');
        if (userData) {
          const user = JSON.parse(userData);
          setUserName(user.student?.first_name || 'Student');
          if (user.student?.fsl_mastery_level) {
            setSelectedLevel(user.student.fsl_mastery_level);
          }
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setLoading(false);
      }
    };
    checkUser();

    // ── Float Animation ──
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // ── Entrance Animation ──
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const current = ALL_CHARACTERS[activeIndex];
  const floatY = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -12],
  });

  const goTo = (index: number) => {
    setDirection(index > activeIndex ? 1 : -1);
    setActiveIndex(index);
    Animated.sequence([
      Animated.timing(slideAnim, {
        toValue: direction * -50,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const prev = () => activeIndex > 0 && goTo(activeIndex - 1);
  const next = () => activeIndex < ALL_CHARACTERS.length - 1 && goTo(activeIndex + 1);

  const handleConfirm = () => {
    setSelectedLevel(current.id);
    setShowPath(true);
  };

  const handleStartLearning = () => {
    router.replace('/(tabs)/dashboard' as Href);
  };

  // ── Loading State ──
  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2E7FE8" />
        <Text style={styles.loadingText}>Loading your profile...</Text>
      </SafeAreaView>
    );
  }

  // ── Learning Path Confirmation ──
  if (showPath && selectedLevel) {
    const selected = ALL_CHARACTERS.find(c => c.id === selectedLevel)!;
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

        {/* ── Gradient Background ── */}
        <View style={StyleSheet.absoluteFillObject}>
          <Svg width={screenWidth} height={screenHeight}>
            <Defs>
              <LinearGradient id="pathBgGrad" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0%" stopColor={selected.bgStart} stopOpacity="1" />
                <Stop offset="50%" stopColor={selected.bgMid} stopOpacity="0.9" />
                <Stop offset="100%" stopColor={selected.bgEnd} stopOpacity="0.9" />
              </LinearGradient>
            </Defs>
            <Rect width={screenWidth} height={screenHeight} fill="url(#pathBgGrad)" />
          </Svg>
        </View>

        <ScrollView contentContainerStyle={styles.pathScrollContent}>
          <Animated.View style={[styles.pathContainer, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
            <View style={[styles.pathCard, { borderColor: selected.accent + '40' }]}>
              <View style={styles.pathHeader}>
                <Animated.Text style={[styles.pathEmoji, { transform: [{ translateY: floatY }] }]}>
                  🎉
                </Animated.Text>
                <Text style={styles.pathTitle}>You're all set!</Text>
                <Text style={styles.pathSubtitle}>Your learning path is ready</Text>
              </View>

              <View style={[styles.pathCharacterRow, { backgroundColor: selected.accent + '10' }]}>
                <Image source={selected.image} style={styles.pathCharacterImage} contentFit="contain" />
                <View>
                  <View style={[styles.pathLevelBadge, { backgroundColor: selected.accent }]}>
                    <Text style={styles.pathLevelText}>{selected.label}</Text>
                  </View>
                  <Text style={styles.pathCharacterName}>{selected.pathTitle}</Text>
                </View>
              </View>

              <View style={[styles.pathModules, { backgroundColor: selected.accent + '08' }]}>
                <Text style={styles.pathModulesTitle}>📋 What you'll learn</Text>
                {selected.modules.map((module, index) => (
                  <View key={module} style={styles.pathModuleItem}>
                    <View style={[styles.pathModuleDot, { backgroundColor: selected.accent }]} />
                    <Text style={styles.pathModuleText}>{module}</Text>
                  </View>
                ))}
              </View>

              <Pressable
                style={[styles.pathStartBtn, { backgroundColor: selected.accent }]}
                onPress={handleStartLearning}
              >
                <Text style={styles.pathStartBtnText}>🚀 Start Learning Now</Text>
              </Pressable>

              <Pressable style={styles.pathChangeBtn} onPress={() => setShowPath(false)}>
                <Text style={styles.pathChangeText}>Change My Level</Text>
              </Pressable>
            </View>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ── Carousel Selection Screen ──
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      {/* ── Gradient Background ── */}
      <View style={StyleSheet.absoluteFillObject}>
        <Svg width={screenWidth} height={screenHeight}>
          <Defs>
            <LinearGradient id="bgGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor={current.bgStart} stopOpacity="1" />
              <Stop offset="50%" stopColor={current.bgMid} stopOpacity="0.9" />
              <Stop offset="100%" stopColor={current.bgEnd} stopOpacity="0.9" />
            </LinearGradient>
          </Defs>
          <Rect width={screenWidth} height={screenHeight} fill="url(#bgGrad)" />
        </Svg>
      </View>

      <Animated.View style={[styles.carouselContainer, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        {/* ── Header ── */}
        <View style={styles.header}>
          <View style={styles.headerBadge}>
            <Text style={styles.headerBadgeText}>🤟 SEÑAS</Text>
          </View>
          <Text style={styles.headerTitle}>What's your FSL level?</Text>
          <Text style={styles.headerSubtitle}>Choose your guide — they'll journey with you!</Text>
        </View>

        {/* ── Dot Indicators ── */}
        <View style={styles.dotsContainer}>
          {ALL_CHARACTERS.map((_, i) => (
            <Pressable
              key={i}
              onPress={() => goTo(i)}
              style={[
                styles.dot,
                i === activeIndex && [styles.dotActive, { backgroundColor: current.accent }]
              ]}
            />
          ))}
        </View>

        {/* ── Character Card with BIG Character ── */}
        <Animated.View
          style={[
            styles.characterCard,
            {
              borderColor: current.accent + '40',
              transform: [{ translateX: slideAnim }]
            }
          ]}
        >
          {/* Character Image - BIG and Free Floating with Glow */}
          <View style={styles.characterImageWrapper}>
            <View style={[styles.characterGlow, { backgroundColor: current.accentGlow }]} />
            <Animated.View style={{ transform: [{ translateY: floatY }] }}>
              <Image
                source={current.image}
                style={styles.characterImage}
                contentFit="contain"
              />
            </Animated.View>
            <View style={[styles.characterTag, { backgroundColor: current.accent }]}>
              <Text style={styles.characterTagText}>{current.character} {current.characterEmoji}</Text>
            </View>
          </View>

          {/* Info - Minimal and Clean */}
          <View style={styles.characterInfo}>
            <View style={[styles.levelBadge, { backgroundColor: current.accent + '15' }]}>
              <Text style={[styles.levelBadgeText, { color: current.accent }]}>
                {current.characterEmoji} {current.label}
              </Text>
            </View>
            <Text style={styles.characterDescription}>{current.description}</Text>
          </View>

          {/* Modules Preview - Small tags */}
          <View style={styles.modulesPreview}>
            {current.modules.map((module, i) => (
              <View key={i} style={[styles.moduleTag, { borderColor: current.accent + '30' }]}>
                <Text style={[styles.moduleTagText, { color: current.accent }]}>{module}</Text>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* ── Navigation ── */}
        <View style={styles.navigation}>
          <Pressable
            onPress={prev}
            disabled={activeIndex === 0}
            style={[styles.navButton, activeIndex === 0 && styles.navButtonDisabled]}
          >
            <ChevronLeftIcon color={activeIndex === 0 ? '#CBD5E1' : '#1A2C3E'} />
          </Pressable>

          <Pressable
            onPress={handleConfirm}
            style={[styles.confirmButton, { backgroundColor: current.accent }]}
          >
            <Text style={styles.confirmButtonText}>Choose {current.character}! {current.characterEmoji}</Text>
          </Pressable>

          <Pressable
            onPress={next}
            disabled={activeIndex === ALL_CHARACTERS.length - 1}
            style={[styles.navButton, activeIndex === ALL_CHARACTERS.length - 1 && styles.navButtonDisabled]}
          >
            <ChevronRightIcon color={activeIndex === ALL_CHARACTERS.length - 1 ? '#CBD5E1' : '#1A2C3E'} />
          </Pressable>
        </View>

        {/* ── Skip ── */}
        <Pressable
          style={styles.skipButton}
          onPress={() => {
            Alert.alert(
              'Skip Assessment?',
              'You can set your level later in your profile.',
              [
                { text: 'Go Back', style: 'cancel' },
                { text: 'Skip to Dashboard', onPress: () => router.replace('/(tabs)/dashboard' as Href) }
              ]
            );
          }}
        >
          <Text style={styles.skipText}>Skip for now</Text>
        </Pressable>
      </Animated.View>
    </SafeAreaView>
  );
}

// ── STYLES ─────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#F8FAFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 14,
    color: '#666',
  },

  // ── Path Scroll ──
  pathScrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },

  // ── Carousel ──
  carouselContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 12,
  },

  // ── Header ──
  header: {
    alignItems: 'center',
    marginBottom: 8,
  },
  headerBadge: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 16,
    paddingVertical: 3,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
    marginBottom: 4,
  },
  headerBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#1A2C3E',
    letterSpacing: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1A2C3E',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#4A5C6E',
    fontWeight: '500',
    marginTop: 2,
    textAlign: 'center',
  },

  // ── Dots ──
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginBottom: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  dotActive: {
    width: 28,
    borderRadius: 4,
  },

  // ── Character Card ──
  characterCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderRadius: 32,
    borderWidth: 2,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 20,
    elevation: 2,
    justifyContent: 'center',
  },
  characterImageWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    width: screenWidth * 0.8,
    height: screenHeight * 0.42,
    marginBottom: 4,
  },
  characterGlow: {
    position: 'absolute',
    width: screenWidth * 0.6,
    height: screenWidth * 0.6,
    borderRadius: screenWidth * 0.3,
    opacity: 0.3,
  },
  characterImage: {
    width: screenWidth * 0.7,
    height: screenHeight * 0.38,
  },
  characterTag: {
    position: 'absolute',
    bottom: 4,
    paddingHorizontal: 16,
    paddingVertical: 5,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  characterTagText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 0.3,
  },
  characterInfo: {
    alignItems: 'center',
    marginBottom: 6,
    paddingHorizontal: 8,
  },
  levelBadge: {
    paddingHorizontal: 12,
    paddingVertical: 2,
    borderRadius: 12,
    marginBottom: 2,
  },
  levelBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  characterDescription: {
    fontSize: 12,
    color: '#4A5C6E',
    textAlign: 'center',
    lineHeight: 16,
    paddingHorizontal: 4,
  },
  modulesPreview: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 4,
  },
  moduleTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  moduleTagText: {
    fontSize: 9,
    fontWeight: '600',
  },

  // ── Navigation ──
  navigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 10,
  },
  navButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navButtonDisabled: {
    opacity: 0.3,
  },
  confirmButton: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  confirmButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#fff',
  },
  skipButton: {
    marginTop: 6,
    paddingVertical: 6,
  },
  skipText: {
    fontSize: 12,
    color: '#8A9AAA',
    fontWeight: '600',
  },

  // ── Learning Path ──
  pathContainer: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  pathCard: {
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: 32,
    padding: 24,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 20,
    elevation: 2,
  },
  pathHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  pathEmoji: {
    fontSize: 40,
    marginBottom: 4,
  },
  pathTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1A2C3E',
  },
  pathSubtitle: {
    fontSize: 13,
    color: '#4A5C6E',
    fontWeight: '500',
  },
  pathCharacterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 12,
    borderRadius: 16,
    marginBottom: 16,
  },
  pathCharacterImage: {
    width: 56,
    height: 56,
  },
  pathLevelBadge: {
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 2,
  },
  pathLevelText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#fff',
  },
  pathCharacterName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A2C3E',
  },
  pathModules: {
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
  },
  pathModulesTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4A5C6E',
    marginBottom: 8,
  },
  pathModuleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 6,
  },
  pathModuleDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  pathModuleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A2C3E',
  },
  pathStartBtn: {
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  pathStartBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
  },
  pathChangeBtn: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  pathChangeText: {
    fontSize: 13,
    color: '#8A9AAA',
    fontWeight: '600',
  },
});