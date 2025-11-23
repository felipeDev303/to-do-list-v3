import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { COLORS } from "../constants/theme";

interface EmptyStateProps {
  message?: string;
  emoji?: string;
}

export default function EmptyState({
  message = "No hay tareas",
  emoji = "📝",
}: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  message: {
    fontSize: 18,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
});
