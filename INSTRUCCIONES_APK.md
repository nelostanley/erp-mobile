# Pasos para generar un APK de la aplicación ERP Mobile

## Requisitos previos:
1. **JDK (Java Development Kit)** - Versión 11 o superior
   - Descargar de: [https://adoptium.net/](https://adoptium.net/)
   - Instalar y configurar la variable JAVA_HOME

2. **Android SDK**
   - Opción 1: Instalar Android Studio
   - Opción 2: Instalar solo el SDK

## Pasos para generar el APK:

### 1. Instalar Java JDK
- Descargar e instalar JDK de https://adoptium.net/
- Configurar JAVA_HOME en las variables de entorno:
  - Variable: JAVA_HOME
  - Valor: C:\Program Files\Eclipse Adoptium\jdk-11.x.x (o donde hayas instalado el JDK)
  - Agregar a PATH: %JAVA_HOME%\bin

### 2. Instalar Android Studio o solo Android SDK
- Android Studio: https://developer.android.com/studio
- Solo el SDK: https://developer.android.com/studio#command-line-tools-only

### 3. Configurar variables de entorno para Android SDK
- Variable: ANDROID_HOME
- Valor: C:\Users\TU_USUARIO\AppData\Local\Android\Sdk (o donde hayas instalado el SDK)
- Agregar a PATH: 
  - %ANDROID_HOME%\platform-tools
  - %ANDROID_HOME%\tools
  - %ANDROID_HOME%\tools\bin

### 4. Aceptar las licencias de Android
Ejecutar en línea de comandos:
```
sdkmanager --licenses
```
(Aceptar todas las licencias)

### 5. Configurar el proyecto para build nativo
```
cd e:\Proyectos\erp-mobile
npx expo prebuild
```

### 6. Generar el APK
```
cd e:\Proyectos\erp-mobile\android
./gradlew assembleRelease
```

### 7. Ubicación del APK generado
El APK estará disponible en:
```
e:\Proyectos\erp-mobile\android\app\build\outputs\apk\release\app-release.apk
```

## Alternativas:

### Opción 1: Usar un servicio de build en la nube
Puedes usar EAS Build (Expo Application Services) para generar el APK sin necesidad de configurar el entorno localmente:

1. Crear una cuenta en Expo
2. Instalar EAS CLI: `npm install -g eas-cli`
3. Iniciar sesión: `eas login`
4. Configurar: `eas build:configure`
5. Ejecutar build: `eas build --platform android --profile preview`

### Opción 2: Generar un APK con un servicio online
Existen servicios como Appetize.io que pueden ayudarte a compilar y probar aplicaciones en la nube.
