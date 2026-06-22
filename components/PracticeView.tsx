// /components/PracticeView.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { UserState } from '../types';

// Import Senya images
const senyaHappy = require('../assets/images/senya/senya_happy.png');
const senyaHi = require('../assets/images/senya/senya_hi.png');
const senyaTeaching = require('../assets/images/senya/senya_teaching.png');

interface PracticeViewProps {
    userState: UserState;
}

interface PracticeCard {
    letter: string;
    signDescription: string;
    handForm: 'A' | 'B' | 'C' | '1' | '2' | '3';
}

const ALPHABET_DRILLS: PracticeCard[] = [
    { letter: 'Letter A', signDescription: 'Make a fist with your thumb pointing upright next to your index finger.', handForm: 'A' },
    { letter: 'Letter B', signDescription: 'Raise all four fingers straight with your thumb crossed in front of your palm.', handForm: 'B' },
    { letter: 'Letter C', signDescription: 'Curve all fingers and thumb to form a crescent letter "C" outline.', handForm: 'C' }
];

const NUMBER_DRILLS: PracticeCard[] = [
    { letter: 'Number 1', signDescription: 'Raise your index finger straight with other fingers folded.', handForm: '1' },
    { letter: 'Number 2', signDescription: 'Raise index and middle finger to form a scissor "2" shape.', handForm: '2' },
    { letter: 'Number 3', signDescription: 'Extend thumb, index, and middle fingers outward together.', handForm: '3' }
];

