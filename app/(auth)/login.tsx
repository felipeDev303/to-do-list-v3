import { useRouter } from "expo-router";
import { useContext, useState } from "react";
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
import { AuthContext } from "../../src/contexts/AuthContext";
import { showAlert } from "../../src/utils/alert";

export default function LoginScreen() {
  const { login, isLoading: authLoading } = useContext(AuthContext);
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    // Validaciones
    if (!email.trim() || !password.trim()) {
      showAlert("Error", "Todos los campos son obligatorios");
      return;
    }

    if (password.length < 6) {
      showAlert("Error", "La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setIsLoading(true);
    try {
      await login(email.trim(), password);
      router.replace("/(tabs)");
    } catch (e: any) {
      // El error ya se muestra en el AuthContext
      console.error("Error en login:", e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      <Text style={styles.title}>kai.zen</Text>
      <Text style={styles.subtitle}>Inicia sesión para continuar</Text>

      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        placeholderTextColor={COLORS.textSecondary}
        autoCapitalize="none"
        keyboardType="email-address"
        editable={!isLoading}
      />

      <TextInput
        style={styles.input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        placeholder="Contraseña"
        placeholderTextColor={COLORS.textSecondary}
        editable={!isLoading}
      />

      <TouchableOpacity
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={handleLogin}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Ingresar</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.linkButton}
        onPress={() => router.push("/(auth)/register")}
        disabled={isLoading}
      >
        <Text style={styles.linkText}>¿No tienes cuenta? Regístrate</Text>
      </TouchableOpacity>

      <Text style={styles.hint}>
        Usa tu email y contraseña (mínimo 6 caracteres)
      </Text>
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
  hint: {
    marginTop: SPACING.l,
    textAlign: "center",
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.s,
  },
});
