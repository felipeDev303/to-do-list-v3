import { Slot, useRouter, useSegments } from "expo-router";
import { useContext, useEffect } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import "react-native-get-random-values";
import { AuthContext, AuthProvider } from "../src/contexts/AuthContext";
import { TodoProvider } from "../src/contexts/TodoContext";

function RootLayoutNav() {
  const { user, isLoading } = useContext(AuthContext);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (!user && !inAuthGroup) {
      // Redirect al login si no hay usuario
      router.replace("/(auth)/login");
    } else if (user && inAuthGroup) {
      // Redirect a tabs si ya hay usuario
      router.replace("/(tabs)");
    }
  }, [user, isLoading, segments, router]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Cargando...</Text>
      </View>
    );
  }

  // Renderizar las rutas sin TodoProvider hasta que esté autenticado
  if (!user) {
    return <Slot />;
  }

  // Solo montar TodoProvider cuando hay usuario autenticado
  return (
    <TodoProvider>
      <Slot />
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
