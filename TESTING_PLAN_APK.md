# Plan de Testing APK Final - ERP Mobile

## **ESTADO ACTUAL**
- ✅ GitHub actualizado con código completo
- ✅ Build APK en progreso (ID: 0cdf3865-3ad2-4265-8d25-e725f1d48162)
- ✅ Código incluye todas las mejoras y correcciones

## **PLAN DE TESTING DETALLADO**

### **FASE 1: Validación de Instalación**
- [ ] Descargar APK desde enlace de Expo
- [ ] Instalar en dispositivo Android de prueba
- [ ] Verificar que la aplicación se abre correctamente
- [ ] Confirmar que no hay crashes al inicio

### **FASE 2: Testing de Autenticación Completa**
- [ ] **Pre-Login:**
  - [ ] Ingresar email: alexander.godoy@example.com
  - [ ] Verificar carga de datos del cliente
  - [ ] Confirmar navegación a pantalla de configuración

- [ ] **Configuración y Login:**
  - [ ] Verificar carga de sucursales desde API
  - [ ] Probar selección de "Sucursal Principal" con nuevo componente
  - [ ] Verificar carga de almacenes después de seleccionar sucursal
  - [ ] Probar selección de almacén
  - [ ] Ingresar contraseña (número de teléfono)
  - [ ] Completar login exitoso

### **FASE 3: Testing de Funcionalidad Post-Login**
- [ ] **Navegación Principal:**
  - [ ] Verificar acceso a pantalla principal
  - [ ] Probar navegación entre tabs/secciones
  - [ ] Confirmar persistencia de sesión

- [ ] **Integración API:**
  - [ ] Probar carga de catálogo de productos
  - [ ] Verificar funcionalidad de búsqueda
  - [ ] Probar filtros de categorías

### **FASE 4: Testing de Rendimiento Nativo**
- [ ] **Rendimiento:**
  - [ ] Medir tiempo de carga inicial
  - [ ] Verificar fluidez de navegación
  - [ ] Probar en diferentes dispositivos Android

- [ ] **Conectividad:**
  - [ ] Probar con conexión WiFi
  - [ ] Probar con datos móviles
  - [ ] Verificar manejo de errores de red

### **FASE 5: Testing de Casos Edge**
- [ ] **Manejo de Errores:**
  - [ ] Probar con email inexistente
  - [ ] Probar con contraseña incorrecta
  - [ ] Verificar mensajes de error apropiados

- [ ] **Estados de la App:**
  - [ ] Probar minimizar/restaurar aplicación
  - [ ] Verificar comportamiento en background
  - [ ] Probar rotación de pantalla

## **CRITERIOS DE ÉXITO**
- ✅ Instalación exitosa sin errores
- ✅ Flujo de autenticación completo funcional
- ✅ Componente Select funcionando perfectamente
- ✅ API calls exitosas a backend BFF
- ✅ Navegación fluida y sin crashes
- ✅ Rendimiento aceptable en dispositivo nativo

## **HERRAMIENTAS DE TESTING**
- Dispositivo Android físico o emulador
- Conexión a backend en 192.168.68.200:3000
- Logs de debugging habilitados
- Monitoreo de performance

## **REPORTE FINAL**
Al completar el testing, se generará un reporte final con:
- Resultados de cada fase de testing
- Screenshots de funcionalidad clave
- Métricas de rendimiento
- Recomendaciones finales
- Certificación de APK listo para producción

---
**Preparado para ejecutar cuando el build APK esté completo**
