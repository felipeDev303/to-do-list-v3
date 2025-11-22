import { createContext, useEffect, useReducer } from "react";
import { loadTodos, saveTodos } from "../services/storage";
import { Todo, TodoAction, todoReducer } from "./TodoReducer";

type TodoContextType = {
  todos: Todo[];
  dispatch: React.Dispatch<TodoAction>;
};

export const TodoContext = createContext<TodoContextType | undefined>(
  undefined
);

export function TodoProvider({ children }: { children: React.ReactNode }) {
  const [todos, dispatch] = useReducer(todoReducer, []);

  useEffect(() => {
    loadTodos().then((data) => dispatch({ type: "SET", payload: data }));
  }, []);

  useEffect(() => {
    saveTodos(todos);
  }, [todos]);

  return (
    <TodoContext.Provider value={{ todos, dispatch }}>
      {children}
    </TodoContext.Provider>
  );
}
