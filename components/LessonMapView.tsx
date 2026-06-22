// /components/LessonMapView.tsx
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { UserState } from '../types';

// Import Senya images
const senyaHappy = require('../assets/images/senya/senya_happy.png');
const senyaHi = require('../assets/images/senya/senya_hi.png');
const senyaTeaching = require('../assets/images/senya/senya_teaching.png');

interface LessonMapViewProps {
    userState: UserState;
    onStartLesson: () => void;
}

export default function LessonMapView({ userState, onStartLesson }: LessonMapViewProps) {
    return (
        <SafeAreaView className="flex-1 bg-blue-50/40">
            {/* Header */}
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
                        onPress={() => alert("Winding Lesson Path:\nCompleted nodes (✓) are unlocked.\nLocked nodes have chests of sign language flashcards!")}
                        className="p-1"
                    >
                        <Ionicons name="information-circle-outline" size={20} color="#64748b" />
                    </TouchableOpacity>

                    <View className="flex-row items-center space-x-1.5 px-3 py-1 bg-amber-50 rounded-full border border-amber-100">
                        <Ionicons name="flame" size={16} color="#f59e0b" />
                        <Text className="text-amber-700 text-[11.5px] font-black">{userState.streak} Day Streak</Text>
                    </View>

                    <TouchableOpacity className="p-1">
                        <Ionicons name="notifications-outline" size={20} color="#64748b" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Map Content */}
            <ScrollView className="flex-1 px-6 py-8">
                <View className="relative min-h-[640px]">
                    {/* Decorative leaves */}
                    <View className="absolute top-[480px] left-[50px] opacity-40">
                        <Ionicons name="leaf-outline" size={24} color="#22c55e" />
                    </View>

                    {/* Node 4: Chest Challenge (Top, locked) */}
                    <View className="absolute top-[80px] left-[170px] items-center">
                        <View className="relative">
                            <View className="absolute -top-1.5 -right-1.5 bg-slate-400 rounded-full p-1 border-2 border-white z-20">
                                <Ionicons name="lock-closed" size={14} color="#ffffff" />
                            </View>
                            <TouchableOpacity
                                onPress={() => alert("Keep learning! Finish Module 1 Lesson to unlock the Chest Challenge 🎁")}
                                className="w-16 h-16 bg-slate-100 border-4 border-slate-200 rounded-full items-center justify-center"
                            >
                                <Ionicons name="gift-outline" size={28} color="#94a3b8" />
                            </TouchableOpacity>
                        </View>
                        <Text className="text-[10px] font-black tracking-widest text-slate-500 mt-2 uppercase">
                            Chest Challenge
                        </Text>
                    </View>

                    {/* Node 3: Greetings (Active) */}
                    <View className="absolute top-[240px] right-[40px] items-center">
                        {/* Senya waving next to active node */}
                        <View className="absolute -top-16 -right-5 z-20">
                            <Image
                                source={senyaHi}
                                style={{ width: 60, height: 60 }}
                                resizeMode="contain"
                            />
                            <Text className="text-[8px] text-blue-500 font-bold text-center mt-1">👋 Hi!</Text>
                        </View>

                        <View className="absolute -bottom-8 px-4 py-1.5 bg-blue-600 border-2 border-white rounded-full">
                            <Text className="text-white text-[10px] font-black tracking-wider uppercase">
                                Greetings
                            </Text>
                        </View>

                        <TouchableOpacity
                            onPress={onStartLesson}
                            className="w-20 h-20 bg-blue-600 border-4 border-yellow-300 rounded-full items-center justify-center"
                            style={{ elevation: 8 }}
                        >
                            <Ionicons name="hand-left-outline" size={32} color="#ffffff" />
                        </TouchableOpacity>
                    </View>

                    {/* Node 2: Alphabets (Part 2) (Completed) */}
                    <View className="absolute bottom-[230px] left-[150px] items-center">
                        <TouchableOpacity
                            onPress={() => alert("Replay Alphabets (Part 2) with fingerspelling drills!")}
                            className="w-16 h-16 bg-blue-600 border-4 border-blue-400 rounded-full items-center justify-center"
                        >
                            <Ionicons name="checkmark" size={28} color="#ffffff" />
                        </TouchableOpacity>
                        <Text className="text-[10px] font-black tracking-widest text-slate-600 mt-2 uppercase">
                            Alphabets (Part 2)
                        </Text>
                    </View>

                    {/* Node 1: Alphabets (Part 1) (Completed) */}
                    <View className="absolute bottom-[60px] right-[100px] items-center">
                        <TouchableOpacity
                            onPress={onStartLesson}
                            className="w-16 h-16 bg-blue-600 border-4 border-blue-400 rounded-full items-center justify-center"
                        >
                            <Ionicons name="checkmark" size={28} color="#ffffff" />
                        </TouchableOpacity>
                        <Text className="text-[10px] font-black tracking-widest text-blue-600 mt-2 uppercase">
                            Alphabets (Part 1)
                        </Text>
                    </View>

                    {/* Winding path decorative lines - using View with styles */}
                    <View className="absolute inset-0">
                        {/* Curved path using a View with border */}
                        <View
                            className="absolute border-2 border-blue-500 rounded-full opacity-60"
                            style={{
                                width: 300,
                                height: 500,
                                top: 100,
                                left: 50,
                                borderStyle: 'dashed',
                                borderColor: '#60a5fa',
                            }}
                        />
                        <View
                            className="absolute border-2 border-blue-400 rounded-full opacity-30"
                            style={{
                                width: 320,
                                height: 520,
                                top: 90,
                                left: 40,
                                borderStyle: 'dotted',
                            }}
                        />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}