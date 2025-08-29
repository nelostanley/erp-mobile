
// Store del carrito de compras con Zustand

import { create } from 'zustand';
import { CartState, CartItem, ProductListItem } from '../types';

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  total: 0,

  addItem: (product, quantity) => {
    const items = get().items;
    const existingItemIndex = items.findIndex(item => item.product.id === product.id);

    let newItems: CartItem[];

    if (existingItemIndex >= 0) {
      // Si el producto ya existe, actualizar cantidad
      newItems = items.map((item, index) => 
        index === existingItemIndex 
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      // Si es nuevo, agregarlo
      newItems = [...items, { product, quantity }];
    }

    const newTotal = newItems.reduce(
      (sum, item) => sum + (item.product.priceInfo.finalPrice * item.quantity),
      0
    );

    set({ items: newItems, total: newTotal });
  },

  removeItem: (productId) => {
    const newItems = get().items.filter(item => item.product.id !== productId);
    const newTotal = newItems.reduce(
      (sum, item) => sum + (item.product.priceInfo.finalPrice * item.quantity),
      0
    );

    set({ items: newItems, total: newTotal });
  },

  updateQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(productId);
      return;
    }

    const newItems = get().items.map(item => 
      item.product.id === productId 
        ? { ...item, quantity }
        : item
    );

    const newTotal = newItems.reduce(
      (sum, item) => sum + (item.product.priceInfo.finalPrice * item.quantity),
      0
    );

    set({ items: newItems, total: newTotal });
  },

  clearCart: () => {
    set({ items: [], total: 0 });
  },

  getItemCount: () => {
    return get().items.reduce((sum, item) => sum + item.quantity, 0);
  },
}));
