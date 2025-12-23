# Examen Final

## 🧠 **Objetivo de la evaluación**

Evaluar la capacidad del estudiante para desarrollar una aplicación móvil profesional utilizando **React Native con Expo**, integrando correctamente:

- **TypeScript**
- **Expo Router**
- **Gestión de estado**
- **Consumo de API REST**
- **Autenticación con persistencia del token**
- **CRUD completo de tareas utilizando únicamente un backend**
- **Uso de APIs nativas**
- **Encapsulación de lógica mediante Custom Hooks**

El examen evalúa tanto el dominio práctico como la capacidad de **explicar técnicamente** las decisiones de implementación.

Trabajo en grupos de **3 a 4 personas**, con un repositorio por grupo y **commits de al menos 2 integrantes**.

---

## ⚙️ **Requerimientos técnicos generales**

- ❌ No se permite persistencia local de tareas
- ✅ El **token** debe persistirse en **AsyncStorage**
- ✅ Toda la data de tareas debe provenir del **backend**
- ✅ Backend obligatorio del examen

---

## 🔗 **Backend obligatorio**

👉 [**https://todo-list.dobleb.cl/docs**](https://todo-list.dobleb.cl/docs)

---

## 🔐 **1. Autenticación contra el backend**

El login debe:

- Enviar credenciales al backend.
- Guardar el token en `AsyncStorage`.
- Proteger rutas si el token no existe o es inválido.
- Manejar errores HTTP (401, 403, 500).

---

## 📝 **2. Todo List 100% conectado al backend**

Las tareas **no se guardan localmente**.

| Acción | Requisito |
| --- | --- |
| Listar | GET backend |
| Crear | POST backend |
| Actualizar | PATCH / PUT |
| Eliminar | DELETE |

**Restricciones:**

- Tareas asociadas al usuario autenticado.
- Solo se muestran tareas del usuario.

---

## 🖼️ **3. Manejo de imágenes (OBLIGATORIO)**

- Captura desde el dispositivo (**API nativa**).
- Subida usando **POST `/images`** (Swagger).
- Asociar la imagen a una tarea.
- Mostrar la **URL retornada por el backend**.

---

## 🧩 **4. Uso obligatorio de Custom Hooks**

La lógica del Todo List debe estar encapsulada en **custom hooks** (ej. `useTodos`):

- Obtener tareas
- Crear / eliminar
- Cambiar estado
- Manejo de `loading` y `error`

❌ No se permite lógica de negocio directamente en las vistas.

---

## 🌱 **5. Variables de entorno**

Ejemplo:

```ENV
EXPO_PUBLIC_API_URL=https://todo-list.dobleb.cl
```

---

# 📦 **Entregables**

### Repositorio

- Código funcional
- Sin `node_modules`
- README.md con:
  - Descripción del proyecto
  - Integrantes y roles
  - Uso de IA (obligatorio)
  - Instrucciones de ejecución

---

---

### Video de preguntas teóricas y demostrativo (OBLIGATORIO)

Las **preguntas se responden exclusivamente en video.**

📌 **Cada integrante debe responder al menos una pregunta**, explicando **con código en pantalla**.

### ❓ Preguntas

1. **¿Qué es un estado en React y cómo funciona?**

    → Demostrar con `useState` en la app.

2. **¿Qué significa que la aplicación sea nativa?**

    → Demostrar el uso de una **API nativa** (cámara, filesystem, ubicación, etc.).

3. **¿Qué es un servicio REST y cómo nos autenticamos a él?**

    → Mostrar el servicio de autenticación y uso del token.

4. **¿Cómo funcionan los hooks en React y cómo se crea un custom hook?**

    → Explicar y mostrar el custom hook del Todo List.

⚠️ **No se aceptan respuestas escritas a estas preguntas.**

---

### 4️⃣ Archivo `.txt` en EVA

Ejemplo:

```
Nombre: Juan Pérez
Repositorio: https://github.com/juanperez/app-reactnative-expo
Fecha: 20/12/2025
```

---

## 🧪 **Rúbrica de evaluación**

| Criterio | Puntos |
| --- | --- |
| Autenticación y manejo de token | 1.0 |
| Video demostrativo + preguntas | 4.0 |
| Custom hooks + arquitectura | **1.0** |
| Integración backend (CRUD completo) | **0.5** |
| Repositorio + README | **0.5** |

**Total: 7.0 puntos**

---

## 📅 **Formato y entrega**

- **Entrega:** Archivo `.txt` en EVA
- **Plazo:** 26 **de diciembre de 2025**
- **Evaluación:**
  - Video (funcional + teórico)
  - Código
  - Integración real con API

---

## 💬 **Recomendaciones del docente**

- No usar AsyncStorage para tareas.
- Separar `/services` y `/hooks`.
- Manejar estados `loading` y `error`.
- Probar endpoints en **Swagger** o **Bruno**.
- El video debe mostrar **código real**, no solo la app corriendo.
