@echo off
echo Generando APK con EAS Build...
echo.
echo Este proceso requiere una cuenta en Expo y conexión a internet.
echo El APK se construirá en la nube y podrás descargarlo después.
echo.
echo Iniciando el proceso...
echo.

REM Asegurarse de que EAS CLI está instalado
call npm install -g eas-cli

REM Iniciar sesión en EAS (si no lo has hecho antes)
echo Por favor, inicia sesión en tu cuenta de Expo cuando se te solicite:
call eas login

REM Construir el APK
echo.
echo Iniciando la construcción del APK...
call eas build --platform android --profile preview --non-interactive

echo.
echo El proceso de construcción ha comenzado en la nube.
echo Recibirás un enlace para descargar el APK cuando esté listo.
echo.
echo Puedes verificar el estado de tu build en: https://expo.dev/accounts/[tu-cuenta]/projects/erp-mobile/builds
echo.
pause
