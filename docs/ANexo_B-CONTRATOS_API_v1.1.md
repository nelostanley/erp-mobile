
# **ANEXO B: CONTRATOS DE API (v1.1)**

**Directiva:** Este documento define las estructuras de datos (schemas) y los endpoints que el BFF expone y que la aplicación móvil debe consumir.

### **Formato de Respuesta General**

Todas las respuestas de la API deben adherirse a la siguiente estructura.

**Respuesta de Éxito (Status `200` o `201`):**
```json
{
  "success": true,
  "data": "...",
  "pagination?": {
    "page": "number",
    "limit": "number",
    "total": "number",
    "totalPages": "number"
  }
}
```

**Respuesta de Error (Status `4xx` o `5xx`):**
```json
{
  "success": false,
  "error": "string",
  "details?": "any"
}
```

---

### **1. Módulo de Autenticación**

#### `POST /api/auth/mobile/pre-login`
*   **Descripción:** Verifica la existencia de un cliente por su email.
*   **Request Body:**
    ```json
    {
      "email": "string"
    }
    ```
*   **Response Data (Éxito):**
    ```json
    {
      "name": "string",
      "address": "string",
      "phone": "string",
      "nit": "string"
    }
    ```

#### `POST /api/auth/mobile/login`
*   **Descripción:** Autentica al cliente y devuelve tokens de sesión.
*   **Request Body:**
    ```json
    {
      "email": "string",
      "password": "string"
    }
    ```
*   **Response Data (Éxito):**
    ```json
    {
      "accessToken": "string",
      "refreshToken": "string"
    }
    ```

#### `POST /api/auth/mobile/refresh`
*   **Descripción:** Renueva un `accessToken` expirado.
*   **Request Body:**
    ```json
    {
      "refreshToken": "string"
    }
    ```
*   **Response Data (Éxito):**
    ```json
    {
      "accessToken": "string"
    }
    ```

---

### **2. Módulo de Catálogo y Productos**

#### `GET /api/products?warehouseId={id}&categoryId?={id}&search?={query}`
*   **Descripción:** Devuelve una lista paginada de productos.
*   **Response Data:** `Array<ProductListItem>`
*   **Schema `ProductListItem`:**
    ```json
    {
      "id": "string",
      "sku": "string",
      "name": "string",
      "imageUrl": "string",
      "price": "number",
      "pricePerSubUnit": "number",
      "unitOfMeasure": "string"
    }
    ```

#### `GET /api/products/{id}?warehouseId={id}`
*   **Descripción:** Devuelve el detalle de un producto.
*   **Response Data:** `ProductDetail`

#### `GET /api/products/most-ordered?warehouseId={id}`
*   **Descripción:** Devuelve una lista de los productos más pedidos.
*   **Response Data:** `Array<ProductListItem>`

#### `GET /api/products/{id}/related?warehouseId={id}`
*   **Descripción:** Devuelve una lista de productos recomendados.
*   **Response Data:** `Array<ProductListItem>`

---

### **3. Módulo de Pedidos**

#### `GET /api/orders?status?={estado}&startDate?={isoDate}&endDate?={isoDate}`
*   **Descripción:** Devuelve el historial de pedidos del cliente, con filtros.
*   **Response Data:** `Array<OrderHistoryItem>`

#### `GET /api/orders/{id}`
*   **Descripción:** Devuelve el detalle completo de un único pedido.
*   **Response Data:** `OrderDetail`

#### `POST /api/orders`
*   **Descripción:** Crea un nuevo pedido.
*   **Request Body:**
    ```json
    {
      "customerId": "string",
      "sucursalId": "string",
      "almacenId": "string",
      "deliveryDate": "string? (ISO 8086)",
      "notes": "string?",
      "items": [
        {
          "productId": "string",
          "unitOfMeasureId": "string",
          "quantity": "number",
          "unitPrice": "number"
        }
      ]
    }
    ```

#### `POST /api/orders/:orderId/upload-receipt`
*   **Descripción:** Sube un comprobante de pago.
*   **Request Body:** `multipart/form-data`

---

### **4. Módulo de Soporte y Engagement**

*   **`GET /api/categories`** -> **Response Data:** `Array<{ "id": "string", "name": "string", "imageUrl?": "string" }>`
*   **`GET /api/sucursales`** -> **Response Data:** `Array<{ "id": "string", "nombre": "string" }>`
*   **`GET /api/almacenes?sucursalId={id}`** -> **Response Data:** `Array<{ "id": "string", "name": "string" }>`
*   **`GET /api/favorites`** -> **Response Data:** `Array<ProductListItem>`
*   **`POST /api/favorites`** -> **Request Body:** `{ "productId": "string" }`
*   **`DELETE /api/favorites/:productId`**
*   **`POST /api/device-tokens`** -> **Request Body:** `{ "token": "string" }`