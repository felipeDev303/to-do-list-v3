import { useRouter } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { COLORS, FONT_SIZE, SPACING } from "../../src/constants/theme";
import { registerUser } from "../../src/services/users";

export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleRegister() {
    // Validaciones
    if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
      showAlert("Error", "Todos los campos son obligatorios");
      return;
    }

    if (password !== confirmPassword) {
      showAlert("Error", "Las contraseñas no coinciden");
      return;
    }

    setIsLoading(true);
    try {
      await registerUser(email, password);
      showAlert("Éxito", "Usuario creado correctamente", [
        {
          text: "OK",
          onPress: () => router.replace("/(auth)/login"),
        },
      ]);
    } catch (e: any) {
      showAlert("Error", e.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      <Text style={styles.title}>Crear cuenta</Text>
      <Text style={styles.subtitle}>Regístrate para comenzar</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor={COLORS.textSecondary}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        editable={!isLoading}
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        placeholderTextColor={COLORS.textSecondary}
        value={password}
        secureTextEntry
        onChangeText={setPassword}
        editable={!isLoading}
      />

      <TextInput
        style={styles.input}
        placeholder="Confirmar contraseña"
        placeholderTextColor={COLORS.textSecondary}
        value={confirmPassword}
        secureTextEntry
        onChangeText={setConfirmPassword}
        editable={!isLoading}
      />

      <TouchableOpacity
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={handleRegister}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Crear cuenta</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.linkButton}
        onPress={() => router.back()}
        disabled={isLoading}
      >
        <Text style={styles.linkText}>¿Ya tienes cuenta? Inicia sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING.l,
    justifyContent: "center",
    backgroundColor: COLORS.background,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: SPACING.s,
    textAlign: "center",
    color: COLORS.white,
  },
  subtitle: {
    fontSize: FONT_SIZE.m,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xl,
    textAlign: "center",
  },
  input: {
    backgroundColor: COLORS.inputBackground,
    padding: SPACING.m,
    marginBottom: SPACING.m,
    borderRadius: 12,
    fontSize: FONT_SIZE.m,
    color: COLORS.white,
    borderWidth: 1,
    borderColor: "transparent",
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: SPACING.m,
    borderRadius: 12,
    alignItems: "center",
    marginTop: SPACING.s,
  },
  buttonDisabled: {
    backgroundColor: COLORS.secondary,
    opacity: 0.7,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.m,
    fontWeight: "600",
  },
  linkButton: {
    marginTop: SPACING.l,
    padding: SPACING.s,
  },
  linkText: {
    color: COLORS.secondary,
    textAlign: "center",
    fontSize: FONT_SIZE.m,
  },
});
