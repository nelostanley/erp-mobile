
# **MANIFEST.md - Manifiesto de Cambios del Sistema ERP B2B Móvil**

**Proyecto:** Sistema ERP B2B Móvil  
**Versión:** v1.0  
**Fecha:** 24 de agosto de 2025  
**Desarrollador:** Agente de Desarrollo Autónomo (Abacus)  

---

## **1. Modificaciones al Esquema de la Base de Datos (`schema.prisma`)**

### **1.1 Modelos Implementados (50+ modelos según ANEXO A v1.1)**

**Modelos de Autenticación y Usuarios:**
- `Account` - Cuentas de autenticación externa
- `Session` - Sesiones de usuario 
- `User` - Usuarios del sistema (Admin/Staff)
- `VerificationToken` - Tokens de verificación

**Modelos de Clientes:**
- `Customer` - Clientes del sistema B2B
- `CustomerType` - Tipos de cliente (Minorista, Mayorista, Distribuidor)
- `Zona` - Zonas geográficas
- `Ruta` - Rutas de distribución
- `GrupoCliente` - Grupos de clientes
- `TipoNegocio` - Tipos de negocio

**Modelos de Productos y Catálogo:**
- `Product` - Productos del catálogo
- `Category` - Categorías de productos
- `ProductImage` - Imágenes de productos
- `UnitOfMeasure` - Unidades de medida
- `ProductUnit` - Unidades por producto
- `EquivalenciaUnidad` - Equivalencias entre unidades

**Modelos de Precios:**
- `Price` - Precios base por producto-almacén-unidad
- `MatrizPrecio` - Matriz multidimensional de precios (Producto × Almacén × Unidad × Cliente × Vigencia)

**Modelos de Inventario:**
- `Warehouse` - Almacenes
- `Inventory` - Inventario por producto-almacén
- `InventarioDetallado` - Inventario detallado con lotes
- `ProductoLote` - Lotes de productos
- `MovimientoLote` - Movimientos de lotes
- `KardexDeInventario` - Kardex de movimientos
- `TraspasoAlmacen` - Traspasos entre almacenes
- `DetalleTraspasoAlmacen` - Detalles de traspasos
- `RegistroInventario` - Registros de inventario
- `RegistroInventarioDetalle` - Detalles de registros

**Modelos de Pedidos:**
- `Order` - Pedidos (con estados duales: EstadoCliente/EstadoEmpresa)
- `OrderItem` - Items de pedidos
- `OrderPayment` - Pagos de pedidos

**Modelos de Configuración:**
- `Vendedor` - Vendedores del sistema
- `Sucursal` - Sucursales
- `TipoNota` - Tipos de notas
- `TipoPedido` - Tipos de pedido
- `Motivo` - Motivos varios
- `Carrier` - Transportistas

**Modelos de Compras:**
- `Proveedor` - Proveedores
- `TipoCompra` - Tipos de compra
- `CuentaContable` - Cuentas contables
- `Compra` - Compras
- `DetalleCompra` - Detalles de compras

**Modelos de Marketing:**
- `Discount` - Descuentos
- `Promotion` - Promociones
- `PromotionProduct` - Productos en promoción
- `Campaign` - Campañas
- `CampaignProduct` - Productos de campaña

**Modelos de Favoritos:**
- `Favorite` - Favoritos por cliente
- `FavoriteProduct` - Productos favoritos

**Modelos de Notificaciones:**
- `DeviceToken` - Tokens de dispositivos móviles para FCM

**Modelos de Parámetros:**
- `Parametros` - Parámetros generales
- `ParametrosSistema` - Parámetros del sistema

### **1.2 Campos Especiales Implementados**
- **Estados Duales en Pedidos**: `statusCliente` (BORRADOR, ENVIADO, CONFIRMADO) y `statusEmpresa` (RECIBIDO, PROCESANDO, ENVIADO, ENTREGADO)
- **Manejo de Lotes**: Campos `manejaLotes` en productos
- **Equivalencias de Unidades**: Sistema de conversión automática
- **Matriz de Precios**: Soporte para precios multidimensionales

---

## **2. Nuevos Endpoints de API Creados**

### **2.1 Endpoints de Autenticación Móvil (`/api/auth/mobile/`)**
- `POST /api/auth/mobile/pre-login` - Verificación de cliente por email (Paso 1 del flujo)
- `POST /api/auth/mobile/login` - Autenticación completa con JWT (Paso 3 del flujo)
- `POST /api/auth/mobile/refresh` - Renovación de tokens JWT

### **2.2 Endpoints de Compatibilidad de Testing (`/api/auth/`)**
- `GET /api/auth/providers` - Lista de proveedores de autenticación
- `GET /api/auth/csrf` - Token CSRF para compatibilidad
- `POST /api/auth/signup` - Endpoint de registro (mock para testing)
- `GET /api/auth/session` - Información de sesión actual

### **2.3 Endpoints de Configuración**
- `GET /api/sucursales` - Lista de sucursales disponibles
- `GET /api/almacenes` - Lista de almacenes por sucursal (query: `?sucursalId=`)

### **2.4 Endpoints de Productos**
- `GET /api/products` - Lista paginada de productos con precios dinámicos
- `GET /api/products/[id]` - Detalle completo de producto con tabla de precios
- `GET /api/products/[id]/related` - Productos relacionados
- `GET /api/products/most-ordered` - Productos más pedidos

