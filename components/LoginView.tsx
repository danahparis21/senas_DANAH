// /components/LoginView.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, SafeAreaView, Image, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { UserRole } from '../types';

// Import Senya images
const senyaHappy = require('../assets/images/senya/senya_happy.png');
const senyaHi = require('../assets/images/senya/senya_hi.png');
const senyaMainLogo = require('../assets/images/senya/senya_main_logo.png');
const senyaTeaching = require('../assets/images/senya/senya_teaching.png');

interface LoginViewProps {
    onBack: () => void;
    onLoginSuccess: (role: UserRole, studentName: string) => void;
}

export default function LoginView({ onBack, onLoginSuccess }: LoginViewProps) {
    const [step, setStep] = useState<'selection' | 'login'>('selection');
    const [role, setRole] = useState<UserRole>(null);

    // Prefilled credentials
    const [lrn, setLrn] = useState('1075121286');
    const [pin, setPin] = useState('1234');
    const [showPin, setShowPin] = useState(false);
    const [termsAccepted, setTermsAccepted] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    const handleSelectRole = (selectedRole: UserRole) => {
        setRole(selectedRole);
        setStep('login');
    };

    const handleBack = () => {
        if (step === 'login') {
            setStep('selection');
            setErrorMessage('');
        } else {
            onBack();
        }
    };

    const handleLoginSubmit = () => {
        if (!lrn.trim()) {
            setErrorMessage('Please enter your LRN.');
            return;
        }
        if (pin.length < 4) {
            setErrorMessage('Please enter a 4-digit PIN.');
            return;
        }
        if (!termsAccepted) {
            setErrorMessage('You must agree to the Terms and Conditions.');
            return;
        }

        if (pin === '1234' || pin === '0000') {
            onLoginSuccess(role, role === 'Student' ? 'Maria Maria' : 'Teacher Cruz');
        } else {
            setErrorMessage('Incorrect PIN. Try using the prefilled "1234"!');
        }
    };

    if (step === 'selection') {
        return (
            <SafeAreaView className="flex-1 bg-white">
                <ScrollView className="flex-1">
                    {/* Header with Senya */}
                    <View className="h-[210px] bg-blue-50 rounded-b-[48px] items-center justify-end pb-3 border-b-2 border-blue-200/20">
                        <View className="items-center -mb-6">
                            <Image
                                source={senyaHi}
                                style={{ width: 100, height: 100 }}
                                resizeMode="contain"
                            />
                            <Text className="text-xs text-blue-500 font-bold mt-1">👋 Welcome to SEÑAS!</Text>
                        </View>
                    </View>

                    {/* Content */}
                    <View className="flex-1 px-6 pt-6">
                        {/* Back and Title */}
                        <View className="flex-row items-center space-x-3 mb-6">
                            <TouchableOpacity
                                onPress={handleBack}
                                className="p-2 bg-slate-100 rounded-full"
                            >
                                <Ionicons name="arrow-back" size={20} color="#1e293b" />
                            </TouchableOpacity>

                            <Text className="text-2xl font-black text-slate-900 tracking-tight">
                                Select User
                            </Text>
                        </View>

                        {/* Role Selection Buttons */}
                        <View className="flex-1 justify-center pt-2">
                            <TouchableOpacity
                                onPress={() => handleSelectRole('Teacher')}
                                className="w-full flex-row items-center p-5 bg-white border-2 border-slate-200 rounded-3xl mb-4"
                                style={{ elevation: 2 }}
                            >
                                <View className="w-14 h-14 bg-blue-50 border border-blue-100 rounded-2xl items-center justify-center mr-4">
                                    <Ionicons name="person-outline" size={32} color="#2563eb" />
                                </View>
                                <View>
                                    <Text className="text-base font-black text-slate-800">I am a Teacher</Text>
                                    <Text className="text-[11px] text-slate-400 font-bold">Manage student records & review FSL lessons</Text>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => handleSelectRole('Student')}
                                className="w-full flex-row items-center p-5 bg-white border-2 border-slate-200 rounded-3xl"
                                style={{ elevation: 2 }}
                            >
                                <View className="w-14 h-14 bg-blue-50 border border-blue-100 rounded-2xl items-center justify-center mr-4">
                                    <Ionicons name="school-outline" size={32} color="#2563eb" />
                                </View>
                                <View>
                                    <Text className="text-base font-black text-slate-800">I am a Student</Text>
                                    <Text className="text-[11px] text-slate-400 font-bold">Start learning alphabets & complete quests</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }

    // Login Step
    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView className="flex-1" keyboardShouldPersistTaps="handled">
                {/* Header with Senya */}
                <View className="h-[180px] bg-blue-50 rounded-b-[48px] items-center justify-end pb-3 border-b-2 border-blue-200/20">
                    <View className="items-center -mb-6">
                        <Image
                            source={senyaTeaching}
                            style={{ width: 80, height: 80 }}
                            resizeMode="contain"
                        />
                        <Text className="text-xs text-blue-500 font-bold mt-1">📚 Ready to learn?</Text>
                    </View>
                </View>

                {/* Content */}
                <View className="flex-1 px-6 pt-6">
                    {/* Back and Title */}
                    <View className="flex-row items-center space-x-3 mb-4">
                        <TouchableOpacity
                            onPress={handleBack}
                            className="p-2 bg-slate-100 rounded-full"
                        >
                            <Ionicons name="arrow-back" size={20} color="#1e293b" />
                        </TouchableOpacity>

                        <Text className="text-2xl font-black text-slate-900 tracking-tight">
                            Welcome, {role}
                        </Text>
                    </View>

                    {/* Login Form */}
                    <View className="flex-1 pt-2">
                        <Text className="text-xs text-slate-500 font-semibold mb-4">
                            {role === 'Student'
                                ? 'Use the access pin from your teacher to log in.'
                                : 'Log in using your registered teacher account PIN.'}
                        </Text>

                        {errorMessage ? (
                            <View className="p-3 bg-red-50 border border-red-200 rounded-2xl mb-4">
                                <Text className="text-xs font-bold text-red-600 text-center">{errorMessage}</Text>
                            </View>
                        ) : null}

                        {/* LRN Input */}
                        <View className="mb-4">
                            <Text className="text-[11px] font-black text-blue-800 tracking-wider uppercase mb-1.5">
                                {role === 'Student' ? 'LRN' : 'TEACHER EMAIL'}
                            </Text>
                            <View className="flex-row items-center bg-slate-50 border-2 border-slate-100 rounded-2xl px-4">
                                <Ionicons name="mail-outline" size={18} color="#94a3b8" />
                                <TextInput
                                    value={lrn}
                                    onChangeText={(text) => {
                                        setLrn(text);
                                        setErrorMessage('');
                                    }}
                                    placeholder={role === 'Student' ? 'e.g. 1075121286' : 'teacher@school.edu'}
                                    placeholderTextColor="#94a3b8"
                                    className="flex-1 py-3.5 px-3 text-sm font-semibold text-slate-800"
                                />
                            </View>
                        </View>

                        {/* PIN Input */}
                        <View className="mb-6">
                            <View className="flex-row justify-between items-center mb-1.5">
                                <Text className="text-[11px] font-black text-blue-800 tracking-wider uppercase">PIN</Text>
                                <TouchableOpacity
                                    onPress={() => setErrorMessage('Demo PIN is prefilled as "1234"!')}
                                >
                                    <Text className="text-xs font-black text-blue-600">Forgot PIN?</Text>
                                </TouchableOpacity>
                            </View>
                            <View className="flex-row items-center bg-slate-50 border-2 border-slate-100 rounded-2xl px-4">
                                <Ionicons name="lock-closed-outline" size={18} color="#94a3b8" />
                                <TextInput
                                    value={pin}
                                    onChangeText={(text) => {
                                        setPin(text.replace(/\D/g, '').slice(0, 4));
                                        setErrorMessage('');
                                    }}
                                    placeholder="••••"
                                    placeholderTextColor="#94a3b8"
                                    secureTextEntry={!showPin}
                                    maxLength={4}
                                    keyboardType="numeric"
                                    className="flex-1 py-3.5 px-3 text-sm font-semibold text-slate-800 tracking-widest"
                                />
                                <TouchableOpacity onPress={() => setShowPin(!showPin)}>
                                    <Ionicons
                                        name={showPin ? "eye-off-outline" : "eye-outline"}
                                        size={18}
                                        color="#94a3b8"
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Login Button */}
                        <TouchableOpacity
                            onPress={handleLoginSubmit}
                            className="w-full py-4 bg-blue-600 rounded-3xl flex-row items-center justify-center mb-4"
                            style={{ elevation: 4 }}
                        >
                            <Text className="text-white font-extrabold text-base mr-2">Log In</Text>
                            <Text className="text-white text-xl font-medium">→</Text>
                        </TouchableOpacity>

                        {/* Terms and Conditions */}
                        <View className="flex-row items-center justify-center space-x-2">
                            <Switch
                                value={termsAccepted}
                                onValueChange={setTermsAccepted}
                                trackColor={{ false: '#e2e8f0', true: '#2563eb' }}
                                thumbColor={termsAccepted ? '#ffffff' : '#f8fafc'}
                            />
                            <Text className="text-xs text-slate-500 font-semibold">
                                I agree with the <Text className="text-blue-600 font-bold">Terms and Conditions</Text>
                            </Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}