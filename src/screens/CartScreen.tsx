
// Pantalla Mi Carrito según las imágenes de referencia

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useCartStore } from '../store/cartStore';
import { apiService } from '../services/api';
import { COLORS, TYPOGRAPHY, SPACING } from '../constants/theme';
import { CartItem } from '../types';

interface CartScreenProps {
  onOrderSuccess: () => void;
}

export const CartScreen: React.FC<CartScreenProps> = ({ onOrderSuccess }) => {
  const { items, total, updateQuantity, removeItem, clearCart } = useCartStore();
  const [loading, setLoading] = React.useState(false);

  const formatPrice = (price: number) => {
    return `Bs. ${price.toFixed(2)}`;
  };

  const handleQuantityChange = (productId: string, change: number) => {
    const item = items.find(i => i.product.id === productId);
    if (item) {
      const newQuantity = item.quantity + change;
      if (newQuantity <= 0) {
        removeItem(productId);
      } else {
        updateQuantity(productId, newQuantity);
      }
    }
  };

  const handleContinuePedido = async () => {
    if (items.length === 0) {
      Alert.alert('Carrito vacío', 'Agregue productos al carrito para continuar');
      return;
    }

    Alert.alert(
      'Confirmar Pedido',
      `¿Desea crear un pedido por ${formatPrice(total)}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Confirmar', onPress: createOrder },
      ]
    );
  };

  const createOrder = async () => {
    setLoading(true);
    try {
      const orderData = {
        items: items.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
      };

      await apiService.createOrder(orderData);
      clearCart();
      Alert.alert(
        'Pedido Creado',
        'Su pedido ha sido enviado exitosamente',
        [{ text: 'OK', onPress: onOrderSuccess }]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'No se pudo crear el pedido');
    } finally {
      setLoading(false);
    }
  };

  const handleVaciarCarrito = () => {
    Alert.alert(
      'Vaciar Carrito',
      '¿Está seguro que desea eliminar todos los productos?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Vaciar', style: 'destructive', onPress: clearCart },
      ]
    );
  };

  const renderCartItem = ({ item }: { item: CartItem }) => (
    <Card style={styles.cartItem}>
      <View style={styles.itemHeader}>
        <Image
          source={{
            uri: item.product.imageUrl || 'https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images.jpg?v=1603109892'
          }}
          style={styles.productImage}
        />
        <View style={styles.itemInfo}>
          <Text style={styles.productName} numberOfLines={2}>
            {item.product.name}
          </Text>
          <Text style={styles.productCode}>
            {item.product.sku}
          </Text>
          <Text style={styles.unitInfo}>
            6 u x caja • Bs. {(item.product.priceInfo.finalPrice / 6).toFixed(2)} c/u
          </Text>
        </View>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => removeItem(item.product.id)}
        >
          <Text style={styles.removeButtonText}>✕</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.quantityContainer}>
        <View style={styles.quantityControls}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => handleQuantityChange(item.product.id, -1)}
          >
            <Text style={styles.quantityButtonText}>−</Text>
          </TouchableOpacity>
          
          <Text style={styles.quantity}>{item.quantity}</Text>
          
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => handleQuantityChange(item.product.id, 1)}
          >
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.itemPrice}>
          {formatPrice(item.product.priceInfo.finalPrice * item.quantity)}
        </Text>
      </View>
    </Card>
  );

  if (items.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Su carrito está vacío</Text>
        <Text style={styles.emptySubtext}>
          Agregue productos desde el catálogo
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mi carrito</Text>
        <TouchableOpacity onPress={handleVaciarCarrito}>
          <Text style={styles.clearButton}>Vaciar Carrito</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={items}
        renderItem={renderCartItem}
        keyExtractor={(item) => item.product.id}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.summary}>
        <Text style={styles.summaryTitle}>
          Resumen ({items.length} producto{items.length !== 1 ? 's' : ''})
        </Text>
        <Text style={styles.total}>Total: {formatPrice(total)}</Text>

        <Button
          title="Continuar pedido"
          onPress={handleContinuePedido}
          loading={loading}
          style={styles.continueButton}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.surface,
  },
  headerTitle: {
    fontSize: TYPOGRAPHY.h2.fontSize,
    fontWeight: TYPOGRAPHY.h2.fontWeight,
    color: COLORS.textPrimary,
  },
  clearButton: {
    fontSize: TYPOGRAPHY.label.fontSize,
    color: COLORS.primary,
  },
  content: {
    padding: SPACING.lg,
    paddingBottom: 200, // Space for summary
  },
  cartItem: {
    marginBottom: SPACING.lg,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: SPACING.md,
  },
  itemInfo: {
    flex: 1,
  },
  productName: {
    fontSize: TYPOGRAPHY.body.fontSize,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  productCode: {
    fontSize: TYPOGRAPHY.caption.fontSize,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  unitInfo: {
    fontSize: TYPOGRAPHY.caption.fontSize,
    color: COLORS.textSecondary,
  },
  removeButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeButtonText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  quantityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.disabled,
    borderRadius: 20,
    paddingHorizontal: SPACING.sm,
  },
  quantityButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  quantity: {
    fontSize: TYPOGRAPHY.body.fontSize,
    fontWeight: '600',
    color: COLORS.textPrimary,
    minWidth: 32,
    textAlign: 'center',
  },
  itemPrice: {
    fontSize: TYPOGRAPHY.h3.fontSize,
    fontWeight: TYPOGRAPHY.h3.fontWeight,
    color: COLORS.textPrimary,
  },
  summary: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: COLORS.disabled,
    padding: SPACING.lg,
  },
  summaryTitle: {
    fontSize: TYPOGRAPHY.body.fontSize,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  total: {
    fontSize: TYPOGRAPHY.h1.fontSize,
    fontWeight: TYPOGRAPHY.h1.fontWeight,
    color: COLORS.textPrimary,
    marginBottom: SPACING.lg,
  },
  continueButton: {
    backgroundColor: COLORS.primary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  emptyText: {
    fontSize: TYPOGRAPHY.h2.fontSize,
    fontWeight: TYPOGRAPHY.h2.fontWeight,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: TYPOGRAPHY.body.fontSize,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});
