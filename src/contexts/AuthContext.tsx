import { createContext, useCallback, useEffect, useState } from "react";
import getAuthService from "../services/auth-service";
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
    console.log("🔄 Cargando sesión...");
    try {
      const savedToken = await platformStorage.getItem(TOKEN_KEY);
      const savedUser = await platformStorage.getItem(SESSION_KEY);

      console.log("📦 Token guardado:", savedToken ? "Existe" : "No existe");
      console.log("📦 Usuario guardado:", savedUser ? "Existe" : "No existe");

      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
        console.log("✅ Sesión restaurada");
      } else {
        console.log("❌ No hay sesión guardada");
      }
    } catch (error) {
      console.error("❌ Error al cargar sesión:", error);
      try {
        await platformStorage.removeItem(SESSION_KEY);
        await platformStorage.removeItem(TOKEN_KEY);
      } catch (e) {
        console.error("Error limpiando storage:", e);
      }
    } finally {
      console.log("✅ Loading completado, isLoading = false");
      setIsLoading(false);
    }
  }

  const login = useCallback(async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const authService = getAuthService();
      const response = await authService.login({ email, password });

      if (response?.data) {
        // Extraer userId del token JWT si no viene en la respuesta
        let userId = response.data.userId;
        if (!userId && response.data.token) {
          try {
            const tokenPayload = JSON.parse(
              atob(response.data.token.split(".")[1])
            );
            userId = tokenPayload.userId || tokenPayload.sub || tokenPayload.id;
          } catch (e) {
            console.error("Error al decodificar token:", e);
            userId = "unknown";
          }
        }

        const userData: AuthUser = {
          userId: userId || "unknown",
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
  }, []);

  const register = useCallback(async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const authService = getAuthService();
      const response = await authService.register({ email, password });

      if (response?.data) {
        // Extraer userId del token JWT si no viene en la respuesta
        let userId = response.data.userId;
        if (!userId && response.data.token) {
          try {
            const tokenPayload = JSON.parse(
              atob(response.data.token.split(".")[1])
            );
            userId = tokenPayload.userId || tokenPayload.sub || tokenPayload.id;
          } catch (e) {
            console.error("Error al decodificar token:", e);
            userId = "unknown";
          }
        }

        const userData: AuthUser = {
          userId: userId || "unknown",
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
  }, []);

  const logout = useCallback(async () => {
    try {
      setUser(null);
      setToken(null);
      await platformStorage.removeItem(SESSION_KEY);
      await platformStorage.removeItem(TOKEN_KEY);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      throw new Error("No se pudo cerrar sesión");
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, token, login, register, logout, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
}
