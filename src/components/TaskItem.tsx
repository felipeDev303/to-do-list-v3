import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Todo } from "../contexts/TodoReducer";

type Props = {
  item: Todo;
  onToggle: () => void;
  onDelete: () => void;
};

export default function TaskItem({ item, onToggle, onDelete }: Props) {
  return (
    <TouchableOpacity onPress={onToggle} onLongPress={onDelete}>
      <View style={styles.item}>
        <Text style={[styles.text, item.done && styles.done]}>{item.text}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  item: {
    padding: 15,
    backgroundColor: "#fff",
    marginBottom: 10,
    borderRadius: 8,
  },
  text: {
    fontSize: 18,
  },
  done: {
    textDecorationLine: "line-through",
    opacity: 0.5,
  },
});
