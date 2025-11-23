import { useCallback, useMemo, useState } from "react";
import {
    FlatList,
    StatusBar,
    StyleSheet,
    View,
} from "react-native";
import EmptyState from "../../src/components/EmptyState";
import FloatingButton from "../../src/components/FloatingButton";
import Header from "../../src/components/Header";
import SearchBar from "../../src/components/SearchBar";
import SegmentedControl from "../../src/components/SegmentedControl";
import StatusFilter from "../../src/components/StatusFilter";
import TaskFormModal from "../../src/components/TaskFormModal";
import TaskItem from "../../src/components/TaskItem";
import { COLORS, SPACING } from "../../src/constants/theme";
import { TaskStatus, TodoLocation } from "../../src/contexts/TodoReducer";
import { useTodos } from "../../src/hooks/useTodos";

export default function Home() {
  const { todos, dispatch } = useTodos();
  const [view, setView] = useState<"Calendario" | "Notas">("Notas");
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "all">("all");
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Filter logic
  const filteredTodos = useMemo(() => {
    return todos.filter((todo) => {
      const matchesSearch = todo.text.toLowerCase().includes(searchText.toLowerCase());
      const matchesStatus = statusFilter === "all" ? true : todo.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [todos, searchText, statusFilter]);

  const handleAdd = useCallback((text: string, imageUri?: string, location?: TodoLocation) => {
    dispatch({ 
      type: "ADD", 
      payload: { text, imageUri, location } 
    });
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

      <StatusFilter selected={statusFilter} onSelect={setStatusFilter} />

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

      <FloatingButton onPress={() => setIsModalVisible(true)} />

      <TaskFormModal 
        visible={isModalVisible} 
        onClose={() => setIsModalVisible(false)} 
        onSubmit={handleAdd} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SPACING.m,
    paddingTop: 60, // Space for status bar
  },
  listContent: {
    paddingBottom: 100, // Space for FAB
    gap: SPACING.s,
  },
});