### **2.5 Endpoints de Pedidos**
- `GET /api/orders` - Historial de pedidos con filtros (status, fechas, paginación)
- `POST /api/orders` - Crear nuevo pedido con validaciones
- `GET /api/orders/[id]` - Detalle de pedido específico
- `POST /api/orders/[id]/upload-receipt` - Subir comprobante de pago

### **2.6 Endpoints de Favoritos**
- `GET /api/favorites` - Lista de productos favoritos del cliente
- `POST /api/favorites/[productId]` - Agregar producto a favoritos
- `DELETE /api/favorites/[productId]` - Remover producto de favoritos

### **2.7 Endpoints de Configuración General**
- `GET /api/categories` - Lista de categorías de productos
- `POST /api/device-tokens` - Registrar token de dispositivo para notificaciones FCM

---

## **3. Dependencias de NPM Añadidas**

### **3.1 Dependencies (Producción)**
```json
{
  "@types/bcryptjs": "^3.0.0",
  "@types/jsonwebtoken": "^9.0.10",
  "bcryptjs": "^3.0.2",
  "firebase-admin": "^13.5.0",
  "jsonwebtoken": "^9.0.2"
}
```

### **3.2 DevDependencies (Desarrollo)**
No se añadieron dependencias de desarrollo adicionales - el proyecto ya contaba con el stack completo necesario.

### **3.3 Dependencias Clave Ya Presentes**
- `@prisma/client`: "6.7.0" - Cliente de base de datos
- `prisma`: "6.7.0" - ORM y migraciones
- `next`: "14.2.28" - Framework web
- `typescript`: "5.2.2" - Tipado estático
- `next-auth`: "4.24.11" - Autenticación (base)
- Múltiples componentes UI de `@radix-ui/*` - Componentes accesibles

---

## **4. Archivos de Configuración Modificados**

### **4.1 Scripts de Base de Datos**
- `scripts/seed.ts` - Script completo de datos de prueba con:
  - 1 usuario admin (`john@doe.com`)
  - 2 clientes demo (`alexander.godoy@example.com`, `maria.gonzalez@example.com`)
  - 3 productos de bebidas (SKUs: 2519, 2518, 2520)
  - 1 sucursal y 1 almacén
  - 1 vendedor
  - Precios e inventario básico

### **4.2 Configuración de Prisma**
- `prisma/schema.prisma` - Schema completo según ANEXO A v1.1
- Configuración de generador con path personalizado: `/home/ubuntu/erp-system/app/node_modules/.prisma/client`
- Configuración de datasource PostgreSQL

### **4.3 Variables de Entorno**
- `.env` - Variables configuradas para desarrollo:
  - `DATABASE_URL` - Conexión a PostgreSQL
  - `JWT_SECRET` - Secreto para tokens JWT
  - `NEXTAUTH_SECRET` - Secreto para NextAuth
  - Variables de FCM y almacenamiento (preparadas)

---

## **5. Páginas y Componentes UI**

### **5.1 Página Principal**
- `app/page.tsx` - Dashboard del BFF con estadísticas en tiempo real:
  - Contadores de clientes, productos, pedidos, almacenes
  - Lista de componentes implementados
  - Lista de endpoints disponibles
  - Estado de integración con app móvil

### **5.2 Layout Global**
- Mantenido el layout existente con tema personalizado
- Integración con providers de autenticación
- Configuración de metadatos y SEO

---

## **6. Lógica de Negocio Implementada**

### **6.1 Sistema de Autenticación JWT Personalizado**
- Flujo de 5 pasos según ANEXO C
- Tokens de acceso (15 min) y refresh (30 días)
- Validación de cliente por email
- Selección obligatoria de sucursal y almacén

### **6.2 Matriz de Precios Dinámica**
- Cálculo de precios según cliente, producto, almacén y unidad
- Soporte para descuentos por volumen
- Precios base y precios finales diferenciados

### **6.3 Estados Duales en Pedidos**
- `EstadoCliente`: BORRADOR → ENVIADO → CONFIRMADO
- `EstadoEmpresa`: RECIBIDO → PROCESANDO → ENVIADO → ENTREGADO
- Lógica de transiciones automáticas

### **6.4 Gestión de Inventario**
- Control de stock por producto-almacén
- Kardex de movimientos
- Soporte para lotes y fechas de vencimiento

---

## **7. Seguridad Implementada**

### **7.1 Autenticación y Autorización**
- Hashing de contraseñas con `bcryptjs` (12 rounds)
- JWT con expiración configurable
- Middleware de autenticación en endpoints protegidos
- Validación de tokens en cada request

### **7.2 Validación de Datos**
- Validación de schemas en endpoints POST
- Sanitización de inputs
- Manejo de errores estructurado
- Rate limiting básico

### **7.3 CORS y Headers de Seguridad**
- Configuración CORS para desarrollo local
- Headers de seguridad básicos
- Protección contra ataques comunes

---

**Resumen:** Se implementó un BFF completo con 50+ modelos de base de datos, 15+ endpoints API, autenticación JWT personalizada, lógica de negocio compleja y datos de prueba realistas, siguiendo fielmente las especificaciones de los anexos A-H proporcionados.
