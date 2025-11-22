import { useContext } from "react";
import { Button, Text, View } from "react-native";
import { AuthContext } from "../../src/contexts/AuthContext";

// Solo a modo de ejemplo
export default function Settings() {
  const { logout } = useContext(AuthContext);
  return (
    <View>
      <Text>Configuración</Text>
      <Button title="Cerrar sesión" onPress={logout} />
    </View>
  );
}
