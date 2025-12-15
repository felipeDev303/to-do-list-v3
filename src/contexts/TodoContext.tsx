import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import getTodosService, {
  CreateTodoPayload,
  UpdateTodoPayload,
} from "../../services/todos-service";
import { showAlert } from "../utils/alert";
import { AuthContext } from "./AuthContext";
import { Todo, TodoAction, todoReducer } from "./TodoReducer";

type TodoContextType = {
  todos: Todo[];
  isLoading: boolean;
  fetchTodos: () => Promise<void>;
  createTodo: (payload: CreateTodoPayload) => Promise<void>;
  updateTodo: (id: string, payload: UpdateTodoPayload) => Promise<void>;
  toggleCompleted: (id: string, completed: boolean) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  dispatch: React.Dispatch<TodoAction>;
};

export const TodoContext = createContext<TodoContextType | undefined>(
  undefined
);

export function TodoProvider({ children }: { children: React.ReactNode }) {
  const [todos, dispatch] = useReducer(todoReducer, []);
  const [isLoading, setIsLoading] = useState(false);
  const { token, logout } = useContext(AuthContext);

  useEffect(() => {
    if (token) {
      fetchTodos();
    }
  }, [token]);

  const handleAuthError = useCallback(
    (error: any) => {
      if (error.message?.includes("Sesión expirada")) {
        showAlert("Sesión expirada", "Por favor, inicia sesión nuevamente");
        logout();
      }
    },
    [logout]
  );

  const fetchTodos = useCallback(async () => {
    if (!token) return;

    try {
      setIsLoading(true);
      const todosService = getTodosService(token);
      const data = await todosService.getTodos();
      dispatch({ type: "SET", payload: data });
    } catch (error) {
      console.error("Error al cargar tareas:", error);
      handleAuthError(error);
      if (error instanceof Error) {
        showAlert("Error", error.message);
      }
    } finally {
      setIsLoading(false);
    }
  }, [token, handleAuthError]);

  const createTodo = useCallback(
    async (payload: CreateTodoPayload) => {
      if (!token) return;

      try {
        setIsLoading(true);
        const todosService = getTodosService(token);
        const newTodo = await todosService.createTodo(payload);
        dispatch({ type: "ADD", payload: newTodo });
      } catch (error) {
        console.error("Error al crear tarea:", error);
        handleAuthError(error);
        if (error instanceof Error) {
          showAlert("Error", error.message);
        }
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [token, handleAuthError]
  );

  const updateTodo = useCallback(
    async (id: string, payload: UpdateTodoPayload) => {
      if (!token) return;

      try {
        setIsLoading(true);
        const todosService = getTodosService(token);
        const updatedTodo = await todosService.updateTodo(id, payload);
        dispatch({ type: "UPDATE", payload: updatedTodo });
      } catch (error) {
        console.error("Error al actualizar tarea:", error);
        handleAuthError(error);
        if (error instanceof Error) {
          showAlert("Error", error.message);
        }
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [token, handleAuthError]
  );

  const toggleCompleted = useCallback(
    async (id: string, completed: boolean) => {
      if (!token) return;

      try {
        const todosService = getTodosService(token);
        const updatedTodo = await todosService.patchTodo(id, { completed });
        dispatch({ type: "UPDATE", payload: updatedTodo });
      } catch (error) {
        console.error("Error al cambiar estado:", error);
        handleAuthError(error);
        if (error instanceof Error) {
          showAlert("Error", error.message);
        }
      }
    },
    [token, handleAuthError]
  );

  const deleteTodo = useCallback(
    async (id: string) => {
      if (!token) return;

      try {
        setIsLoading(true);
        const todosService = getTodosService(token);
        await todosService.deleteTodo(id);
        dispatch({ type: "DELETE", payload: id });
      } catch (error) {
        console.error("Error al eliminar tarea:", error);
        handleAuthError(error);
        if (error instanceof Error) {
          showAlert("Error", error.message);
        }
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [token, handleAuthError]
  );

  return (
    <TodoContext.Provider
      value={{
        todos,
        isLoading,
        fetchTodos,
        createTodo,
        updateTodo,
        toggleCompleted,
        deleteTodo,
        dispatch,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
}
