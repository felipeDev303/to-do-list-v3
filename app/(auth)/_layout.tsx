import { Redirect, Slot } from "expo-router";
import { useContext } from "react";
import { AuthContext } from "../../src/contexts/AuthContext";

export default function AuthLayout() {
  const { user, loading } = useContext(AuthContext);

  if (loading) return null; // splash

  if (user) return <Redirect href="/(tabs)" />;

  return <Slot />;
}
