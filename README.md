# kai.zen - Aplicación de Gestión de Tareas

Una aplicación moderna de gestión de tareas (To-Do List) desarrollada con React Native y Expo, que implementa autenticación, gestión de estado con Context API, y funcionalidades avanzadas como geolocalización y adjuntar imágenes.

## 📋 Tabla de Contenidos

- [Stack Tecnológico](#-stack-tecnológico)
- [Arquitectura del Proyecto](#-arquitectura-del-proyecto)
- [Estructura de Carpetas](#-estructura-de-carpetas)
- [Flujo de Datos](#-flujo-de-datos)
- [Componentes Principales](#-componentes-principales)
- [Instalación y Uso](#-instalación-y-uso)
- [Funcionalidades](#-funcionalidades)

## 🚀 Stack Tecnológico

### React Native

React Native es el framework base que permite escribir aplicaciones móviles nativas usando JavaScript y React. En este proyecto:

- **Versión**: 0.81.5
- **React**: 19.1.0
- Se utiliza para renderizar componentes nativos de iOS y Android
- Proporciona APIs nativas como `Image`, `FlatList`, `TextInput`, etc.

### Expo

Expo es una plataforma que envuelve React Native y proporciona herramientas y servicios adicionales:

- **Versión SDK**: ~54.0.25
- **Expo Router**: Sistema de navegación basado en archivos (file-based routing)
- **Ventajas**:
  - Configuración simplificada sin necesidad de Xcode o Android Studio
  - Acceso a APIs nativas a través de paquetes expo (camera, location, etc.)
  - Hot reload y desarrollo rápido
  - Soporte para web, iOS y Android desde un solo código base

### TypeScript

El proyecto está completamente tipado con TypeScript para mejor seguridad de tipos y experiencia de desarrollo.

## 🏗️ Arquitectura del Proyecto

### Patrón de Diseño

El proyecto sigue una arquitectura basada en **React Context API** para la gestión de estado global, con los siguientes principios:

1. **Separación de Responsabilidades**:

   - Componentes de UI (`src/components`)
   - Lógica de negocio (`src/contexts`, `src/services`)
   - Navegación (`app/`)

2. **File-based Routing con Expo Router**:

   - La estructura de carpetas en `app/` define automáticamente las rutas
   - Grupos de rutas con `(auth)` y `(tabs)`
   - Layout compartidos con `_layout.tsx`

3. **Gestión de Estado**:
   - **Context API**: Para estado compartido entre componentes
   - **useReducer**: Para lógica compleja de actualización de estado (tareas)
   - **Custom Hooks**: Para encapsular lógica reutilizable

## 📁 Estructura de Carpetas

```
to-do-list-v3/
│
├── app/                          # Sistema de navegación (Expo Router)
│   ├── (auth)/                   # Grupo de rutas de autenticación
│   │   ├── login.tsx            # Pantalla de inicio de sesión
│   │   └── register.tsx         # Pantalla de registro
│   │
│   ├── (tabs)/                   # Grupo de rutas con tab navigation
│   │   ├── index.tsx            # Pantalla principal (lista de tareas)
│   │   ├── settings.tsx         # Pantalla de ajustes
│   │   └── _layout.tsx          # Layout de las tabs (Bottom Navigation)
│   │
│   └── _layout.tsx              # Layout raíz (Providers globales)
│
├── src/                          # Código fuente de la aplicación
│   ├── components/              # Componentes reutilizables
│   │   ├── Button.tsx
│   │   ├── EmptyState.tsx       # Componente para estados vacíos
│   │   ├── FilterButton.tsx     # Botones de filtro
│   │   ├── FloatingButton.tsx   # FAB para agregar tareas
│   │   ├── Header.tsx           # Encabezado de la app
│   │   ├── SearchBar.tsx        # Barra de búsqueda
│   │   ├── SegmentedControl.tsx # Control segmentado (tabs)
│   │   ├── StatusFilter.tsx     # Filtro por estado de tarea
│   │   ├── TaskFormModal.tsx    # Modal para crear/editar tareas
│   │   └── TaskItem.tsx         # Card individual de tarea
│   │
│   ├── constants/               # Constantes de la aplicación
│   │   ├── colors.ts           # Paleta de colores
│   │   ├── config.ts           # Configuración del backend (API URL)
│   │   └── theme.ts            # Sistema de diseño (spacing, font sizes)
│   │
│   ├── contexts/                # Contextos de React (Estado global)
│   │   ├── AuthContext.tsx     # Gestión de autenticación con JWT
│   │   ├── TodoContext.tsx     # Gestión de tareas con backend
│   │   └── TodoReducer.ts      # Reducer para acciones de tareas
│   │
│   ├── hooks/                   # Custom hooks
│   │   ├── useAuth.ts          # Hook para acceder al contexto de auth
│   │   └── useTodos.ts         # Hook para acceder al contexto de todos
│   │
│   ├── services/                # Servicios de API y utilidades
│   │   ├── auth-service.ts     # API: login y registro con JWT
│   │   ├── todos-service.ts    # API: CRUD de tareas en el backend
│   │   └── platformStorage.ts  # Storage multiplataforma (web/mobile)
│   │
│   └── utils/                   # Utilidades
│       ├── alert.ts            # Alertas multiplataforma (web/mobile)
│       └── validators.ts       # Funciones de validación
│
├── assets/                      # Recursos estáticos (imágenes, fuentes)
├── package.json                 # Dependencias y scripts
├── app.json                     # Configuración de Expo
└── tsconfig.json               # Configuración de TypeScript
```

## 🔄 Flujo de Datos

### 1. Autenticación (AuthContext)

```
Usuario ingresa credenciales
        ↓
  getAuthService().login() [src/services/auth-service.ts]
        ↓
  POST /auth/login al backend con axios
        ↓
  Recibe JWT token del servidor
        ↓
  login() actualiza AuthContext
        ↓
  Guarda token en AsyncStorage/localStorage
        ↓
  Router redirige a (tabs)/
```

**Implementación**:

```typescript
// AuthContext proporciona:
interface AuthContextType {
  user: AuthUser | null; // { userId, token }
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}
```

### 2. Gestión de Tareas (TodoContext + Reducer)

```
Usuario crea una tarea
        ↓
  createTodo() [TodoContext]
        ↓
  getTodosService(token).createTodo() [src/services/todos-service.ts]
        ↓
  POST /todos al backend con JWT token
        ↓
  Recibe tarea creada con _id del servidor
        ↓
  dispatch({ type: "ADD_TODO", payload: todo })
        ↓
  todoReducer actualiza estado
        ↓
  UI se re-renderiza automáticamente
```

**Reducer Pattern**:

```typescript
// Acciones disponibles:
type TodoAction =
  | { type: "SET_TODOS"; payload: Todo[] }
  | { type: "ADD_TODO"; payload: Todo }
  | { type: "UPDATE_TODO"; payload: Todo }
  | { type: "DELETE_TODO"; payload: string };
```

### 3. Navegación con Expo Router

Expo Router utiliza el sistema de archivos para definir rutas automáticamente:

```
app/
├── _layout.tsx              → Provider raíz
├── (auth)/
│   ├── login.tsx           → /login
│   └── register.tsx        → /register
└── (tabs)/
    ├── _layout.tsx         → Bottom tabs layout
    ├── index.tsx           → / (Inicio)
    └── settings.tsx        → /settings
```

**Protección de rutas**:

```typescript
// En (tabs)/_layout.tsx
if (!user) return <Redirect href="/(auth)/login" />;
```

## 🧩 Componentes Principales

### TaskItem.tsx

**Responsabilidad**: Renderizar una tarjeta individual de tarea

**Características**:

- Muestra imagen adjunta (si existe)
- Muestra ubicación con ícono (si existe)
- Botones de cambio de estado (pending, in-progress, completed)
- Botón de eliminar

```typescript
<TaskItem
  item={todo}                              // Datos de la tarea
  onChangeStatus={(status) => {...}}       // Callback cambio de estado
  onDelete={() => {...}}                   // Callback eliminar
/>
```

### TaskFormModal.tsx

**Responsabilidad**: Modal para crear nuevas tareas con formulario completo

**Funcionalidades**:

- Input de texto para descripción
- Selector de imagen (expo-image-picker)
- Captura automática de ubicación (expo-location)
- Validación de campos

### TodoContext

**Responsabilidad**: Proveer estado global de tareas a toda la aplicación

**Características**:

- Estado en memoria con `useReducer`
- Persistencia automática en `AsyncStorage`
- Carga inicial desde almacenamiento local
- Exporta `dispatch` para modificar estado

## 📦 Instalación y Uso

### Prerrequisitos

- Node.js (v16 o superior)
- npm o yarn
- Expo CLI (opcional, se instala automáticamente)

### Instalación

```bash
# 1. Clonar el repositorio
git clone <url-del-repositorio>
cd to-do-list-v3

# 2. Instalar dependencias
npm install

# 3. Iniciar el servidor de desarrollo
npm start
```

### Scripts disponibles

```bash
npm start          # Inicia Expo Dev Server
npm run android    # Ejecuta en emulador/dispositivo Android
npm run ios        # Ejecuta en simulador/dispositivo iOS
npm run web        # Ejecuta en navegador web
npm run lint       # Ejecuta ESLint
```

### Desarrollo

1. Escanea el QR con la app **Expo Go** (iOS/Android)
2. O presiona `w` para abrir en navegador web
3. Hot reload está habilitado automáticamente

## ✨ Funcionalidades

### Implementadas

- ✅ **Autenticación simulada** con persistencia
- ✅ **CRUD de tareas** (Crear, Leer, Actualizar, Eliminar)
- ✅ **Estados de tarea**: Pendiente, En progreso, Completado
- ✅ **Filtrado por estado** (Kanban-style)
- ✅ **Búsqueda de tareas** por texto
- ✅ **Adjuntar imágenes** a tareas
- ✅ **Geolocalización automática** al crear tareas
- ✅ **Persistencia local** multiplataforma (localStorage en web, AsyncStorage en móvil)
- ✅ **Alertas multiplataforma** (window.alert en web, Alert.alert en móvil)
- ✅ **UI/UX moderna** con tema oscuro
- ✅ **Navegación file-based** con Expo Router
- ✅ **Safe Area handling** para notches y bordes redondeados
- ✅ **Compatibilidad web completa** con adaptadores específicos

### Detalles Técnicos

#### Persistencia de Datos

La aplicación utiliza un sistema de almacenamiento multiplataforma:

```typescript
// platformStorage.ts - Adaptador multiplataforma
// En web: usa localStorage
// En móvil: usa AsyncStorage

STORAGE_KEY_SESSION = "SESSION"; // Sesión de usuario
STORAGE_KEY_USERS = "USERS"; // Base de datos de usuarios
STORAGE_KEY_TODOS = "todos"; // Array de tareas
```

#### Generación de IDs

Se utiliza `uuid` con polyfill `react-native-get-random-values` para generar IDs únicos:

```typescript
import { v4 as uuidv4 } from "uuid";
const newTodo = { id: uuidv4(), ... };
```

#### Geolocalización

```typescript
// Se solicita permiso y captura ubicación al crear tarea
const { status } = await Location.requestForegroundPermissionsAsync();
const location = await Location.getCurrentPositionAsync({});
```

## 🎨 Sistema de Diseño

El proyecto utiliza un sistema de diseño centralizado en `src/constants/theme.ts`:

```typescript
export const COLORS = {
  background: "#1F1D2B",
  card: "#252836",
  primary: "#8B5CF6",
  secondary: "#A78BFA",
  // ...
};

export const SPACING = {
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
};
```

## 🔐 Autenticación

La aplicación implementa autenticación JWT completa con el backend:

### Backend API

- **URL Base**: `https://todo-list.dobleb.cl`
- **Documentación**: [https://todo-list.dobleb.cl/docs](https://todo-list.dobleb.cl/docs)
- **OpenAPI Schema**: [https://todo-list.dobleb.cl/openapi.json](https://todo-list.dobleb.cl/openapi.json)

### Flujo de Autenticación

1. **Registro** (`POST /auth/register`):

   ```json
   {
     "email": "user@example.com",
     "password": "password123"
   }
   ```

   Respuesta: `{ "success": true, "data": { "token": "jwt...", "userId": "..." } }`

2. **Login** (`POST /auth/login`):

   ```json
   {
     "email": "user@example.com",
     "password": "password123"
   }
   ```

   Respuesta: `{ "success": true, "data": { "token": "jwt...", "userId": "..." } }`

3. **Persistencia del Token**:
   - El JWT token se guarda en AsyncStorage (móvil) o localStorage (web)
   - Se incluye automáticamente en el header `Authorization: Bearer <token>` en todas las peticiones subsecuentes

### Servicios de Autenticación

```typescript
// src/services/auth-service.ts
export default function getAuthService() {
  const apiClient = axios.create({
    baseURL: API_URL,
  });

  async function login(payload: LoginPayload): Promise<LoginResponse>;
  async function register(payload: RegisterPayload): Promise<RegisterResponse>;
}
```

## 🌐 Integración con Backend

### Configuración de la API

```typescript
// src/constants/config.ts
export const API_URL =
  process.env.EXPO_PUBLIC_API_URL || "https://todo-list.dobleb.cl";
```

Para cambiar la URL del backend, crea un archivo `.env`:

```bash
EXPO_PUBLIC_API_URL=https://todo-list.dobleb.cl
```

### Endpoints Disponibles

#### Autenticación

- `POST /auth/register` - Registrar nuevo usuario
- `POST /auth/login` - Iniciar sesión

#### Todos (requieren autenticación)

- `GET /todos` - Listar todas las tareas del usuario
- `POST /todos` - Crear nueva tarea
- `GET /todos/{id}` - Obtener tarea específica
- `PUT /todos/{id}` - Actualizar tarea completa
- `PATCH /todos/{id}` - Actualizar campos específicos de tarea
- `DELETE /todos/{id}` - Eliminar tarea

#### Imágenes (requieren autenticación)

- `POST /images` - Subir imagen (multipart/form-data, máx 5MB)
- `GET /images/{userId}/{imageId}` - Descargar imagen
- `DELETE /images/{userId}/{imageId}` - Eliminar imagen

### Estructura de una Tarea (Todo)

```typescript
interface Todo {
  id: string; // ID único generado por MongoDB
  title: string; // Descripción de la tarea
  completed: boolean; // Estado de completado
  photoUri?: string; // URL de imagen en Cloudflare R2
  location?: {
    // Ubicación opcional
    latitude: number;
    longitude: number;
  };
  userId: string; // ID del usuario propietario
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
}
```

### Servicios de API

#### TodosService

```typescript
// src/services/todos-service.ts
export default function getTodosService(token: string) {
  const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  async function getTodos(): Promise<Todo[]>;
  async function getTodoById(id: string): Promise<Todo>;
  async function createTodo(payload: CreateTodoPayload): Promise<Todo>;
  async function updateTodo(
    id: string,
    payload: UpdateTodoPayload
  ): Promise<Todo>;
  async function patchTodo(
    id: string,
    payload: Partial<UpdateTodoPayload>
  ): Promise<Todo>;
  async function deleteTodo(id: string): Promise<void>;
}
```

#### ImagesService

```typescript
// src/services/images-service.ts
export default function getImagesService(token: string) {
  const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  async function uploadImage(
    imageUri: string,
    fileName?: string
  ): Promise<string>;
  async function deleteImage(userId: string, imageId: string): Promise<void>;
}
```

### Manejo de Errores

La aplicación maneja automáticamente los siguientes casos:

- **401 Unauthorized**: Sesión expirada, redirige al login
- **404 Not Found**: Recurso no encontrado
- **400 Bad Request**: Validación fallida (ej: título vacío)
- **413 Payload Too Large**: Imagen muy grande (máx 5MB)
- **Network Errors**: Muestra mensaje de error de conexión

```typescript
// Ejemplo de manejo de errores en TodoContext
try {
  await todosService.createTodo(payload);
} catch (error) {
  if (error.message?.includes("Sesión expirada")) {
    logout(); // Redirige al login
  }
  showAlert("Error", error.message);
}
```

### Subida de Imágenes

Flujo completo de subida de imagen con tarea:

1. Usuario selecciona imagen con `expo-image-picker`
2. Se obtiene URI local (`file://...`)
3. Al crear tarea, si hay imagen local:
   - Primero se sube la imagen a `/images` con multipart/form-data
   - Se recibe URL permanente de Cloudflare R2
   - Luego se crea la tarea con `photoUri` apuntando a la URL permanente
4. Si falla subida de imagen, se crea tarea sin imagen

```typescript
// src/contexts/TodoContext.tsx
if (payload.photoUri && payload.photoUri.startsWith("file://")) {
  const imagesService = getImagesService(token);
  const uploadedImageUrl = await imagesService.uploadImage(payload.photoUri);
  finalPayload.photoUri = uploadedImageUrl; // URL permanente
}
```

### Formatos de Respuesta

Todas las respuestas del backend siguen el formato:

```typescript
// Éxito
{
  "success": true,
  "data": { /* datos */ }
}

// Error
{
  "success": false,
  "error": "Mensaje de error"
}

// Lista con conteo
{
  "success": true,
  "data": [ /* items */ ],
  "count": 5
}
```

## 🌐 Compatibilidad Web

La aplicación incluye adaptadores específicos para funcionar correctamente en navegadores web:

### PlatformStorage

```typescript
// src/services/platformStorage.ts
// Detecta automáticamente la plataforma y usa el almacenamiento apropiado
- Web: localStorage
- iOS/Android: AsyncStorage
```

### Alertas Multiplataforma

```typescript
// src/utils/alert.ts
// Adapta las alertas según la plataforma
- Web: window.alert / window.confirm
- iOS/Android: Alert.alert nativo
```

### Consideraciones Web

- ✅ Todas las funcionalidades de móvil están disponibles en web
- ✅ La interfaz es completamente responsive
- ✅ Los datos persisten entre sesiones
- ⚠️ Geolocalización y cámara requieren permisos del navegador

## 🛠️ Tecnologías y Librerías Clave

| Librería                                    | Propósito                |
| ------------------------------------------- | ------------------------ |
| `expo-router`                               | Navegación file-based    |
| `@react-native-async-storage/async-storage` | Persistencia local       |
| `expo-image-picker`                         | Selector de imágenes     |
| `expo-location`                             | Geolocalización          |
| `react-native-safe-area-context`            | Manejo de safe areas     |
| `uuid`                                      | Generación de IDs únicos |
| `@expo/vector-icons`                        | Iconos (Ionicons)        |

## 📱 Compatibilidad

- ✅ **iOS**: Soporte completo con safe areas y gestos nativos
- ✅ **Android**: Soporte completo con material design
- ✅ **Web**: Soporte completo con adaptadores multiplataforma
  - localStorage para persistencia
  - window.alert/confirm para alertas
  - Funcionalidad completa de la app

## 🤝 Contribuciones

Este es un proyecto educativo. Las contribuciones son bienvenidas.

## 📄 Licencia

MIT

---

**Desarrollado con ❤️ usando React Native + Expo**
