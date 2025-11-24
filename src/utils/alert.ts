import { Alert, Platform } from "react-native";

/**
 * Cross-platform alert wrapper
 * Uses window.alert for web and Alert.alert for mobile
 */
export const showAlert = (
  title: string,
  message?: string,
  buttons?: Array<{
    text: string;
    onPress?: () => void;
    style?: "default" | "cancel" | "destructive";
  }>
) => {
  if (Platform.OS === "web") {
    // En web, usar window.alert y confirm
    const fullMessage = message ? `${title}\n\n${message}` : title;
    
    if (buttons && buttons.length > 1) {
      // Si hay múltiples botones, usar confirm
      const result = window.confirm(fullMessage);
      if (result && buttons[0].onPress) {
        buttons[0].onPress();
      } else if (!result && buttons[1]?.onPress) {
        buttons[1].onPress();
      }
    } else {
      // Solo un botón o ninguno
      window.alert(fullMessage);
      if (buttons && buttons[0]?.onPress) {
        buttons[0].onPress();
      }
    }
  } else {
    // En móvil, usar Alert.alert nativo
    Alert.alert(title, message, buttons as any);
  }
};
