import { Ionicons } from "@expo/vector-icons";
import React, { memo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLORS, FONT_SIZE, SPACING } from "../constants/theme";
import { TaskStatus, Todo } from "../contexts/TodoReducer";

type Props = {
  item: Todo;
  onChangeStatus: (status: TaskStatus) => void;
  onDelete: () => void;
};

function TaskItem({ item, onChangeStatus, onDelete }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.text}>{item.text}</Text>
        <Text style={styles.date}>Hoy</Text>
      </View>
      
      <TouchableOpacity onPress={onDelete} style={styles.pinButton}>
         <Ionicons name="trash-outline" size={16} color={COLORS.textSecondary} />
      </TouchableOpacity>

       {/* Status Indicator (Simple dot for now, can be expanded) */}
      <View style={[styles.statusIndicator, 
        item.status === 'completed' && { backgroundColor: COLORS.secondary },
        item.status === 'in-progress' && { backgroundColor: COLORS.primary }
      ]} />
    </View>
  );
}

export default memo(TaskItem);

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: SPACING.m,
    marginBottom: SPACING.m,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    minHeight: 100,
  },
  content: {
    flex: 1,
    marginRight: SPACING.s,
  },
  text: {
    fontSize: FONT_SIZE.m,
    color: COLORS.white,
    marginBottom: SPACING.s,
    lineHeight: 20,
  },
  date: {
    fontSize: FONT_SIZE.s,
    color: COLORS.textSecondary,
  },
  pinButton: {
    padding: SPACING.xs,
  },
  statusIndicator: {
    position: "absolute",
    bottom: SPACING.m,
    right: SPACING.m,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "transparent", 
  }
});
