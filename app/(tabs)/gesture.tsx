// app/(tabs)/gesture.tsx
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Pressable,
  ScrollView,
  Dimensions,
  FlatList,
  TouchableOpacity,
  Animated,
  Easing,
  StatusBar
} from 'react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path, Rect, Defs, LinearGradient, Stop, Circle } from 'react-native-svg';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const CARD_WIDTH = screenWidth * 0.76;
const CARD_MARGIN = 10;
const SNAP_INTERVAL = CARD_WIDTH + CARD_MARGIN * 2;
const SIDE_OFFSET = (screenWidth - CARD_WIDTH - CARD_MARGIN * 2) / 2;

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

// Module data with new colors
const modules = [
  {
    id: 'alphabet1',
    title: 'Alphabet Part 1',
    subtitle: 'A-M',
    category: 'alphabet',
    color: ['#FF6B6B', '#FF8E8E'],
    gradientColors: ['#FF6B6B', '#FF8E8E'],
    icon: 'book',
    description: 'Learn letters A through M',
    progress: 60,
    xp: 100,
    locked: false,
    route: '/gesture/webview-camera',
    image: require('../../assets/images/img/alphabet.png'),
    lessons: 13,
  },
  {
    id: 'alphabet2',
    title: 'Alphabet Part 2',
    subtitle: 'N-Z',
    category: 'alphabet',
    color: ['#4ECDC4', '#45B7AA'],
    gradientColors: ['#4ECDC4', '#45B7AA'],
    icon: 'ribbon',
    description: 'Learn letters N through Z',
    progress: 0,
    xp: 120,
    locked: false,
    route: '/gesture/alphabet2',
    image: require('../../assets/images/img/alphabet_star.png'),
    lessons: 13,
  },
  {
    id: 'fingerspelling',
    title: 'Fingerspelling',
    subtitle: 'Practice spelling words',
    category: 'practice',
    color: ['#A8E6CF', '#88D8B0'],
    gradientColors: ['#A8E6CF', '#88D8B0'],
    icon: 'hand-left',
    description: 'Spell words using signs',
    progress: 0,
    xp: 150,
    locked: true,
    route: '/gesture/fingerspelling',
    image: require('../../assets/images/img/senya_magnify.png'),
    lessons: 10,
  },
  {
    id: 'greetings',
    title: 'Basic Greetings',
    subtitle: 'Everyday Signs & Phrases',
    category: 'greetings',
    color: ['#FFB6C1', '#FF8E9E'],
    gradientColors: ['#FFB6C1', '#FF8E9E'],
    icon: 'chatbubble-ellipses',
    description: 'Learn greetings and phrases',
    progress: 0,
    xp: 200,
    locked: true,
    route: '/gesture/greetings',
    image: require('../../assets/images/img/greetings.png'),
    lessons: 8,
  },
];

// Categories configuration
const CATEGORIES = [
  { id: 'all', title: 'All', icon: 'grid-outline' },
  { id: 'alphabet', title: 'Alphabet', icon: 'text-outline' },
  { id: 'practice', title: 'Practice', icon: 'hand-left-outline' },
  { id: 'greetings', title: 'Greetings', icon: 'chatbubbles-outline' },
];

