import { Ionicons } from "@expo/vector-icons";
import React, { memo } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
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
      {item.imageUri && (
        <Image source={{ uri: item.imageUri }} style={styles.image} />
      )}
      
      <View style={styles.content}>
        <Text style={styles.text}>{item.text}</Text>
        <View style={styles.metaContainer}>
          <Text style={styles.date}>Hoy</Text>
          {item.location && (
            <View style={styles.locationBadge}>
              <Ionicons name="location-sharp" size={12} color={COLORS.textSecondary} />
            </View>
          )}
        </View>
      </View>
      
      <TouchableOpacity onPress={onDelete} style={styles.pinButton}>
         <Ionicons name="trash-outline" size={16} color={COLORS.textSecondary} />
      </TouchableOpacity>

       {/* Status Indicator */}
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
    overflow: "hidden",
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: SPACING.m,
    backgroundColor: COLORS.background,
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
  metaContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.s,
  },
  date: {
    fontSize: FONT_SIZE.s,
    color: COLORS.textSecondary,
  },
  locationBadge: {
    padding: 2,
    borderRadius: 4,
    backgroundColor: COLORS.inputBackground,
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
