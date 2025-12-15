import { Ionicons } from "@expo/vector-icons";
import React, { memo } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Todo } from "../contexts/TodoReducer";

type Props = {
  item: Todo;
  onToggleCompleted: () => void;
  onDelete: () => void;
};

function TaskItem({ item, onToggleCompleted, onDelete }: Props) {
  return (
    <View style={styles.container}>
      <Text style={[styles.text, item.completed && styles.completed]}>
        {item.title}
      </Text>

      {/* Mostrar imagen si existe */}
      {item.photoUri && (
        <Image
          source={{ uri: item.photoUri }}
          style={styles.image}
          resizeMode="cover"
        />
      )}

      {/* Mostrar ubicación si existe */}
      {item.location && (
        <View style={styles.locationContainer}>
          <Ionicons name="location" size={16} color="#007AFF" />
          <Text style={styles.locationText}>
            {item.location.address ||
              `${item.location.latitude.toFixed(
                4
              )}, ${item.location.longitude.toFixed(4)}`}
          </Text>
        </View>
      )}

      <View style={styles.buttons}>
        <TouchableOpacity
          style={[
            styles.statusButton,
            item.completed && styles.completedButton,
          ]}
          onPress={onToggleCompleted}
          activeOpacity={0.7}
        >
          <Text style={styles.emoji}>{item.completed ? "✅" : "⭕"}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.statusButton, styles.deleteButton]}
          onPress={onDelete}
        >
          <Text style={styles.emoji}>🗑</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Componente auxiliar para botones de estado (ya no necesario, pero lo dejo por si acaso)
const StatusButton = memo(
  ({
    emoji,
    isActive,
    onPress,
  }: {
    emoji: string;
    isActive: boolean;
    onPress: () => void;
  }) => {
    return (
      <TouchableOpacity
        style={[styles.statusButton, isActive && styles.statusButtonActive]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <Text style={[styles.emoji, isActive && styles.emojiActive]}>
          {emoji}
        </Text>
      </TouchableOpacity>
    );
  }
);

StatusButton.displayName = "StatusButton";

export default memo(TaskItem);

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: "#fff",
    marginBottom: 10,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  text: {
    fontSize: 16,
    marginBottom: 12,
    color: "#1C1C1E",
  },
  completed: {
    textDecorationLine: "line-through",
    opacity: 0.5,
    color: "#8E8E93",
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 12,
    padding: 8,
    backgroundColor: "#F2F2F7",
    borderRadius: 6,
  },
  locationText: {
    fontSize: 12,
    color: "#007AFF",
    flex: 1,
  },
  buttons: {
    flexDirection: "row",
    gap: 8,
  },
  statusButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#F2F2F7",
    alignItems: "center",
    justifyContent: "center",
  },
  statusButtonActive: {
    backgroundColor: "#007AFF",
  },
  completedButton: {
    backgroundColor: "#32CD32",
  },
  emoji: {
    fontSize: 18,
  },
  emojiActive: {
    transform: [{ scale: 1.2 }],
  },
  deleteButton: {
    backgroundColor: "#FF3B30",
  },
});
