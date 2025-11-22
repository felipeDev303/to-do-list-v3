import { useState } from "react";
import { Button, FlatList, StyleSheet, TextInput, View } from "react-native";
import TaskItem from "../../src/components/TaskItem";
import { TaskStatus } from "../../src/contexts/TodoReducer";
import { useTodos } from "../../src/hooks/useTodos";

export default function Home() {
  const { todos, dispatch } = useTodos();
  const [text, setText] = useState("");
  const [filter, setFilter] = useState<TaskStatus | "all">("all");

  // Filtrar las tareas según el estado seleccionado
  const filteredTodos = todos.filter((todo) =>
    filter === "all" ? true : todo.status === filter
  );

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

      {/* Botones de filtro */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          marginVertical: 10,
        }}
      >
        <Button
          title="Todas"
          onPress={() => setFilter("all")}
          color={filter === "all" ? "#000" : "#888"}
        />
        <Button
          title="Pendientes"
          onPress={() => setFilter("pending")}
          color={filter === "pending" ? "#000" : "#888"}
        />
        <Button
          title="En Progreso"
          onPress={() => setFilter("in-progress")}
          color={filter === "in-progress" ? "#000" : "#888"}
        />
        <Button
          title="Completadas"
          onPress={() => setFilter("completed")}
          color={filter === "completed" ? "#000" : "#888"}
        />
      </View>

      <FlatList
        data={filteredTodos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TaskItem
            item={item}
            onChangeStatus={(status: TaskStatus) =>
              dispatch({ type: "SET_STATUS", payload: { id: item.id, status } })
            }
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
  filterContainer: {
    flexDirection: "row",
    gap: 10,
    marginVertical: 15,
    justifyContent: "space-between",
  },
});
