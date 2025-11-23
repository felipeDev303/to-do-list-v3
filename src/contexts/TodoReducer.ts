import { v4 as uuidv4 } from "uuid";

export type TaskStatus = "pending" | "in-progress" | "completed";

export type TodoLocation = {
  latitude: number;
  longitude: number;
  address?: string;
};

export type Todo = {
  id: string; // Identificador único
  text: string; // Descripción de la tarea
  status: TaskStatus; // Estado de la tarea
  imageUri?: string; // URI de la imagen adjunta
  location?: TodoLocation; // Ubicación de la tarea
  createdAt: number;
};

export type TodoAction =
  | { 
      type: "ADD"; 
      payload: { 
        text: string; 
        imageUri?: string; 
        location?: TodoLocation 
      } 
    }
  | { type: "SET_STATUS"; payload: { id: string; status: TaskStatus } }
  | { type: "DELETE"; payload: string }
  | { type: "SET"; payload: Todo[] };

export const todoReducer = (state: Todo[], action: TodoAction): Todo[] => {
  switch (action.type) {
    case "SET":
      return action.payload;

    case "ADD":
      return [
        {
          id: uuidv4(),
          text: action.payload.text,
          status: "pending",
          imageUri: action.payload.imageUri,
          location: action.payload.location,
          createdAt: Date.now(),
        },
        ...state,
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
