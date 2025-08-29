#!/bin/bash

# Este script ayuda a generar un APK para la aplicación ERP Mobile usando EAS Build local
# Se necesita tener instalado Docker para usar esta opción

echo "Generando APK para la aplicación ERP Mobile..."
echo ""

# 1. Asegurarse de que el proyecto está configurado para build
cd "$(dirname "$0")" # Navegar al directorio del script
npx expo install expo-dev-client

# 2. Configurar el proyecto para build local
echo "Configurando proyecto para build local..."
npx expo prebuild

# 3. Generar el APK usando EAS Build local
echo "Generando APK con EAS Build local..."
npx eas-cli build --platform android --local

echo ""
echo "Si el build es exitoso, el APK estará disponible en el directorio especificado por EAS Build."
echo ""
echo "Nota: Si ocurre algún error, asegúrate de tener Docker instalado y ejecutándose."
