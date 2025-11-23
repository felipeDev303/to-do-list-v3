import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { COLORS, SPACING } from "../constants/theme";

interface Props {
  value: string;
  onChangeText: (text: string) => void;
}

export default function SearchBar({ value, onChangeText }: Props) {
  return (
    <View style={styles.container}>
      <Ionicons name="search" size={20} color={COLORS.textSecondary} style={styles.icon} />
      <TextInput
        style={styles.input}
        placeholder="Buscar nota"
        placeholderTextColor={COLORS.textSecondary}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.inputBackground,
    borderRadius: 20,
    marginHorizontal: SPACING.m,
    marginBottom: SPACING.m,
    paddingHorizontal: SPACING.m,
    height: 40,
  },
  icon: {
    marginRight: SPACING.s,
  },
  input: {
    flex: 1,
    color: COLORS.white,
    fontSize: 16,
  },
});
