import { Stack } from "expo-router";
import { AuthProvider } from "../src/contexts/AuthContext";
import { TodoProvider } from "../src/contexts/TodoContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <TodoProvider>
        <Stack />
      </TodoProvider>
    </AuthProvider>
  );
}
