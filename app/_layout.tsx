import { Stack } from "expo-router";
import { TodoProvider } from "../src/contexts/TodoContext";

export default function RootLayout() {
  return (
    <TodoProvider>
      <Stack />
    </TodoProvider>
  );
}
