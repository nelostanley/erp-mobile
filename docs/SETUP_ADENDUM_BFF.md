# ADENDA A LA GUÍA DE INSTALACIÓN DEL BFF (SETUP_ADENDUM_BFF.md)

**Propósito:** Este documento detalla los ajustes y correcciones necesarias que no estaban especificadas en la guía `SETUP_LOCAL_BFF.md` original para lograr una implementación funcional del proyecto `erp-system`.

---

### **1. Ajustes en Dependencias (`package.json`)**

* **Observación:** La instalación de dependencias con `npm install` falló debido a conflictos de versiones entre eslint@9.24.0 y @typescript-eslint/parser@7.0.0.
* **Acción Realizada:** Se ejecutó `npm install --legacy-peer-deps` para forzar la instalación ignorando conflictos de peer dependencies.

---

### **2. Correcciones en el Código Fuente**

* **Observación:** El archivo `schema.prisma` contenía una configuración incompatible con Windows, ya que especificaba una ruta absoluta a un directorio de Linux para la generación del cliente Prisma.
* **Acción Realizada:** Se modificó la configuración del generador client en `prisma/schema.prisma` para usar una ruta relativa:
  ```prisma
  generator client {
      provider = "prisma-client-js"
      binaryTargets = ["native", "linux-musl-arm64-openssl-3.0.x"]
      // Usar ruta relativa para compatibilidad entre sistemas operativos
      output = "../node_modules/.prisma/client"
  }
  ```

---

### **3. Pasos Adicionales en la Configuración del Entorno**

* **Observación:** La guía especificaba usar Node.js v18.0+ pero no mencionaba posibles problemas de compatibilidad con versiones más recientes de Node.js.
* **Acción Realizada:** Fue necesario asegurar la compatibilidad con Node.js v22.17.1 a través de cambios en la generación del cliente Prisma. Al cambiar la ruta de salida del cliente Prisma, se resolvió el error "@prisma/client did not initialize yet".

* **Observación:** El archivo `.env` proporcionado contenía una cadena de conexión a una base de datos remota en lugar de la base de datos local especificada en las instrucciones.
* **Acción Realizada:** Fue necesario modificar manualmente el archivo `.env` para asegurar que la variable DATABASE_URL apuntara correctamente a la base de datos local:
  ```
  DATABASE_URL="postgresql://postgres:1234567@localhost:5432/erp_b2b_mobile_local"
  ```

---

### **4. Ambigüedades Aclaradas en la Guía Original**

* **Observación:** La sección 5.1 (Verificación Funcional) no especificaba qué herramienta utilizar para realizar las pruebas en Windows, donde `curl` no está disponible por defecto.
* **Acción Realizada:** Se utilizó el navegador web para verificar directamente la respuesta del servidor en `http://localhost:3000` y los endpoints de la API.

* **Observación:** La guía no especificaba cómo verificar o resolver problemas cuando la generación del cliente Prisma fallaba debido a diferencias en la estructura de directorios entre entornos Linux y Windows.
* **Acción Realizada:** Se identificó el problema en la ruta de salida del cliente Prisma y se modificó el esquema para usar una ruta relativa en lugar de absoluta.

* **Observación:** La guía no proporcionaba información sobre qué hacer si ya existía una versión más reciente de Node.js instalada en el sistema.
* **Acción Realizada:** Se utilizó la versión de Node.js existente (v22.17.1) con los ajustes necesarios en Prisma en lugar de instalar una versión específica (v18.x) como sugería la guía.

---

### **5. Recomendaciones Adicionales**

* Para entornos Windows, se recomienda utilizar herramientas como nvm-windows para gestionar múltiples versiones de Node.js si se necesita mantener compatibilidad con distintos proyectos.

* En caso de problemas de inicialización con Prisma Client, verificar siempre la ruta de salida en el esquema Prisma y considerar usar rutas relativas para mejorar la compatibilidad entre diferentes sistemas operativos.

* Si se encuentran errores durante la ejecución del seed, considerar examinar los scripts para verificar posibles problemas relacionados con paths específicos del sistema operativo.
