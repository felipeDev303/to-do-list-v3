import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useEffect, useState } from "react";
import { fakeLogin } from "../services/auth";

type AuthContextType = {
  user: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => false,
  logout: () => {},
  loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Cargar usuario desde AsyncStorage
  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem("user");
      if (saved) setUser(saved);
      setLoading(false);
    })();
  }, []);

  const login = async (email: string, password: string) => {
    const ok = await fakeLogin(email, password);
    if (!ok) return false;

    setUser(email);
    await AsyncStorage.setItem("user", email);

    return true;
  };

  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
