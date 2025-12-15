# ✅ Verificación de Requisitos - Todo List App

## Estado de Implementación

### 1. ✅ Autenticación contra el backend

**Backend URL:** `https://todo-list.dobleb.cl`

#### ✅ Endpoints implementados:

- `POST /auth/login` - Inicio de sesión
- `POST /auth/register` - Registro de usuarios

#### ✅ Funcionalidades:

- ✅ Envío de credenciales al backend
- ✅ Token JWT guardado en **AsyncStorage** (mobile) / **localStorage** (web)
- ✅ Extracción automática de `userId` del token JWT
- ✅ Protección de rutas en [app/\_layout.tsx](app/_layout.tsx):
  - Redirect automático a login si no hay token
  - Loading screen durante verificación de sesión
- ✅ Manejo de errores de API:
  - 401: Credenciales incorrectas
  - 409: Usuario ya existe
  - Errores de conexión

**Archivos clave:**

- [src/services/auth-service.ts](src/services/auth-service.ts)
- [src/contexts/AuthContext.tsx](src/contexts/AuthContext.tsx)
- [src/services/platformStorage.ts](src/services/platformStorage.ts)

---

### 2. ✅ Todo List 100% conectado al backend

**Todas las operaciones interactúan con el backend. NO hay persistencia local.**

| Acción                  | Estado | Endpoint            | Método         |
| ----------------------- | ------ | ------------------- | -------------- |
| **Listar tareas**       | ✅     | `GET /todos`        | `getTodos()`   |
| **Crear tarea**         | ✅     | `POST /todos`       | `createTodo()` |
| **Marcar completada**   | ✅     | `PATCH /todos/:id`  | `patchTodo()`  |
| **Actualizar completo** | ✅     | `PUT /todos/:id`    | `updateTodo()` |
| **Eliminar tarea**      | ✅     | `DELETE /todos/:id` | `deleteTodo()` |

#### ✅ Restricciones cumplidas:

- Las tareas están asociadas al usuario autenticado
- El token JWT se envía en header `Authorization: Bearer <token>`
- El backend filtra automáticamente por usuario

#### ✅ Manejo de errores:

- 401: Sesión expirada → Logout automático
- 404: Tarea no encontrada
- 400: Datos inválidos

**Archivos clave:**

- [src/services/todos-service.ts](src/services/todos-service.ts)
- [src/contexts/TodoContext.tsx](src/contexts/TodoContext.tsx)
- [app/(tabs)/index.tsx](<app/(tabs)/index.tsx>)

---

### 3. ✅ Manejo de imágenes (IMPLEMENTADO)

#### ✅ Funcionalidades:

- ✅ Captura desde cámara (`expo-image-picker`)
- ✅ Selección desde galería
- ✅ Subida automática al backend con **multipart/form-data**
- ✅ URL devuelta por el servidor se guarda en la tarea
- ✅ Preview de imagen en lista de tareas

#### 📤 Flujo de subida de imágenes:

```typescript
// 1. Usuario captura/selecciona imagen → URI local (file://)
const imageUri = "file:///path/to/image.jpg";

// 2. Al crear tarea, se sube primero la imagen
const imagesService = getImagesService(token);
const uploadedUrl = await imagesService.uploadImage(imageUri);
// → Retorna: "https://todo-list.dobleb.cl/images/userId/imageId"

// 3. Se crea la tarea con la URL del servidor
await todosService.createTodo({
  title: "Mi tarea",
  imageUrl: uploadedUrl, // URL del servidor
});
```

**Endpoints implementados:**

- `POST /images` - Subir imagen
- `GET /images/:userId/:imageId` - Descargar imagen
- `DELETE /images/:userId/:imageId` - Eliminar imagen

**Archivos clave:**

- [src/services/images-service.ts](src/services/images-service.ts) ← **NUEVO**
- [src/components/TaskFormModal.tsx](src/components/TaskFormModal.tsx)
- [src/contexts/TodoContext.tsx](src/contexts/TodoContext.tsx)

---

### 4. ✅ Variables de entorno

#### ✅ Configuración:

**Archivos:**

- [.env.local](.env.local) ← Configuración actual
- [.env.example](.env.example) ← Template

**Contenido:**

```env
EXPO_PUBLIC_API_URL=https://todo-list.dobleb.cl
```

**Uso en código:**

```typescript
// src/constants/config.ts
export const API_URL =
  process.env.EXPO_PUBLIC_API_URL || "https://todo-list.dobleb.cl";
```

---

## 🎯 Resumen de Cumplimiento

| Requisito            | Estado | Detalles                                  |
| -------------------- | ------ | ----------------------------------------- |
| Autenticación JWT    | ✅     | Login, register, token en AsyncStorage    |
| Protección de rutas  | ✅     | Redirect automático sin token             |
| Listar tareas        | ✅     | GET /todos con token                      |
| Crear tarea          | ✅     | POST /todos con título, imagen, ubicación |
| Marcar completada    | ✅     | PATCH /todos/:id                          |
| Eliminar tarea       | ✅     | DELETE /todos/:id                         |
| Subida de imágenes   | ✅     | multipart/form-data a /images             |
| Variables de entorno | ✅     | EXPO_PUBLIC_API_URL configurada           |
| Tareas por usuario   | ✅     | Backend filtra con JWT                    |
| Manejo de errores    | ✅     | 401, 404, 400, etc.                       |

---

## 🚀 Estructura de Servicios

```
src/services/
├── auth-service.ts      # Login, register
├── todos-service.ts     # CRUD de tareas
├── images-service.ts    # Subida/eliminación de imágenes
└── platformStorage.ts   # AsyncStorage/localStorage
```

---

## 🔐 Flujo de Autenticación

```
1. Usuario ingresa email/password
   ↓
2. POST /auth/login → Backend valida
   ↓
3. Backend retorna { token: "jwt..." }
   ↓
4. App decodifica JWT para extraer userId
   ↓
5. Guarda { userId, token } en AsyncStorage
   ↓
6. Redirect a (tabs)/
   ↓
7. Todas las peticiones usan: Authorization: Bearer <token>
```

---

## 📝 Notas de Implementación

### Decodificación de JWT

Si el backend no retorna `userId` explícitamente, la app lo extrae del token:

```typescript
const tokenPayload = JSON.parse(atob(token.split(".")[1]));
const userId = tokenPayload.userId || tokenPayload.sub || tokenPayload.id;
```

### Manejo de sesión expirada

Cuando el backend retorna 401, la app:

1. Muestra alerta "Sesión expirada"
2. Ejecuta `logout()` automáticamente
3. Limpia AsyncStorage
4. Redirect a login

### Subida de imágenes

- Solo se suben imágenes con URI local (`file://`)
- Si `imageUrl` ya es una URL del servidor, se usa directamente
- Manejo de errores: 413 (imagen muy grande), 400 (formato inválido)

---

## 🧪 Testing Recomendado

1. **Login/Register:**

   - Credenciales inválidas
   - Usuario ya existe
   - Token persistente tras reiniciar app

2. **CRUD Tareas:**

   - Crear con/sin imagen
   - Crear con/sin ubicación
   - Marcar completada
   - Eliminar tarea

3. **Manejo de errores:**

   - Sesión expirada (simular 401)
   - Sin conexión
   - Imágenes grandes

4. **Protección de rutas:**
   - Acceso directo a /tabs sin login
   - Logout y redirect automático

---

## 📚 Documentación del Backend

👉 https://todo-list.dobleb.cl/docs

**OpenAPI:** https://todo-list.dobleb.cl/openapi.json
