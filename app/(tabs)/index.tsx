import { useCallback, useMemo, useState } from "react";
import {
  FlatList,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";
import EmptyState from "../../src/components/EmptyState"; // Keeping this for now, might need restyling
import FloatingButton from "../../src/components/FloatingButton";
import Header from "../../src/components/Header";
import SearchBar from "../../src/components/SearchBar";
import SegmentedControl from "../../src/components/SegmentedControl";
import TaskItem from "../../src/components/TaskItem";
import { COLORS, SPACING } from "../../src/constants/theme";
import { useTodos } from "../../src/hooks/useTodos";

export default function Home() {
  const { todos, dispatch } = useTodos();
  const [view, setView] = useState<"Calendario" | "Notas">("Notas");
  const [searchText, setSearchText] = useState("");

  // Filter logic
  const filteredTodos = useMemo(() => {
    return todos.filter((todo) =>
      todo.text.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [todos, searchText]);

  const handleAdd = useCallback(() => {
    // For now, just adding a dummy task to test UI
    // In real app, this would open a modal
    dispatch({ type: "ADD", payload: "Nueva Tarea " + new Date().toLocaleTimeString() });
  }, [dispatch]);

  const handleDelete = useCallback(
    (id: string) => {
      dispatch({ type: "DELETE", payload: id });
    },
    [dispatch]
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      <Header />
      
      <SegmentedControl selected={view} onSelect={setView} />
      
      <SearchBar value={searchText} onChangeText={setSearchText} />

      <FlatList
        data={filteredTodos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TaskItem
            item={item}
            onChangeStatus={(status) => 
              dispatch({ type: "SET_STATUS", payload: { id: item.id, status } })
            }
            onDelete={() => handleDelete(item.id)}
          />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<EmptyState message="No se encontraron notas" emoji="🌑" />}
      />

      <FloatingButton onPress={handleAdd} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  listContent: {
    padding: SPACING.m,
    paddingBottom: 100, // Space for FAB
  },
});
