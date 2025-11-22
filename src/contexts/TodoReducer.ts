export type Todo = {
  id: string;
  text: string;
  done: boolean;
};

export type TodoAction =
  | { type: "ADD"; payload: string }
  | { type: "TOGGLE"; payload: string }
  | { type: "DELETE"; payload: string }
  | { type: "SET"; payload: Todo[] };

export const todoReducer = (state: Todo[], action: TodoAction): Todo[] => {
  switch (action.type) {
    case "SET":
      return action.payload;
    case "ADD":
      return [
        ...state,
        { id: Date.now().toString(), text: action.payload, done: false },
      ];
    case "TOGGLE":
      return state.map((t) =>
        t.id === action.payload ? { ...t, done: !t.done } : t
      );
    case "DELETE":
      return state.filter((t) => t.id !== action.payload);
    default:
      return state;
  }
};
