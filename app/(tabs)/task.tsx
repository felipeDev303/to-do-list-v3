import { StyleSheet, Text, View } from "react-native";

export default function TaskScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tareas</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#6B5BC7",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
});
