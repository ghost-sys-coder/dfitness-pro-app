import { useTheme } from '@/context/ThemeContext';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

const ThemeSwitcher = () => {
    const { theme, toggleTheme } = useTheme();
    return (
        <View className="flex-row items-center gap-2">
            <Text className='text-on-background font-label'>
                {theme === "neon" ? "⚡ Neon Athlete" : "☀️ Solar Precision"}
            </Text>
            <Pressable
                onPress={toggleTheme}
                className="w-14 h-7 rounded-full bg-surface-highest justify-center px-1"
            >
                <View
                    className={
                        `w-5 h-5 rounded-full bg-primary transition-all 
                        ${theme === "solar" ? "self-end" : "self-start"}`
                    }
                />
            </Pressable>
        </View>
    )

}

export default ThemeSwitcher