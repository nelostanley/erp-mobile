
// Store de autenticación con Zustand según especificaciones

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthState, AuthTokens, Customer, Sucursal, Warehouse } from '../types';
import { apiService } from '../services/api';

const STORAGE_KEYS = {
  REFRESH_TOKEN: 'erp_refresh_token',
  SUCURSAL_ID: 'erp_sucursal_id',
  ALMACEN_ID: 'erp_almacen_id',
  CUSTOMER_DATA: 'erp_customer_data',
};

export const useAuthStore = create<AuthState>((set, get) => ({
  tokens: null,
  customer: null,
  sucursal: null,
  warehouse: null,
  isAuthenticated: false,
  isLoading: false,

  login: async (data) => {
    try {
      // Guardar en AsyncStorage
      await AsyncStorage.multiSet([
        [STORAGE_KEYS.REFRESH_TOKEN, data.tokens.refreshToken],
        [STORAGE_KEYS.SUCURSAL_ID, data.sucursal.id],
        [STORAGE_KEYS.ALMACEN_ID, data.warehouse.id],
        [STORAGE_KEYS.CUSTOMER_DATA, JSON.stringify(data.customer)],
      ]);

      // Configurar token en el servicio API
      apiService.setAccessToken(data.tokens.accessToken);

      // Actualizar estado
      set({
        tokens: data.tokens,
        customer: data.customer,
        sucursal: data.sucursal,
        warehouse: data.warehouse,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      console.error('Error saving auth data:', error);
      set({ isLoading: false });
    }
  },

  logout: async () => {
    try {
      // Limpiar AsyncStorage
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.REFRESH_TOKEN,
        STORAGE_KEYS.SUCURSAL_ID,
        STORAGE_KEYS.ALMACEN_ID,
        STORAGE_KEYS.CUSTOMER_DATA,
      ]);

      // Limpiar token del servicio API
      apiService.setAccessToken('');

      // Limpiar estado
      set({
        tokens: null,
        customer: null,
        sucursal: null,
        warehouse: null,
        isAuthenticated: false,
        isLoading: false,
      });
    } catch (error) {
      console.error('Error during logout:', error);
    }
  },

  setTokens: (tokens) => {
    apiService.setAccessToken(tokens.accessToken);
    set({ tokens });
  },

  setLoading: (loading) => {
    set({ isLoading: loading });
  },

  // Función para re-autenticación silenciosa
  attemptSilentLogin: async () => {
    try {
      set({ isLoading: true });

      const storedData = await AsyncStorage.multiGet([
        STORAGE_KEYS.REFRESH_TOKEN,
        STORAGE_KEYS.CUSTOMER_DATA,
      ]);

      const refreshToken = storedData[0][1];
      const customerDataStr = storedData[1][1];

      if (!refreshToken || !customerDataStr) {
        set({ isLoading: false });
        return false;
      }

      // Intentar refrescar el token
      const newTokens = await apiService.refreshToken(refreshToken);
      
      // Configurar el nuevo access token
      apiService.setAccessToken(newTokens.accessToken);

      // Restaurar datos del customer
      const customerData = JSON.parse(customerDataStr);

      set({
        tokens: newTokens,
        customer: customerData,
        isAuthenticated: true,
        isLoading: false,
      });

      return true;
    } catch (error) {
      console.error('Silent login failed:', error);
      // Si falla, limpiar almacenamiento
      await get().logout();
      return false;
    }
  },
}));
