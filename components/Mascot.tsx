// /components/Mascot.tsx
import React from 'react';
import { View, Text } from 'react-native';

export type MascotMood =
    | 'waving'
    | 'teacher'
    | 'success'
    | 'student'
    | 'peek_normal'
    | 'reading'
    | 'dual_stars';

interface MascotProps {
    mood: MascotMood;
    className?: string;
    speechText?: string;
}

const Mascot = ({ mood, className = '', speechText }: MascotProps) => {
    const getEmoji = () => {
        const emojis = {
            waving: '👋',
            teacher: '🧑‍🏫',
            success: '🌟',
            student: '🎓',
            peek_normal: '👀',
            reading: '📕',
            dual_stars: '⭐✨'
        };
        return emojis[mood] || '⭐';
    };

    return (
        <View className={`items-center ${className}`}>
            {speechText && (
                <View className="bg-emerald-50 px-4 py-2 rounded-2xl mb-2">
                    <Text className="text-emerald-800 text-sm">{speechText}</Text>
                </View>
            )}
            <View className="w-20 h-20 rounded-full bg-yellow-100 items-center justify-center border-4 border-yellow-300">
                <Text className="text-5xl">{getEmoji()}</Text>
            </View>
            <Text className="text-xs font-bold text-blue-600 mt-1">Senya</Text>
        </View>
    );
};

export default Mascot;