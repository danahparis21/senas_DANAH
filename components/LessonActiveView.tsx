// /components/LessonActiveView.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Lesson, UserState } from '../types';

// Import Senya images
const senyaHappy = require('../assets/images/senya/senya_happy.png');
const senyaHi = require('../assets/images/senya/senya_hi.png');
const senyaMainLogo = require('../assets/images/senya/senya_main_logo.png');
const senyaTeaching = require('../assets/images/senya/senya_teaching.png');

interface LessonActiveViewProps {
    lesson: Lesson;
    onLessonFinished: (earnedBadgeId?: string) => void;
    onCancel: () => void;
}

export default function LessonActiveView({ lesson, onLessonFinished, onCancel }: LessonActiveViewProps) {
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
    const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
    const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);

    const step = lesson.steps[currentStepIndex];
    const totalSteps = lesson.steps.length;
    const progressPercent = ((currentStepIndex + 1) / totalSteps) * 100;

    const handleContinue = () => {
        if (step.type === 'quiz' && !isAnswerSubmitted) {
            if (!selectedOptionId) return;

            const selectedOption = step.quizQuestion?.options.find(o => o.id === selectedOptionId);
            const correct = !!selectedOption?.isCorrect;

            setIsAnswerCorrect(correct);
            setIsAnswerSubmitted(true);
            return;
        }

        if (currentStepIndex < totalSteps - 1) {
            setCurrentStepIndex(prev => prev + 1);
            setSelectedOptionId(null);
            setIsAnswerSubmitted(false);
            setIsAnswerCorrect(false);
        } else {
            onLessonFinished(lesson.badgeReward.id);
        }
    };

    const handleBack = () => {
        if (currentStepIndex > 0) {
            setCurrentStepIndex(prev => prev - 1);
            setSelectedOptionId(null);
            setIsAnswerSubmitted(false);
            setIsAnswerCorrect(false);
        } else {
            onCancel();
        }
    };

    const getSenyaImage = (mood: string) => {
        switch (mood) {
            case 'happy': return senyaHappy;
            case 'hi': return senyaHi;
            case 'teaching': return senyaTeaching;
            case 'logo': return senyaMainLogo;
            default: return senyaHi;
        }
    };

    const renderIntroStep = () => {
        return (
            <View className="flex-1 justify-between">
                <ScrollView>
                    <View className="items-center px-2 pt-2">
                        <Text className="text-[11px] font-black tracking-widest text-blue-600 uppercase">
                            Getting your lesson ready...
                        </Text>

                        <View className="items-center my-4">
                            <Image
                                source={senyaTeaching}
                                style={{ width: 120, height: 120 }}
                                resizeMode="contain"
                            />
                            <Text className="text-xs text-blue-500 font-bold mt-2">📚 Senya is preparing your lesson!</Text>
                        </View>

                        <Text className="text-3xl font-black text-slate-950 text-center tracking-tight">
                            {step.headingText || 'FSL Alphabets'}
                        </Text>

                        <Text className="text-sm text-slate-600 font-bold leading-relaxed text-center px-3 mt-4">
                            {step.bodyText?.split('\n\n')[0]}
                        </Text>
                        <Text className="text-sm text-slate-600 font-bold leading-relaxed text-center px-3 mt-2">
                            {step.bodyText?.split('\n\n')[1]}
                        </Text>
                    </View>
                </ScrollView>

                <View className="items-center pb-4">
                    <Text className="text-slate-400 font-bold text-xs mb-4">
                        This will only take a moment...
                    </Text>
                    <TouchableOpacity
                        onPress={handleContinue}
                        className="px-8 py-3.5 bg-blue-600 rounded-2xl flex-row items-center"
                        style={{ elevation: 4 }}
                    >
                        <Text className="text-white font-extrabold text-sm mr-2">Continue</Text>
                        <Ionicons name="arrow-forward" size={16} color="#ffffff" />
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    const renderTeachingCard = () => {
        const renderLetterSign = () => {
            if (step.illustrationType === 'letter_a') {
                return <Text className="text-8xl">👆</Text>;
            } else if (step.illustrationType === 'letter_b') {
                return <Text className="text-8xl">✋</Text>;
            }
            return <Text className="text-8xl">🖐️</Text>;
        };

        return (
            <View className="flex-1 justify-between">
                <ScrollView>
                    <View className="items-center pt-4">
                        <Text className="text-[11px] font-black tracking-widest text-[#1270e3] uppercase">
                            Lesson Card
                        </Text>

                        <Text className="text-3xl font-black text-slate-950 mt-2">
                            {step.title}
                        </Text>

                        <View className="w-[230px] h-[230px] bg-blue-600 rounded-[42px] items-center justify-center p-6 mt-4 border-4 border-white">
                            {renderLetterSign()}
                        </View>

                        <Text className="text-sm text-slate-600 font-bold text-center max-w-[240px] leading-relaxed mt-4">
                            {step.bodyText}
                        </Text>

                        {/* Small Senya helper */}
                        <View className="mt-4 items-center">
                            <Image
                                source={senyaHi}
                                style={{ width: 60, height: 60 }}
                                resizeMode="contain"
                            />
                            <Text className="text-[10px] text-blue-400 font-bold mt-1">Keep going! 👋</Text>
                        </View>
                    </View>
                </ScrollView>

                <View className="flex-row justify-between items-center pb-4 pt-4">
                    <TouchableOpacity
                        onPress={handleBack}
                        className="p-3 bg-slate-100 rounded-full"
                    >
                        <Ionicons name="arrow-back" size={20} color="#475569" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={handleContinue}
                        className="px-8 py-3.5 bg-blue-600 rounded-2xl flex-row items-center"
                        style={{ elevation: 4 }}
                    >
                        <Text className="text-white font-extrabold text-sm mr-2">Continue</Text>
                        <Ionicons name="arrow-forward" size={16} color="#ffffff" />
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    const renderQuizStep = () => {
        const question = step.quizQuestion!;

        return (
            <View className="flex-1 justify-between">
                <ScrollView>
                    <View className="items-center pt-1">
                        <Text className="text-2xl font-black text-slate-950 text-center leading-snug">
                            {question.questionText}
                        </Text>
                        <Text className="text-xs text-slate-400 font-bold mt-1">Choose one option.</Text>

                        <View className="w-[170px] h-[170px] bg-blue-600 rounded-[36px] items-center justify-center p-3 mt-4 border-4 border-white">
                            <Text className="text-7xl">👆</Text>
                        </View>

                        <View className="w-full max-w-[290px] mt-4">
                            {question.options.map((opt) => {
                                const isSelected = selectedOptionId === opt.id;

                                let optionBgColor = 'bg-white border-slate-100';
                                let textColor = 'text-slate-800';

                                if (isAnswerSubmitted) {
                                    if (opt.isCorrect) {
                                        optionBgColor = 'bg-emerald-50 border-emerald-300';
                                        textColor = 'text-emerald-800';
                                    } else if (isSelected) {
                                        optionBgColor = 'bg-rose-50 border-rose-300';
                                        textColor = 'text-rose-800';
                                    }
                                } else if (isSelected) {
                                    optionBgColor = 'bg-blue-50 border-blue-300';
                                    textColor = 'text-blue-800';
                                }

                                return (
                                    <TouchableOpacity
                                        key={opt.id}
                                        disabled={isAnswerSubmitted}
                                        onPress={() => setSelectedOptionId(opt.id)}
                                        className={`w-full py-4 px-5 border-2 rounded-3xl flex-row items-center mb-3 ${optionBgColor}`}
                                    >
                                        <View className={`w-4 h-4 rounded-full border-2 items-center justify-center mr-3 ${isSelected ? 'border-blue-600' : 'border-slate-300'}`}>
                                            {isSelected && <View className="w-1.5 h-1.5 bg-blue-600 rounded-full" />}
                                        </View>
                                        <Text className={`font-black text-sm ${textColor}`}>{opt.text}</Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>
                </ScrollView>

                {/* Feedback Section with Senya */}
                <View className="items-center mt-3">
                    {isAnswerSubmitted ? (
                        isAnswerCorrect ? (
                            <View className="items-center">
                                <View className="bg-emerald-50 px-5 py-2.5 rounded-2xl border border-emerald-100 mb-3">
                                    <Text className="text-emerald-800 text-xs font-black text-center">
                                        {question.successMessage || 'Good Job! That is how we sign A!'}
                                    </Text>
                                </View>
                                <Image
                                    source={senyaHappy}
                                    style={{ width: 80, height: 80 }}
                                    resizeMode="contain"
                                />
                                <Text className="text-xs text-green-500 font-bold mt-1">🌟 Awesome! 🌟</Text>
                            </View>
                        ) : (
                            <View className="items-center">
                                <View className="bg-rose-50 px-5 py-2.5 rounded-2xl border border-rose-100 mb-3">
                                    <Text className="text-rose-800 text-xs font-black text-center">
                                        Oops! Let's review our Alphabet Letter cards.
                                    </Text>
                                </View>
                                <Image
                                    source={senyaTeaching}
                                    style={{ width: 80, height: 80 }}
                                    resizeMode="contain"
                                />
                                <Text className="text-xs text-rose-500 font-bold mt-1">📖 Let's try again!</Text>
                            </View>
                        )
                    ) : (
                        <View className="items-center">
                            <View className="bg-blue-50 px-5 py-2.5 rounded-2xl border border-blue-100 mb-3">
                                <Text className="text-blue-800 text-xs font-black text-center">
                                    Let's practice what we learned.
                                </Text>
                            </View>
                            <Image
                                source={senyaTeaching}
                                style={{ width: 80, height: 80 }}
                                resizeMode="contain"
                            />
                            <Text className="text-xs text-blue-500 font-bold mt-1">✨ You can do this! ✨</Text>
                        </View>
                    )}
                </View>

                {/* Navigation */}
                <View className="flex-row justify-between items-center max-w-[280px] w-full mx-auto pb-4 pt-2">
                    <TouchableOpacity
                        disabled={isAnswerSubmitted}
                        onPress={handleBack}
                        className={`p-3 rounded-full ${isAnswerSubmitted ? 'bg-slate-50 opacity-50' : 'bg-slate-100'}`}
                    >
                        <Ionicons name="arrow-back" size={20} color={isAnswerSubmitted ? '#94a3b8' : '#475569'} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        disabled={!selectedOptionId}
                        onPress={handleContinue}
                        className={`p-3.5 rounded-full ${selectedOptionId ? 'bg-blue-600' : 'bg-slate-100'}`}
                        style={selectedOptionId ? { elevation: 4 } : {}}
                    >
                        {isAnswerSubmitted ? (
                            <Ionicons name="arrow-forward" size={24} color="#ffffff" />
                        ) : (
                            <Text className={`text-xs font-black px-3.5 uppercase tracking-wider ${selectedOptionId ? 'text-white' : 'text-slate-400'}`}>
                                CHECK
                            </Text>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            {/* Header with Progress Bar */}
            <View className="px-6 pt-5 pb-3 bg-white border-b border-slate-50">
                <View className="flex-row justify-between items-center">
                    <TouchableOpacity
                        onPress={onCancel}
                        className="p-1"
                    >
                        <Text className="text-slate-400 text-xl">✕</Text>
                    </TouchableOpacity>

                    <Text className="text-base font-extrabold text-slate-950 text-center">
                        {step.title || `Module ${lesson.moduleNo}`}
                    </Text>

                    <View className="w-6" />
                </View>

                <View className="relative w-full h-2.5 bg-slate-100 rounded-full overflow-hidden mt-3">
                    <View
                        className="h-full bg-blue-600 rounded-full"
                        style={{ width: `${progressPercent}%` }}
                    />
                </View>
            </View>

            {/* Main Content */}
            <View className="flex-1 px-6 py-4">
                {step.type === 'intro' && renderIntroStep()}
                {step.type === 'teaching_card' && renderTeachingCard()}
                {step.type === 'quiz' && renderQuizStep()}
            </View>
        </SafeAreaView>
    );
}