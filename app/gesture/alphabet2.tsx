// app/gesture/alphabet2.tsx
import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    Pressable,
    TouchableOpacity,
    ScrollView,
    Dimensions,
    Image,
    Modal,
    Animated,
    StatusBar,
    Easing,  // ← Import Easing from react-native
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
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

// Alphabet Part 2: N-Z
const ALPHABET_PART2 = ['N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

// Senya's encouragement messages
const SENYA_MESSAGES = {
    welcome: "Let's learn N-Z together! 🌟",
    correct: [
        "Amazing! Keep going! 🌟",
        "Perfect! You're on fire! 🔥",
        "Great job! You're a natural! 💪",
        "Wonderful! You're crushing it! ✨",
        "Fantastic! Next one! 🎉",
    ],
    struggle: [
        "Try curling your fingers more... 🤔",
        "Keep your hand steady! ✋",
        "Make the shape clearer! 👀",
        "You got this! Try again! 💪",
        "Almost there! One more try! 🎯",
    ],
    complete: "YOU DID IT! ALL 13 LETTERS! 🏆",
};

// Letter struggle tracking
interface LetterAttempt {
    letter: string;
    attempts: number;
    wrongAttempts: number;
    firstSuccess?: number;
    lastAttempt?: number;
    successCount: number;
}

export default function AlphabetPart2() {
    const router = useRouter();
    const scrollViewRef = useRef<ScrollView>(null);
    const [detectedLetter, setDetectedLetter] = useState('✋');
    const [confidence, setConfidence] = useState(0);
    const [isConnected, setIsConnected] = useState(true);

    // Gamification state
    const [completedLetters, setCompletedLetters] = useState<Set<string>>(new Set());
    const [currentTarget, setCurrentTarget] = useState('N');
    const [senyaMessage, setSenyaMessage] = useState(SENYA_MESSAGES.welcome);
    const [consecutiveWrong, setConsecutiveWrong] = useState(0);
    const [isModuleComplete, setIsModuleComplete] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [starRating, setStarRating] = useState(0);

    // Letter tracking for results
    const [letterAttempts, setLetterAttempts] = useState<Record<string, LetterAttempt>>({});
    const [totalWrongAttempts, setTotalWrongAttempts] = useState(0);
    const [totalCorrectAttempts, setTotalCorrectAttempts] = useState(0);
    const [startTime, setStartTime] = useState<number>(Date.now());
    const [endTime, setEndTime] = useState<number | null>(null);

    // Popup animation
    const popupAnim = useState(new Animated.Value(0))[0];
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');
    const [popupSubMessage, setPopupSubMessage] = useState('');

    // Track the last detected letter
    const [lastProcessedLetter, setLastProcessedLetter] = useState<string>('');
    const [letterStableCount, setLetterStableCount] = useState(0);

    // Senya message cooldown
    const senyaMsgCooldownRef = useRef<number>(0);
    const SENYA_COOLDOWN_MS = 3000;

    // Star animations for results modal
    const starAnim1 = useRef(new Animated.Value(0)).current;
    const starAnim2 = useRef(new Animated.Value(0)).current;
    const starAnim3 = useRef(new Animated.Value(0)).current;

    // ── SIMULATED DETECTION ──
    const detectionIntervalRef = useRef<number | null>(null);
    const [isSimulating, setIsSimulating] = useState(false);

    // ── Cloud Animations ──
    const cloud1Anim = useRef(new Animated.Value(-200)).current;
    const cloud2Anim = useRef(new Animated.Value(screenWidth + 200)).current;
    const cloud3Anim = useRef(new Animated.Value(-250)).current;
    const cloud4Anim = useRef(new Animated.Value(screenWidth + 250)).current;

    // ── Sun Glow Animation ──
    const sunAnim = useRef(new Animated.Value(0)).current;

    // Get current target letter (first incomplete)
    const getCurrentTarget = () => {
        for (const letter of ALPHABET_PART2) {
            if (!completedLetters.has(letter)) return letter;
        }
        return null;
    };

    // Initialize letter tracking
    useEffect(() => {
        const initial: Record<string, LetterAttempt> = {};
        ALPHABET_PART2.forEach(letter => {
            initial[letter] = {
                letter,
                attempts: 0,
                wrongAttempts: 0,
                successCount: 0,
            };
        });
        setLetterAttempts(initial);
        setStartTime(Date.now());
        setEndTime(null);
    }, []);

    // Auto-scroll to current target when it changes
    useEffect(() => {
        const target = getCurrentTarget();
        if (target) {
            setCurrentTarget(target);
            const targetIndex = ALPHABET_PART2.indexOf(target);
            if (targetIndex >= 0 && scrollViewRef.current) {
                const slotWidth = 54;
                const scrollX = targetIndex * slotWidth - (screenWidth - 100) / 2;  // ← Changed from 'width' to 'screenWidth'
                setTimeout(() => {
                    scrollViewRef.current?.scrollTo({
                        x: Math.max(0, scrollX),
                        animated: true,
                    });
                }, 100);
            }
        } else if (completedLetters.size === ALPHABET_PART2.length) {
            setIsModuleComplete(true);
            setSenyaMessage(SENYA_MESSAGES.complete);
            const endNow = Date.now();
            setEndTime(endNow);
            const elapsed = Math.round((endNow - startTime) / 1000);
            setStarRating(elapsed < 30 ? 3 : elapsed < 60 ? 2 : 1);
            setTimeout(() => {
                setShowResults(true);
                stopSimulation();
            }, 1500);
        }
    }, [completedLetters]);

    // Animate stars when results are shown
    useEffect(() => {
        if (showResults) {
            starAnim1.setValue(0);
            starAnim2.setValue(0);
            starAnim3.setValue(0);
            setTimeout(() => Animated.spring(starAnim1, { toValue: 1, friction: 5, tension: 40, useNativeDriver: true }).start(), 300);
            setTimeout(() => Animated.spring(starAnim2, { toValue: 1, friction: 5, tension: 40, useNativeDriver: true }).start(), 550);
            setTimeout(() => Animated.spring(starAnim3, { toValue: 1, friction: 5, tension: 40, useNativeDriver: true }).start(), 800);
        }
    }, [showResults]);

    // ── CLOUD & SUN EFFECTS ──
    useEffect(() => {
        const startCloud1 = () => {
            cloud1Anim.setValue(-200);
            Animated.timing(cloud1Anim, {
                toValue: screenWidth + 200,
                duration: 45000,
                easing: Easing.linear,  // ← Now Easing is properly imported
                useNativeDriver: true,
            }).start(() => startCloud1());
        };

        const startCloud2 = () => {
            cloud2Anim.setValue(screenWidth + 200);
            Animated.timing(cloud2Anim, {
                toValue: -200,
                duration: 55000,
                easing: Easing.linear,  // ← Now Easing is properly imported
                useNativeDriver: true,
            }).start(() => startCloud2());
        };

        const startCloud3 = () => {
            cloud3Anim.setValue(-250);
            Animated.timing(cloud3Anim, {
                toValue: screenWidth + 250,
                duration: 50000,
                easing: Easing.linear,  // ← Now Easing is properly imported
                useNativeDriver: true,
            }).start(() => startCloud3());
        };

        const startCloud4 = () => {
            cloud4Anim.setValue(screenWidth + 250);
            Animated.timing(cloud4Anim, {
                toValue: -250,
                duration: 60000,
                easing: Easing.linear,  // ← Now Easing is properly imported
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
                    easing: Easing.inOut(Easing.ease),  // ← Now Easing is properly imported
                    useNativeDriver: false,
                }),
                Animated.timing(sunAnim, {
                    toValue: 0,
                    duration: 3000,
                    easing: Easing.inOut(Easing.ease),  // ← Now Easing is properly imported
                    useNativeDriver: false,
                }),
            ])
        ).start();

        return () => {
            // Cleanup
        };
    }, []);

    // ── SIMULATION LOGIC ──
    const startSimulation = () => {
        if (isSimulating) return;
        setIsSimulating(true);
        setIsConnected(true);

        let target = getCurrentTarget();

        if (detectionIntervalRef.current !== null) {
            clearInterval(detectionIntervalRef.current);
            detectionIntervalRef.current = null;
        }

        detectionIntervalRef.current = setInterval(() => {
            if (isModuleComplete) {
                stopSimulation();
                return;
            }

            target = getCurrentTarget();
            if (!target) return;

            const progress = completedLetters.size / ALPHABET_PART2.length;
            const accuracy = 0.9 - (progress * 0.3);
            const isCorrect = Math.random() < accuracy;

            let detected = '';
            if (isCorrect) {
                detected = target;
            } else {
                const possibleWrong = ALPHABET_PART2.filter(l => l !== target);
                detected = possibleWrong[Math.floor(Math.random() * possibleWrong.length)];
            }

            const conf = 0.6 + Math.random() * 0.35;
            handleDetection({ letter: detected, confidence: conf });
        }, 1200 + Math.random() * 800);
    };

    const stopSimulation = () => {
        if (detectionIntervalRef.current !== null) {
            clearInterval(detectionIntervalRef.current);
            detectionIntervalRef.current = null;
        }
        setIsSimulating(false);
    };

    // ── DETECTION HANDLER ──
    const handleDetection = (data: any) => {
        const { letter, confidence: conf } = data;

        if (letter && letter !== '✋' && letter.length === 1) {
            setDetectedLetter(letter);
            setConfidence(conf || 0);

            if (letter === lastProcessedLetter) {
                setLetterStableCount(prev => prev + 1);
            } else {
                setLastProcessedLetter(letter);
                setLetterStableCount(0);
                return;
            }

            if (letterStableCount < 1) {
                return;
            }

            if (ALPHABET_PART2.includes(letter)) {
                setLetterAttempts(prev => {
                    const current = prev[letter] || { letter, attempts: 0, wrongAttempts: 0, successCount: 0 };
                    return {
                        ...prev,
                        [letter]: {
                            ...current,
                            attempts: current.attempts + 1,
                            lastAttempt: Date.now(),
                        }
                    };
                });
            }

            if (ALPHABET_PART2.includes(letter)) {
                const target = getCurrentTarget();

                if (letter === target) {
                    if (!completedLetters.has(letter)) {
                        const newCompleted = new Set(completedLetters);
                        newCompleted.add(letter);
                        setCompletedLetters(newCompleted);
                        setConsecutiveWrong(0);
                        setTotalCorrectAttempts(prev => prev + 1);

                        setLetterAttempts(prev => {
                            const current = prev[letter] || { letter, attempts: 0, wrongAttempts: 0, successCount: 0 };
                            return {
                                ...prev,
                                [letter]: {
                                    ...current,
                                    successCount: current.successCount + 1,
                                    firstSuccess: current.firstSuccess || Date.now(),
                                }
                            };
                        });

                        const msg = SENYA_MESSAGES.correct[Math.floor(Math.random() * SENYA_MESSAGES.correct.length)];
                        setSenyaMessage(msg);
                        senyaMsgCooldownRef.current = Date.now();

                        showCutePopup(
                            `${letter} ✓`,
                            `${completedLetters.size + 1}/${ALPHABET_PART2.length}`
                        );
                    }
                } else if (completedLetters.has(letter)) {
                    const now = Date.now();
                    if (now - senyaMsgCooldownRef.current >= SENYA_COOLDOWN_MS) {
                        senyaMsgCooldownRef.current = now;
                        if (target) {
                            setSenyaMessage(`You got ${letter}! Try ${target} 👀`);
                        } else {
                            setSenyaMessage(SENYA_MESSAGES.complete);
                        }
                    }
                    setConsecutiveWrong(0);
                } else {
                    if (letterStableCount >= 2) {
                        const newWrong = consecutiveWrong + 1;
                        setConsecutiveWrong(newWrong);
                        setTotalWrongAttempts(prev => prev + 1);

                        if (target) {
                            setLetterAttempts(prev => {
                                const current = prev[target] || { letter: target, attempts: 0, wrongAttempts: 0, successCount: 0 };
                                return {
                                    ...prev,
                                    [target]: {
                                        ...current,
                                        wrongAttempts: current.wrongAttempts + 1,
                                    }
                                };
                            });
                        }

                        const now = Date.now();
                        if (now - senyaMsgCooldownRef.current >= SENYA_COOLDOWN_MS) {
                            senyaMsgCooldownRef.current = now;
                            if (newWrong >= 4) {
                                const msg = SENYA_MESSAGES.struggle[Math.floor(Math.random() * SENYA_MESSAGES.struggle.length)];
                                setSenyaMessage(msg);
                                setConsecutiveWrong(0);
                                showCutePopup(
                                    `💡 ${target}`,
                                    'Keep your hand steady'
                                );
                            } else if (newWrong >= 2) {
                                setSenyaMessage(`Try making ${target} shape! 🖐️`);
                            }
                        }
                    }
                }
            }
        } else {
            setDetectedLetter('✋');
            setConfidence(0);
            setLastProcessedLetter('');
            setLetterStableCount(0);

            const now = Date.now();
            if (!isModuleComplete && completedLetters.size < ALPHABET_PART2.length && now - senyaMsgCooldownRef.current >= 5000) {
                senyaMsgCooldownRef.current = now;
                const target = getCurrentTarget();
                if (target) {
                    setSenyaMessage(`Show me ${target}! 🤚`);
                }
            }
        }
    };

    // Show cute popup
    const showCutePopup = (message: string, subMessage: string = '') => {
        setPopupMessage(message);
        setPopupSubMessage(subMessage);
        setShowPopup(true);
        popupAnim.setValue(0);
        Animated.spring(popupAnim, {
            toValue: 1,
            friction: 8,
            tension: 40,
            useNativeDriver: true,
        }).start();

        setTimeout(() => {
            Animated.timing(popupAnim, {
                toValue: 0,
                duration: 150,
                useNativeDriver: true,
            }).start(() => {
                setShowPopup(false);
            });
        }, 1200);
    };

    // Get results
    const getResults = () => {
        const timeToUse = endTime || Date.now();
        const totalSecs = Math.round((timeToUse - startTime) / 1000);
        const minutes = Math.floor(totalSecs / 60);
        const seconds = totalSecs % 60;
        const timeDisplay = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;

        const strugglingLetters = Object.values(letterAttempts)
            .filter(l => l.wrongAttempts >= 2)
            .sort((a, b) => b.wrongAttempts - a.wrongAttempts)
            .map(l => l.letter)
            .slice(0, 3);

        const easyLetters = Object.values(letterAttempts)
            .filter(l => l.successCount > 0 && l.wrongAttempts === 0)
            .map(l => l.letter);

        return {
            totalTime: timeDisplay,
            strugglingLetters,
            easyLetters,
            totalCorrect: completedLetters.size,
            totalWrong: totalWrongAttempts,
        };
    };

    // Start simulation on mount
    useEffect(() => {
        startSimulation();
        return () => stopSimulation();
    }, []);

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
                {/* Header */}
                <View style={styles.header}>
                    <Pressable onPress={() => {
                        stopSimulation();
                        router.back();
                    }} style={styles.backBtn}>
                        <Ionicons name="arrow-back" size={24} color="#1A2C3E" />
                    </Pressable>
                    <Text style={styles.headerTitle}>Alphabet Part 2</Text>
                    <View style={[styles.statusBadge, isConnected && styles.statusActive]}>
                        <Text style={[styles.statusText, isConnected && styles.statusActiveText]}>
                            {isConnected ? '🟢 Live' : '⏳ Loading'}
                        </Text>
                    </View>
                </View>

                {/* Senya Section with Image */}
                <View style={styles.senyaSection}>
                    <Image
                        source={require('../../assets/images/new_characters/flora.png')}
                        style={styles.senyaImage}
                        resizeMode="contain"
                    />
                    <Text style={styles.senyaMessage}>{senyaMessage}</Text>
                </View>

                {/* Progress */}
                <View style={styles.progressHeader}>
                    <Text style={styles.progressText}>
                        Progress: {completedLetters.size}/{ALPHABET_PART2.length}
                    </Text>
                    <View style={styles.progressBar}>
                        <View
                            style={[
                                styles.progressFill,
                                { width: `${(completedLetters.size / ALPHABET_PART2.length) * 100}%` }
                            ]}
                        />
                    </View>
                    <Text style={styles.targetText}>
                        🎯 {currentTarget}
                    </Text>
                </View>

                {/* Camera/WebView Placeholder */}
                <View style={styles.webviewContainer}>
                    <View style={styles.placeholderContent}>
                        <Ionicons name="camera" size={48} color="#FFFFFF" style={{ opacity: 0.3 }} />
                        <Text style={styles.placeholderText}>
                            {isSimulating ? '🔍 Gesture Recognition Active' : '⏳ Loading Camera...'}
                        </Text>
                        <Text style={styles.placeholderSubtext}>
                            {isSimulating ? `Detecting: ${detectedLetter}` : 'Please wait...'}
                        </Text>
                        {isSimulating && (
                            <View style={styles.simulationControls}>
                                <TouchableOpacity
                                    style={[styles.controlBtn, styles.controlBtnStop]}
                                    onPress={stopSimulation}
                                >
                                    <Ionicons name="stop" size={16} color="#fff" />
                                    <Text style={styles.controlBtnText}>Stop</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.controlBtn, styles.controlBtnReset]}
                                    onPress={() => {
                                        stopSimulation();
                                        setCompletedLetters(new Set());
                                        setTotalWrongAttempts(0);
                                        setTotalCorrectAttempts(0);
                                        setStartTime(Date.now());
                                        setEndTime(null);
                                        setIsModuleComplete(false);
                                        setShowResults(false);
                                        setSenyaMessage(SENYA_MESSAGES.welcome);
                                        const initial: Record<string, LetterAttempt> = {};
                                        ALPHABET_PART2.forEach(letter => {
                                            initial[letter] = {
                                                letter,
                                                attempts: 0,
                                                wrongAttempts: 0,
                                                successCount: 0,
                                            };
                                        });
                                        setLetterAttempts(initial);
                                        setTimeout(() => startSimulation(), 500);
                                    }}
                                >
                                    <Ionicons name="refresh" size={16} color="#fff" />
                                    <Text style={styles.controlBtnText}>Reset</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                </View>

                {/* Letter Grid - N to Z with auto-scroll */}
                <ScrollView
                    ref={scrollViewRef}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.letterGridScroll}
                    contentContainerStyle={styles.letterGridContent}
                    scrollEventThrottle={16}
                >
                    {ALPHABET_PART2.map((letter) => {
                        const isCompleted = completedLetters.has(letter);
                        const isActive = letter === currentTarget && !isCompleted;
                        return (
                            <View
                                key={letter}
                                style={[
                                    styles.letterSlot,
                                    isCompleted && styles.letterCompleted,
                                    isActive && styles.letterActive,
                                ]}
                            >
                                <Text style={[
                                    styles.letterChar,
                                    isCompleted && styles.letterCharCompleted,
                                    isActive && styles.letterCharActive,
                                ]}>
                                    {letter}
                                </Text>
                                {isCompleted && (
                                    <Ionicons name="checkmark-circle" size={14} color="#10B981" />
                                )}
                                {isActive && (
                                    <Ionicons name="star" size={13} color="#FFD700" />
                                )}
                                {!isCompleted && !isActive && (
                                    <View style={styles.letterStatusDot} />
                                )}
                            </View>
                        );
                    })}
                </ScrollView>

                {/* Bottom Detection Bar */}
                <View style={styles.resultBar}>
                    <Text style={styles.resultLabel}>Detected:</Text>
                    <Text style={styles.resultLetter}>{detectedLetter}</Text>
                    {confidence > 0 && (
                        <View style={styles.confidenceContainer}>
                            <View style={styles.confidenceBar}>
                                <View
                                    style={[
                                        styles.confidenceFill,
                                        { width: `${Math.round(confidence * 100)}%` }
                                    ]}
                                />
                            </View>
                            <Text style={styles.resultConfidence}>
                                {Math.round(confidence * 100)}%
                            </Text>
                        </View>
                    )}
                </View>

                {/* Cute Popup */}
                {showPopup && (
                    <Animated.View
                        style={[
                            styles.popupContainer,
                            {
                                opacity: popupAnim,
                                transform: [
                                    {
                                        scale: popupAnim.interpolate({
                                            inputRange: [0, 0.5, 1],
                                            outputRange: [0.7, 1.05, 1],
                                        })
                                    }
                                ]
                            }
                        ]}
                    >
                        <View style={styles.popupContent}>
                            <Image
                                source={require('../../assets/images/new_characters/flora.png')}
                                style={styles.popupSenya}
                                resizeMode="contain"
                            />
                            <Text style={styles.popupMessage}>{popupMessage}</Text>
                            {popupSubMessage ? (
                                <Text style={styles.popupSubMessage}>{popupSubMessage}</Text>
                            ) : null}
                        </View>
                    </Animated.View>
                )}

                {/* Results Modal */}
                <Modal
                    visible={showResults}
                    transparent
                    animationType="fade"
                    onRequestClose={() => setShowResults(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalCard}>
                            <TouchableOpacity
                                style={styles.modalClose}
                                onPress={() => setShowResults(false)}
                                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                            >
                                <Ionicons name="close" size={20} color="#1A2C3E" />
                            </TouchableOpacity>

                            <View style={styles.trophyBadge}>
                                <Ionicons name="trophy" size={32} color="#FFD700" />
                            </View>

                            <Text style={styles.modalTitle}>You Did It!</Text>
                            <Text style={styles.modalSubtitle}>
                                All {ALPHABET_PART2.length} letters mastered
                            </Text>

                            <View style={styles.starsRow}>
                                {([starAnim1, starAnim2, starAnim3] as Animated.Value[]).map((anim, i) => {
                                    const isEarned = starRating > i;
                                    return (
                                        <Animated.View
                                            key={i}
                                            style={[
                                                styles.starWrapper,
                                                i === 1 && styles.starWrapperCenter,
                                                { transform: [{ scale: anim }], opacity: anim },
                                            ]}
                                        >
                                            <Ionicons
                                                name={isEarned ? 'star' : 'star-outline'}
                                                size={i === 1 ? 40 : 32}
                                                color={isEarned ? '#FFC93C' : '#D9E2EC'}
                                            />
                                        </Animated.View>
                                    );
                                })}
                            </View>
                            <View style={styles.starLabelPill}>
                                <Ionicons
                                    name={starRating === 3 ? 'flash' : starRating === 2 ? 'thumbs-up' : 'leaf'}
                                    size={14}
                                    color="#1A2C3E"
                                    style={{ marginRight: 6 }}
                                />
                                <Text style={styles.starLabel}>
                                    {starRating === 3 ? 'Lightning Fast!' : starRating === 2 ? 'Great Job!' : 'Keep Practicing!'}
                                </Text>
                            </View>

                            {(() => {
                                const results = getResults();
                                return (
                                    <>
                                        <View style={styles.resultsGrid}>
                                            <View style={styles.resultItem}>
                                                <View style={styles.resultIconWrap}>
                                                    <Ionicons name="timer-outline" size={20} color="#1A2C3E" />
                                                </View>
                                                <Text style={styles.resultValue}>{results.totalTime}</Text>
                                                <Text style={styles.resultGridLabel}>Time</Text>
                                            </View>
                                            <View style={styles.resultItemDivider} />
                                            <View style={styles.resultItem}>
                                                <View style={styles.resultIconWrap}>
                                                    <Ionicons name="hand-left-outline" size={20} color="#1A2C3E" />
                                                </View>
                                                <Text style={styles.resultValue}>
                                                    {results.totalCorrect}/{ALPHABET_PART2.length}
                                                </Text>
                                                <Text style={styles.resultGridLabel}>Gestures</Text>
                                            </View>
                                        </View>

                                        <View style={styles.senyaFeedback}>
                                            <View style={styles.feedbackHeader}>
                                                <Ionicons name="document-text-outline" size={16} color="#1A2C3E" />
                                                <Text style={styles.feedbackTitle}>Flora's Notes</Text>
                                            </View>
                                            {(() => {
                                                const items: { icon: any; color: string; text: string }[] = [];

                                                if (starRating === 3) {
                                                    items.push({ icon: 'sparkles', color: '#FFC93C', text: "You're absolutely incredible at this!" });
                                                } else if (starRating === 2) {
                                                    items.push({ icon: 'flame', color: '#FF7A45', text: 'Great work! A bit more speed for 3 stars.' });
                                                } else {
                                                    items.push({ icon: 'refresh', color: '#4A5C6E', text: 'Keep practicing! Your hands will get faster.' });
                                                }

                                                if (results.strugglingLetters.length > 0) {
                                                    items.push({
                                                        icon: 'alert-circle-outline',
                                                        color: '#E11D48',
                                                        text: `Need more help with: ${results.strugglingLetters.join(', ')}`,
                                                    });
                                                }

                                                if (results.easyLetters.length > 0) {
                                                    items.push({
                                                        icon: 'checkmark-circle',
                                                        color: '#10B981',
                                                        text: `You nailed: ${results.easyLetters.join(', ')}`,
                                                    });
                                                }

                                                return items.map((it, i) => (
                                                    <View key={i} style={styles.feedbackRow}>
                                                        <Ionicons name={it.icon} size={14} color={it.color} style={{ marginTop: 2, marginRight: 8 }} />
                                                        <Text style={styles.feedbackText}>{it.text}</Text>
                                                    </View>
                                                ));
                                            })()}
                                        </View>
                                    </>
                                );
                            })()}

                            <TouchableOpacity
                                style={styles.continueButton}
                                activeOpacity={0.85}
                                onPress={() => {
                                    setShowResults(false);
                                    stopSimulation();
                                    router.back();
                                }}
                            >
                                <Text style={styles.continueButtonText}>Continue</Text>
                                <Ionicons name="arrow-forward" size={18} color="#fff" style={{ marginLeft: 8 }} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
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
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: 'rgba(255,255,255,0.75)',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.3)',
    },
    backBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.8)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(26, 44, 62, 0.1)',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#1A2C3E',
    },
    statusBadge: {
        backgroundColor: 'rgba(200,200,200,0.2)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    statusActive: {
        backgroundColor: 'rgba(16,185,129,0.2)',
    },
    statusText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#6B7280',
    },
    statusActiveText: {
        color: '#10B981',
    },
    senyaSection: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        backgroundColor: 'rgba(255,255,255,0.6)',
        gap: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.3)',
    },
    senyaImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    senyaMessage: {
        flex: 1,
        fontSize: 14,
        fontWeight: '600',
        color: '#1A2C3E',
        fontStyle: 'italic',
    },
    progressHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: 'rgba(255,255,255,0.4)',
        gap: 10,
    },
    progressText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#1A2C3E',
        minWidth: 70,
    },
    progressBar: {
        flex: 1,
        height: 4,
        backgroundColor: 'rgba(26,44,62,0.1)',
        borderRadius: 2,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#FFD700',
        borderRadius: 2,
    },
    targetText: {
        fontSize: 14,
        fontWeight: '800',
        color: '#FFD700',
        minWidth: 30,
        textAlign: 'center',
    },
    webviewContainer: {
        flex: 1,
        marginHorizontal: 12,
        marginVertical: 8,
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: '#1A2C3E',
        position: 'relative',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        minHeight: 250,
    },
    placeholderContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        gap: 8,
    },
    placeholderText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
        marginTop: 8,
    },
    placeholderSubtext: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 13,
    },
    simulationControls: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 12,
    },
    controlBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    controlBtnStop: {
        backgroundColor: 'rgba(239, 68, 68, 0.3)',
    },
    controlBtnReset: {
        backgroundColor: 'rgba(59, 130, 246, 0.3)',
    },
    controlBtnText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '600',
    },
    letterGridScroll: {
        maxHeight: 88,
        marginHorizontal: 12,
        marginVertical: 6,
    },
    letterGridContent: {
        paddingHorizontal: 4,
        gap: 6,
        alignItems: 'center',
    },
    letterSlot: {
        width: 48,
        height: 64,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.78)',
        borderWidth: 2,
        borderColor: 'rgba(26, 44, 62, 0.12)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 6,
        shadowColor: '#1A2C3E',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.07,
        shadowRadius: 4,
        elevation: 2,
    },
    letterCompleted: {
        backgroundColor: 'rgba(16, 185, 129, 0.12)',
        borderColor: '#10B981',
        shadowColor: '#10B981',
        shadowOpacity: 0.2,
    },
    letterActive: {
        borderColor: '#FFD700',
        backgroundColor: 'rgba(255, 215, 0, 0.15)',
        transform: [{ scale: 1.1 }],
        shadowColor: '#FFD700',
        shadowOpacity: 0.55,
        shadowRadius: 10,
        elevation: 8,
    },
    letterChar: {
        fontSize: 20,
        fontWeight: '800',
        color: 'rgba(26, 44, 62, 0.35)',
    },
    letterCharCompleted: {
        color: '#10B981',
        fontSize: 18,
    },
    letterCharActive: {
        color: '#92650A',
        fontSize: 22,
    },
    letterStatusDot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: 'rgba(26,44,62,0.15)',
        marginTop: 3,
    },
    resultBar: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: 'rgba(255,255,255,0.9)',
        marginHorizontal: 12,
        marginBottom: 12,
        borderRadius: 14,
        gap: 10,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.8)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    resultLabel: {
        fontSize: 11,
        color: '#4A5C6E',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    resultLetter: {
        fontSize: 28,
        fontWeight: '900',
        color: '#1A2C3E',
        minWidth: 34,
        textAlign: 'center',
    },
    confidenceContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    confidenceBar: {
        flex: 1,
        height: 4,
        backgroundColor: 'rgba(26,44,62,0.1)',
        borderRadius: 2,
        overflow: 'hidden',
    },
    confidenceFill: {
        height: '100%',
        backgroundColor: '#10B981',
        borderRadius: 2,
    },
    resultConfidence: {
        fontSize: 11,
        color: '#10B981',
        fontWeight: '700',
        minWidth: 32,
    },
    popupContainer: {
        position: 'absolute',
        top: '35%',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        pointerEvents: 'none',
    },
    popupContent: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 10,
        paddingHorizontal: 18,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
        borderWidth: 1.5,
        borderColor: '#FFD700',
        minWidth: 80,
    },
    popupSenya: {
        width: 28,
        height: 28,
        marginBottom: 2,
    },
    popupMessage: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1A2C3E',
        textAlign: 'center',
    },
    popupSubMessage: {
        fontSize: 10,
        color: '#4A5C6E',
        marginTop: 1,
        textAlign: 'center',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(10, 22, 40, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    modalCard: {
        backgroundColor: '#fff',
        borderRadius: 24,
        paddingTop: 28,
        paddingBottom: 20,
        paddingHorizontal: 20,
        width: '100%',
        maxWidth: 340,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.25,
        shadowRadius: 24,
        elevation: 16,
    },
    modalClose: {
        position: 'absolute',
        top: 12,
        right: 12,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#f1f5f9',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2,
    },
    trophyBadge: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: 'rgba(255, 201, 60, 0.15)',
        borderWidth: 2,
        borderColor: 'rgba(255, 201, 60, 0.4)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: '#1A2C3E',
        textAlign: 'center',
    },
    modalSubtitle: {
        fontSize: 13,
        color: '#4A5C6E',
        marginTop: 4,
        textAlign: 'center',
    },
    starsRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'center',
        marginTop: 14,
        gap: 6,
    },
    starWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    starWrapperCenter: {
        marginBottom: 6,
    },
    starLabelPill: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 201, 60, 0.15)',
        paddingVertical: 5,
        paddingHorizontal: 12,
        borderRadius: 999,
        marginTop: 10,
        marginBottom: 14,
    },
    starLabel: {
        fontSize: 12,
        fontWeight: '700',
        color: '#1A2C3E',
    },
    resultsGrid: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f7faff',
        borderRadius: 16,
        paddingVertical: 14,
        paddingHorizontal: 12,
        marginBottom: 12,
        width: '100%',
        borderWidth: 1,
        borderColor: 'rgba(26,44,62,0.08)',
    },
    resultItem: {
        flex: 1,
        alignItems: 'center',
    },
    resultIconWrap: {
        width: 34,
        height: 34,
        borderRadius: 17,
        backgroundColor: 'rgba(26, 44, 62, 0.08)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 6,
    },
    resultItemDivider: {
        width: 1,
        height: 44,
        backgroundColor: 'rgba(26,44,62,0.1)',
        marginHorizontal: 4,
    },
    resultValue: {
        fontSize: 18,
        fontWeight: '800',
        color: '#1A2C3E',
    },
    resultGridLabel: {
        fontSize: 10,
        color: '#4A5C6E',
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginTop: 2,
    },
    senyaFeedback: {
        backgroundColor: '#fbfcff',
        borderRadius: 14,
        padding: 12,
        width: '100%',
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(26,44,62,0.08)',
    },
    feedbackHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 8,
    },
    feedbackTitle: {
        fontSize: 13,
        fontWeight: '800',
        color: '#1A2C3E',
    },
    feedbackRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 4,
    },
    feedbackText: {
        flex: 1,
        fontSize: 12,
        color: '#334155',
        lineHeight: 18,
    },
    continueButton: {
        backgroundColor: '#2E7FE8',
        paddingVertical: 13,
        paddingHorizontal: 24,
        borderRadius: 999,
        width: '100%',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        shadowColor: '#2E7FE8',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 6,
    },
    continueButtonText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '700',
    },
});