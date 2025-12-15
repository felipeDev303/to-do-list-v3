import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import EmptyState from "../../src/components/EmptyState";
import FloatingButton from "../../src/components/FloatingButton";
import Header from "../../src/components/Header";
import SearchBar from "../../src/components/SearchBar";
import SegmentedControl from "../../src/components/SegmentedControl";
import TaskFormModal from "../../src/components/TaskFormModal";
import TaskItem from "../../src/components/TaskItem";
import { COLORS, SPACING } from "../../src/constants/theme";
import { TodoLocation } from "../../src/contexts/TodoReducer";
import { useTodos } from "../../src/hooks/useTodos";

export default function Home() {
  const {
    todos,
    isLoading,
    fetchTodos,
    createTodo,
    toggleCompleted,
    deleteTodo,
  } = useTodos();
  const [view, setView] = useState<"Calendario" | "Notas">("Notas");
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "completed" | "pending"
  >("all");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Cargar tareas al montar el componente
  useEffect(() => {
    fetchTodos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Solo ejecutar al montar

  // Filter logic
  const filteredTodos = useMemo(() => {
    return todos.filter((todo) => {
      const matchesSearch = todo.title
        .toLowerCase()
        .includes(searchText.toLowerCase());
      const matchesStatus =
        statusFilter === "all"
          ? true
          : statusFilter === "completed"
          ? todo.completed
          : !todo.completed;
      return matchesSearch && matchesStatus;
    });
  }, [todos, searchText, statusFilter]);

  const handleAdd = useCallback(
    async (text: string, imageUri?: string, location?: TodoLocation) => {
      try {
        await createTodo({
          title: text,
          imageUrl: imageUri,
          location,
        });
      } catch (error) {
        console.error("Error al crear tarea:", error);
      }
    },
    [createTodo]
  );

  const handleToggleCompleted = useCallback(
    async (id: string, completed: boolean) => {
      try {
        await toggleCompleted(id, !completed);
      } catch (error) {
        console.error("Error al cambiar estado:", error);
      }
    },
    [toggleCompleted]
  );

  const handleDelete = useCallback(
    async (id: string) => {
      try {
        await deleteTodo(id);
      } catch (error) {
        console.error("Error al eliminar tarea:", error);
      }
    },
    [deleteTodo]
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchTodos();
    setRefreshing(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // fetchTodos es estable en el contexto

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      <Header />

      <SegmentedControl selected={view} onSelect={setView} />

      <SearchBar value={searchText} onChangeText={setSearchText} />

      <View style={styles.filterContainer}>
        {/* Simplified filter - you can expand this */}
      </View>

      {isLoading && !refreshing && todos.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <FlatList
          data={filteredTodos}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TaskItem
              item={item}
              onToggleCompleted={() =>
                handleToggleCompleted(item._id, item.completed)
              }
              onDelete={() => handleDelete(item._id)}
            />
          )}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={<EmptyState message="No hay tareas" emoji="📝" />}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={COLORS.primary}
            />
          }
        />
      )}

      <FloatingButton onPress={() => setIsModalVisible(true)} />

      <TaskFormModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSubmit={handleAdd}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.m,
  },
  listContent: {
    paddingBottom: 100, // Space for FAB
    gap: SPACING.s,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  filterContainer: {
    marginBottom: SPACING.s,
  },
});
