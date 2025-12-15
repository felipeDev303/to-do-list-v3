import { createContext, useEffect, useState } from "react";
import getAuthService from "../../services/auth-service";
import platformStorage from "../services/platformStorage";
import { showAlert } from "../utils/alert";

type AuthUser = {
  userId: string;
  token: string;
};

type AuthContextType = {
  user: AuthUser | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  isLoading: true,
});

const SESSION_KEY = "AUTH_SESSION";
const TOKEN_KEY = "AUTH_TOKEN";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSession();
  }, []);

  async function loadSession() {
    try {
      const savedToken = await platformStorage.getItem(TOKEN_KEY);
      const savedUser = await platformStorage.getItem(SESSION_KEY);

      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      }
    } catch (error) {
      console.error("Error al cargar sesión:", error);
      await platformStorage.removeItem(SESSION_KEY);
      await platformStorage.removeItem(TOKEN_KEY);
    } finally {
      setIsLoading(false);
    }
  }

  async function login(email: string, password: string) {
    try {
      setIsLoading(true);
      const authService = getAuthService();
      const response = await authService.login({ email, password });

      if (response?.data) {
        const userData: AuthUser = {
          userId: response.data.userId,
          token: response.data.token,
        };

        setUser(userData);
        setToken(response.data.token);

        await platformStorage.setItem(TOKEN_KEY, response.data.token);
        await platformStorage.setItem(SESSION_KEY, JSON.stringify(userData));
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      if (error instanceof Error) {
        showAlert("Error", error.message);
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  async function register(email: string, password: string) {
    try {
      setIsLoading(true);
      const authService = getAuthService();
      const response = await authService.register({ email, password });

      if (response?.data) {
        const userData: AuthUser = {
          userId: response.data.userId,
          token: response.data.token,
        };

        setUser(userData);
        setToken(response.data.token);

        await platformStorage.setItem(TOKEN_KEY, response.data.token);
        await platformStorage.setItem(SESSION_KEY, JSON.stringify(userData));
      }
    } catch (error) {
      console.error("Error al registrar:", error);
      if (error instanceof Error) {
        showAlert("Error", error.message);
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  async function logout() {
    try {
      setUser(null);
      setToken(null);
      await platformStorage.removeItem(SESSION_KEY);
      await platformStorage.removeItem(TOKEN_KEY);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      throw new Error("No se pudo cerrar sesión");
    }
  }

  return (
    <AuthContext.Provider
      value={{ user, token, login, register, logout, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
}