export default function PracticeView({ userState }: PracticeViewProps) {
    const [activeCategory, setActiveCategory] = useState<'selection' | 'drill_alphabet' | 'drill_numbers'>('selection');
    const [currentDrillIndex, setCurrentDrillIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);

    const startDrill = (type: 'alphabet' | 'numbers') => {
        setActiveCategory(type === 'alphabet' ? 'drill_alphabet' : 'drill_numbers');
        setCurrentDrillIndex(0);
        setIsFlipped(false);
    };

    const handleNextDrill = (max: number) => {
        if (currentDrillIndex < max - 1) {
            setCurrentDrillIndex(prev => prev + 1);
            setIsFlipped(false);
        } else {
            setActiveCategory('selection');
            Alert.alert(
                '🎉 Congratulations!',
                "You've finished this practice segment! Progress updated! ⭐️"
            );
        }
    };

    const currentDrillsList = activeCategory === 'drill_alphabet' ? ALPHABET_DRILLS : NUMBER_DRILLS;
    const currentCard = currentDrillsList[currentDrillIndex];

    const renderHandSign = (handForm: string) => {
        switch (handForm) {
            case 'A':
                return <Text className="text-8xl">👆</Text>;
            case 'B':
                return <Text className="text-8xl">✋</Text>;
            case 'C':
                return <Text className="text-8xl">🤏</Text>;
            case '1':
                return <Text className="text-8xl">☝️</Text>;
            case '2':
                return <Text className="text-8xl">✌️</Text>;
            case '3':
                return <Text className="text-8xl">🤟</Text>;
            default:
                return <Text className="text-8xl">👋</Text>;
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-slate-50/30">
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
                        onPress={() => Alert.alert(
                            'Practice Hub',
                            'Interactive sign flashcards to review hand configurations anytime!'
                        )}
                        className="p-1"
                    >
                        <Ionicons name="information-circle-outline" size={20} color="#64748b" />
                    </TouchableOpacity>

                    <View className="flex-row items-center space-x-1.5 px-3 py-1 bg-amber-50 rounded-full border border-amber-100">
                        <Ionicons name="flame" size={16} color="#f59e0b" />
                        <Text className="text-amber-700 text-[11px] font-black">{userState.streak} Day Streak</Text>
                    </View>

                    <TouchableOpacity className="p-1">
                        <Ionicons name="notifications-outline" size={20} color="#64748b" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Main Content */}
            <ScrollView className="flex-1 px-5 py-4">
                {activeCategory === 'selection' ? (
                    /* ================= MAIN SELECTION LIST ================= */
                    <View className="space-y-6">
                        {/* Header greeting with Senya */}
                        <View className="flex-row justify-between items-start bg-slate-50/50 rounded-2xl p-2 relative">
                            <View className="pt-2 pl-2">
                                <Text className="text-2xl font-black text-slate-950 leading-tight">
                                    Let's Practice{'\n'}Your Signs!
                                </Text>
                            </View>
                            <View className="absolute right-[-10px] top-[-26px]">
                                <Image
                                    source={senyaHi}
                                    style={{ width: 60, height: 60 }}
                                    resizeMode="contain"
                                />
                            </View>
                        </View>

                        {/* Tips Banner */}
                        <View className="w-full bg-blue-600 rounded-3xl p-5 relative overflow-hidden">
                            <View className="absolute right-4 bottom-4 opacity-20">
                                <Ionicons name="star" size={48} color="#38bdf8" />
                            </View>
                            <View className="max-w-[210px]">
                                <Text className="text-xs font-black uppercase tracking-wider text-yellow-300">
                                    Practice Tip
                                </Text>
                                <Text className="text-sm text-slate-100/90 leading-relaxed font-bold mt-1">
                                    Just 5 minutes of daily practice is way more effective than cramming!
                                </Text>
                            </View>
                        </View>

                        {/* Categories */}
                        <View className="space-y-4">
                            <Text className="text-slate-800 text-sm font-black leading-snug tracking-tight">
                                Choose a category to practice the gestures you've learned.
                            </Text>

                            <View className="flex-row flex-wrap justify-between">
                                {/* Alphabet card */}
                                <TouchableOpacity
                                    onPress={() => startDrill('alphabet')}
                                    className="bg-white border-2 border-slate-100 p-5 rounded-3xl w-[48%] mb-4"
                                >
                                    <View className="w-10 h-10 bg-blue-50 rounded-2xl items-center justify-center">
                                        <Text className="text-blue-600 font-black text-xs">ABC</Text>
                                    </View>
                                    <View className="mt-3">
                                        <Text className="text-[14px] font-black text-slate-950">Alphabet</Text>
                                        <Text className="text-[10px] text-slate-400 font-bold">Fingerspelling</Text>
                                        <View className="mt-2">
                                            <View className="flex-row justify-between items-center">
                                                <Text className="text-[9px] font-bold text-slate-400">PROGRESS</Text>
                                                <Text className="text-[9px] font-bold text-slate-400">20%</Text>
                                            </View>
                                            <View className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden mt-0.5">
                                                <View className="h-full bg-yellow-400 rounded-full" style={{ width: '20%' }} />
                                            </View>
                                        </View>
                                    </View>
                                </TouchableOpacity>

                                {/* Numbers card */}
                                <TouchableOpacity
                                    onPress={() => startDrill('numbers')}
                                    className="bg-white border-2 border-slate-100 p-5 rounded-3xl w-[48%] mb-4"
                                >
                                    <View className="w-10 h-10 bg-indigo-50 rounded-2xl items-center justify-center">
                                        <Text className="text-indigo-600 font-black text-xs">123</Text>
                                    </View>
                                    <View className="mt-3">
                                        <Text className="text-[14px] font-black text-slate-950">Numbers</Text>
                                        <Text className="text-[10px] text-slate-400 font-bold">Counting 1-100</Text>
                                        <View className="mt-2">
                                            <View className="flex-row justify-between items-center">
                                                <Text className="text-[9px] font-bold text-slate-400">PROGRESS</Text>
                                                <Text className="text-[9px] font-bold text-slate-400">1%</Text>
                                            </View>
                                            <View className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden mt-0.5">
                                                <View className="h-full bg-yellow-400 rounded-full" style={{ width: '1%' }} />
                                            </View>
                                        </View>
                                    </View>
                                </TouchableOpacity>

                                {/* Basic Words (Locked) */}
                                <View className="bg-slate-100/60 border border-slate-200/50 p-5 rounded-3xl w-[48%] relative">
                                    <View className="absolute top-4 right-4">
                                        <Ionicons name="lock-closed" size={16} color="#94a3b8" />
                                    </View>
                                    <View className="w-10 h-10 bg-slate-200/80 rounded-2xl items-center justify-center">
                                        <Text className="text-slate-400 text-xl">💬</Text>
                                    </View>
                                    <View className="mt-3">
                                        <Text className="text-[14px] font-black text-slate-400">Basic Words</Text>
                                        <Text className="text-[10px] text-slate-400 font-semibold">Greetings & Phrases</Text>
                                    </View>
                                </View>

                                {/* Sentences (Locked) */}
                                <View className="bg-slate-100/60 border border-slate-200/50 p-5 rounded-3xl w-[48%] relative">
                                    <View className="absolute top-4 right-4">
                                        <Ionicons name="lock-closed" size={16} color="#94a3b8" />
                                    </View>
                                    <View className="w-10 h-10 bg-slate-200/80 rounded-2xl items-center justify-center">
                                        <Text className="text-slate-400 text-xl">📝</Text>
                                    </View>
                                    <View className="mt-3">
                                        <Text className="text-[14px] font-black text-slate-400">Sentences</Text>
                                        <Text className="text-[10px] text-slate-400 font-semibold">Structuring phrases</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                ) : (
                    /* ================= DRILL SECTION ================= */
                    <View className="space-y-6 pt-2 items-center">
                        {/* Header navigation */}
                        <View className="flex-row justify-between items-center w-full bg-white px-2 py-1 rounded-xl">
                            <TouchableOpacity
                                onPress={() => setActiveCategory('selection')}
                                className="flex-row items-center"
                            >
                                <Text className="text-xs font-black text-blue-600">✕ Exit Practice</Text>
                            </TouchableOpacity>

                            <Text className="text-xs font-black text-slate-400 uppercase tracking-widest">
                                Drill {currentDrillIndex + 1} of {currentDrillsList.length}
                            </Text>
                        </View>

                        {/* Instruction with Senya */}
                        <View className="p-4 bg-blue-50 border border-blue-100 rounded-3xl w-full flex-row items-start">
                            <Image
                                source={senyaTeaching}
                                style={{ width: 50, height: 50 }}
                                resizeMode="contain"
                            />
                            <View className="ml-2 pt-1">
                                <Text className="text-sm font-black text-blue-950">Let's practice gestures!</Text>
                                <Text className="text-xs text-blue-800 font-semibold">
                                    Tap the flashcard to flip and read the exact gesture description instruction.
                                </Text>
                            </View>
                        </View>

                        {/* Flashcard */}
                        <TouchableOpacity
                            onPress={() => setIsFlipped(!isFlipped)}
                            className="w-full max-w-[280px] h-[320px]"
                            activeOpacity={0.9}
                        >
                            <View className={`relative w-full h-full ${isFlipped ? 'rotate-y-180' : ''}`}>
                                {/* Card Front */}
                                <View className={`absolute w-full h-full bg-white border-2 border-slate-100 rounded-[36px] p-6 items-center justify-between ${isFlipped ? 'hidden' : 'flex'}`}>
                                    <Text className="text-xl font-extrabold text-[#1270e3] uppercase tracking-wider">
                                        {currentCard.letter}
                                    </Text>

                                    <View className="w-40 h-40 bg-blue-50/40 rounded-3xl border border-blue-100 items-center justify-center">
                                        {renderHandSign(currentCard.handForm)}
                                    </View>

                                    <Text className="text-xs font-bold text-slate-400 tracking-wider">TAP TO REVEAL DETAILS</Text>
                                </View>

                                {/* Card Back */}
                                <View className={`absolute w-full h-full bg-slate-900 rounded-[36px] p-6 items-center justify-between ${isFlipped ? 'flex' : 'hidden'}`}>
                                    <Text className="text-xs font-black text-yellow-300 uppercase tracking-widest">How to Sign</Text>

                                    <Text className="text-sm font-semibold leading-relaxed text-slate-100 text-center px-4">
                                        {currentCard.signDescription}
                                    </Text>

                                    <View className="py-2 px-4 bg-white/10 rounded-xl">
                                        <Text className="text-[10px] font-extrabold text-slate-300 uppercase tracking-wide">
                                            Tap to view front
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>

                        {/* Next button */}
                        <TouchableOpacity
                            onPress={() => handleNextDrill(currentDrillsList.length)}
                            className="w-full max-w-[240px] py-4 bg-blue-600 rounded-2xl"
                            style={{ elevation: 4 }}
                        >
                            <Text className="text-white font-extrabold text-sm text-center">
                                {currentDrillIndex < currentDrillsList.length - 1 ? 'Next Hand Sign →' : 'Finish Segment 🎉'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}