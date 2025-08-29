
// Pantalla principal según las imágenes de referencia

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  Alert,
} from 'react-native';
import { ProductCard } from '../components/ProductCard';
import { apiService } from '../services/api';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import { ProductListItem } from '../types';
import { COLORS, TYPOGRAPHY, SPACING } from '../constants/theme';

interface HomeScreenProps {
  onNavigateToProduct: (productId: string) => void;
  onNavigateToCart: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigateToProduct,
  onNavigateToCart,
}) => {
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const { customer, warehouse } = useAuthStore();
  const { addItem } = useCartStore();

  useEffect(() => {
    loadProducts(true);
  }, []);

  const loadProducts = async (reset = false) => {
    if (loading && !reset) return;

    const currentPage = reset ? 1 : page;
    setLoading(true);

    try {
      const response = await apiService.getProducts(currentPage, 20);
      
      if (reset) {
        setProducts(response.products);
        setPage(2);
      } else {
        setProducts(prev => [...prev, ...response.products]);
        setPage(prev => prev + 1);
      }
      
      setHasMore(response.hasMore);
    } catch (error: any) {
      Alert.alert('Error', 'No se pudieron cargar los productos');
    } finally {
      setLoading(false);
      if (refreshing) setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadProducts(true);
  };

  const handleLoadMore = () => {
    if (hasMore && !loading) {
      loadProducts(false);
    }
  };

  const handleAddToCart = (product: ProductListItem) => {
    addItem(product, 1);
    Alert.alert(
      'Producto agregado',
      `${product.name} se agregó al carrito`,
      [
        { text: 'Continuar', style: 'default' },
        { text: 'Ver Carrito', onPress: onNavigateToCart },
      ]
    );
  };

  const renderProduct = ({ item }: { item: ProductListItem }) => (
    <ProductCard
      product={item}
      onPress={() => onNavigateToProduct(item.id)}
      onAddToCart={() => handleAddToCart(item)}
    />
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.welcomeText}>
        Recibe el <Text style={styles.deliveryDate}>Sábado 28</Text>
      </Text>
      <Text style={styles.customerName}>
        {customer?.name?.toUpperCase() || 'CLIENTE'}
      </Text>
      
      {warehouse && (
        <View style={styles.warehouseInfo}>
          <Text style={styles.warehouseText}>
            📍 {warehouse.name}
          </Text>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.content}
        ListHeaderComponent={renderHeader}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING.lg,
  },
  header: {
    backgroundColor: COLORS.primary,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    borderRadius: 12,
    marginHorizontal: -SPACING.lg,
    marginTop: -SPACING.lg,
  },
  welcomeText: {
    fontSize: TYPOGRAPHY.body.fontSize,
    color: COLORS.white,
    marginBottom: SPACING.xs,
  },
  deliveryDate: {
    fontWeight: '600',
  },
  customerName: {
    fontSize: TYPOGRAPHY.h2.fontSize,
    fontWeight: TYPOGRAPHY.h2.fontWeight,
    color: COLORS.white,
    marginBottom: SPACING.sm,
  },
  warehouseInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  warehouseText: {
    fontSize: TYPOGRAPHY.label.fontSize,
    color: COLORS.white,
    opacity: 0.9,
  },
  row: {
    justifyContent: 'space-between',
  },
});
