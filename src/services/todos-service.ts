import ServiceError from "@/errors/ServiceError";
import axios, { isAxiosError } from "axios";
import { API_URL } from "../constants/config";

export interface TodoLocation {
  latitude: number;
  longitude: number;
  address?: string;
}

export interface Todo {
  _id: string;
  title: string;
  completed: boolean;
  imageUrl?: string;
  location?: TodoLocation;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTodoPayload {
  title: string;
  imageUrl?: string;
  location?: TodoLocation;
}

export interface UpdateTodoPayload {
  title?: string;
  completed?: boolean;
  imageUrl?: string;
  location?: TodoLocation;
}

export interface TodosResponse {
  success: boolean;
  data: Todo[];
}

export interface TodoResponse {
  success: boolean;
  data: Todo;
}

export default function getTodosService(token: string) {
  const apiClient = axios.create({
    baseURL: `${API_URL}/todos`,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  async function getTodos() {
    try {
      const response = await apiClient.get<TodosResponse>("/");
      return response.data.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        if (error.response.status === 401) {
          throw new ServiceError(
            "Sesión expirada. Por favor, inicia sesión nuevamente"
          );
        } else {
          throw new ServiceError(
            `Error al obtener las tareas: ${error.response.status}`
          );
        }
      }
      throw new ServiceError("Error de conexión al servidor");
    }
  }

  async function getTodoById(id: string) {
    try {
      const response = await apiClient.get<TodoResponse>(`/${id}`);
      return response.data.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        if (error.response.status === 404) {
          throw new ServiceError("Tarea no encontrada");
        } else if (error.response.status === 401) {
          throw new ServiceError(
            "Sesión expirada. Por favor, inicia sesión nuevamente"
          );
        } else {
          throw new ServiceError(
            `Error al obtener la tarea: ${error.response.status}`
          );
        }
      }
      throw new ServiceError("Error de conexión al servidor");
    }
  }

  async function createTodo(payload: CreateTodoPayload) {
    try {
      const response = await apiClient.post<TodoResponse>("/", payload);
      return response.data.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        if (error.response.status === 401) {
          throw new ServiceError(
            "Sesión expirada. Por favor, inicia sesión nuevamente"
          );
        } else if (error.response.status === 400) {
          throw new ServiceError("Datos inválidos. El título es requerido");
        } else {
          throw new ServiceError(
            `Error al crear la tarea: ${error.response.status}`
          );
        }
      }
      throw new ServiceError("Error de conexión al servidor");
    }
  }

  async function updateTodo(id: string, payload: UpdateTodoPayload) {
    try {
      const response = await apiClient.put<TodoResponse>(`/${id}`, payload);
      return response.data.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        if (error.response.status === 404) {
          throw new ServiceError("Tarea no encontrada");
        } else if (error.response.status === 401) {
          throw new ServiceError(
            "Sesión expirada. Por favor, inicia sesión nuevamente"
          );
        } else {
          throw new ServiceError(
            `Error al actualizar la tarea: ${error.response.status}`
          );
        }
      }
      throw new ServiceError("Error de conexión al servidor");
    }
  }

  async function patchTodo(id: string, payload: Partial<UpdateTodoPayload>) {
    try {
      const response = await apiClient.patch<TodoResponse>(`/${id}`, payload);
      return response.data.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        if (error.response.status === 404) {
          throw new ServiceError("Tarea no encontrada");
        } else if (error.response.status === 401) {
          throw new ServiceError(
            "Sesión expirada. Por favor, inicia sesión nuevamente"
          );
        } else {
          throw new ServiceError(
            `Error al actualizar la tarea: ${error.response.status}`
          );
        }
      }
      throw new ServiceError("Error de conexión al servidor");
    }
  }

  async function deleteTodo(id: string) {
    try {
      await apiClient.delete(`/${id}`);
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        if (error.response.status === 404) {
          throw new ServiceError("Tarea no encontrada");
        } else if (error.response.status === 401) {
          throw new ServiceError(
            "Sesión expirada. Por favor, inicia sesión nuevamente"
          );
        } else {
          throw new ServiceError(
            `Error al eliminar la tarea: ${error.response.status}`
          );
        }
      }
      throw new ServiceError("Error de conexión al servidor");
    }
  }

  return {
    getTodos,
    getTodoById,
    createTodo,
    updateTodo,
    patchTodo,
    deleteTodo,
  };
}
