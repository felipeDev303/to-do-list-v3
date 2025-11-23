import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { COLORS, SPACING } from "../constants/theme";

interface Props {
  onPress: () => void;
}

export default function FloatingButton({ onPress }: Props) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress} activeOpacity={0.8}>
      <Ionicons name="add" size={32} color={COLORS.white} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    bottom: SPACING.xl,
    right: SPACING.xl,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
});
