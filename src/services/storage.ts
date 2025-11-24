import { Todo } from "../contexts/TodoReducer";
import platformStorage from "./platformStorage";

const KEY = "todos";

export async function saveTodos(todos: Todo[]): Promise<void> {
  try {
    await platformStorage.setItem(KEY, JSON.stringify(todos));
  } catch (error) {
    console.error("Error saving todos:", error);
  }
}

export async function loadTodos(): Promise<Todo[]> {
  try {
    const data = await platformStorage.getItem(KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error loading todos:", error);
    return [];
  }
}
