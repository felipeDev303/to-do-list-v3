import { useContext } from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, FONT_SIZE, SPACING } from "../../src/constants/theme";
import { AuthContext } from "../../src/contexts/AuthContext";

export default function Settings() {
  const { logout } = useContext(AuthContext);
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Configuración</Text>
      <TouchableOpacity style={styles.button} onPress={logout}>
        <Text style={styles.buttonText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SPACING.l,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    color: COLORS.white,
    marginBottom: SPACING.xl,
    fontWeight: "bold",
  },
  button: {
    backgroundColor: COLORS.accent,
    paddingVertical: SPACING.m,
    paddingHorizontal: SPACING.xl,
    borderRadius: 12,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.m,
    fontWeight: "600",
  },
});
