// /components/SplashView.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Import Senya images
const senyaHappy = require('../assets/images/senya/senya_happy.png');
const senyaHi = require('../assets/images/senya/senya_hi.png');
const senyaMainLogo = require('../assets/images/senya/senya_main_logo.png');
const senyaTeaching = require('../assets/images/senya/senya_teaching.png');

interface SplashViewProps {
    onStart: () => void;
}

export default function SplashView({ onStart }: SplashViewProps) {
    const [activeDot, setActiveDot] = useState(0);

    return (
        <SafeAreaView className="flex-1 bg-blue-600">
            <View className="flex-1 justify-between p-6 items-center">
                {/* Upper Space */}
                <View className="pt-8" />

                {/* Main Branding Section */}
                <View className="items-center">
                    {/* Brand Icon */}
                    <View className="w-14 h-14 bg-white rounded-2xl items-center justify-center mb-4">
                        <Text className="text-blue-600 font-black text-3xl">S</Text>
                    </View>

                    {/* Logo Text */}
                    <Text className="text-4xl font-black tracking-tight text-white mb-1">
                        SEÑAS <Text className="text-blue-300 font-medium">FSL</Text>
                    </Text>
                    <Text className="text-[10px] text-white/80 font-bold uppercase tracking-widest mb-8">
                        Filipino Sign Language Learning
                    </Text>

                    {/* Curved Container Card with Senya */}
                    <View className="w-[230px] h-[290px] bg-white rounded-[40px] items-center justify-end overflow-hidden border-4 border-white/40 p-4">
                        <View className="items-center pb-2">
                            <Image
                                source={senyaHi}
                                style={{ width: 150, height: 150 }}
                                resizeMode="contain"
                            />
                            <Text className="text-xs text-blue-500 font-bold mt-1">👋 Hello!</Text>
                        </View>
                    </View>
                </View>

                {/* Bottom Section */}
                <View className="items-center space-y-6 pb-8 w-full">
                    {/* Dot Indicators */}
                    <View className="flex-row space-x-1.5 justify-center items-center">
                        {[0, 1, 2, 3, 4].map((idx) => (
                            <TouchableOpacity
                                key={idx}
                                onPress={() => setActiveDot(idx)}
                                className={`h-2.5 rounded-full ${activeDot === idx ? 'w-5 bg-white' : 'w-2.5 bg-white/40'}`}
                            />
                        ))}
                    </View>

                    {/* Start Button */}
                    <TouchableOpacity
                        onPress={onStart}
                        className="w-full max-w-[280px] py-4 bg-white rounded-3xl"
                        style={{ elevation: 8 }}
                    >
                        <Text className="text-blue-600 font-extrabold text-base text-center">
                            Start Learning
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}