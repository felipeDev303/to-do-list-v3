import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

/**
 * Cross-platform storage wrapper
 * Uses localStorage for web and AsyncStorage for mobile
 */
class PlatformStorage {
  async getItem(key: string): Promise<string | null> {
    if (Platform.OS === "web") {
      try {
        return localStorage.getItem(key);
      } catch (error) {
        console.error("Error getting item from localStorage:", error);
        return null;
      }
    }
    return AsyncStorage.getItem(key);
  }

  async setItem(key: string, value: string): Promise<void> {
    if (Platform.OS === "web") {
      try {
        localStorage.setItem(key, value);
      } catch (error) {
        console.error("Error setting item in localStorage:", error);
        throw error;
      }
    } else {
      await AsyncStorage.setItem(key, value);
    }
  }

  async removeItem(key: string): Promise<void> {
    if (Platform.OS === "web") {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.error("Error removing item from localStorage:", error);
        throw error;
      }
    } else {
      await AsyncStorage.removeItem(key);
    }
  }

  async clear(): Promise<void> {
    if (Platform.OS === "web") {
      try {
        localStorage.clear();
      } catch (error) {
        console.error("Error clearing localStorage:", error);
        throw error;
      }
    } else {
      await AsyncStorage.clear();
    }
  }
}

export default new PlatformStorage();
