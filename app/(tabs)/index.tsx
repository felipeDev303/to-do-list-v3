import { useState } from "react";
import { Button, FlatList, StyleSheet, TextInput, View } from "react-native";
import TaskItem from "../../src/components/TaskItem";
import { useTodos } from "../../src/hooks/useTodos";

export default function Home() {
  const { todos, dispatch } = useTodos();
  const [text, setText] = useState("");

  const add = () => {
    if (!text.trim()) return;
    dispatch({ type: "ADD", payload: text });
    setText("");
  };

  return (
    <View style={styles.container}>
      <TextInput
        value={text}
        onChangeText={setText}
        placeholder="Nueva tarea..."
        style={styles.input}
      />
      <Button title="Agregar" onPress={add} />

      <FlatList
        data={todos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TaskItem
            item={item}
            onToggle={() => dispatch({ type: "TOGGLE", payload: item.id })}
            onDelete={() => dispatch({ type: "DELETE", payload: item.id })}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  input: {
    backgroundColor: "#fff",
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
  },
});
