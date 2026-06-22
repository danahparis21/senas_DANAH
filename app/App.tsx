// /app/App.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

// Import components from the correct relative path
import SplashView from '../components/SplashView';
import LoginView from '../components/LoginView';
import FamiliarityView from '../components/FamiliarityView';
import DashboardView from '../components/DashboardView';
import LessonMapView from '../components/LessonMapView';
import PracticeView from '../components/PracticeView';
import AchievementsView from '../components/AchievementsView';
import ProfileView from '../components/ProfileView';
import LessonActiveView from '../components/LessonActiveView';

import { ActiveScreen, MainTab, UserState, UserRole, FamiliarityLevel } from '../types';
import { INITIAL_USER_STATE, MODULE_1_LESSON } from '../data/lessons';

export default function App() {
    const [activeScreen, setActiveScreen] = useState<ActiveScreen>('splash');
    const [userRole, setUserRole] = useState<UserRole>(null);
    const [user, setUser] = useState<UserState>(INITIAL_USER_STATE);

    const handleStartApp = () => {
        setActiveScreen('userSelection');
    };

    const handleLoginSuccess = (role: UserRole, studentName: string) => {
        setUserRole(role);
        setUser(prev => ({
            ...prev,
            name: studentName,
        }));

        if (role === 'Student' && !user.familiarity) {
            setActiveScreen('familiarityAssessment');
        } else {
            setActiveScreen('appShell');
        }
    };

    const handleFamiliarityChosen = (level: FamiliarityLevel) => {
        setUser(prev => ({
            ...prev,
            familiarity: level,
            progress: level === 'Beginner' ? 10 : level === 'Intermediate' ? 35 : 55
        }));
        setActiveScreen('appShell');
    };

    const handleUpdateUserState = (updatedFields: Partial<UserState>) => {
        setUser(prev => ({
            ...prev,
            ...updatedFields
        }));
    };

    const handleStartLesson = () => {
        setActiveScreen('activeLesson');
    };

    const handleLessonFinished = (earnedBadgeId?: string) => {
        const updatedBadges = [...user.earnedBadges];
        if (earnedBadgeId && !updatedBadges.includes(earnedBadgeId)) {
            updatedBadges.push(earnedBadgeId);
        }

        setUser(prev => ({
            ...prev,
            progress: 65,
            lessonsCompletedCount: prev.lessonsCompletedCount + 1,
            streak: prev.streak + 1,
            earnedBadges: updatedBadges
        }));

        setActiveScreen('appShell');
        Alert.alert(
            '🎉 Amazing Job!',
            'Lesson Completed! You have unlocked your "First Sign Badge" ⭐\nYour sign progress is now 65%!'
        );
    };

    // Custom tab navigator for the app shell
    function AppShell() {
        const [activeTab, setActiveTab] = useState<MainTab>('home');

        const renderTabContent = () => {
            switch (activeTab) {
                case 'home':
                    return (
                        <DashboardView
                            userState={user}
                            onStartLesson={handleStartLesson}
                            onNavigateTab={(tab) => setActiveTab(tab)}
                        />
                    );
                case 'map':
                    return (
                        <LessonMapView
                            userState={user}
                            onStartLesson={handleStartLesson}
                        />
                    );
                case 'practice':
                    return <PracticeView userState={user} />;
                case 'achievements':
                    return <AchievementsView userState={user} />;
                case 'profile':
                    return (
                        <ProfileView
                            userState={user}
                            onUpdateUser={handleUpdateUserState}
                        />
                    );
                default:
                    return null;
            }
        };

        return (
            <SafeAreaView className="flex-1 bg-white">
                <StatusBar style="dark" />
                <View className="flex-1">
                    {renderTabContent()}

                    {/* Bottom Navigation */}
                    <View className="h-[72px] bg-white border-t border-slate-200 flex-row items-center justify-around px-2">
                        {[
                            { key: 'home', icon: 'home-outline', label: 'Home' },
                            { key: 'map', icon: 'book-outline', label: 'Lessons' },
                            { key: 'practice', icon: 'hand-left-outline', label: 'Practice' },
                            { key: 'achievements', icon: 'trophy-outline', label: 'Achievements' },
                            { key: 'profile', icon: 'person-outline', label: 'Profile' },
                        ].map((tab) => (
                            <TouchableOpacity
                                key={tab.key}
                                onPress={() => setActiveTab(tab.key as MainTab)}
                                className="items-center py-1 flex-1"
                            >
                                <View className={`px-4 py-1.5 rounded-2xl ${activeTab === tab.key ? 'bg-blue-600' : 'bg-transparent'}`}>
                                    <Ionicons
                                        name={tab.icon as any}
                                        size={22}
                                        color={activeTab === tab.key ? '#ffffff' : '#94a3b8'}
                                    />
                                </View>
                                <Text className={`text-[10px] font-bold mt-1 ${activeTab === tab.key ? 'text-blue-600' : 'text-slate-400'}`}>
                                    {tab.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </SafeAreaView>
        );
    }

    const renderScreen = () => {
        switch (activeScreen) {
            case 'splash':
                return <SplashView onStart={handleStartApp} />;

            case 'userSelection':
            case 'studentLogin':
            case 'teacherLogin':
                return (
                    <LoginView
                        onBack={() => setActiveScreen('splash')}
                        onLoginSuccess={handleLoginSuccess}
                    />
                );

            case 'familiarityAssessment':
            case 'levelConfirmation':
                return (
                    <FamiliarityView
                        onBack={() => setActiveScreen('userSelection')}
                        onFamiliarityChosen={handleFamiliarityChosen}
                    />
                );

            case 'activeLesson':
                return (
                    <LessonActiveView
                        lesson={MODULE_1_LESSON}
                        onCancel={() => setActiveScreen('appShell')}
                        onLessonFinished={handleLessonFinished}
                    />
                );

            case 'appShell':
                return <AppShell />;

            default:
                return null;
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <StatusBar style="dark" />
            {renderScreen()}
        </SafeAreaView>
    );
}