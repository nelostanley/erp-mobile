@echo off
echo Generando APK con EAS Build localmente (Docker)...
echo.
echo Este proceso utiliza Docker para construir el APK sin necesidad de instalar JDK o Android SDK.
echo Asegúrate de tener Docker Desktop instalado y en ejecución antes de continuar.
echo.
echo Iniciando el proceso...
echo.

REM Verificar si Docker está instalado
docker --version > nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Docker no está instalado o no está en ejecución.
    echo Por favor, instala Docker Desktop desde https://www.docker.com/products/docker-desktop
    echo y asegúrate de que está en ejecución antes de ejecutar este script.
    echo.
    pause
    exit /b 1
)

REM Asegurarse de que EAS CLI está instalado
call npm install -g eas-cli

REM Iniciar sesión en EAS (si no lo has hecho antes)
echo Por favor, inicia sesión en tu cuenta de Expo cuando se te solicite:
call eas login

REM Construir el APK localmente usando Docker
echo.
echo Iniciando la construcción local del APK...
call eas build --platform android --profile preview --local

echo.
echo Si la construcción fue exitosa, el APK estará disponible en la ruta indicada arriba.
echo.
pause
