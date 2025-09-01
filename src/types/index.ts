
// Tipos TypeScript para la aplicación móvil según especificaciones API

export interface User {
  id: string;
  email: string;
  name?: string;
  role: string;
}

export interface Customer {
  id: string;
  code: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  customerTypeId: string;
  isActive: boolean;
}

export interface Warehouse {
  id: string;
  name: string;
  code: string;
  address: string;
  sucursalId: string;
}

export interface Sucursal {
  id: string;
  nombre: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  description?: string;
  categoryId: string;
  unitOfMeasureId: string;
  isActive: boolean;
  imageUrl?: string;
  category: {
    id: string;
    name: string;
  };
  unitOfMeasure: {
    id: string;
    name: string;
    abbreviation: string;
  };
  priceInfo: {
    basePrice: number;
    finalPrice: number;
    hasDiscount: boolean;
    discountPercentage?: number;
    volumeDiscounts: Array<{
      quantity: number;
      discount: number;
      pricePerBox: number;
    }>;
  };
}

export interface ProductListItem {
  id: string;
  sku: string;
  name: string;
  description?: string;
  imageUrl?: string;
  category: {
    id: string;
    name: string;
  };
  unitOfMeasure: {
    id: string;
    name: string;
    abbreviation: string;
  };
  priceInfo: {
    basePrice: number;
    finalPrice: number;
    hasDiscount: boolean;
    discountPercentage?: number;
  };
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  vendorId: string;
  warehouseId: string;
  statusCliente: 'BORRADOR' | 'ENVIADO' | 'CONFIRMADO';
  statusEmpresa: 'RECIBIDO' | 'PROCESANDO' | 'ENVIADO' | 'ENTREGADO';
  totalAmount: number;
  createdAt: string;
  deliveryDate?: string;
  vendorName: string;
  items: OrderItem[];
}

export interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  product: {
    id: string;
    sku: string;
    name: string;
    imageUrl?: string;
  };
}

export interface ApiError {
  message: string;
  status: number;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface PreLoginResponse {
  name: string;
  address: string;
  phone: string;
  nit: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  sucursalId: string;
  almacenId: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export interface LoginMockResponse {
  customer: Customer;
  tokens: AuthTokens;
  sucursal: Sucursal;
  warehouse: Warehouse;
}

export interface Category {
  id: string;
  name: string;
  imageUrl?: string;
}

// Store State Types
export interface AuthState {
  tokens: AuthTokens | null;
  customer: Customer | null;
  sucursal: Sucursal | null;
  warehouse: Warehouse | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginMockResponse) => void;
  logout: () => void;
  setTokens: (tokens: AuthTokens) => void;
  setLoading: (loading: boolean) => void;
  attemptSilentLogin: () => Promise<boolean>;
}

export interface CartItem {
  product: ProductListItem;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  total: number;
  addItem: (product: ProductListItem, quantity: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getItemCount: () => number;
}
