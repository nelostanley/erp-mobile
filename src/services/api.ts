
// Servicio de API para comunicación con el BFF según ANEXO B

import axios from 'axios';
import { 
  PreLoginResponse, 
  LoginRequest, 
  LoginResponse, 
  Product, 
  ProductListItem,
  Order,
  Sucursal,
  Warehouse,
  AuthTokens 
} from '../types';

// URL base del BFF - apuntando al servidor actual
// En producción cambiar a la URL del servidor real
// const BASE_URL = 'http://localhost:3000'; // Conexión local
// const BASE_URL = 'http://10.0.2.2:3000'; // Para Android emulator
const BASE_URL = 'http://192.168.68.200:3000'; // Servidor BFF activo

// Si necesitas usar un proxy local para desarrollo web, descomenta la siguiente línea:
// const BASE_URL = 'http://localhost:3001/api';

class ApiService {
  private accessToken: string | null = null;

  setAccessToken(token: string) {
    this.accessToken = token;
  }

  private getAuthHeaders() {
    return this.accessToken ? {
      'Authorization': `Bearer ${this.accessToken}`,
      'Content-Type': 'application/json',
    } : {
      'Content-Type': 'application/json',
    };
  }

  // AUTH ENDPOINTS

  async preLogin(email: string): Promise<PreLoginResponse> {
    try {
      const response = await axios.post(`${BASE_URL}/api/auth/mobile/pre-login`, {
        email,
      });
      return response.data;
    } catch (error: any) {
      throw {
        message: error.response?.data?.message || 'Error en pre-login',
        status: error.response?.status || 500,
      };
    }
  }

  async login(data: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await axios.post(`${BASE_URL}/api/auth/mobile/login`, data);
      return response.data;
    } catch (error: any) {
      throw {
        message: error.response?.data?.message || 'Error en login',
        status: error.response?.status || 500,
      };
    }
  }

  async refreshToken(refreshToken: string): Promise<AuthTokens> {
    try {
      const response = await axios.post(`${BASE_URL}/api/auth/mobile/refresh`, {
        refreshToken,
      });
      return response.data;
    } catch (error: any) {
      throw {
        message: error.response?.data?.message || 'Error al refrescar token',
        status: error.response?.status || 500,
      };
    }
  }

  // SUCURSALES Y ALMACENES

  async getSucursales(): Promise<Sucursal[]> {
    try {
      const response = await axios.get(`${BASE_URL}/api/sucursales`, {
        headers: this.getAuthHeaders(),
      });
      return response.data;
    } catch (error: any) {
      throw {
        message: error.response?.data?.message || 'Error obteniendo sucursales',
        status: error.response?.status || 500,
      };
    }
  }

  async getAlmacenes(sucursalId: string): Promise<Warehouse[]> {
    try {
      const response = await axios.get(`${BASE_URL}/api/almacenes?sucursalId=${sucursalId}`, {
        headers: this.getAuthHeaders(),
      });
      return response.data;
    } catch (error: any) {
      throw {
        message: error.response?.data?.message || 'Error obteniendo almacenes',
        status: error.response?.status || 500,
      };
    }
  }

  // PRODUCTOS

  async getProducts(page = 1, limit = 20, categoryId?: string, search?: string): Promise<{
    products: ProductListItem[];
    totalCount: number;
    hasMore: boolean;
  }> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      
      if (categoryId) params.append('categoryId', categoryId);
      if (search) params.append('search', search);

      const response = await axios.get(`${BASE_URL}/api/products?${params.toString()}`, {
        headers: this.getAuthHeaders(),
      });
      return response.data;
    } catch (error: any) {
      throw {
        message: error.response?.data?.message || 'Error obteniendo productos',
        status: error.response?.status || 500,
      };
    }
  }

  async getProductById(id: string): Promise<Product> {
    try {
      const response = await axios.get(`${BASE_URL}/api/products/${id}`, {
        headers: this.getAuthHeaders(),
      });
      return response.data;
    } catch (error: any) {
      throw {
        message: error.response?.data?.message || 'Error obteniendo producto',
        status: error.response?.status || 500,
      };
    }
  }

  // PEDIDOS

  async getOrders(page = 1, limit = 20, status?: string, startDate?: string, endDate?: string): Promise<{
    orders: Order[];
    totalCount: number;
    hasMore: boolean;
  }> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      
      if (status) params.append('status', status);
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const response = await axios.get(`${BASE_URL}/api/orders?${params.toString()}`, {
        headers: this.getAuthHeaders(),
      });
      return response.data;
    } catch (error: any) {
      throw {
        message: error.response?.data?.message || 'Error obteniendo pedidos',
        status: error.response?.status || 500,
      };
    }
  }

  async createOrder(orderData: {
    items: Array<{
      productId: string;
      quantity: number;
    }>;
  }): Promise<Order> {
    try {
      const response = await axios.post(`${BASE_URL}/api/orders`, orderData, {
        headers: this.getAuthHeaders(),
      });
      return response.data;
    } catch (error: any) {
      throw {
        message: error.response?.data?.message || 'Error creando pedido',
        status: error.response?.status || 500,
      };
    }
  }

  // FAVORITOS

  async getFavorites(): Promise<ProductListItem[]> {
    try {
      const response = await axios.get(`${BASE_URL}/api/favorites`, {
        headers: this.getAuthHeaders(),
      });
      return response.data;
    } catch (error: any) {
      throw {
        message: error.response?.data?.message || 'Error obteniendo favoritos',
        status: error.response?.status || 500,
      };
    }
  }

  async addToFavorites(productId: string): Promise<void> {
    try {
      await axios.post(`${BASE_URL}/api/favorites/${productId}`, {}, {
        headers: this.getAuthHeaders(),
      });
    } catch (error: any) {
      throw {
        message: error.response?.data?.message || 'Error agregando a favoritos',
        status: error.response?.status || 500,
      };
    }
  }

  async removeFromFavorites(productId: string): Promise<void> {
    try {
      await axios.delete(`${BASE_URL}/api/favorites/${productId}`, {
        headers: this.getAuthHeaders(),
      });
    } catch (error: any) {
      throw {
        message: error.response?.data?.message || 'Error removiendo de favoritos',
        status: error.response?.status || 500,
      };
    }
  }
}

export const apiService = new ApiService();
