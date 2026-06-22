// /components/FamiliarityView.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FamiliarityLevel } from '../types';

interface FamiliarityViewProps {
    onFamiliarityChosen: (level: FamiliarityLevel) => void;
    onBack: () => void;
}

interface SlideItem {
    level: FamiliarityLevel;
    title: string;
    description: string;
    gestureEmoji: string;
    handSvgType: 'beginner' | 'intermediate' | 'advanced';
}

const FAMILIARITY_SLIDES: SlideItem[] = [
    {
        level: 'Beginner',
        title: 'Beginner',
        description: "I'm new to sign language",
        gestureEmoji: '👋',
        handSvgType: 'beginner'
    },
    {
        level: 'Intermediate',
        title: 'Intermediate',
        description: 'I know some letters and basic words',
        gestureEmoji: '✌️',
        handSvgType: 'intermediate'
    },
    {
        level: 'Advanced',
        title: 'Conversational',
        description: 'I want to speak and translate phrases',
        gestureEmoji: '🤟',
        handSvgType: 'advanced'
    }
];

// Import images
const senyaHappy = require('../assets/images/senya/senya_happy.png');
const senyaHi = require('../assets/images/senya/senya_hi.png');
const senyaMainLogo = require('../assets/images/senya/senya_main_logo.png');
const senyaTeaching = require('../assets/images/senya/senya_teaching.png');

