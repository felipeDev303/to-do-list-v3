import { Button, StyleSheet, Text, View } from "react-native";
import { TaskStatus, Todo } from "../contexts/TodoReducer";

type Props = {
  item: Todo;
  onChangeStatus: (status: TaskStatus) => void;
  onDelete: () => void;
};

export default function TaskItem({ item, onChangeStatus, onDelete }: Props) {
  return (
    <View style={styles.container}>
      <Text
        style={[styles.text, item.status === "completed" && styles.completed]}
      >
        {item.text}
      </Text>

      <View style={styles.buttons}>
        <Button
          title="🟡"
          onPress={() => onChangeStatus("pending")}
          color={item.status === "pending" ? "#FFD700" : "#CCC"}
        />
        <Button
          title="🔵"
          onPress={() => onChangeStatus("in-progress")}
          color={item.status === "in-progress" ? "#4169E1" : "#CCC"}
        />
        <Button
          title="🟢"
          onPress={() => onChangeStatus("completed")}
          color={item.status === "completed" ? "#32CD32" : "#CCC"}
        />
        <Button title="🗑" onPress={onDelete} color="#FF6B6B" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: "#fff",
    marginBottom: 10,
    borderRadius: 8,
    flexDirection: "column",
    gap: 10,
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
  },
  completed: {
    textDecorationLine: "line-through",
    opacity: 0.5,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
