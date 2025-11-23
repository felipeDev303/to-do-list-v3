import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { colors } from "../constants/colors";

interface FilterButtonProps {
  title: string;
  onPress: () => void;
  active: boolean;
  color?: string;
}

export default function FilterButton({
  title,
  onPress,
  active,
  color = colors.primary,
}: FilterButtonProps) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        active && { ...styles.active, backgroundColor: color },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text
        style={[styles.text, active && styles.activeText]}
        numberOfLines={1}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: colors.backgroundSecondary,
    minWidth: 80,
    alignItems: "center",
  },
  active: {
    backgroundColor: colors.primary,
  },
  text: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  activeText: {
    color: colors.textInverse,
  },
});