// Individual module card component
function ModuleCard({
  module,
  onPress,
  isActive,
}: {
  module: typeof modules[0];
  onPress: () => void;
  isActive: boolean;
}) {
  const scale = useRef(new Animated.Value(0.92)).current;
  const opacity = useRef(new Animated.Value(0.7)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: isActive ? 1.0 : 0.92,
        useNativeDriver: true,
        friction: 8,
        tension: 40,
      }),
      Animated.timing(opacity, {
        toValue: isActive ? 1.0 : 0.7,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isActive]);

  return (
    <Animated.View
      style={[
        styles.cardContainer,
        {
          transform: [{ scale }],
          opacity,
        },
      ]}
    >
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.9}
        style={styles.cardTouchable}
      >
        <View style={[styles.cardGradient, { backgroundColor: module.color[0] }]}>
          {/* Main Visual Image container */}
          <View style={styles.cardImageContainer}>
            <Image
              source={module.image}
              style={styles.cardImage}
              contentFit="cover"
            />
            {/* Top info badge floating over the image */}
            <View style={styles.cardFloatingHeader}>
              <View style={[styles.cardIconBadge, { backgroundColor: module.color[0] + '60' }]}>
                <Ionicons name={module.icon as any} size={20} color="#FFF" />
              </View>
              {module.progress > 0 && (
                <View style={styles.cardProgressBadge}>
                  <Text style={styles.cardProgressBadgeText}>{module.progress}% Done</Text>
                </View>
              )}
            </View>
          </View>

          {/* Overlapping details card at the bottom */}
          <View style={styles.cardOverlayDetails}>
            <View style={styles.cardHeaderInfo}>
              <Ionicons name="book-outline" size={14} color="#6B7280" style={{ marginRight: 4 }} />
              <Text style={styles.cardInfoText}>{module.lessons} Lessons</Text>
              <Text style={styles.cardInfoDivider}>•</Text>
              <Ionicons name="star" size={14} color="#F59E0B" style={{ marginRight: 4 }} />
              <Text style={styles.cardInfoText}>{module.xp} XP</Text>
            </View>

            <Text style={styles.cardMainTitle} numberOfLines={1}>{module.title}</Text>
            <Text style={styles.cardDescription} numberOfLines={1}>{module.description}</Text>

            {/* Bottom row: progress track or play button */}
            <View style={styles.cardFooterRow}>
              {module.locked ? (
                <View style={styles.lockedRow}>
                  <Ionicons name="lock-closed" size={16} color="#EF4444" style={{ marginRight: 4 }} />
                  <Text style={styles.lockedText}>Locked</Text>
                </View>
              ) : (
                <View style={styles.progressBarWrapper}>
                  <View style={styles.progressBarTrack}>
                    <View
                      style={[
                        styles.progressBarFill,
                        { width: `${module.progress}%`, backgroundColor: module.color[0] }
                      ]}
                    />
                  </View>
                  <Text style={styles.progressPctText}>{module.progress}% Complete</Text>
                </View>
              )}

              {!module.locked && (
                <View style={[styles.playIndicatorButton, { backgroundColor: module.color[0] }]}>
                  <Ionicons name="play" size={14} color="#FFF" />
                </View>
              )}
            </View>
          </View>

          {/* Lock Overlay if locked */}
          {module.locked && (
            <View style={styles.lockedCardOverlay}>
              <View style={styles.lockedIconCircle}>
                <Ionicons name="lock-closed" size={26} color="#0F3172" />
              </View>
              <Text style={styles.lockedOverlayText}>Complete previous modules to unlock!</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

// Carousel dots
function CarouselDots({ currentIndex, total }: { currentIndex: number; total: number }) {
  return (
    <View style={styles.dotsContainer}>
      {Array.from({ length: total }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            currentIndex === index && styles.dotActive,
          ]}
        />
      ))}
    </View>
  );
}

