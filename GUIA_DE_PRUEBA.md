# Guía de Prueba para la Aplicación ERP Mobile

## Conexión al Servidor BFF

La aplicación está configurada para conectarse al servidor BFF en la siguiente dirección:
- URL del BFF: `http://192.168.68.200:3000`

Esta configuración se encuentra en el archivo `src/services/api.ts`.

## Opciones para Probar la Aplicación

Tienes varias opciones para probar la aplicación:

### 1. Utilizar Expo Go

Si bien mencionaste problemas con Expo Go, esta es la forma más sencilla de probar la aplicación:

```bash
# Instalar las dependencias (si no lo has hecho)
npm install

# Iniciar la aplicación
npx expo start
```

Luego escanea el código QR con la aplicación Expo Go en tu dispositivo móvil.

### 2. Generar un APK en la Nube (Recomendado)

Esta es la opción más sencilla sin requerimientos locales adicionales:

1. Ejecuta el script `build-apk-cloud.bat`:
```bash
.\build-apk-cloud.bat
```

2. Inicia sesión en tu cuenta de Expo cuando se te solicite.
3. Espera a que se complete la construcción (puede tomar varios minutos).
4. Descarga el APK desde el enlace proporcionado.
5. Instala el APK en tu dispositivo Android.

### 3. Generar un APK con Docker (Local)

Si tienes Docker instalado:

1. Asegúrate de que Docker Desktop esté instalado y ejecutándose.
2. Ejecuta el script `build-apk-docker.bat`:
```bash
.\build-apk-docker.bat
```

3. Inicia sesión en tu cuenta de Expo cuando se te solicite.
4. Espera a que se complete la construcción local.
5. Instala el APK generado en tu dispositivo Android.

### 4. Compilación Nativa (Requiere JDK y Android SDK)

Si prefieres una compilación completamente nativa:

1. Instala Java JDK y Android SDK según las instrucciones en `INSTRUCCIONES_APK.md`.
2. Ejecuta los siguientes comandos:
```bash
# Preparar el proyecto para compilación nativa
npx expo prebuild

# Navegar al directorio de Android
cd android

# Generar el APK
./gradlew assembleRelease
```

3. El APK estará disponible en `android/app/build/outputs/apk/release/app-release.apk`.

## Verificación de la Conexión

Para verificar que la aplicación puede conectarse correctamente al servidor BFF:

1. Asegúrate de que el servidor BFF esté funcionando en `192.168.68.200:3000`.
2. Intenta iniciar sesión en la aplicación.
3. Si hay problemas de conexión, verifica:
   - La configuración de red (firewall, VPN)
   - Que el dispositivo esté en la misma red que el servidor
   - Que la URL del servidor en `src/services/api.ts` sea correcta

## Problemas Comunes y Soluciones

### Error de CORS al probar en navegador web

Si estás probando en un navegador web y encuentras errores CORS:

1. Ejecuta el servidor proxy incluido:
```bash
node proxy-server.js
```

2. Modifica temporalmente `src/services/api.ts` para usar:
```typescript
const BASE_URL = 'http://localhost:3001/api';
```

### Error de Conexión en Dispositivo

Si tu dispositivo no puede conectarse al servidor:

1. Verifica que el dispositivo esté en la misma red Wi-Fi que el servidor.
2. Comprueba que el servidor acepte conexiones externas (no solo localhost).
3. Verifica que no haya firewall bloqueando la conexión.

### Problemas con la Compilación del APK

Si tienes problemas al compilar el APK:

1. Intenta primero la opción de nube (build-apk-cloud.bat), que es la más sencilla.
2. Si usas Docker, asegúrate de que Docker Desktop esté en ejecución.
3. Para compilación nativa, verifica que JAVA_HOME y ANDROID_HOME estén correctamente configurados.
