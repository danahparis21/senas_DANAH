// /components/ProfileView.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, Image, TextInput, Modal, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { UserState } from '../types';

// Import Senya images
const senyaHappy = require('../assets/images/senya/senya_happy.png');
const senyaHi = require('../assets/images/senya/senya_hi.png');
const senyaMainLogo = require('../assets/images/senya/senya_main_logo.png');
const senyaTeaching = require('../assets/images/senya/senya_teaching.png');

interface ProfileViewProps {
    userState: UserState;
    onUpdateUser: (updatedFields: Partial<UserState>) => void;
}

export default function ProfileView({ userState, onUpdateUser }: ProfileViewProps) {
    const [showEditNameModal, setShowEditNameModal] = useState(false);
    const [tempName, setTempName] = useState(userState.name);
    const [tempSchool, setTempSchool] = useState(userState.school);

    const handleSaveProfile = () => {
        if (!tempName.trim()) return;
        onUpdateUser({
            name: tempName,
            school: tempSchool
        });
        setShowEditNameModal(false);
        Alert.alert('🎉 Success!', 'Profile saved successfully!');
    };

    return (
        <SafeAreaView className="flex-1 bg-slate-50/20">
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
                            'Profile Settings',
                            'Configure your sign credentials and view student record.'
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
                {/* Profile Card & Avatar */}
                <View className="items-center justify-center pt-4">
                    {/* Circular Frame with Senya */}
                    <View className="relative w-32 h-32 mb-4">
                        <View className="w-full h-full bg-blue-50 rounded-full border-4 border-white items-center justify-center overflow-hidden">
                            <Image
                                source={senyaHi}
                                style={{ width: 100, height: 100 }}
                                resizeMode="contain"
                            />
                        </View>

                        {/* Student Badge */}
                        <View className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-yellow-400 rounded-full border-2 border-white">
                            <Text className="text-slate-900 font-extrabold text-[10px] uppercase tracking-wider">
                                Student
                            </Text>
                        </View>
                    </View>

                    <Text className="text-2xl font-black text-slate-950 tracking-tight">
                        {userState.name}
                    </Text>

                    {/* School details */}
                    <View className="flex-row items-center justify-center mt-1.5 px-4">
                        <Ionicons name="business-outline" size={16} color="#2563eb" />
                        <Text className="text-xs text-slate-500 font-bold ml-1 truncate max-w-[200px]">
                            {userState.school || 'Nasugbu West Central School'}
                        </Text>
                    </View>
                </View>

                {/* Current Progress */}
                <View className="bg-white border-2 border-slate-100 rounded-3xl p-5 mt-4">
                    <View className="flex-row justify-between items-start">
                        <View>
                            <Text className="text-[10px] font-black text-slate-400 tracking-wider">
                                CURRENT PROGRESS
                            </Text>
                            <Text className="text-[17px] font-black text-slate-950 mt-0.5">
                                Unit 1: Basics
                            </Text>
                        </View>
                        <Text className="text-xl font-black text-blue-600">65%</Text>
                    </View>

                    <View className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden mt-3">
                        <View className="h-full bg-yellow-400 rounded-full" style={{ width: '65%' }} />
                    </View>
                </View>

                {/* Stats Cards */}
                <View className="flex-row flex-wrap justify-between mt-4">
                    {/* Lessons */}
                    <View className="bg-white border border-slate-100 rounded-2xl p-4 items-center justify-between w-[31%] h-[104px]">
                        <Ionicons name="book-outline" size={20} color="#2563eb" />
                        <Text className="text-xl font-black text-slate-950">{userState.lessonsCompletedCount}</Text>
                        <Text className="text-[10px] font-black text-slate-400 tracking-wider uppercase">Lessons</Text>
                    </View>

                    {/* Streak */}
                    <View className="bg-white border border-slate-100 rounded-2xl p-4 items-center justify-between w-[31%] h-[104px]">
                        <Ionicons name="flame" size={20} color="#f59e0b" />
                        <Text className="text-xl font-black text-slate-950">{userState.streak}</Text>
                        <Text className="text-[10px] font-black text-slate-400 tracking-wider uppercase">Day Streak</Text>
                    </View>

                    {/* Performance */}
                    <View className="bg-white border border-slate-100 rounded-2xl p-4 items-center justify-between w-[31%] h-[104px]">
                        <Ionicons name="checkmark-circle" size={20} color="#059669" />
                        <Text className="text-xl font-black text-slate-950">{userState.performanceRate}%</Text>
                        <Text className="text-[10px] font-black text-slate-400 tracking-wider uppercase">Performance</Text>
                    </View>
                </View>

                {/* Options Settings */}
                <View className="mt-4 pb-8">
                    {/* Edit Profile */}
                    <TouchableOpacity
                        onPress={() => {
                            setTempName(userState.name);
                            setTempSchool(userState.school);
                            setShowEditNameModal(true);
                        }}
                        className="w-full bg-white border border-slate-100 py-4 px-5 rounded-2xl flex-row items-center justify-between mb-3"
                    >
                        <View className="flex-row items-center space-x-3.5">
                            <Ionicons name="happy-outline" size={20} color="#2563eb" />
                            <Text className="text-slate-900 font-black text-sm">Edit Profile</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={16} color="#94a3b8" />
                    </TouchableOpacity>

                    {/* Notification Settings */}
                    <TouchableOpacity
                        onPress={() => Alert.alert(
                            'Notifications',
                            'Push alerts configured for 8:00 AM daily FSL review!'
                        )}
                        className="w-full bg-white border border-slate-100 py-4 px-5 rounded-2xl flex-row items-center justify-between"
                    >
                        <View className="flex-row items-center space-x-3.5">
                            <Ionicons name="settings-outline" size={20} color="#2563eb" />
                            <Text className="text-slate-900 font-black text-sm">Notification Settings</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={16} color="#94a3b8" />
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Edit Profile Modal */}
            <Modal
                visible={showEditNameModal}
                transparent
                animationType="fade"
            >
                <View className="flex-1 bg-slate-900/60 items-center justify-center p-6">
                    <View className="w-full max-w-[320px] bg-white rounded-3xl p-6">
                        <View className="flex-row items-center space-x-2 mb-4">
                            <Ionicons name="create-outline" size={20} color="#2563eb" />
                            <Text className="text-lg font-black text-slate-950">Edit Signer Profile</Text>
                        </View>

                        {/* Name Input */}
                        <View className="mb-4">
                            <Text className="text-[10.5px] font-black text-slate-400 uppercase tracking-wider mb-1">
                                Signer Name
                            </Text>
                            <TextInput
                                value={tempName}
                                onChangeText={setTempName}
                                placeholder="Maria Maria"
                                className="w-full px-4 py-2.5 bg-slate-100 rounded-xl text-sm font-semibold text-slate-800"
                            />
                        </View>

                        {/* School Input */}
                        <View className="mb-4">
                            <Text className="text-[10.5px] font-black text-slate-400 uppercase tracking-wider mb-1">
                                Registered School
                            </Text>
                            <TextInput
                                value={tempSchool}
                                onChangeText={setTempSchool}
                                placeholder="Nasugbu West Central School"
                                className="w-full px-4 py-2.5 bg-slate-100 rounded-xl text-sm font-semibold text-slate-800"
                            />
                        </View>

                        {/* Buttons */}
                        <View className="flex-row space-x-3 pt-2">
                            <TouchableOpacity
                                onPress={() => setShowEditNameModal(false)}
                                className="flex-1 py-3 bg-slate-100 rounded-xl"
                            >
                                <Text className="text-slate-600 font-bold text-xs text-center">Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={handleSaveProfile}
                                className="flex-1 py-3 bg-blue-600 rounded-xl"
                            >
                                <Text className="text-white font-bold text-xs text-center">Save</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}