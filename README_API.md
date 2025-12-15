# To-Do List v3 - React Native + Expo

Aplicación móvil de lista de tareas desarrollada con React Native, Expo, TypeScript y conexión completa a backend REST API.

## 🚀 Características

- ✅ **Autenticación completa** con JWT
  - Registro de usuarios
  - Inicio de sesión
  - Persistencia de sesión con AsyncStorage
  - Protección de rutas autenticadas
- 📝 **CRUD completo de tareas** conectado al backend
  - Crear tareas con título, imagen y ubicación
  - Listar todas las tareas del usuario
  - Marcar como completada/pendiente
  - Eliminar tareas
  - Búsqueda y filtrado
  - Pull to refresh
- 🎨 **UI moderna**
  - Tema oscuro
  - Componentes reutilizables
  - Animaciones suaves
  - Diseño responsive

## 🛠️ Tecnologías

- **React Native** + **Expo**
- **TypeScript**
- **Expo Router** (navegación)
- **Context API** (gestión de estado)
- **Axios** (peticiones HTTP)
- **AsyncStorage** (persistencia local)

## 📦 Instalación

```bash
# Instalar dependencias
npm install

# Iniciar en modo desarrollo
npx expo start
```

## 🔧 Configuración

La URL de la API se configura en:

- `constants/config.ts`
- Por defecto: `https://basic-hono-api.borisbelmarm.workers.dev`

## 📁 Estructura del Proyecto

```
├── app/                      # Rutas de Expo Router
│   ├── (auth)/              # Pantallas de autenticación
│   │   ├── login.tsx
│   │   └── register.tsx
│   ├── (tabs)/              # Pantallas principales (tabs)
│   │   ├── index.tsx        # Home / Lista de tareas
│   │   └── settings.tsx     # Configuración
│   └── _layout.tsx          # Layout raíz con protección de rutas
│
├── services/                 # Servicios de API
│   ├── auth-service.ts      # Autenticación (login, register)
│   └── todos-service.ts     # CRUD de tareas
│
├── src/
│   ├── components/          # Componentes reutilizables
│   │   ├── TaskItem.tsx     # Item de tarea
│   │   ├── TaskFormModal.tsx # Modal para crear tarea
│   │   ├── Header.tsx
│   │   ├── SearchBar.tsx
│   │   └── ...
│   │
│   ├── contexts/            # Context API
│   │   ├── AuthContext.tsx  # Contexto de autenticación
│   │   ├── TodoContext.tsx  # Contexto de tareas
│   │   └── TodoReducer.ts   # Reducer de tareas
│   │
│   ├── hooks/               # Custom hooks
│   │   ├── useAuth.ts
│   │   └── useTodos.ts
│   │
│   ├── services/            # Servicios auxiliares
│   │   ├── platformStorage.ts # AsyncStorage wrapper
│   │   └── ...
│   │
│   ├── constants/           # Constantes
│   │   ├── theme.ts         # Tema y colores
│   │   └── config.ts        # Configuración
│   │
│   └── utils/               # Utilidades
│       ├── alert.ts         # Alertas
│       └── validators.ts    # Validadores
│
└── errors/
    └── ServiceError.ts      # Clase de error personalizada
```

## 🔐 Autenticación

### Registro

```typescript
const { register } = useAuth();
await register(email, password);
```

### Login

```typescript
const { login } = useAuth();
await login(email, password);
```

### Logout

```typescript
const { logout } = useAuth();
await logout();
```

### Estado de autenticación

```typescript
const { user, token, isLoading } = useAuth();
```

## 📝 Gestión de Tareas

### Crear tarea

```typescript
const { createTodo } = useTodos();
await createTodo({
  title: "Mi tarea",
  imageUrl: "https://...", // Opcional
  location: {
    // Opcional
    latitude: 0,
    longitude: 0,
    address: "...",
  },
});
```

### Listar tareas

```typescript
const { todos, fetchTodos } = useTodos();
await fetchTodos();
```

### Marcar como completada

```typescript
const { toggleCompleted } = useTodos();
await toggleCompleted(todoId, newCompletedState);
```

### Eliminar tarea

```typescript
const { deleteTodo } = useTodos();
await deleteTodo(todoId);
```

## 🌐 API Endpoints Utilizados

### Autenticación

- `POST /auth/register` - Registrar usuario
- `POST /auth/login` - Iniciar sesión

### Tareas (requieren token JWT)

- `GET /todos` - Listar todas las tareas del usuario
- `POST /todos` - Crear nueva tarea
- `GET /todos/:id` - Obtener tarea específica
- `PUT /todos/:id` - Actualizar tarea completa
- `PATCH /todos/:id` - Actualizar parcialmente (ej: completed)
- `DELETE /todos/:id` - Eliminar tarea

## 🔒 Protección de Rutas

La aplicación implementa protección de rutas mediante:

1. **Layout raíz** (`app/_layout.tsx`):

   - Verifica si hay usuario autenticado
   - Redirige a `/login` si no hay sesión
   - Muestra loading mientras verifica

2. **Layout de auth** (`app/(auth)/_layout.tsx`):

   - Redirige a `/tabs` si ya está autenticado

3. **Persistencia**:
   - El token JWT se guarda en AsyncStorage
   - Se restaura automáticamente al abrir la app
   - Se elimina al cerrar sesión

## 📱 Flujo de Usuario

1. Usuario abre la app
2. Si no está autenticado → Pantalla de login
3. Usuario se registra o inicia sesión
4. Token se guarda localmente
5. Usuario accede a la lista de tareas
6. Todas las operaciones requieren el token
7. Al cerrar sesión, se elimina el token

## 🎯 Características Pendientes (Opcionales)

- [ ] Subida de imágenes al servidor (multipart/form-data)
- [ ] Edición de tareas existentes
- [ ] Filtros avanzados
- [ ] Ordenamiento personalizado
- [ ] Notificaciones push
- [ ] Modo offline con sincronización

## 🐛 Solución de Problemas

### Error de conexión

- Verificar que la URL del backend es correcta
- Verificar conexión a internet
- Revisar logs del servidor

### Token expirado

- La app detecta automáticamente tokens expirados
- Se muestra un alert y redirige a login
- El usuario debe iniciar sesión nuevamente

### Error al crear tareas

- Verificar que el token es válido
- El título es obligatorio
- Verificar formato de datos

## 📄 Licencia

MIT

## 👨‍💻 Autor

Desarrollado como proyecto educativo de React Native + Backend REST API
