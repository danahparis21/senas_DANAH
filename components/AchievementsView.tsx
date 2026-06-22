// /components/AchievementsView.tsx
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { UserState } from '../types';
import { ALL_BADGES } from '../data/lessons';
import { Badge } from '../types';

// Import Senya images
const senyaHappy = require('../assets/images/senya/senya_happy.png');
const senyaHi = require('../assets/images/senya/senya_hi.png');
const senyaTeaching = require('../assets/images/senya/senya_teaching.png');

interface AchievementsViewProps {
    userState: UserState;
}

export default function AchievementsView({ userState }: AchievementsViewProps) {
    const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

    const renderBadgeIcon = (badge: Badge) => {
        const isUnlocked = userState.earnedBadges.includes(badge.id);

        const getIconName = () => {
            switch (badge.iconType) {
                case 'early_bird':
                    return 'sunny-outline';
                case 'ten_day':
                    return 'calendar-outline';
                case 'high_flyer':
                    return 'rocket-outline';
                case 'master_signer':
                    return 'star-outline';
                case 'perfect_score':
                    return 'checkmark-circle-outline';
                case 'first_sign':
                    return 'ribbon-outline';
                default:
                    return 'trophy-outline';
            }
        };

        return (
            <View className={`w-14 h-14 rounded-full items-center justify-center border-2 
                ${isUnlocked ? 'bg-blue-50 border-blue-200' : 'bg-slate-100 border-slate-200 opacity-60'}`}>
                <Ionicons
                    name={getIconName() as any}
                    size={28}
                    color={isUnlocked ? '#2563eb' : '#94a3b8'}
                />
                {isUnlocked && badge.iconType === 'first_sign' && (
                    <View className="absolute -top-1 -right-1">
                        <Text className="text-xs">⭐</Text>
                    </View>
                )}
            </View>
        );
    };

    return (
        <View className="flex-1 bg-slate-50/20">
            {/* Header */}
            <View className="flex-row justify-between items-center px-6 py-3.5 bg-white border-b border-slate-100">
                <View className="flex-row items-center">
                    <View className="w-8.5 h-8.5 bg-blue-600 rounded-xl items-center justify-center mr-2">
                        <Text className="text-white font-black text-sm">S</Text>
                    </View>
                    <View>
                        <Text className="text-base font-black text-slate-900">SEÑAS FSL</Text>
                        <Text className="text-[9px] text-slate-400 font-extrabold uppercase">KamayKita Platform</Text>
                    </View>
                </View>

                <View className="flex-row items-center">
                    <TouchableOpacity className="mr-3">
                        <Ionicons name="information-circle-outline" size={20} color="#64748b" />
                    </TouchableOpacity>

                    <View className="flex-row items-center px-3 py-1 bg-amber-50 rounded-full border border-amber-100 mr-3">
                        <Ionicons name="flame" size={16} color="#f59e0b" />
                        <Text className="ml-1 text-amber-700 text-[11px] font-black">{userState.streak} Day Streak</Text>
                    </View>

                    <TouchableOpacity>
                        <Ionicons name="notifications-outline" size={20} color="#64748b" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Content */}
            <ScrollView className="flex-1 px-5 py-4">
                {/* Milestone Banner with Senya */}
                <View className="bg-white border-2 border-slate-100 rounded-[30px] p-5 relative">
                    <View>
                        <Text className="text-[10px] font-black text-blue-800 tracking-widest uppercase">
                            Your Achievements
                        </Text>
                        <Text className="text-xl font-black text-slate-950 mt-1">
                            Mastering the Basics
                        </Text>

                        <View className="mt-4">
                            <View className="flex-row justify-between items-center">
                                <Text className="text-xs font-bold text-slate-400">Current Progress</Text>
                                <Text className="font-extrabold text-[#1270e3]">20%</Text>
                            </View>
                            <View className="h-3 w-full bg-slate-100 rounded-full overflow-hidden mt-1">
                                <View className="h-full bg-yellow-400 rounded-full" style={{ width: '20%' }} />
                            </View>
                        </View>

                        <Text className="text-[10.5px] text-slate-400 font-extrabold mt-3">
                            Just 3 more lessons to reach your next major milestone!
                        </Text>
                    </View>

                    {/* Senya instead of Mascot */}
                    <View className="absolute right-[-10px] bottom-[-10px]">
                        <Image
                            source={senyaHappy}
                            style={{ width: 70, height: 70 }}
                            resizeMode="contain"
                        />
                    </View>
                </View>

                {/* Earned Badges */}
                <View className="mt-6">
                    <View className="flex-row justify-between items-center mb-4">
                        <Text className="text-base font-black text-slate-800">Earned Badges</Text>
                        <View className="px-3.5 py-1 bg-blue-600 rounded-full">
                            <Text className="text-white font-extrabold text-[11px]">
                                {userState.earnedBadges.length}/24 Total
                            </Text>
                        </View>
                    </View>

                    <View className="flex-row flex-wrap justify-between">
                        {ALL_BADGES.map((badge) => {
                            const isUnlocked = userState.earnedBadges.includes(badge.id);
                            return (
                                <TouchableOpacity
                                    key={badge.id}
                                    onPress={() => setSelectedBadge(badge)}
                                    className="w-[30%] items-center mb-6"
                                >
                                    {renderBadgeIcon(badge)}
                                    <Text className="text-[9.5px] font-black uppercase text-slate-900 text-center mt-2">
                                        {badge.name}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>

                {/* Milestone Progress */}
                <View className="mt-2 mb-6">
                    <Text className="text-base font-black text-slate-800 mb-3">Milestone Progress</Text>
                    <View className="bg-white border border-slate-100 rounded-2xl p-4">
                        <View className="flex-row items-center justify-between">
                            <View className="flex-row items-center">
                                <View className="w-9 h-9 bg-purple-50 rounded-xl items-center justify-center mr-3">
                                    <Text className="text-purple-600 font-bold text-sm">🏆</Text>
                                </View>
                                <View>
                                    <Text className="text-xs font-black text-slate-950">FSL Star Pupil</Text>
                                    <Text className="text-[10px] text-slate-400 font-bold">Earn 100 perfect answers</Text>
                                </View>
                            </View>
                            <Text className="text-xs font-black text-purple-600">12/100</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Badge Detail Modal */}
            <Modal
                visible={!!selectedBadge}
                transparent
                animationType="slide"
            >
                <View className="flex-1 bg-slate-900/60 justify-end">
                    <View className="bg-white rounded-t-[36px] p-6">
                        <TouchableOpacity
                            onPress={() => setSelectedBadge(null)}
                            className="absolute top-4 right-4 z-10"
                        >
                            <View className="w-8 h-8 bg-slate-100 rounded-full items-center justify-center">
                                <Text className="text-slate-500 text-xl">✕</Text>
                            </View>
                        </TouchableOpacity>

                        {selectedBadge && (
                            <>
                                <View className="items-center my-6">
                                    {renderBadgeIcon(selectedBadge)}
                                </View>

                                <View className="items-center">
                                    <View className="px-3.5 py-0.5 bg-sky-50 rounded-full mb-2">
                                        <Text className="text-sky-700 text-[10px] font-black uppercase">
                                            {selectedBadge.category}
                                        </Text>
                                    </View>
                                    <Text className="text-xl font-black text-slate-900">{selectedBadge.name}</Text>
                                    <Text className="text-sm text-slate-500 font-semibold text-center mt-2">
                                        {selectedBadge.description}
                                    </Text>

                                    <View className="mt-4">
                                        {userState.earnedBadges.includes(selectedBadge.id) ? (
                                            <Text className="text-emerald-600 font-extrabold text-sm">
                                                ✓ Unlocked on {selectedBadge.unlockedAt || '2026-06-22'}
                                            </Text>
                                        ) : (
                                            <Text className="text-rose-500 font-extrabold text-sm">
                                                🔒 Locked - Keep practicing!
                                            </Text>
                                        )}
                                    </View>

                                    <TouchableOpacity
                                        onPress={() => setSelectedBadge(null)}
                                        className="w-full py-3 bg-blue-600 rounded-2xl mt-6"
                                    >
                                        <Text className="text-white font-bold text-center">Done</Text>
                                    </TouchableOpacity>
                                </View>
                            </>
                        )}
                    </View>
                </View>
            </Modal>
        </View>
    );
}