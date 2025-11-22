import { Redirect, Slot } from "expo-router";
import { useContext } from "react";
import { AuthContext } from "../../src/contexts/AuthContext";

export default function AuthLayout() {
  const { user, isLoading } = useContext(AuthContext);

  if (isLoading) return null; // splash

  if (user) return <Redirect href="/(tabs)" />;

  return <Slot />;
}
