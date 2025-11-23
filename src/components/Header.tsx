import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLORS, FONT_SIZE, SPACING } from "../constants/theme";

export default function Header() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>kai.zen</Text>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="notifications-outline" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="ellipsis-vertical" size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.m,
    backgroundColor: COLORS.background,
  },
  title: {
    fontSize: FONT_SIZE.xl,
    fontWeight: "bold",
    color: COLORS.white,
  },
  actions: {
    flexDirection: "row",
    gap: SPACING.s,
  },
  iconButton: {
    padding: SPACING.xs,
  },
});
