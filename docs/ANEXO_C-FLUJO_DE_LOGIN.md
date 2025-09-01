# **ANEXO C: FLUJO DE LOGIN**

**Directiva:** Implemente el siguiente flujo de autenticación y configuración de sesión de forma exacta. Es el proceso más crítico de la aplicación.

---

### **Diagrama de Flujo Lógico**

El flujo de autenticación sigue una secuencia de pasos obligatoria para verificar la identidad del cliente y configurar su entorno de trabajo.

```mermaid
graph TD
    A([INICIO]) --> B{Pantalla de Pre-Login: Pide Email};
    B -- Usuario introduce Email y presiona "Continuar" --> C[Llamada a API: POST /api/auth/mobile/pre-login];
    C -- Éxito 200 OK --> D{Pantalla de Configuración y Login};
    C -- Fallo 404 Not Found --> E[Muestra Error: "Email no registrado"];
    E --> B;

    D -- 1. Muestra datos del cliente --> F[Pide seleccionar Sucursal];
    F -- 2. Llama a GET /api/sucursales --> G[Pide seleccionar Almacén];
    G -- 3. Llama a GET /api/almacenes?sucursalId=... --> H[Pide Contraseña (teléfono)];
    H -- 4. Usuario presiona "Iniciar Sesión" --> I[Llamada a API: POST /api/auth/mobile/login];
    
    I -- Éxito 200 OK --> J[Guarda Tokens y Contexto];
    J --> K([Navega a Pantalla Principal]);
    K --> Z([FIN]);

    I -- Fallo 401 Unauthorized --> L[Muestra Error: "Contraseña incorrecta"];
    L --> D;
```

---

### **Detalles de Implementación**

#### **Paso 1: Verificación de Identidad**
*   **Pantalla Inicial:** La primera pantalla de la aplicación debe contener un único campo de texto para el `Email` y un botón "Continuar".
*   **Lógica:** Al presionar "Continuar", la aplicación realiza una llamada a `POST /api/auth/mobile/pre-login`.
*   **Condición:** La transición a la siguiente pantalla solo puede ocurrir si la respuesta de la API es exitosa (HTTP `200 OK`). En caso de error (HTTP `404 Not Found`), se debe mostrar un mensaje de error no invasivo (ej. un "toast") indicando que el email no fue encontrado.

#### **Paso 2: Configuración del Entorno de Trabajo**
*   **Pantalla de Configuración:** Al recibir una respuesta exitosa del pre-login, la aplicación debe navegar a una segunda pantalla.
*   **UI y Estado:**
    1.  Mostrar los datos del cliente (nombre, dirección, etc.) devueltos por la API de forma **no editable**. Esto sirve como confirmación visual para el usuario.
    2.  Presentar un componente `Picker` o `Select` para "Seleccionar Sucursal". Este debe poblarse con los datos de `GET /api/sucursales`.
    3.  Presentar un segundo `Picker` para "Seleccionar Almacén". Este debe permanecer **deshabilitado** hasta que se haya seleccionado una sucursal.
    4.  Una vez seleccionada una sucursal, el `Picker` de almacén se habilita y se puebla con los datos de `GET /api/almacenes?sucursalId={id_seleccionado}`.
    5.  El campo de "Contraseña" y el botón "Iniciar Sesión" deben permanecer **deshabilitados** hasta que tanto la sucursal como el almacén hayan sido seleccionados.

#### **Paso 3: Login Final**
*   **Credenciales:** La contraseña que el usuario debe introducir es su número de teléfono, tal como está registrado en el sistema.
*   **Lógica del BFF:** El Backend-For-Frontend es responsable de:
    1.  Buscar al cliente por su email.
    2.  Usar la librería `bcryptjs` para comparar la contraseña en texto plano (el teléfono) enviada desde la app con el hash almacenado en el campo `password` de la base de datos.
    3.  Si la comparación es exitosa, generar un `accessToken` y un `refreshToken`.

#### **Paso 4: Persistencia de la Sesión**
*   **Almacenamiento:** Tras un login exitoso, la aplicación móvil debe ejecutar las siguientes acciones:
    1.  Guardar el `refreshToken` de forma persistente y segura usando `AsyncStorage`.
    2.  Guardar los `sucursalId` y `almacenId` seleccionados en `AsyncStorage`.
    3.  Guardar el `accessToken` en el estado global de Zustand para su uso inmediato.
*   **Re-autenticación Silenciosa:** En inicios posteriores de la aplicación, el código debe:
    1.  Verificar la existencia del `refreshToken` y el contexto de trabajo en `AsyncStorage`.
    2.  Si existen, realizar una llamada a `POST /api/auth/mobile/refresh` para obtener un nuevo `accessToken`.
    3.  Si la llamada es exitosa, poblar el estado de Zustand y navegar al usuario directamente a la pantalla principal, **saltando todo el flujo de login**.
    4.  Si la llamada falla (ej. el refresh token ha expirado), se debe limpiar el almacenamiento y redirigir al usuario al inicio del flujo de login normal.