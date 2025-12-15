import { Redirect, Stack } from "expo-router";
import { useContext } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import "react-native-get-random-values";
import { AuthContext, AuthProvider } from "../src/contexts/AuthContext";
import { TodoProvider } from "../src/contexts/TodoContext";

function RootLayoutNav() {
  const { user, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Cargando...</Text>
      </View>
    );
  }

  // Si no hay usuario autenticado, redirigir a login
  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  // Solo montar TodoProvider cuando hay usuario autenticado
  return (
    <TodoProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
    </TodoProvider>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1F1D2B",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
});