export default function GestureMain() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  // ── Cloud Animations ──
  const cloud1Anim = useRef(new Animated.Value(-200)).current;
  const cloud2Anim = useRef(new Animated.Value(screenWidth + 200)).current;
  const cloud3Anim = useRef(new Animated.Value(-250)).current;
  const cloud4Anim = useRef(new Animated.Value(screenWidth + 250)).current;

  // ── Sun Glow Animation ──
  const sunAnim = useRef(new Animated.Value(0)).current;

  // ── Cloud Loops ──
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

  const handleModulePress = (module: typeof modules[0]) => {
    if (module.locked) {
      return;
    }
    router.push(module.route as any);
  };

  const handleScroll = (event: any) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / SNAP_INTERVAL);
    setCurrentIndex(index);
  };

  const scrollToIndex = (index: number) => {
    flatListRef.current?.scrollToIndex({
      index,
      animated: true,
    });
  };

  // Filter modules based on category
  const filteredModules = selectedCategory === 'all'
    ? modules
    : modules.filter((m) => m.category === selectedCategory);

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

      <View style={styles.content}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>Let's Practice</Text>
              <Text style={styles.title}>Gestures</Text>
            </View>
            <View style={styles.headerRight}>
              <View style={styles.xpBadge}>
                <Ionicons name="star" size={16} color="#F59E0B" style={{ marginRight: 4 }} />
                <Text style={styles.xpBadgeText}>150 XP</Text>
              </View>
              <TouchableOpacity style={styles.settingsButton}>
                <Ionicons name="options-outline" size={22} color="#0F3172" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Category Filters */}
          <View style={styles.categoriesContainer}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoriesContent}
            >
              {CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <TouchableOpacity
                    key={cat.id}
                    style={[
                      styles.categoryButton,
                      isSelected && styles.categoryButtonActive,
                    ]}
                    onPress={() => {
                      setSelectedCategory(cat.id);
                      setCurrentIndex(0);
                    }}
                  >
                    <Ionicons
                      name={cat.icon as any}
                      size={18}
                      color={isSelected ? '#FFFFFF' : '#4B7BBB'}
                      style={{ marginRight: 6 }}
                    />
                    <Text
                      style={[
                        styles.categoryText,
                        isSelected && styles.categoryTextActive,
                      ]}
                    >
                      {cat.title}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Carousel Section */}
          <View style={styles.carouselSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Featured Modules</Text>
              {filteredModules.length > 1 && (
                <View style={styles.carouselNavSimple}>
                  <TouchableOpacity
                    style={[styles.arrowButton, currentIndex === 0 && styles.arrowButtonDisabled]}
                    onPress={() => scrollToIndex(Math.max(0, currentIndex - 1))}
                    disabled={currentIndex === 0}
                  >
                    <Ionicons
                      name="chevron-back"
                      size={20}
                      color={currentIndex === 0 ? 'rgba(15, 49, 114, 0.25)' : '#0F3172'}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.arrowButton,
                      currentIndex === filteredModules.length - 1 && styles.arrowButtonDisabled,
                    ]}
                    onPress={() => scrollToIndex(Math.min(filteredModules.length - 1, currentIndex + 1))}
                    disabled={currentIndex === filteredModules.length - 1}
                  >
                    <Ionicons
                      name="chevron-forward"
                      size={20}
                      color={currentIndex === filteredModules.length - 1 ? 'rgba(15, 49, 114, 0.25)' : '#0F3172'}
                    />
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {filteredModules.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Ionicons name="search-outline" size={40} color="#4B7BBB" style={{ marginBottom: 12 }} />
                <Text style={styles.emptyText}>No modules in this category yet!</Text>
              </View>
            ) : (
              <View style={styles.carouselContainer}>
                <FlatList
                  ref={flatListRef}
                  data={filteredModules}
                  renderItem={({ item, index }) => (
                    <ModuleCard
                      module={item}
                      onPress={() => handleModulePress(item)}
                      isActive={currentIndex === index}
                    />
                  )}
                  keyExtractor={(item) => item.id}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  onScroll={handleScroll}
                  scrollEventThrottle={16}
                  snapToInterval={SNAP_INTERVAL}
                  snapToAlignment="center"
                  decelerationRate="fast"
                  contentContainerStyle={{ paddingHorizontal: SIDE_OFFSET }}
                  style={styles.carousel}
                />

                <CarouselDots currentIndex={currentIndex} total={filteredModules.length} />
              </View>
            )}
          </View>

          {/* Quick Access */}
          <View style={styles.quickAccess}>
            <Text style={styles.sectionTitle}>Quick Start</Text>
            <View style={styles.quickAccessGrid}>
              <TouchableOpacity
                style={[styles.quickAccessItem, styles.quickAccessItemStudent]}
                onPress={() => router.push('/gesture/webview-camera')}
              >
                <View style={[styles.quickAccessIconContainer, { backgroundColor: 'rgba(46, 127, 232, 0.12)' }]}>
                  <Ionicons name="text-outline" size={24} color="#2E7FE8" />
                </View>
                <Text style={styles.quickAccessText}>Alphabet</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.quickAccessItem, styles.quickAccessItemLocked]}
                disabled
              >
                <View style={[styles.quickAccessIconContainer, { backgroundColor: 'rgba(156, 163, 175, 0.1)' }]}>
                  <Ionicons name="hand-left-outline" size={24} color="#9CA3AF" />
                </View>
                <Text style={styles.quickAccessText}>Fingerspell</Text>
                <Ionicons name="lock-closed" size={12} color="#9CA3AF" style={styles.quickAccessLock} />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.quickAccessItem, styles.quickAccessItemLocked]}
                disabled
              >
                <View style={[styles.quickAccessIconContainer, { backgroundColor: 'rgba(156, 163, 175, 0.1)' }]}>
                  <Ionicons name="chatbubbles-outline" size={24} color="#9CA3AF" />
                </View>
                <Text style={styles.quickAccessText}>Greetings</Text>
                <Ionicons name="lock-closed" size={12} color="#9CA3AF" style={styles.quickAccessLock} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Senya's Tip */}
          <View style={styles.tipCard}>
            <Image
              source={require('../../assets/images/new_characters/senya.png')}
              style={styles.tipImage}
              contentFit="contain"
            />
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>💡 Senya Says</Text>
              <Text style={styles.tipText}>
                Complete Alphabet Part 1 to unlock more modules! Practice makes perfect! 🌟
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
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
    zIndex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  greeting: {
    fontSize: 14,
    color: '#4A5C6E',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1A2C3E',
    marginTop: 2,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  xpBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.75)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  xpBadgeText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1A2C3E',
  },
  settingsButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.75)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  categoriesContainer: {
    marginVertical: 12,
  },
  categoriesContent: {
    paddingHorizontal: 20,
    gap: 10,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.75)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  categoryButtonActive: {
    backgroundColor: '#2E7FE8',
    borderColor: '#2E7FE8',
    shadowColor: '#2E7FE8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4A5C6E',
  },
  categoryTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  carouselSection: {
    marginVertical: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1A2C3E',
  },
  carouselNavSimple: {
    flexDirection: 'row',
    gap: 8,
  },
  arrowButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.75)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  arrowButtonDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    marginHorizontal: 20,
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  emptyText: {
    color: '#4A5C6E',
    fontSize: 14,
    fontWeight: '500',
  },
  carouselContainer: {
    position: 'relative',
  },
  carousel: {
    height: 360,
  },
  cardContainer: {
    width: CARD_WIDTH,
    height: 340,
    marginHorizontal: CARD_MARGIN,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 6,
  },
  cardTouchable: {
    flex: 1,
  },
  cardGradient: {
    flex: 1,
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
  },
  cardImageContainer: {
    height: 180,
    position: 'relative',
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardFloatingHeader: {
    position: 'absolute',
    top: 14,
    left: 14,
    right: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardIconBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  cardProgressBadge: {
    backgroundColor: '#10B981',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  cardProgressBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFF',
  },
  cardOverlayDetails: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  cardHeaderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardInfoText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
  },
  cardInfoDivider: {
    marginHorizontal: 6,
    color: '#D1D5DB',
  },
  cardMainTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1A2C3E',
    marginBottom: 2,
  },
  cardDescription: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
    marginBottom: 8,
  },
  cardFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressBarWrapper: {
    flex: 1,
    marginRight: 10,
  },
  progressBarTrack: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressPctText: {
    fontSize: 10,
    color: '#9CA3AF',
    fontWeight: '600',
    marginTop: 4,
  },
  playIndicatorButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  lockedRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lockedText: {
    fontSize: 12,
    color: '#EF4444',
    fontWeight: '700',
  },
  lockedCardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  lockedIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(15, 49, 114, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(15, 49, 114, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  lockedOverlayText: {
    color: '#4A5C6E',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 18,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(26, 44, 62, 0.2)',
  },
  dotActive: {
    backgroundColor: '#2E7FE8',
    width: 18,
  },
  quickAccess: {
    marginTop: 12,
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  quickAccessGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  quickAccessItem: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.75)',
    paddingVertical: 16,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  quickAccessItemStudent: {
    borderColor: 'rgba(46, 127, 232, 0.2)',
  },
  quickAccessItemLocked: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    opacity: 0.7,
  },
  quickAccessIconContainer: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  quickAccessText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1A2C3E',
  },
  quickAccessLock: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  tipCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.75)',
    marginHorizontal: 20,
    marginVertical: 16,
    padding: 16,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    gap: 14,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  tipImage: {
    width: 56,
    height: 56,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#D97706',
    marginBottom: 4,
  },
  tipText: {
    fontSize: 12,
    color: '#4A5C6E',
    fontWeight: '600',
    lineHeight: 18,
  },
});