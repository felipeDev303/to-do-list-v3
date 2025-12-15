import ServiceError from "@/errors/ServiceError";
import axios, { isAxiosError } from "axios";
import { API_URL } from "../constants/config";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  data: {
    token: string;
    userId?: string;
  };
}

export interface RegisterResponse {
  success: boolean;
  data: {
    token: string;
    userId?: string;
  };
}

export interface RegisterPayload {
  email: string;
  password: string;
}

export default function getAuthService() {
  console.log("🔧 Auth Service - URL:", `${API_URL}/auth`);
  const apiClient = axios.create({
    baseURL: API_URL,
  });

  async function login(payload: LoginPayload) {
    try {
      console.log("🔑 Login - URL completa:", `${API_URL}/auth/login`);
      const response = await apiClient.post("/auth/login", payload);
      return response.data as LoginResponse;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        if (error.response.status === 401) {
          throw new ServiceError("Correo o contraseña incorrectos");
        } else {
          throw new ServiceError(
            `Error de inicio de sesión con estado ${error.response.status}`
          );
        }
      }
      throw new ServiceError("Error de conexión al servidor");
    }
  }

  async function register(payload: RegisterPayload) {
    try {
      console.log("🔐 Register - URL completa:", `${API_URL}/auth/register`);
      const response = await apiClient.post("/auth/register", payload);
      return response.data as RegisterResponse;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        if (error.response.status === 409) {
          throw new ServiceError("El correo ya está registrado");
        } else {
          throw new ServiceError(
            `Error de registro con estado ${error.response.status}`
          );
        }
      }
      throw new ServiceError("Error de conexión al servidor");
    }
  }

  return {
    login,
    register,
  };
}
