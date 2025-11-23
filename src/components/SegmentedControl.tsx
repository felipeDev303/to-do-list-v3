import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLORS, SPACING } from "../constants/theme";

type Option = "Calendario" | "Notas";

interface Props {
  selected: Option;
  onSelect: (option: Option) => void;
}

export default function SegmentedControl({ selected, onSelect }: Props) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.option, selected === "Calendario" && styles.selectedOption]}
        onPress={() => onSelect("Calendario")}
      >
        <Text style={[styles.text, selected === "Calendario" && styles.selectedText]}>
          Calendario
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.option, selected === "Notas" && styles.selectedOption]}
        onPress={() => onSelect("Notas")}
      >
        <Text style={[styles.text, selected === "Notas" && styles.selectedText]}>
          Notas
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#2A2836",
    borderRadius: 12,
    margin: SPACING.m,
    padding: 4,
  },
  option: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 8,
  },
  selectedOption: {
    backgroundColor: "#3B3949",
  },
  text: {
    color: COLORS.textSecondary,
    fontWeight: "600",
  },
  selectedText: {
    color: COLORS.white,
  },
});