export default function FamiliarityView({ onFamiliarityChosen, onBack }: FamiliarityViewProps) {
    const [subStep, setSubStep] = useState<'assess' | 'confirmed'>('assess');
    const [activeSlide, setActiveSlide] = useState(0);

    const handleNextSlide = () => {
        setActiveSlide((prev) => (prev < FAMILIARITY_SLIDES.length - 1 ? prev + 1 : prev));
    };

    const handlePrevSlide = () => {
        setActiveSlide((prev) => (prev > 0 ? prev - 1 : prev));
    };

    const handleContinue = () => {
        setSubStep('confirmed');
    };

    const handleStartLearning = () => {
        onFamiliarityChosen(FAMILIARITY_SLIDES[activeSlide].level);
    };

    const currentSlide = FAMILIARITY_SLIDES[activeSlide];

    const renderHandSign = (type: string) => {
        switch (type) {
            case 'beginner':
                return (
                    <View className="items-center justify-center">
                        <Text className="text-8xl">👋</Text>
                        <Text className="text-xs text-slate-400 mt-2">Waving Hand</Text>
                    </View>
                );
            case 'intermediate':
                return (
                    <View className="items-center justify-center">
                        <Text className="text-8xl">✌️</Text>
                        <Text className="text-xs text-slate-400 mt-2">Peace Sign</Text>
                    </View>
                );
            case 'advanced':
                return (
                    <View className="items-center justify-center">
                        <Text className="text-8xl">🤟</Text>
                        <Text className="text-xs text-slate-400 mt-2">I Love You</Text>
                    </View>
                );
            default:
                return <Text className="text-8xl">👋</Text>;
        }
    };

    if (subStep === 'assess') {
        return (
            <SafeAreaView className="flex-1 bg-white">
                <View className="flex-1 px-6 pt-4">
                    {/* Header with Back and Skip */}
                    <View className="flex-row justify-between items-center pb-2">
                        <TouchableOpacity
                            onPress={onBack}
                            className="p-2"
                        >
                            <Ionicons name="arrow-back" size={24} color="#475569" />
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={handleContinue}
                            className="px-4 py-1.5 bg-slate-100 rounded-full flex-row items-center"
                        >
                            <Text className="text-slate-600 text-sm font-bold mr-1">Skip</Text>
                            <Ionicons name="arrow-forward" size={16} color="#475569" />
                        </TouchableOpacity>
                    </View>

                    {/* Title */}
                    <View className="items-center mt-3 px-2">
                        <Text className="text-xs font-black text-blue-600 tracking-widest uppercase mb-1">
                            Self-Assessment
                        </Text>
                        <Text className="text-2xl font-black text-slate-950 text-center leading-tight">
                            How familiar are you with <Text className="text-blue-600">Filipino Sign Language?</Text>
                        </Text>
                    </View>

                    {/* Sliding Card */}
                    <View className="flex-1 items-center justify-center">
                        <View className="relative w-full items-center">
                            {/* Navigation Arrows */}
                            {activeSlide > 0 && (
                                <TouchableOpacity
                                    onPress={handlePrevSlide}
                                    className="absolute left-0 z-10 p-2.5 bg-white shadow-lg border border-slate-100 rounded-full"
                                    style={{ elevation: 2 }}
                                >
                                    <Ionicons name="chevron-back" size={20} color="#475569" />
                                </TouchableOpacity>
                            )}

                            {/* Main Content */}
                            <View className="items-center px-8">
                                <View className="w-[170px] h-[170px] bg-slate-50/50 rounded-full border border-blue-100 items-center justify-center mb-6">
                                    {renderHandSign(currentSlide.handSvgType)}
                                </View>

                                <Text className="text-3xl font-black text-slate-800 text-center mb-1">
                                    {currentSlide.title}
                                </Text>
                                <Text className="text-xs text-slate-500 font-semibold text-center max-w-[200px]">
                                    {currentSlide.description}
                                </Text>
                            </View>

                            {activeSlide < FAMILIARITY_SLIDES.length - 1 && (
                                <TouchableOpacity
                                    onPress={handleNextSlide}
                                    className="absolute right-0 z-10 p-2.5 bg-white shadow-lg border border-slate-100 rounded-full"
                                    style={{ elevation: 2 }}
                                >
                                    <Ionicons name="chevron-forward" size={20} color="#475569" />
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>

                    {/* Bottom Controls */}
                    <View className="items-center pb-6">
                        {/* Dot indicators */}
                        <View className="flex-row mb-6">
                            {FAMILIARITY_SLIDES.map((_, idx) => (
                                <View
                                    key={idx}
                                    className={`h-2 rounded-full ${activeSlide === idx ? 'w-4 bg-blue-600' : 'w-2 bg-slate-200'}`}
                                    style={{ marginHorizontal: 3 }}
                                />
                            ))}
                        </View>

                        <TouchableOpacity
                            onPress={handleContinue}
                            className="w-full max-w-[280px] py-4 bg-blue-600 rounded-3xl"
                            style={{ elevation: 4 }}
                        >
                            <Text className="text-white font-extrabold text-base text-center">
                                Continue
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        );
    }

    // Confirmation Step
    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="flex-1 px-6 pt-4 items-center justify-between">
                <View />

                <View className="items-center px-4">
                    <Text className="text-[28px] font-black text-slate-950 text-center leading-tight">
                        You're at the <Text className="text-blue-600">{currentSlide.level} Level!</Text>
                    </Text>
                    <Text className="text-sm text-slate-500 font-semibold text-center mt-2 px-4">
                        Let's start with the basics and build your skills step by step.
                    </Text>

                    {/* Senya Image - Using senya_hi.png for the confirmation step */}
                    <View className="py-8 items-center">
                        <Image
                            source={senyaHi}
                            style={{ width: 150, height: 150 }}
                            resizeMode="contain"
                        />
                        <Text className="text-xs text-blue-500 font-bold mt-2">✨ Senya is ready to teach you! ✨</Text>
                    </View>
                </View>

                <View className="w-full items-center pb-8">
                    <TouchableOpacity
                        onPress={handleStartLearning}
                        className="w-full max-w-[290px] py-4 bg-blue-600 rounded-2xl flex-row items-center justify-center"
                        style={{ elevation: 6 }}
                    >
                        <Text className="text-white font-extrabold text-base mr-2">Start Learning</Text>
                        <Text className="text-white text-xl font-medium">→</Text>
                    </TouchableOpacity>

                    <View className="flex-row items-center mt-4">
                        <Text className="text-xs text-slate-500 font-semibold">
                            Think this isn't right?{' '}
                        </Text>
                        <TouchableOpacity onPress={() => setSubStep('assess')}>
                            <Text className="text-xs text-blue-600 font-bold">
                                Go back and adjust your level.
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}