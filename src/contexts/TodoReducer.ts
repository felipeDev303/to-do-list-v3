export type TodoLocation = {
  latitude: number;
  longitude: number;
  address?: string;
};

export type Todo = {
  _id: string;
  title: string;
  completed: boolean;
  imageUrl?: string;
  location?: TodoLocation;
  userId: string;
  createdAt: string;
  updatedAt: string;
};

export type TodoAction =
  | { type: "SET"; payload: Todo[] }
  | { type: "ADD"; payload: Todo }
  | { type: "UPDATE"; payload: Todo }
  | { type: "DELETE"; payload: string }
  | { type: "TOGGLE_COMPLETED"; payload: { id: string; completed: boolean } };

export const todoReducer = (state: Todo[], action: TodoAction): Todo[] => {
  switch (action.type) {
    case "SET":
      return action.payload;

    case "ADD":
      return [action.payload, ...state];

    case "UPDATE":
      return state.map((t) =>
        t._id === action.payload._id ? action.payload : t
      );

    case "TOGGLE_COMPLETED":
      return state.map((t) =>
        t._id === action.payload.id
          ? { ...t, completed: action.payload.completed }
          : t
      );

    case "DELETE":
      return state.filter((t) => t._id !== action.payload);

    default:
      return state;
  }
};
