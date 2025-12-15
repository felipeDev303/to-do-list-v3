import ServiceError from "@/errors/ServiceError";
import axios, { isAxiosError } from "axios";
import { API_URL } from "../constants/config";

export interface ImageUploadResponse {
  success: boolean;
  data: {
    imageUrl: string;
    imageId: string;
  };
}

export default function getImagesService(token: string) {
  const apiClient = axios.create({
    baseURL: `${API_URL}/images`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  /**
   * Sube una imagen al backend usando multipart/form-data
   * @param imageUri - URI local de la imagen (file:// o content://)
   * @param fileName - Nombre del archivo (opcional)
   * @returns URL de la imagen subida
   */
  async function uploadImage(
    imageUri: string,
    fileName?: string
  ): Promise<string> {
    try {
      const formData = new FormData();

      // Crear el objeto de archivo para React Native
      const file: any = {
        uri: imageUri,
        type: "image/jpeg", // Asumimos JPEG, podría detectarse del URI
        name: fileName || `image-${Date.now()}.jpg`,
      };

      formData.append("image", file);

      const response = await apiClient.post<ImageUploadResponse>(
        "/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data.data.imageUrl;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        if (error.response.status === 401) {
          throw new ServiceError(
            "Sesión expirada. Por favor, inicia sesión nuevamente"
          );
        } else if (error.response.status === 400) {
          throw new ServiceError("Imagen inválida o formato no soportado");
        } else if (error.response.status === 413) {
          throw new ServiceError("La imagen es demasiado grande");
        } else {
          throw new ServiceError(
            `Error al subir imagen: ${error.response.status}`
          );
        }
      }
      throw new ServiceError("Error de conexión al servidor");
    }
  }

  /**
   * Elimina una imagen del backend
   * @param userId - ID del usuario propietario
   * @param imageId - ID de la imagen a eliminar
   */
  async function deleteImage(userId: string, imageId: string): Promise<void> {
    try {
      await apiClient.delete(`/${userId}/${imageId}`);
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        if (error.response.status === 404) {
          throw new ServiceError("Imagen no encontrada");
        } else if (error.response.status === 401) {
          throw new ServiceError(
            "Sesión expirada. Por favor, inicia sesión nuevamente"
          );
        } else {
          throw new ServiceError(
            `Error al eliminar imagen: ${error.response.status}`
          );
        }
      }
      throw new ServiceError("Error de conexión al servidor");
    }
  }

  return {
    uploadImage,
    deleteImage,
  };
}
