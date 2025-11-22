import { router } from "expo-router";
import { useContext, useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import { AuthContext } from "../../src/contexts/AuthContext";

export default function Login() {
  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState("admin@demo.com");
  const [pass, setPass] = useState("123456");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    const ok = await login(email, pass);
    if (!ok) return setError("Credenciales incorrectas");

    router.replace("/(tabs)");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>

      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
      />

      <TextInput
        style={styles.input}
        secureTextEntry
        value={pass}
        onChangeText={setPass}
        placeholder="Contraseña"
      />

      {error !== "" && <Text style={styles.error}>{error}</Text>}

      <Button title="Ingresar" onPress={handleLogin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 30, justifyContent: "center" },
  title: { fontSize: 28, marginBottom: 20, fontWeight: "bold" },
  input: {
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#ccc",
    marginBottom: 10,
  },
  error: { color: "red", marginBottom: 10 },
});
