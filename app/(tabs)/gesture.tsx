import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, Pressable, ScrollView, Modal
} from 'react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import Svg, { Path, Circle, Line, Polyline, Rect } from 'react-native-svg';

/* ══ DATA ══════════════════════════════════════════════════════════════ */
const gestureChallenges = [
  { letter: 'A', emoji: '✊', hint: 'Closed fist — thumb resting on side of index finger', color: '#2563EB' },
  { letter: 'B', emoji: '🖐',  hint: 'Four fingers pointing up, thumb folded across palm', color: '#10B981' },
  { letter: 'C', emoji: '🤏', hint: 'Curve all fingers and thumb to form letter C shape', color: '#F59E0B' },
  { letter: 'D', emoji: '👆', hint: 'Index finger up, other fingers touch thumb', color: '#8B5CF6' },
  { letter: 'E', emoji: '🤛', hint: 'All fingers bent down toward palm, touching thumb', color: '#EF4444' },
];

/* ══ Result Modal ══════════════════════════════════════════════════════ */
function ResultModal({ visible, score, total, onClose, onRetry }: {
  visible: boolean; score: number; total: number; onClose: () => void; onRetry: () => void;
}) {
  const pct = Math.round((score / total) * 100);
  const { label, color } =
    pct === 100 ? { label: 'Perfect! 🎉', color: '#F59E0B' } :
    pct >= 80   ? { label: 'Excellent! 🌟', color: '#10B981' } :
    pct >= 60   ? { label: 'Good Job! 👍', color: '#2563EB' } :
                  { label: 'Keep Trying! 💪', color: '#8B5CF6' };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={s.overlay}>
        <View style={s.resultModal}>
          <Image source={require('../../assets/images/img/senya_teaching.png')} style={s.resultModalSenya} contentFit="contain" />
          <Text style={{ fontSize: 40, marginBottom: 8 }}>🏆</Text>
          <Text style={[s.resultModalLabel, { color }]}>{label}</Text>
          <Text style={s.resultModalScore}>{score}<Text style={{ fontSize: 24, opacity: 0.5 }}>/{total}</Text></Text>
          <Text style={s.resultModalSub}>signs recognized</Text>
          <View style={s.xpBadgeLg}><Text style={s.xpBadgeLgText}>+{score * 15} XP Earned!</Text></View>

          <View style={s.resultModalBtns}>
            <Pressable style={s.retryBtn} onPress={onRetry}>
              <Text style={s.retryBtnText}>↺ Try Again</Text>
            </Pressable>
            <Pressable style={s.doneBtn} onPress={onClose}>
              <Text style={s.doneBtnText}>Done ✓</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

/* ══ Camera Placeholder ══════════════════════════════════════════════════ */
function CameraViewPlaceholder({ challenge, status, onDetect }: {
  challenge: typeof gestureChallenges[0];
  status: 'waiting' | 'scanning' | 'success' | 'fail';
  onDetect: (success: boolean) => void;
}) {
  return (
    <View style={[s.cameraBox, { borderColor: status === 'success' ? '#10B981' : status === 'fail' ? '#EF4444' : challenge.color }]}>
      {/* Simulated camera feed background */}
      <View style={s.cameraFeed}>
        <View style={s.cameraBg} />

        {/* Corner brackets */}
        {[
          { top: 12, left: 12, borderTopWidth: 3, borderLeftWidth: 3 },
          { top: 12, right: 12, borderTopWidth: 3, borderRightWidth: 3 },
          { bottom: 12, left: 12, borderBottomWidth: 3, borderLeftWidth: 3 },
          { bottom: 12, right: 12, borderBottomWidth: 3, borderRightWidth: 3 },
        ].map((style, i) => (
          <View key={i} style={[s.cornerBracket, style, { borderColor: challenge.color }]} />
        ))}

        {/* Sign display area */}
        <View style={s.cameraCenter}>
          {status === 'success' ? (
            <View style={s.successOverlay}>
              <Text style={s.successEmoji}>✅</Text>
              <Text style={s.successText}>Sign Detected!</Text>
            </View>
          ) : status === 'fail' ? (
            <View style={s.failOverlay}>
              <Text style={s.failEmoji}>❌</Text>
              <Text style={s.failText}>Try Again</Text>
            </View>
          ) : status === 'scanning' ? (
            <View style={s.scanningOverlay}>
              <Text style={s.scanningEmoji}>🔍</Text>
              <Text style={s.scanningText}>Scanning...</Text>
            </View>
          ) : (
            <View style={s.waitingOverlay}>
              <Text style={s.handEmoji}>{challenge.emoji}</Text>
              <Text style={s.waitingText}>Show sign for "{challenge.letter}"</Text>
            </View>
          )}
        </View>

        {/* Hand skeleton dots simulation */}
        <View style={s.handSkeleton}>
          {[...Array(8)].map((_, i) => (
            <View key={i} style={[s.skelDot, {
              left: 40 + (i % 4) * 30,
              top: 20 + Math.floor(i / 4) * 40,
              opacity: status === 'scanning' ? 0.8 : 0.3,
              backgroundColor: challenge.color,
            }]} />
          ))}
        </View>
      </View>

      {/* Scan line animation hint */}
      {status === 'scanning' && (
        <View style={[s.scanLine, { backgroundColor: challenge.color }]} />
      )}
    </View>
  );
}

/* ══ MAIN SCREEN ══════════════════════════════════════════════════════════ */
export default function Gesture() {
  const router = useRouter();
  const [challengeIdx, setChallengeIdx] = useState(0);
  const [status, setStatus] = useState<'waiting' | 'scanning' | 'success' | 'fail'>('waiting');
  const [score, setScore] = useState(0);
  const [completedIds, setCompletedIds] = useState<Set<number>>(new Set());
  const [showResult, setShowResult] = useState(false);
  const [camPermission, setCamPermission] = useState<'unknown' | 'granted' | 'denied'>('unknown');

  const challenge = gestureChallenges[challengeIdx];

  const handleSimulateDetect = (success: boolean) => {
    setStatus(success ? 'success' : 'fail');
    if (success) {
      setScore(s => s + 1);
      setCompletedIds(prev => new Set([...prev, challengeIdx]));
    }
    setTimeout(() => {
      if (challengeIdx < gestureChallenges.length - 1) {
        setChallengeIdx(challengeIdx + 1);
        setStatus('waiting');
      } else {
        setShowResult(true);
        setStatus('waiting');
      }
    }, 1200);
  };

  const handleScan = () => {
    if (status !== 'waiting') return;
    setStatus('scanning');
    // Simulate recognition after 2 seconds (random result for demo)
    setTimeout(() => {
      handleSimulateDetect(Math.random() > 0.3); // 70% success rate for demo
    }, 2000);
  };

  const handleRetry = () => {
    setChallengeIdx(0);
    setScore(0);
    setCompletedIds(new Set());
    setStatus('waiting');
    setShowResult(false);
  };

  const handlePermission = () => {
    setCamPermission('granted');
  };

  return (
    <SafeAreaView style={s.container}>
      <ResultModal
        visible={showResult}
        score={score}
        total={gestureChallenges.length}
        onClose={() => router.push('/(tabs)/dashboard')}
        onRetry={handleRetry}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>
        {/* Top bar */}
        <View style={s.topBar}>
          <View>
            <Text style={s.logoText}>SEÑAS</Text>
            <Text style={s.subTitle}>Gesture Recognition</Text>
          </View>
          <View style={s.topRight}>
            <View style={s.scoreBadge}>
              <Text style={s.scoreBadgeText}>✋ {score}/{gestureChallenges.length}</Text>
            </View>
            <Pressable onPress={() => router.back()} style={s.backBtnTop}>
              <Text style={s.backBtnTopText}>←</Text>
            </Pressable>
          </View>
        </View>

        {/* Challenge progress strip */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.challengeStrip}>
          {gestureChallenges.map((g, i) => (
            <Pressable
              key={i}
              style={[s.challengeChip,
                i === challengeIdx && s.challengeChipActive,
                completedIds.has(i) && s.challengeChipDone,
              ]}
              onPress={() => { if (!status.includes('scanning')) { setChallengeIdx(i); setStatus('waiting'); } }}
            >
              <Text style={s.challengeChipEmoji}>{g.emoji}</Text>
              <Text style={[s.challengeChipLetter,
                i === challengeIdx ? { color: '#fff' } :
                completedIds.has(i) ? { color: '#10B981' } : { color: '#4b7bbb' }
              ]}>{g.letter}</Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Current challenge info */}
        <View style={s.challengeInfoCard}>
          <View style={[s.challengeColorBar, { backgroundColor: challenge.color }]} />
          <View style={s.challengeInfoInner}>
            <View style={s.challengeInfoLeft}>
              <Text style={s.challengeTitle}>Sign the letter</Text>
              <Text style={[s.challengeLetter, { color: challenge.color }]}>{challenge.letter}</Text>
              <Text style={s.challengeHint}>{challenge.hint}</Text>
            </View>
            <View style={[s.challengeEmojiBig, { backgroundColor: challenge.color + '15' }]}>
              <Text style={s.challengeEmojiBigText}>{challenge.emoji}</Text>
            </View>
          </View>
        </View>

        {/* Camera permission prompt or camera view */}
        {camPermission !== 'granted' ? (
          <View style={s.permissionCard}>
            <Image
              source={require('../../assets/images/img/camera.png')}
              style={s.cameraIconImg} contentFit="contain"
            />
            <Text style={s.permissionTitle}>Camera Access Needed</Text>
            <Text style={s.permissionDesc}>
              To recognize your hand signs, SEÑAS needs access to your camera.{'\n'}
              Your video is processed on-device and never stored.
            </Text>
            <Pressable style={s.allowBtn} onPress={handlePermission}>
              <Text style={s.allowBtnText}>📷 Allow Camera Access</Text>
            </Pressable>
            <Pressable style={s.demoModeBtn} onPress={handlePermission}>
              <Text style={s.demoModeBtnText}>Try Demo Mode Instead</Text>
            </Pressable>
          </View>
        ) : (
          <>
            {/* Camera view */}
            <CameraViewPlaceholder
              challenge={challenge}
              status={status}
              onDetect={handleSimulateDetect}
            />

            {/* Scan button */}
            <View style={s.scanBtnRow}>
              <Pressable
                style={[s.scanBtn, status === 'scanning' && s.scanBtnActive, { borderColor: challenge.color }]}
                onPress={handleScan}
                disabled={status === 'scanning' || status === 'success'}
              >
                <View style={[s.scanBtnInner, { backgroundColor: challenge.color }]}>
                  <Text style={s.scanBtnText}>
                    {status === 'scanning' ? '🔍 Scanning...' :
                     status === 'success'  ? '✅ Got it!'     :
                     status === 'fail'     ? '↺ Try Again'   : '📷 Scan Sign'}
                  </Text>
                </View>
              </Pressable>
            </View>

            {/* Tips */}
            <View style={s.tipsCard}>
              <Image source={require('../../assets/images/img/senya_blue.png')} style={s.tipsSenya} contentFit="contain" />
              <View style={s.tipsBubble}>
                <Text style={s.tipsBubbleText}>
                  💡 Hold your hand steady in good lighting. Keep your hand within the frame and face the camera.
                </Text>
              </View>
            </View>

            {/* All signs reference */}
            <View style={s.referenceCard}>
              <Text style={s.referenceTitle}>Quick Reference</Text>
              <View style={s.referenceGrid}>
                {gestureChallenges.map((g, i) => (
                  <View key={i} style={[s.referenceItem, completedIds.has(i) && s.referenceItemDone]}>
                    <Text style={s.referenceEmoji}>{g.emoji}</Text>
                    <Text style={[s.referenceLetter, completedIds.has(i) ? { color: '#10B981' } : { color: '#0f3172' }]}>{g.letter}</Text>
                    {completedIds.has(i) && <Text style={s.referenceDoneCheck}>✓</Text>}
                  </View>
                ))}
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

/* ══ STYLES ══════════════════════════════════════════════════════════════ */
const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#eaf5fd' },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center', padding: 20 },
  scroll: { padding: 16, paddingBottom: 60 },

  // Top bar
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  logoText: { color: '#0f3172', fontSize: 22, fontWeight: '800', letterSpacing: 2 },
  subTitle: { color: '#4b7bbb', fontSize: 12, fontWeight: '600', marginTop: 2 },
  topRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  scoreBadge: { backgroundColor: 'rgba(255,255,255,0.7)', borderRadius: 20, paddingVertical: 5, paddingHorizontal: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.85)' },
  scoreBadgeText: { fontSize: 13, fontWeight: '700', color: '#0f3172' },
  backBtnTop: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.7)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.85)' },
  backBtnTopText: { fontSize: 18, color: '#0f3172' },

  // Challenge strip
  challengeStrip: { gap: 8, paddingRight: 4, marginBottom: 14 },
  challengeChip: { alignItems: 'center', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.62)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.85)', gap: 4 },
  challengeChipActive: { backgroundColor: '#2563EB', borderColor: '#2563EB' },
  challengeChipDone: { borderColor: '#10B981', backgroundColor: 'rgba(16,185,129,0.08)' },
  challengeChipEmoji: { fontSize: 20 },
  challengeChipLetter: { fontSize: 11, fontWeight: '800' },

  // Challenge info card
  challengeInfoCard: { backgroundColor: 'rgba(255,255,255,0.62)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.85)', borderRadius: 20, marginBottom: 14, overflow: 'hidden', shadowColor: '#0f3172', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.09, shadowRadius: 12, elevation: 4 },
  challengeColorBar: { height: 4 },
  challengeInfoInner: { flexDirection: 'row', alignItems: 'center', padding: 18, gap: 16 },
  challengeInfoLeft: { flex: 1 },
  challengeTitle: { fontSize: 12, fontWeight: '600', color: '#4b7bbb', marginBottom: 2 },
  challengeLetter: { fontSize: 40, fontWeight: '900', marginBottom: 4 },
  challengeHint: { fontSize: 12, color: '#6B7280', fontWeight: '500', lineHeight: 18 },
  challengeEmojiBig: { width: 70, height: 70, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  challengeEmojiBigText: { fontSize: 40 },

  // Camera
  cameraBox: { borderRadius: 24, borderWidth: 2, overflow: 'hidden', marginBottom: 14, height: 280, position: 'relative' },
  cameraFeed: { flex: 1, backgroundColor: '#0a1628', position: 'relative' },
  cameraBg: { position: 'absolute', inset: 0, backgroundColor: '#0a1628' },
  cornerBracket: { position: 'absolute', width: 24, height: 24 },
  cameraCenter: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' },
  waitingOverlay: { alignItems: 'center', gap: 8 },
  handEmoji: { fontSize: 72, opacity: 0.8 },
  waitingText: { color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: '600' },
  scanningOverlay: { alignItems: 'center', gap: 8 },
  scanningEmoji: { fontSize: 48 },
  scanningText: { color: '#fff', fontSize: 14, fontWeight: '700' },
  successOverlay: { alignItems: 'center', gap: 8, backgroundColor: 'rgba(16,185,129,0.15)', borderRadius: 20, padding: 20 },
  successEmoji: { fontSize: 56 },
  successText: { color: '#10B981', fontSize: 16, fontWeight: '800' },
  failOverlay: { alignItems: 'center', gap: 8, backgroundColor: 'rgba(239,68,68,0.15)', borderRadius: 20, padding: 20 },
  failEmoji: { fontSize: 56 },
  failText: { color: '#EF4444', fontSize: 16, fontWeight: '700' },
  handSkeleton: { position: 'absolute', bottom: 20, right: 20, width: 130, height: 80 },
  skelDot: { position: 'absolute', width: 8, height: 8, borderRadius: 4 },
  scanLine: { position: 'absolute', left: 0, right: 0, height: 2, top: '50%', opacity: 0.5 },

  // Scan button
  scanBtnRow: { alignItems: 'center', marginBottom: 14 },
  scanBtn: { borderWidth: 2, borderRadius: 99, padding: 4, width: '80%' },
  scanBtnActive: { opacity: 0.7 },
  scanBtnInner: { borderRadius: 99, paddingVertical: 16, alignItems: 'center' },
  scanBtnText: { fontSize: 16, fontWeight: '700', color: '#fff' },

  // Tips
  tipsCard: { flexDirection: 'row', alignItems: 'flex-end', gap: 10, marginBottom: 14 },
  tipsSenya: { width: 56, height: 56, flexShrink: 0 },
  tipsBubble: { flex: 1, backgroundColor: 'rgba(255,255,255,0.62)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.85)', borderRadius: 14, padding: 12 },
  tipsBubbleText: { fontSize: 12, color: '#0f3172', fontWeight: '500', lineHeight: 18 },

  // Reference
  referenceCard: { backgroundColor: 'rgba(255,255,255,0.62)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.85)', borderRadius: 20, padding: 18 },
  referenceTitle: { fontSize: 14, fontWeight: '800', color: '#0f3172', marginBottom: 14 },
  referenceGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  referenceItem: { width: '18%', alignItems: 'center', padding: 8, borderRadius: 12, backgroundColor: 'rgba(15,49,114,0.05)' },
  referenceItemDone: { backgroundColor: 'rgba(16,185,129,0.10)' },
  referenceEmoji: { fontSize: 24 },
  referenceLetter: { fontSize: 11, fontWeight: '800', marginTop: 2 },
  referenceDoneCheck: { fontSize: 10, color: '#10B981', fontWeight: '800' },

  // Permission
  permissionCard: { backgroundColor: 'rgba(255,255,255,0.62)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.85)', borderRadius: 24, padding: 28, alignItems: 'center', marginBottom: 14 },
  cameraIconImg: { width: 80, height: 80, marginBottom: 16 },
  permissionTitle: { fontSize: 20, fontWeight: '800', color: '#0f3172', marginBottom: 8 },
  permissionDesc: { fontSize: 13, color: '#6B7280', fontWeight: '500', lineHeight: 20, textAlign: 'center', marginBottom: 24 },
  allowBtn: { width: '100%', backgroundColor: '#2563EB', borderRadius: 60, paddingVertical: 14, alignItems: 'center', marginBottom: 12, shadowColor: '#2563EB', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.28, shadowRadius: 18, elevation: 10 },
  allowBtnText: { fontSize: 15, fontWeight: '700', color: '#fff' },
  demoModeBtn: { paddingVertical: 10 },
  demoModeBtnText: { fontSize: 13, fontWeight: '600', color: '#4b7bbb' },

  // Result modal
  resultModal: { width: '92%', maxWidth: 380, backgroundColor: 'rgba(255,255,255,0.97)', borderRadius: 32, padding: 28, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 20 }, shadowOpacity: 0.2, shadowRadius: 40, elevation: 24 },
  resultModalSenya: { width: 90, height: 90, marginBottom: 8 },
  resultModalLabel: { fontSize: 22, fontWeight: '800', marginBottom: 4 },
  resultModalScore: { fontSize: 64, fontWeight: '900', color: '#0f3172', lineHeight: 72 },
  resultModalSub: { fontSize: 14, color: '#6B7280', fontWeight: '500', marginBottom: 12 },
  xpBadgeLg: { backgroundColor: 'rgba(245,158,11,0.15)', borderRadius: 99, paddingVertical: 6, paddingHorizontal: 18, marginBottom: 24 },
  xpBadgeLgText: { fontSize: 14, fontWeight: '800', color: '#92400E' },
  resultModalBtns: { flexDirection: 'row', gap: 12, width: '100%' },
  retryBtn: { flex: 1, paddingVertical: 14, borderRadius: 60, backgroundColor: 'rgba(15,49,114,0.07)', borderWidth: 1, borderColor: 'rgba(15,49,114,0.10)', alignItems: 'center' },
  retryBtnText: { fontSize: 14, fontWeight: '700', color: '#0f3172' },
  doneBtn: { flex: 1.5, paddingVertical: 14, borderRadius: 60, backgroundColor: '#2563EB', alignItems: 'center', shadowColor: '#2563EB', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 14, elevation: 8 },
  doneBtnText: { fontSize: 14, fontWeight: '700', color: '#fff' },
});
