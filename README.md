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

**Nota**: La autenticación es simulada para propósitos de demostración.

- Cualquier email es válido
- Password debe tener mínimo 6 caracteres
- Los usuarios se persisten en almacenamiento multiplataforma (localStorage en web, AsyncStorage en móvil)
- No hay backend real

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
