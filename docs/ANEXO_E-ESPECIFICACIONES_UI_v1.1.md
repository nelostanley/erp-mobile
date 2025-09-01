
# **ANEXO E: ESPECIFICaciones DE UI (SISTEMA DE DISEÑO) v1.1**

**Directiva:** Utilice estas especificaciones para construir un sistema de diseño consistente y reutilizable en la aplicación móvil. La implementación visual de cada componente y pantalla debe ser una réplica exacta de los diseños proporcionados en el **ANEXO F**.

---

### **1. Paleta de Colores**

Se debe crear un objeto o tema de colores centralizado para ser utilizado en toda la aplicación.

| Nombre de Token | Código Hexadecimal | Uso Principal                                               |
| :-------------- | :----------------- | :---------------------------------------------------------- |
| `primary`       | `#D32F2F`          | Cabeceras, botones de acción principales, íconos activos.   |
| `background`    | `#FFFFFF`          | Color de fondo principal para las pantallas.                |
| `surface`       | `#F5F5F5`          | Color de fondo para tarjetas, modales y elementos elevados. |
| `textPrimary`   | `#212121`          | Color principal para títulos y texto importante.            |
| `textSecondary` | `#757575`          | Color para texto descriptivo, subtítulos y labels.          |
| `accent`        | `#FFA000`          | Para etiquetas de ofertas, descuentos o elementos a resaltar. |
| `statusSuccess` | `#2E7D32`          | Color de fondo para badges de estado "Entregado" o exitoso. |
| `disabled`      | `#BDBDBD`          | Color para bordes de inputs y texto en estado deshabilitado. |

---

### **2. Tipografía**

Se debe utilizar una fuente Sans-serif estándar como **Roboto** o **Inter**. Se deben definir los siguientes estilos tipográficos para ser reutilizados.

| Estilo  | Descripción          | Tamaño de Fuente | Peso de Fuente |
| :------ | :------------------- | :--------------- | :------------- |
| `H1`    | Precio Grande        | 24pt             | Bold (700)     |
| `H2`    | Título de Pantalla   | 20pt             | Bold (700)     |
| `H3`    | Título de Sección    | 18pt             | Medium (500)   |
| `Body`  | Texto Principal      | 16pt             | Regular (400)  |
| `Label` | Etiquetas de Campo   | 14pt             | Medium (500)   |
| `Caption` | Texto Pequeño        | 12pt             | Regular (400)  |

---

### **3. Especificaciones de Componentes Reutilizables**

Se deben construir los siguientes componentes base con los estilos especificados.

*   #### **Botones Principales**
    *   **Fondo:** Color `primary`.
    *   **Texto:** Color `#FFFFFF` (blanco), estilo `Body`.
    *   **Bordes:** `borderRadius: 8px`.
    *   **Padding:** `paddingVertical: 12px`, `paddingHorizontal: 16px`.
    *   **Estado Presionado:** Debe tener un efecto visual sutil (ej. opacidad al 80%).

*   #### **Tarjetas (`ProductCard`, `OrderCard`)**
    *   **Fondo:** Color `surface`.
    *   **Bordes:** `borderRadius: 12px`.
    *   **Sombra (Android):** `elevation: 2`.
    *   **Sombra (iOS):** Sombra sutil con `shadowColor: '#000'`, `shadowOffset: { width: 0, height: 1 }`, `shadowOpacity: 0.20`, `shadowRadius: 1.41`.

*   #### **Inputs de Texto**
    *   **Fondo:** Color `background`.
    *   **Bordes:** `borderWidth: 1px`, `borderColor: disabled`, `borderRadius: 8px`.
    *   **Padding:** `padding: 10px`.
    *   **Estado Enfocado:** El color del borde debe cambiar a color `primary`.

*   #### **Badges de Estado**
    *   **Forma:** Componente tipo "píldora" (totalmente redondeado). `borderRadius: 16px`.
    *   **Fondo:** Color dinámico según el contexto (ej. `statusSuccess` para "Entregado", `accent` para "Oferta").
    *   **Texto:** Color `#FFFFFF` (blanco), estilo `Caption`.
    *   **Padding:** `paddingVertical: 4px`, `paddingHorizontal: 12px`.

---

### **4. Especificaciones de Componentes Complejos**

*   #### **`PriceTable` (Tabla de Precios por Volumen)**
    *   **Ubicación:** Pantalla de Detalle del Producto.
    *   **Datos de Entrada:** Debe recibir el array `volumeDiscounts` del objeto `priceInfo` (ver ANEXO B, schema `ProductDetail`).
    *   **Implementación Visual:** Debe renderizar una tabla o una lista de filas, como se ve en la imagen de referencia. Cada fila debe mostrar claramente tres columnas:
        1.  **Cantidad:** (ej. "1", "2 a 9999").
        2.  **Descuento:** (ej. "No aplica", "6%").
        3.  **Precio x caja:** (ej. "91,98", "86,00").
    *   Debe tener una cabecera con los títulos de las columnas.

*   #### **`FilterModal` (Modal de Filtro de Pedidos)**
    *   **Ubicación:** Pantalla "Mis Pedidos".
    *   **Activación:** Debe aparecer como un modal o un "bottom sheet" cuando el usuario presiona el botón "Filtrar".
    *   **Implementación Visual y Funcional:**
        1.  **Filtro por Estado:** Debe contener un `Picker` o una lista de `RadioButtons` que permita al usuario seleccionar uno o varios estados de pedido (ej. "Entregado", "Pendiente", "Enviado"). Los estados disponibles deben basarse en el enum `EstadoCliente`.
        2.  **Filtro por Rango de Fechas:** Debe incluir dos campos de entrada que abran un selector de calendario (`DatePicker`) para que el usuario elija una fecha de inicio y una fecha de fin.
        3.  **Acciones:** Debe contener dos botones: "Aplicar Filtros" y "Limpiar".
    *   **Lógica:** Al presionar "Aplicar Filtros", el modal se cierra y se vuelve a llamar al endpoint `GET /api/orders` con los query parameters correspondientes (`?status=...&startDate=...&endDate=...`).