import { Redirect, Tabs } from "expo-router";
import { useContext } from "react";
import { AuthContext } from "../../src/contexts/AuthContext";

export default function TabLayout() {
  const { user, isLoading } = useContext(AuthContext);

  if (isLoading) return null; // splash

  if (!user) return <Redirect href="/(auth)/login" />;
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" options={{ title: "Home" }} />
    </Tabs>
  );
}
