import { v4 as uuidv4 } from "uuid";

export type TaskStatus = "pending" | "in-progress" | "completed";

export type Todo = {
  id: string; // Identificador único
  text: string; // Descripción de la tarea
  status: TaskStatus; // Estado de la tarea
};

export type TodoAction =
  | { type: "ADD"; payload: string }
  | { type: "SET_STATUS"; payload: { id: string; status: TaskStatus } }
  | { type: "DELETE"; payload: string }
  | { type: "SET"; payload: Todo[] };

export const todoReducer = (state: Todo[], action: TodoAction): Todo[] => {
  switch (action.type) {
    case "SET":
      return action.payload;

    case "ADD":
      return [
        ...state,
        {
          id: uuidv4(),
          text: action.payload,
          status: "pending",
        },
      ];

    case "SET_STATUS":
      return state.map((t) =>
        t.id === action.payload.id ? { ...t, status: action.payload.status } : t
      );

    case "DELETE":
      return state.filter((t) => t.id !== action.payload);

    default:
      return state;
  }
};
