// /components/DashboardView.tsx
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Mascot from './Mascot';
import { UserState } from '../types';

interface DashboardViewProps {
    userState: UserState;
    onStartLesson: () => void;
    onNavigateTab: (tab: 'home' | 'map' | 'practice' | 'achievements' | 'profile') => void;
}

export default function DashboardView({ userState, onStartLesson, onNavigateTab }: DashboardViewProps) {
    const [showWelcomeModal, setShowWelcomeModal] = useState(true);
    const [showReadyLessonModal, setShowReadyLessonModal] = useState(false);

    const handleStartOnboarding = () => {
        setShowWelcomeModal(false);
        setShowReadyLessonModal(true);
    };

    const handleStartLessonDirect = () => {
        setShowReadyLessonModal(false);
        onStartLesson();
    };

    return (
        <SafeAreaView className="flex-1 bg-[#F8FAFC]">
            {/* ================= HEADER SECTION ================= */}
            <View className="flex-row justify-between items-center px-6 py-3.5 bg-white border-b border-slate-100">
                <View className="flex-row items-center space-x-2.5">
                    <View className="w-8.5 h-8.5 bg-blue-600 rounded-xl items-center justify-center">
                        <Text className="text-white font-black text-sm">S</Text>
                    </View>
                    <View>
                        <Text className="text-base font-black text-slate-900 tracking-tight">
                            SEÑAS <Text className="text-blue-600">FSL</Text>
                        </Text>
                        <Text className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest">
                            KamayKita Platform
                        </Text>
                    </View>
                </View>

                <View className="flex-row items-center space-x-3">
                    <TouchableOpacity
                        onPress={() => alert("SEÑAS: Filipino Sign Language Platform developed for student fingerspelling, lessons & sign practice.")}
                        className="p-1"
                    >
                        <Ionicons name="information-circle-outline" size={20} color="#64748b" />
                    </TouchableOpacity>

                    <View className="flex-row items-center space-x-1.5 px-3 py-1 bg-amber-50 rounded-full border border-amber-100">
                        <Ionicons name="flame" size={16} color="#f59e0b" />
                        <Text className="text-amber-700 text-[11px] font-black">{userState.streak} Day Streak</Text>
                    </View>

                    <TouchableOpacity
                        onPress={() => alert("Notification: Maria Maria, you have completed 1 lesson today with a perfect 94% performance rate! 🎉")}
                        className="relative p-1"
                    >
                        <Ionicons name="notifications-outline" size={20} color="#64748b" />
                        <View className="absolute top-1 right-2.5 w-1.5 h-1.5 bg-rose-600 rounded-full" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* ================= HOME CONTENT ================= */}
            <ScrollView className="flex-1 px-5 pt-4 pb-6">
                {/* Dynamic Personal Welcome Banner with Mascot */}
                <View className="flex-row justify-between items-start bg-white border border-slate-100 rounded-2xl p-4 relative">
                    <View className="pt-1">
                        <Text className="text-xl font-black text-slate-900 leading-snug">
                            Hello {userState.name.split(' ')[0]}!
                        </Text>
                        <Text className="text-xs text-blue-600 font-extrabold tracking-wide">
                            Ready to learn some signs today? 👋
                        </Text>
                    </View>
                    <View className="absolute right-0 top-[-24px]">
                        <Mascot mood="peek_normal" />
                    </View>
                </View>

                {/* Level Unit / Progress Main Card */}
                <View className="w-full bg-blue-600 rounded-[32px] p-6 mt-4 relative overflow-hidden">
                    <View className="absolute right-[-40px] bottom-[-40px] opacity-10">
                        <Ionicons name="trophy" size={48} color="#ffffff" />
                    </View>

                    <View className="flex-row justify-between items-start">
                        <View>
                            <View className="mb-4">
                                <View className="px-3 py-1 bg-yellow-400 rounded-full self-start">
                                    <Text className="text-slate-900 font-black text-[9px] uppercase tracking-wider">
                                        Layer 1: Unit Basics
                                    </Text>
                                </View>
                                <Text className="text-lg font-black text-white mt-2">{userState.currentUnit}</Text>
                                <Text className="text-xs text-white/80 font-bold">{userState.familiarity || 'Novice Signer'}</Text>
                            </View>

                            <View className="w-[180px]">
                                <View className="flex-row justify-between items-center">
                                    <Text className="text-[10px] font-black text-white tracking-wider">PROGRESS</Text>
                                    <Text className="text-[10px] font-black text-white">{userState.progress}%</Text>
                                </View>
                                <View className="h-2.5 w-full bg-white/20 rounded-full overflow-hidden mt-1">
                                    <View
                                        className="h-full bg-yellow-400 rounded-full"
                                        style={{ width: `${userState.progress}%` }}
                                    />
                                </View>
                            </View>
                        </View>

                        <View className="bg-white/15 p-4 rounded-3xl border border-white/25">
                            <Ionicons name="trophy" size={40} color="#fcd34d" />
                        </View>
                    </View>
                </View>

                {/* Recommended Lesson block */}
                <View className="mt-4">
                    <View className="flex-row justify-between items-center px-1 mb-3">
                        <View>
                            <Text className="text-base font-black text-slate-900">Recommended Lesson</Text>
                            <Text className="text-xs text-slate-400 font-bold">Begin with lessons matched to your skill level.</Text>
                        </View>
                        <TouchableOpacity onPress={() => onNavigateTab('map')}>
                            <Text className="text-xs font-black text-blue-600">See more →</Text>
                        </TouchableOpacity>
                    </View>

                    <View className="bg-white border-2 border-slate-100 rounded-3xl p-5 flex-row justify-between items-center">
                        <View>
                            <Text className="text-[10px] font-black text-blue-600 tracking-widest uppercase">Module 1</Text>
                            <Text className="text-lg font-black text-slate-950 leading-tight">Alphabets (Part 1)</Text>

                            <TouchableOpacity
                                onPress={() => setShowReadyLessonModal(true)}
                                className="px-6 py-2.5 bg-blue-600 rounded-2xl mt-3"
                            >
                                <Text className="text-white font-extrabold text-xs">Start →</Text>
                            </TouchableOpacity>
                        </View>

                        <View className="flex-row items-center">
                            <View className="w-11 h-11 bg-rose-400 border-2 border-white rounded-xl rotate-12 items-center justify-center mr-[-8px]">
                                <Text className="text-white font-black text-lg">A</Text>
                            </View>
                            <View className="w-12 h-12 bg-teal-400 border-2 border-white rounded-xl rotate-[-6deg] items-center justify-center mr-[-8px]">
                                <Text className="text-white font-black text-lg">B</Text>
                            </View>
                            <View className="w-12 h-12 bg-amber-400 border-2 border-white rounded-xl rotate-12 items-center justify-center">
                                <Text className="text-white font-black text-lg">C</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Continue Learning section */}
                <View className="mt-4">
                    <View className="flex-row justify-between items-center px-1 mb-3">
                        <Text className="text-base font-black text-slate-900">Continue Learning</Text>
                        <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
                    </View>

                    <View className="flex-row flex-wrap justify-between">
                        <TouchableOpacity
                            onPress={() => onNavigateTab('practice')}
                            className="bg-white border-2 border-slate-100 p-4 rounded-3xl w-[48%]"
                        >
                            <View className="w-9 h-9 bg-blue-50 rounded-2xl items-center justify-center">
                                <Ionicons name="help-circle-outline" size={20} color="#2563eb" />
                            </View>
                            <View className="mt-2">
                                <Text className="text-[13px] font-black text-slate-950">Fingerspelling</Text>
                                <Text className="text-[10px] text-slate-400 font-bold">Progress 20%</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => onNavigateTab('practice')}
                            className="bg-white border-2 border-slate-100 p-4 rounded-3xl w-[48%]"
                        >
                            <View className="w-10 h-10 bg-amber-50 rounded-2xl items-center justify-center">
                                <Text className="text-amber-600 font-black text-lg">123</Text>
                            </View>
                            <View className="mt-2">
                                <Text className="text-[13px] font-black text-slate-950">Numbers</Text>
                                <Text className="text-[10px] text-slate-400 font-bold">12 Lessons</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>

            {/* ================= MODAL OVERLAYS ================= */}

            {/* 1. ONBOARDING WELCOME MODAL */}
            <Modal
                visible={showWelcomeModal}
                transparent
                animationType="fade"
            >
                <View className="flex-1 bg-slate-950/70 items-center justify-center p-6">
                    <View className="w-full max-w-[320px] bg-white rounded-[32px] p-6 items-center border-4 border-yellow-300">
                        <View className="items-center -mt-20 mb-3">
                            <Mascot mood="waving" />
                        </View>

                        <Text className="text-2xl font-black text-blue-600 text-center">
                            Hi! I'm Senya! 👋
                        </Text>

                        <Text className="text-sm font-semibold text-slate-600 text-center mt-2">
                            Welcome to SEÑAS! I'll help you learn and explore the app step by step.
                        </Text>

                        <View className="flex-row space-x-3 mt-4 w-full">
                            <TouchableOpacity
                                onPress={() => setShowWelcomeModal(false)}
                                className="flex-1 py-3 bg-slate-100 rounded-2xl"
                            >
                                <Text className="text-slate-600 font-black text-sm text-center">Skip</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={handleStartOnboarding}
                                className="flex-1 py-3 bg-blue-600 rounded-2xl"
                            >
                                <Text className="text-white font-black text-sm text-center">Start →</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* 2. "READY TO LEARN?" MODAL */}
            <Modal
                visible={showReadyLessonModal}
                transparent
                animationType="fade"
            >
                <View className="flex-1 bg-slate-950/70 items-center justify-center p-6">
                    <View className="w-full max-w-[320px] bg-white rounded-[32px] p-6 items-center">
                        <TouchableOpacity
                            onPress={() => setShowReadyLessonModal(false)}
                            className="absolute top-4 left-4"
                        >
                            <Text className="text-slate-400 text-xl font-bold">✕</Text>
                        </TouchableOpacity>

                        <View className="items-center my-6">
                            <Mascot mood="teacher" />
                        </View>

                        <Text className="text-2xl font-black text-slate-950 text-center">
                            Ready to Learn?
                        </Text>
                        <Text className="text-sm font-semibold text-slate-500 text-center mt-1">
                            Introduction to FSL and Alphabets
                        </Text>

                        <View className="py-2.5 px-4 bg-amber-50 rounded-2xl border border-amber-100 mt-4">
                            <Text className="text-amber-800 font-extrabold text-xs text-center">
                                Finish this lesson to earn your First Sign Badge ⭐
                            </Text>
                        </View>

                        <TouchableOpacity
                            onPress={handleStartLessonDirect}
                            className="w-full py-4 bg-blue-600 rounded-2xl mt-4"
                        >
                            <Text className="text-white font-black text-center">Start Lesson! →</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}