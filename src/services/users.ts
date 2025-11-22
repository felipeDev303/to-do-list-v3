import AsyncStorage from "@react-native-async-storage/async-storage";

const USERS_KEY = "USERS";

export type User = {
  id: string;
  email: string;
  password: string; // ⚠️ En producción debería estar hasheada
};

// ✅ Manejo de errores agregado
export async function getUsers(): Promise<User[]> {
  try {
    const data = await AsyncStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    return [];
  }
}

// ✅ Manejo de errores agregado
export async function saveUsers(users: User[]): Promise<void> {
  try {
    await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch (error) {
    console.error("Error al guardar usuarios:", error);
    throw new Error("No se pudo guardar el usuario");
  }
}

// ✅ Validación de email mejorada
export async function registerUser(email: string, password: string) {
  // Validar formato de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error("Email inválido");
  }

  // Validar longitud de contraseña
  if (password.length < 6) {
    throw new Error("La contraseña debe tener al menos 6 caracteres");
  }

  const users = await getUsers();

  const exists = users.some(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  );
  if (exists) throw new Error("El usuario ya existe");

  const newUser: User = {
    id: Date.now().toString(),
    email: email.toLowerCase(), // ✅ Normalizar email
    password, // ⚠️ Debería hashearse
  };

  const updated = [...users, newUser];
  await saveUsers(updated);

  // ✅ No retornar password
  const { password: _, ...userWithoutPassword } = newUser;
  return userWithoutPassword as Omit<User, "password">;
}

// ✅ Login normalizado
export async function loginUser(email: string, password: string) {
  const users = await getUsers();

  const user = users.find(
    (u) =>
      u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );

  if (!user) throw new Error("Credenciales incorrectas");

  // ✅ No retornar password
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword as Omit<User, "password">;
}
