// app/login.tsx
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Pressable,
  Alert,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
  Animated,
  Easing,
  StatusBar
} from 'react-native';
import { Href, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import Svg, { Path, Rect, Circle, Polyline, Defs, LinearGradient, Stop } from 'react-native-svg';

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

// SVG Icons
function IdCard({ size = 18, color = "currentColor" }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
      <Rect x="2" y="4" width="20" height="16" rx="2" />
      <Path d="M8 10h8" />
      <Path d="M8 14h5" />
      <Circle cx="16" cy="14" r="2" />
    </Svg>
  );
}

function Lock({ size = 18, color = "currentColor" }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
      <Rect x="3" y="11" width="18" height="10" rx="2" />
      <Path d="M7 11V8a5 5 0 0 1 10 0v3" />
    </Svg>
  );
}

function GraduationCap({ size = 20, color = "currentColor" }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
      <Path d="M12 2L1 7l11 5 9-4.09V17" />
      <Path d="M21 7v6" />
      <Path d="M7 21h10" />
    </Svg>
  );
}

function ChevronRight({ size = 18, color = "currentColor" }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <Polyline points="9 18 15 12 9 6" />
    </Svg>
  );
}

function CheckCircle({ size = 16, color = "currentColor" }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <Path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <Polyline points="22 4 12 14.01 9 11.01" />
    </Svg>
  );
}

// Field Component
function Field({
  label,
  value,
  onChange,
  placeholder,
  type,
  icon,
  maxLength,
  error,
  onBlur,
  showCounter,
  counterText
}: any) {
  const [isFocused, setIsFocused] = useState(false);
  const [touched, setTouched] = useState(false);

  const showError = touched && error;

  return (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={[
        styles.inputWrapper,
        isFocused && styles.inputWrapperFocused,
        showError && styles.inputWrapperError
      ]}>
        <View style={styles.inputIcon}>
          {icon}
        </View>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChange}
          placeholder={placeholder}
          placeholderTextColor="#9AABB8"
          secureTextEntry={type === 'password'}
          keyboardType={type === 'password' ? 'number-pad' : 'number-pad'}
          maxLength={maxLength}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setIsFocused(false);
            setTouched(true);
            if (onBlur) onBlur();
          }}
        />
        {showCounter && value.length > 0 && (
          <View style={styles.counterContainer}>
            <Text style={[
              styles.counterText,
              value.length === maxLength && styles.counterTextComplete
            ]}>
              {value.length}/{maxLength}
            </Text>
            {value.length === maxLength && (
              <CheckCircle size={16} color="#4CAF50" />
            )}
          </View>
        )}
      </View>
      {showError && (
        <Text style={styles.errorText}>{error}</Text>
      )}
      {!showError && counterText && value.length > 0 && value.length < maxLength && (
        <Text style={styles.hintText}>{counterText}</Text>
      )}
    </View>
  );
}

