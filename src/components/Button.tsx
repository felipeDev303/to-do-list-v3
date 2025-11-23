import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import { colors } from "../constants/colors";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default function Button({
  title,
  onPress,
  variant = "primary",
  disabled = false,
  loading = false,
  icon,
  style,
  textStyle,
}: ButtonProps) {
  const buttonStyle = [
    styles.button,
    styles[variant],
    disabled && styles.disabled,
    style,
  ];

  const textStyleCombined = [
    styles.text,
    styles[`${variant}Text` as keyof typeof styles],
    disabled && styles.disabledText,
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === "primary" ? colors.textInverse : colors.primary}
          size="small"
        />
      ) : (
        <>
          {icon}
          <Text style={textStyleCombined}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
  },
  primary: {
    backgroundColor: colors.primary,
  },
  primaryText: {
    color: colors.textInverse,
  },
  secondary: {
    backgroundColor: colors.secondary,
  },
  secondaryText: {
    color: colors.textInverse,
  },
  outline: {
    backgroundColor: colors.transparent,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  outlineText: {
    color: colors.primary,
  },
  ghost: {
    backgroundColor: colors.transparent,
  },
  ghostText: {
    color: colors.primary,
  },
  disabled: {
    backgroundColor: colors.disabled,
    borderColor: colors.disabled,
  },
  disabledText: {
    color: colors.disabledText,
  },
});
