import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useDSTheme } from "./ThemeContext";
import { ThemeName, themeMetadata } from "./themes";

const THEME_ORDER: ThemeName[] = ["solar", "neon", "ember"];

export default function DSThemeSwitcher() {
  const { themeName, colors, setTheme } = useDSTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surfaceContainer,
          borderColor: colors.outlineVariant,
        },
      ]}
    >
      {THEME_ORDER.map((name) => {
        const active = themeName === name;
        const {
          // label, -- we can add this back if we want to show the theme name next to the icon
          icon } = themeMetadata[name];

        return (
          <Pressable
            key={name}
            onPress={() => setTheme(name)}
            style={({ pressed }) => [
              styles.pill,
              active && { backgroundColor: colors.primary },
              pressed && { opacity: 0.75 },
            ]}
          >
            <Text
              style={[
                styles.icon,
                { color: active ? colors.onPrimary : colors.onSurfaceVariant },
              ]}
            >
              {icon}
            </Text>
            {/* <Text
              style={[
                styles.label,
                { color: active ? colors.onPrimary : colors.onSurfaceVariant },
              ]}
            >
              {label}
            </Text> */}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderRadius: 14,
    borderWidth: 1,
    padding: 4,
    gap: 4,
    alignSelf: "flex-start",
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
  },
  icon: {
    fontSize: 13,
  },
  label: {
    fontSize: 13,
    fontWeight: "500",
  },
});
