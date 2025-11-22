import AsyncStorage from "@react-native-async-storage/async-storage";
import { Todo } from "../contexts/TodoReducer";

const KEY = "todos";

export async function saveTodos(todos: Todo[]): Promise<void> {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(todos));
  } catch (error) {
    console.error("Error saving todos:", error);
  }
}

export async function loadTodos(): Promise<Todo[]> {
  try {
    const data = await AsyncStorage.getItem(KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error loading todos:", error);
    return [];
  }
}
