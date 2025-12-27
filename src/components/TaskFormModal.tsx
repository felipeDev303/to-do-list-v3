import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { COLORS, FONT_SIZE, SPACING } from "../constants/theme";
import { TodoLocation } from "../contexts/TodoReducer";
import { showAlert } from "../utils/alert";

interface Props {
  visible: boolean;
  onClose: () => void;
  onSubmit: (text: string, imageUri?: string, location?: TodoLocation) => void;
}

export default function TaskFormModal({ visible, onClose, onSubmit }: Props) {
  const [text, setText] = useState("");
  const [image, setImage] = useState<string | undefined>(undefined);
  const [location, setLocation] = useState<TodoLocation | undefined>(undefined);
  const [loadingLocation, setLoadingLocation] = useState(false);

  useEffect(() => {
    if (visible) {
      // Cuando se abre el modal, reiniciamos el estado
      setText("");
      setImage(undefined);
      setLocation(undefined);
    }
  }, [visible]);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      showAlert("Permiso denegado", "Necesitamos acceso a tu galería.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      showAlert("Permiso denegado", "Necesitamos acceso a tu cámara.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const getLocation = async () => {
    setLoadingLocation(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        showAlert("Permiso denegado", "Necesitamos acceso a tu ubicación.");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});

      // Reverse geocoding to get address (optional)
      let address = "Ubicación actual";
      try {
        const reverseGeocode = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
        if (reverseGeocode.length > 0) {
          const item = reverseGeocode[0];
          address = `${item.street || ""} ${item.streetNumber || ""}, ${
            item.city || ""
          }`;
        }
      } catch (e) {
        console.log("Error reverse geocoding", e);
      }

      setLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        address: address.trim() || "Ubicación detectada",
      });
    } catch (error) {
      showAlert("Error", "No pudimos obtener tu ubicación.");
    } finally {
      setLoadingLocation(false);
    }
  };

  const handleSubmit = () => {
    if (!text.trim()) {
      showAlert("Error", "El título es obligatorio.");
      return;
    }
    onSubmit(text, image, location);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Nueva Tarea</Text>

          <TextInput
            style={styles.input}
            placeholder="¿Qué necesitas hacer?"
            placeholderTextColor={COLORS.textSecondary}
            value={text}
            onChangeText={setText}
            autoFocus
          />

          <View style={styles.actionsContainer}>
            {/* Image Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Adjuntar Imagen</Text>
              <View style={styles.row}>
                <TouchableOpacity style={styles.iconButton} onPress={pickImage}>
                  <Ionicons
                    name="images-outline"
                    size={24}
                    color={COLORS.primary}
                  />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton} onPress={takePhoto}>
                  <Ionicons
                    name="camera-outline"
                    size={24}
                    color={COLORS.primary}
                  />
                </TouchableOpacity>
              </View>
              {image && (
                <View style={styles.previewContainer}>
                  <Image source={{ uri: image }} style={styles.previewImage} />
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => setImage(undefined)}
                  >
                    <Ionicons
                      name="close-circle"
                      size={24}
                      color={COLORS.accent}
                    />
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* Location Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Ubicación</Text>
              <TouchableOpacity
                style={styles.locationButton}
                onPress={getLocation}
                disabled={loadingLocation}
              >
                {loadingLocation ? (
                  <ActivityIndicator size="small" color={COLORS.primary} />
                ) : (
                  <Ionicons
                    name={location ? "location" : "location-outline"}
                    size={24}
                    color={location ? COLORS.primary : COLORS.textSecondary}
                  />
                )}
                <Text
                  style={[
                    styles.locationText,
                    location && styles.locationTextActive,
                  ]}
                >
                  {location ? location.address : "Agregar ubicación"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
            >
              <Text style={styles.submitText}>Guardar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  container: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: SPACING.l,
    minHeight: "60%",
  },
  title: {
    fontSize: FONT_SIZE.xl,
    fontWeight: "bold",
    color: COLORS.white,
    marginBottom: SPACING.l,
    textAlign: "center",
  },
  input: {
    backgroundColor: COLORS.inputBackground,
    padding: SPACING.m,
    borderRadius: 12,
    fontSize: FONT_SIZE.l,
    color: COLORS.white,
    marginBottom: SPACING.l,
  },
  actionsContainer: {
    gap: SPACING.l,
    marginBottom: SPACING.xl,
  },
  section: {
    gap: SPACING.s,
  },
  sectionTitle: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.s,
    fontWeight: "600",
  },
  row: {
    flexDirection: "row",
    gap: SPACING.m,
  },
  iconButton: {
    backgroundColor: COLORS.card,
    padding: SPACING.m,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  previewContainer: {
    marginTop: SPACING.s,
    position: "relative",
  },
  previewImage: {
    width: "100%",
    height: 150,
    borderRadius: 12,
  },
  removeButton: {
    position: "absolute",
    top: -10,
    right: -10,
    backgroundColor: COLORS.background,
    borderRadius: 12,
  },
  locationButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    padding: SPACING.m,
    borderRadius: 12,
    gap: SPACING.s,
  },
  locationText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.m,
    flex: 1,
  },
  locationTextActive: {
    color: COLORS.white,
  },
  footer: {
    flexDirection: "row",
    gap: SPACING.m,
    marginTop: "auto",
  },
  cancelButton: {
    flex: 1,
    padding: SPACING.m,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.card,
    alignItems: "center",
  },
  cancelText: {
    color: COLORS.textSecondary,
    fontWeight: "600",
  },
  submitButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    padding: SPACING.m,
    borderRadius: 12,
    alignItems: "center",
  },
  submitText: {
    color: COLORS.white,
    fontWeight: "600",
  },
});
