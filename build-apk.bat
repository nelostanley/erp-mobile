@echo off
echo Generando APK para la aplicación ERP Mobile...
echo.

cd e:\Proyectos\erp-mobile\android

echo Ejecutando Gradle para generar APK...
echo.

call ./gradlew assembleRelease

echo.
if %ERRORLEVEL% NEQ 0 (
    echo Error al generar el APK. Verifica los mensajes anteriores.
) else (
    echo APK generado exitosamente.
    echo.
    echo El archivo APK se encuentra en:
    echo e:\Proyectos\erp-mobile\android\app\build\outputs\apk\release\app-release.apk
)

pause
