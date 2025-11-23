import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLORS, FONT_SIZE, SPACING } from "../constants/theme";
import { TaskStatus } from "../contexts/TodoReducer";

type FilterType = TaskStatus | "all";

interface Props {
  selected: FilterType;
  onSelect: (status: FilterType) => void;
}

export default function StatusFilter({ selected, onSelect }: Props) {
  const filters: { label: string; value: FilterType; color?: string }[] = [
    { label: "Todas", value: "all" },
    { label: "Pendientes", value: "pending", color: "#FFD700" },
    { label: "En Progreso", value: "in-progress", color: COLORS.primary },
    { label: "Completadas", value: "completed", color: "#32CD32" },
  ];

  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {filters.map((filter) => {
          const isActive = selected === filter.value;
          return (
            <TouchableOpacity
              key={filter.value}
              style={[
                styles.chip,
                isActive && styles.chipActive,
                isActive && filter.color ? { backgroundColor: filter.color } : null,
              ]}
              onPress={() => onSelect(filter.value)}
            >
              <Text
                style={[
                  styles.text,
                  isActive && styles.textActive,
                ]}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.m,
  },
  scrollContent: {
    paddingHorizontal: SPACING.m,
    gap: SPACING.s,
  },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: COLORS.inputBackground,
    borderWidth: 1,
    borderColor: "transparent",
  },
  chipActive: {
    backgroundColor: COLORS.primary,
  },
  text: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.s,
    fontWeight: "600",
  },
  textActive: {
    color: COLORS.white,
  },
});