export default function Login() {
  const router = useRouter();
  const [lrn, setLrn] = useState('');
  const [pw, setPw] = useState('');
  const [loading, setLoading] = useState(false);
  const [lrnError, setLrnError] = useState('');
  const [pinError, setPinError] = useState('');
  const pinInputRef = useRef(null);

  // ── Cloud Animations ──
  const cloud1Anim = useRef(new Animated.Value(-200)).current;
  const cloud2Anim = useRef(new Animated.Value(screenWidth + 200)).current;
  const cloud3Anim = useRef(new Animated.Value(-250)).current;
  const cloud4Anim = useRef(new Animated.Value(screenWidth + 250)).current;

  // ── Sun Glow Animation ──
  const sunAnim = useRef(new Animated.Value(0)).current;

  // ── Card Entrance Animation ──
  const cardScale = useRef(new Animated.Value(0.9)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const cardTranslateY = useRef(new Animated.Value(30)).current;

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

    // ── Card Entrance Animation ──
    Animated.parallel([
      Animated.timing(cardOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(cardScale, {
        toValue: 1,
        friction: 6,
        tension: 40,
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
      // Cleanup not needed for looping animations
    };
  }, []);

  const validateLRN = (text: string) => {
    const numericText = text.replace(/[^0-9]/g, '');
    setLrn(numericText);

    if (numericText.length > 0 && numericText.length < 12) {
      setLrnError(`LRN must be exactly 12 digits (${numericText.length}/12)`);
    } else if (numericText.length === 12) {
      setLrnError('');
    } else {
      setLrnError('');
    }
  };

  const validatePIN = (text: string) => {
    const numericText = text.replace(/[^0-9]/g, '');
    setPw(numericText);

    if (numericText.length > 0 && numericText.length < 4) {
      setPinError(`PIN must be exactly 4 digits (${numericText.length}/4)`);
    } else if (numericText.length === 4) {
      setPinError('');
    } else {
      setPinError('');
    }
  };

  const handleSignIn = async () => {
    let hasError = false;

    if (lrn.length !== 12) {
      setLrnError('LRN must be exactly 12 digits');
      hasError = true;
    }

    if (pw.length !== 4) {
      setPinError('PIN must be exactly 4 digits');
      hasError = true;
    }

    if (hasError) {
      return;
    }

    setLoading(true);

    try {
      if (lrn === '123456789012' && pw === '1234') {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));

        // Navigate directly - no Alert delay
        router.replace('/assessment' as Href);
      } else {
        Alert.alert(
          'Login Failed',
          'Invalid LRN or PIN. Please try again.\n\n(Hint: Use LRN: 123456789012, PIN: 1234)'
        );
      }
    } catch (error: any) {
      Alert.alert('Login Failed', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
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
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.content}>
              {/* Header */}
              <View style={styles.header}>
                <View style={styles.logoBox}>
                  <Image
                    source={require('../assets/images/new_characters/senya.png')}
                    style={styles.logo}
                    contentFit="contain"
                  />
                </View>
                <Text style={styles.title}>Welcome Back</Text>
                <Text style={styles.subtitle}>Sign in to continue learning</Text>
              </View>

              {/* ── Animated Card ── */}
              <Animated.View
                style={[
                  styles.card,
                  {
                    opacity: cardOpacity,
                    transform: [
                      { scale: cardScale },
                      { translateY: cardTranslateY }
                    ]
                  }
                ]}
              >


                <View style={styles.noteCard}>
                  <View style={styles.noteIconBox}>
                    <GraduationCap size={22} color="#D4891A" />
                  </View>
                  <View style={styles.noteTextContent}>
                    <Text style={styles.noteTitle}>Need your LRN?</Text>
                    <Text style={styles.noteDesc}>Your Learner Reference Number (LRN) is provided by your teacher. Ask them if you need help! ✨</Text>
                  </View>
                </View>

                <Field
                  label="Learner Reference Number (LRN)"
                  value={lrn}
                  onChange={validateLRN}
                  placeholder="Enter your 12-digit LRN"
                  type="text"
                  icon={<IdCard size={18} color="#9AABB8" />}
                  maxLength={12}
                  error={lrnError}
                  showCounter={true}
                  counterText="Enter 12-digit LRN"
                />

                <View style={{ height: 16 }} />

                <Field
                  label="PIN"
                  value={pw}
                  onChange={validatePIN}
                  placeholder="Enter your 4-digit PIN"
                  type="password"
                  icon={<Lock size={18} color="#9AABB8" />}
                  maxLength={4}
                  error={pinError}
                  showCounter={true}
                  counterText="Enter 4-digit PIN"
                />

                <Pressable style={styles.forgotBtn}>
                  <Text style={styles.forgotText}>Forgot PIN? Ask your teacher 🧑‍🏫</Text>
                </Pressable>

                <Pressable
                  style={[
                    styles.signInBtn,
                    loading && styles.signInBtnDisabled,
                    (lrn.length !== 12 || pw.length !== 4) && styles.signInBtnDisabled
                  ]}
                  onPress={handleSignIn}
                  disabled={loading || lrn.length !== 12 || pw.length !== 4}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <>
                      <Text style={styles.signInText}>Sign in</Text>
                      <ChevronRight size={18} color="#fff" />
                    </>
                  )}
                </Pressable>
              </Animated.View>

              <Text style={styles.footerText}>
                By signing in, you agree to our <Text style={styles.linkText}>Terms</Text> and <Text style={styles.linkText}>Privacy Policy</Text>
              </Text>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
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
    flexGrow: 1,
    paddingBottom: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
    zIndex: 1,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
    paddingTop: 12,
  },
  logoBox: {
    backgroundColor: 'rgba(46, 127, 232, 0.08)',
    borderRadius: 60,
    padding: 12,
    marginBottom: 12,
  },
  logo: {
    width: 64,
    height: 64,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1A2C3E',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#4A5C6E',
    fontWeight: '500',
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.75)',
    backdropFilter: 'blur(20px)',
    borderRadius: 28,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 20,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    marginBottom: 20,
  },
  cardTopStrip: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: '#2E7FE8',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  noteCard: {
    backgroundColor: 'rgba(255, 200, 100, 0.12)',
    borderRadius: 20,
    padding: 14,
    marginBottom: 24,
    borderColor: 'rgba(255, 200, 100, 0.2)',
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  noteIconBox: {
    backgroundColor: 'rgba(255, 200, 100, 0.15)',
    borderRadius: 40,
    padding: 8,
  },
  noteTextContent: {
    flex: 1,
  },
  noteTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#C47A1A',
  },
  noteDesc: {
    fontSize: 12,
    color: '#9B6A1A',
    lineHeight: 16,
    marginTop: 2,
  },
  fieldContainer: {
    marginBottom: 4,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4A5C6E',
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.06)',
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.8)',
    paddingHorizontal: 16,
    minHeight: 50,
  },
  inputWrapperFocused: {
    borderColor: '#2E7FE8',
    backgroundColor: '#FFFFFF',
  },
  inputWrapperError: {
    borderColor: '#E53935',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 14,
    color: '#1A2C3E',
    paddingRight: 8,
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  counterText: {
    fontSize: 11,
    color: '#9AABB8',
    fontWeight: '500',
    marginRight: 2,
  },
  counterTextComplete: {
    color: '#4CAF50',
  },
  errorText: {
    fontSize: 12,
    color: '#E53935',
    marginTop: 5,
    marginLeft: 4,
    fontWeight: '500',
  },
  hintText: {
    fontSize: 12,
    color: '#9AABB8',
    marginTop: 5,
    marginLeft: 4,
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    marginTop: 12,
  },
  forgotText: {
    color: '#2E7FE8',
    fontSize: 12,
    fontWeight: '600',
  },
  signInBtn: {
    marginTop: 24,
    backgroundColor: '#2E7FE8',
    paddingVertical: 14,
    borderRadius: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#2E7FE8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },
  signInBtnDisabled: {
    opacity: 0.5,
  },
  signInText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  footerText: {
    textAlign: 'center',
    fontSize: 11,
    color: '#8A9AAA',
    lineHeight: 18,
  },
  linkText: {
    color: '#2E7FE8',
    fontWeight: '600',
  },
});