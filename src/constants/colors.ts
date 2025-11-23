// Colores del sistema de diseño
export const colors = {
  // Colores principales
  primary: "#007AFF",
  secondary: "#5AC8FA",
  success: "#32CD32",
  warning: "#FFD700",
  error: "#FF3B30",
  info: "#4169E1",

  // Colores de texto
  textPrimary: "#000000",
  textSecondary: "#8E8E93",
  textTertiary: "#C7C7CC",
  textInverse: "#FFFFFF",

  // Colores de fondo
  backgroundPrimary: "#FFFFFF",
  backgroundSecondary: "#F2F2F7",
  backgroundTertiary: "#E5E5EA",

  // Colores de estado de tareas
  statusPending: "#FFD700",
  statusInProgress: "#4169E1",
  statusCompleted: "#32CD32",

  // Colores de UI
  border: "#E5E5EA",
  disabled: "#E5E5EA",
  disabledText: "#8E8E93",
  placeholder: "#8E8E93",

  // Colores transparentes
  transparent: "transparent",
} as const;

// Type helper para autocompletado
export type Color = keyof typeof colors;
