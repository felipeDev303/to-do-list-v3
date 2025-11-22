import { useContext } from "react";
import { TodoContext } from "../contexts/TodoContext";

export function useTodos() {
  const context = useContext(TodoContext);

  if (!context) {
    throw new Error("useTodos debe ser usado dentro de TodoProvider");
  }

  return context;
}
