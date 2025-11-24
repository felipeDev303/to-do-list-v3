import { createContext, useEffect, useState } from "react";
import platformStorage from "../services/platformStorage";
import { User } from "../services/users";

type UserWithoutPassword = Omit<User, "password">;

type AuthContextType = {
  user: UserWithoutPassword | null;
  login: (u: User | UserWithoutPassword) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  logout: async () => {},
  isLoading: true,
});

const SESSION_KEY = "SESSION";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserWithoutPassword | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSession();
  }, []);

  async function loadSession() {
    try {
      const data = await platformStorage.getItem(SESSION_KEY);
      if (data) {
        const parsedUser = JSON.parse(data);
        setUser(parsedUser);
      }
    } catch (error) {
      console.error("Error al cargar sesión:", error);
      await platformStorage.removeItem(SESSION_KEY);
    } finally {
      setIsLoading(false);
    }
  }

  async function login(u: User | UserWithoutPassword) {
    try {
      // Si tiene password, la eliminamos; si no, usamos el objeto tal cual
      const userWithoutPassword =
        "password" in u ? (({ password, ...rest }) => rest)(u) : u;

      setUser(userWithoutPassword);
      await platformStorage.setItem(
        SESSION_KEY,
        JSON.stringify(userWithoutPassword)
      );
    } catch (error) {
      console.error("Error al guardar sesión:", error);
      throw new Error("No se pudo iniciar sesión");
    }
  }

  async function logout() {
    try {
      setUser(null);
      await platformStorage.removeItem(SESSION_KEY);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      throw new Error("No se pudo cerrar sesión");
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}
