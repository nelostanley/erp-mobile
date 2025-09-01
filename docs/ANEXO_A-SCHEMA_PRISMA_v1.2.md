// ===============================================
// # ANEXO A: ESQUEMA PRISMA v1.2 COMPLETO
// # Fuente de Verdad para la Estructura de la Base de Datos
// ===============================================

generator client {
  provider      = "prisma-client-js"
  binaryTargets = ["native", "linux-musl-arm64-openssl-3.0.x"]
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ===============================================
// # 1. Modelos de Autenticación y Usuarios
// ===============================================

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?
  user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model User {
  id                  String                 @id @default(cuid())
  name                String?
  email               String                 @unique
  emailVerified       DateTime?
  image               String?
  password            String?
  role                String                 @default("ADMIN")
  createdAt           DateTime               @default(now())
  updatedAt           DateTime               @updatedAt
  accounts            Account[]
  compras             Compra[]
  kardexMovimientos   KardexDeInventario[]
  sessions            Session[]
  traspasos           TraspasoAlmacen[]
  registrosInventario RegistroInventario[]
  // Relaciones para funcionalidades móviles
  deviceTokens        DeviceToken[]
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}

// ===============================================
// # 2. Modelos de Clientes y Segmentación
// ===============================================

model CustomerType {
  id            String         @id @default(cuid())
  name          String         @unique
  description   String?
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt
  customers     Customer[]
  discounts     Discount[]
  matrizPrecios MatrizPrecio[]
  promotions    Promotion[]
}

model Zona {
  id        String     @id @default(cuid())
  nombre    String     @unique
  estado    Boolean    @default(true)
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt
  customers Customer[]
}

model Ruta {
  id        String     @id @default(cuid())
  nombre    String     @unique
  estado    Boolean    @default(true)
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt
  customers Customer[]
}

model GrupoCliente {
  id        String     @id @default(cuid())
  nombre    String     @unique
  estado    Boolean    @default(true)
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt
  customers Customer[]
}

model TipoNegocio {
  id        String     @id @default(cuid())
  nombre    String     @unique
  estado    Boolean    @default(true)
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt
  customers Customer[]
}

model Customer {
  id             String        @id @default(cuid())
  code           String        @unique
  name           String
  email          String        @unique
  password       String?
  phone          String?
  address        String?
  latitude       Float?
  longitude      Float?
  nit            String?
  fiscalName     String?
  fcmToken       String? // Considerar eliminar en favor de DeviceToken
  customerTypeId String
  idZona         String?
  idRuta         String?
  idGrupo        String?
  idTipoNegocio  String?
  isActive       Boolean       @default(true)
  createdAt      DateTime      @default(now())
  updatedAt      DateTime      @updatedAt
  customerType   CustomerType  @relation(fields: [customerTypeId], references: [id])
  grupo          GrupoCliente? @relation(fields: [idGrupo], references: [id])
  ruta           Ruta?         @relation(fields: [idRuta], references: [id])
  tipoNegocio    TipoNegocio?  @relation(fields: [idTipoNegocio], references: [id])
  zona           Zona?         @relation(fields: [idZona], references: [id])
  favorites      Favorite[]
  orders         Order[]
}

// ===============================================
// # 3. Modelos de Productos y Catálogo
// ===============================================

model Category {
  id          String     @id @default(cuid())
  name        String     @unique
  description String?
  image       String?
  order       Int        @default(0)
  parentId    String?
  isActive    Boolean    @default(true)
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
  parent      Category?  @relation("CategoryHierarchy", fields: [parentId], references: [id])
  children    Category[] @relation("CategoryHierarchy")
  products    Product[]
}

model UnitOfMeasure {
  id                    String               @id @default(cuid())
  name                  String               @unique
  abbreviation          String               @unique
  createdAt             DateTime             @default(now())
  updatedAt             DateTime             @updatedAt
  equivalenciasUnidades EquivalenciaUnidad[]
  matrizPrecios         MatrizPrecio[]
  orderItems            OrderItem[]
  prices                Price[]
  productUnits          ProductUnit[]
}

model Product {
  id                         String                      @id @default(cuid())
  sku                        String                      @unique
  name                       String
  shortDescription           String?
  longDescription            String?
  categoryId                 String
  minimo                     Float?
  maximo                     Float?
  manejaLotes                Boolean                     @default(false)
  isActive                   Boolean                     @default(true)
  createdAt                  DateTime                    @default(now())
  updatedAt                  DateTime                    @updatedAt
  campaignProducts           CampaignProduct[]
  detallesCompra             DetalleCompra[]
  detallesTraspasos          DetalleTraspasoAlmacen[]
  equivalenciasUnidades      EquivalenciaUnidad[]
  favorites                  Favorite[]
  inventarioDetallado        InventarioDetallado[]
  inventory                  Inventory[]
  kardexMovimientos          KardexDeInventario[]
  matrizPrecios              MatrizPrecio[]
  orderItems                 OrderItem[]
  prices                     Price[]
  category                   Category                    @relation(fields: [categoryId], references: [id])
  images                     ProductImage[]
  units                      ProductUnit[]
  lotes                      ProductoLote[]
  promotions                 PromotionProduct[]
  registroInventarioDetalles RegistroInventarioDetalle[]
}

model ProductImage {
  id        String   @id @default(cuid())
  url       String
  alt       String?
  priority  Int      @default(0)
  productId String
  createdAt DateTime @default(now())
  product   Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
}

// ===============================================
// # 4. Modelos de Precios, Promociones y Descuentos
// ===============================================

// ... (Price, MatrizPrecio, EquivalenciaUnidad, etc. completos aquí)
model Price {
  id              String        @id @default(cuid())
  productId       String
  almacenId       String
  unitOfMeasureId String
  price           Float
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
  almacen         Warehouse     @relation(fields: [almacenId], references: [id])
  product         Product       @relation(fields: [productId], references: [id], onDelete: Cascade)
  unitOfMeasure   UnitOfMeasure @relation(fields: [unitOfMeasureId], references: [id])
  @@unique([productId, almacenId, unitOfMeasureId])
}

model MatrizPrecio {
  id                  String        @id @default(cuid())
  idproducto          String
  idalmacen           String
  idunidadmedida      String
  idgrupocliente      String
  precio              Float         @default(0)
  precio_anterior     Float?
  fecha_desde         DateTime?
  fecha_hasta         DateTime?
  estado              Boolean       @default(true)
  fecha_creacion      DateTime      @default(now())
  fecha_actualizacion DateTime      @updatedAt
  almacen             Warehouse     @relation(fields: [idalmacen], references: [id])
  grupoCliente        CustomerType  @relation(fields: [idgrupocliente], references: [id])
  producto            Product       @relation(fields: [idproducto], references: [id], onDelete: Cascade)
  unidadMedida        UnitOfMeasure @relation(fields: [idunidadmedida], references: [id])
  @@unique([idproducto, idalmacen, idunidadmedida, idgrupocliente])
}

model Discount {
  id             String        @id @default(cuid())
  name           String
  description    String?
  type           DiscountType
  value          Float
  minQuantity    Int?
  maxQuantity    Int?
  minAmount      Float?
  startDate      DateTime?
  endDate        DateTime?
  customerTypeId String?
  isActive       Boolean       @default(true)
  createdAt      DateTime      @default(now())
  updatedAt      DateTime      @updatedAt
  customerType   CustomerType? @relation(fields: [customerTypeId], references: [id])
}

model Promotion {
  id                 String             @id @default(cuid())
  name               String
  description        String?
  code               String?            @unique
  type               PromotionType
  value              Float
  minQuantity        Int?
  maxQuantity        Int?
  minOrderAmount     Float?
  maxOrderAmount     Float?
  maxUses            Int?
  maxUsesPerCustomer Int?
  currentUses        Int                @default(0)
  startDate          DateTime
  endDate            DateTime
  priority           Int                @default(0)
  customerTypeId     String?
  status             PromotionStatus    @default(DRAFT)
  isActive           Boolean            @default(true)
  createdAt          DateTime           @default(now())
  updatedAt          DateTime           @updatedAt
  customerType       CustomerType?      @relation(fields: [customerTypeId], references: [id])
  products           PromotionProduct[]
}

model PromotionProduct {
  id          String    @id @default(cuid())
  promotionId String
  productId   String
  createdAt   DateTime  @default(now())
  product     Product   @relation(fields: [productId], references: [id], onDelete: Cascade)
  promotion   Promotion @relation(fields: [promotionId], references: [id], onDelete: Cascade)
  @@unique([promotionId, productId])
}

model Campaign {
  id               String            @id @default(cuid())
  name             String
  description      String?
  bannerUrl        String?
  startDate        DateTime?
  endDate          DateTime?
  isActive         Boolean           @default(true)
  createdAt        DateTime          @default(now())
  updatedAt        DateTime          @updatedAt
  campaignProducts CampaignProduct[]
}

model CampaignProduct {
  id         String   @id @default(cuid())
  campaignId String
  productId  String
  createdAt  DateTime @default(now())
  campaign   Campaign @relation(fields: [campaignId], references: [id], onDelete: Cascade)
  product    Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  @@unique([campaignId, productId])
}

// ... (Todos los demás modelos del ERP van aquí)

// ===============================================
// # 10. Modelos NUEVOS a añadir para la App Móvil
// ===============================================

model DeviceToken {
  id        String   @id @default(cuid())
  token     String   @unique
  provider  String   @default("FCM")
  createdAt DateTime @default(now())
  // CAMBIO: La relación debe ser con Customer, no con User
  customerId String
  customer   Customer @relation(fields: [customerId], references: [id], onDelete: Cascade)
}

// ===============================================
// # 11. Enumeraciones (Enums)
// ===============================================

enum DiscountType {
  PERCENTAGE
  BUY_X_GET_Y
}

enum PromotionType {
  PERCENTAGE
  FIXED_AMOUNT
  BUY_X_GET_Y
  FREE_SHIPPING
}

enum PromotionStatus {
  DRAFT
  ACTIVE
  INACTIVE
  EXPIRED
}

enum EstadoCliente {
  PENDIENTE
  ACEPTADO
  RECHAZADO
  ANULADO
  ENVIADO
  ENTREGADO
}

enum EstadoEmpresa {
  PENDIENTE
  ACEPTADO
  PREPARANDO
  ENVIADO
  ENTREGADO
  CANCELADO
  ANULADO
  CONSOLIDADO
}

enum PaymentMethod {
  CASH
  BANK_TRANSFER
  CREDIT_CARD
  DEBIT_CARD
  CHECK
}

enum EstadoCompra {
  PENDIENTE
  ACEPTADO
  CANCELADO
  CONSOLIDADO
  ANULADO
}