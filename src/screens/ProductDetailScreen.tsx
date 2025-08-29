
// Pantalla de detalle de producto con tabla de precios según ANEXO E

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { apiService } from '../services/api';
import { useCartStore } from '../store/cartStore';
import { Product } from '../types';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../constants/theme';

interface ProductDetailScreenProps {
  productId: string;
  onNavigateBack: () => void;
  onNavigateToCart: () => void;
}

export const ProductDetailScreen: React.FC<ProductDetailScreenProps> = ({
  productId,
  onNavigateBack,
  onNavigateToCart,
}) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  const { addItem } = useCartStore();

  useEffect(() => {
    loadProduct();
  }, [productId]);

  const loadProduct = async () => {
    try {
      const data = await apiService.getProductById(productId);
      setProduct(data);
    } catch (error: any) {
      Alert.alert('Error', 'No se pudo cargar el producto');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return `Bs. ${price.toFixed(2)}`;
  };

  const handleQuantityChange = (change: number) => {
    const newQuantity = Math.max(1, quantity + change);
    setQuantity(newQuantity);
  };

  const handleAddToCart = () => {
    if (!product) return;

    const productListItem = {
      id: product.id,
      sku: product.sku,
      name: product.name,
      description: product.description,
      imageUrl: product.imageUrl,
      category: product.category,
      unitOfMeasure: product.unitOfMeasure,
      priceInfo: product.priceInfo,
    };

    addItem(productListItem, quantity);
    Alert.alert(
      'Producto agregado',
      `${quantity} ${product.name} se agregó al carrito`,
      [
        { text: 'Continuar', style: 'default' },
        { text: 'Ver Carrito', onPress: onNavigateToCart },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Cargando producto...</Text>
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No se pudo cargar el producto</Text>
        <Button title="Volver" onPress={onNavigateBack} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri: product.imageUrl || 'https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image_large.png?v=1530129081'
          }}
          style={styles.productImage}
          resizeMode="cover"
        />
        {product.priceInfo.hasDiscount && (
          <View style={styles.badgeContainer}>
            <Badge
              text={`${product.priceInfo.discountPercentage}% descuento`}
              variant="warning"
            />
          </View>
        )}
      </View>

      <View style={styles.content}>
        <Text style={styles.productName}>{product.name}</Text>
        
        {product.description && (
          <Text style={styles.productDescription}>{product.description}</Text>
        )}

        <View style={styles.productInfo}>
          <Text style={styles.productCode}>SKU: {product.sku}</Text>
          <Text style={styles.productCategory}>{product.category.name}</Text>
        </View>

        <View style={styles.priceSection}>
          <View style={styles.mainPrice}>
            <Text style={styles.price}>
              {formatPrice(product.priceInfo.finalPrice)}
            </Text>
            <Text style={styles.unit}>6 unidades</Text>
          </View>
          <Text style={styles.pricePerUnit}>
            {product.unitOfMeasure.name} x{product.unitOfMeasure.abbreviation}. {(product.priceInfo.finalPrice / 6).toFixed(2)} c/u
          </Text>
        </View>

        <Card style={styles.quantityCard}>
          <View style={styles.quantitySection}>
            <View style={styles.quantityControls}>
              <Button
                title="−"
                onPress={() => handleQuantityChange(-1)}
                style={styles.quantityButton}
              />
              <Text style={styles.quantityText}>{quantity}</Text>
              <Button
                title="+"
                onPress={() => handleQuantityChange(1)}
                style={styles.quantityButton}
              />
            </View>
            <Text style={styles.totalQuantity}>
              6 unidades x{product.unitOfMeasure.abbreviation}. {(product.priceInfo.finalPrice * quantity / 6).toFixed(2)} c/u
            </Text>
          </View>
        </Card>

        <Card style={styles.characteristicsCard}>
          <Text style={styles.cardTitle}>Características</Text>
          <View style={styles.characteristic}>
            <Text style={styles.characteristicLabel}>• Detalle de caja:</Text>
            <Text style={styles.characteristicValue}>6 unidades x 3 LT</Text>
          </View>
          <View style={styles.characteristic}>
            <Text style={styles.characteristicLabel}>• Precio por unidad:</Text>
            <Text style={styles.characteristicValue}>
              {formatPrice(product.priceInfo.finalPrice / 6)}
            </Text>
          </View>
          <View style={styles.characteristic}>
            <Text style={styles.characteristicLabel}>• Empaque unidad:</Text>
            <Text style={styles.characteristicValue}>botella no retornable</Text>
          </View>
          <View style={styles.characteristic}>
            <Text style={styles.characteristicLabel}>• SKU:</Text>
            <Text style={styles.characteristicValue}>{product.sku}</Text>
          </View>
        </Card>

        {/* Tabla de Precios por Volumen según ANEXO E */}
        {product.priceInfo.volumeDiscounts && product.priceInfo.volumeDiscounts.length > 0 && (
          <Card style={styles.priceTableCard}>
            <Text style={styles.cardTitle}>Oferta desde 2 cajas</Text>
            <Text style={styles.offerSubtext}>
              Llevas más y paga menos en el precio final por unidad de producto.
            </Text>
            
            <View style={styles.priceTable}>
              <View style={styles.tableHeader}>
                <Text style={styles.tableHeaderText}>Cantidad</Text>
                <Text style={styles.tableHeaderText}>Descuento</Text>
                <Text style={styles.tableHeaderText}>Precio x caja</Text>
              </View>
              
              {product.priceInfo.volumeDiscounts.map((discount, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={styles.tableCellText}>
                    {discount.quantity === 1 
                      ? '1' 
                      : `${discount.quantity} a 9999`
                    }
                  </Text>
                  <Text style={styles.tableCellText}>
                    {discount.discount === 0 ? 'No aplica' : `${discount.discount}%`}
                  </Text>
                  <Text style={styles.tableCellText}>
                    {formatPrice(discount.pricePerBox)}
                  </Text>
                </View>
              ))}
            </View>
          </Card>
        )}

        <View style={styles.bottomButtons}>
          <Button
            title="Agregar al carrito"
            onPress={handleAddToCart}
            style={styles.addButton}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: TYPOGRAPHY.body.fontSize,
    color: COLORS.textSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  errorText: {
    fontSize: TYPOGRAPHY.body.fontSize,
    color: COLORS.textPrimary,
    marginBottom: SPACING.lg,
    textAlign: 'center',
  },
  imageContainer: {
    position: 'relative',
    height: 300,
    backgroundColor: COLORS.surface,
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  badgeContainer: {
    position: 'absolute',
    top: SPACING.lg,
    left: SPACING.lg,
  },
  content: {
    padding: SPACING.lg,
  },
  productName: {
    fontSize: TYPOGRAPHY.h2.fontSize,
    fontWeight: TYPOGRAPHY.h2.fontWeight,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  productDescription: {
    fontSize: TYPOGRAPHY.body.fontSize,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
    lineHeight: 20,
  },
  productInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
  },
  productCode: {
    fontSize: TYPOGRAPHY.label.fontSize,
    color: COLORS.textSecondary,
  },
  productCategory: {
    fontSize: TYPOGRAPHY.label.fontSize,
    color: COLORS.primary,
    fontWeight: '600',
  },
  priceSection: {
    marginBottom: SPACING.lg,
  },
  mainPrice: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: SPACING.xs,
  },
  price: {
    fontSize: TYPOGRAPHY.h1.fontSize,
    fontWeight: TYPOGRAPHY.h1.fontWeight,
    color: COLORS.textPrimary,
    marginRight: SPACING.sm,
  },
  unit: {
    fontSize: TYPOGRAPHY.body.fontSize,
    color: COLORS.textSecondary,
  },
  pricePerUnit: {
    fontSize: TYPOGRAPHY.caption.fontSize,
    color: COLORS.textSecondary,
  },
  quantityCard: {
    marginBottom: SPACING.lg,
  },
  quantitySection: {
    alignItems: 'center',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginHorizontal: SPACING.lg,
  },
  quantityText: {
    fontSize: TYPOGRAPHY.h2.fontSize,
    fontWeight: TYPOGRAPHY.h2.fontWeight,
    color: COLORS.textPrimary,
    minWidth: 30,
    textAlign: 'center',
  },
  totalQuantity: {
    fontSize: TYPOGRAPHY.caption.fontSize,
    color: COLORS.textSecondary,
  },
  characteristicsCard: {
    marginBottom: SPACING.lg,
  },
  cardTitle: {
    fontSize: TYPOGRAPHY.h3.fontSize,
    fontWeight: TYPOGRAPHY.h3.fontWeight,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  characteristic: {
    marginBottom: SPACING.sm,
  },
  characteristicLabel: {
    fontSize: TYPOGRAPHY.body.fontSize,
    color: COLORS.textPrimary,
  },
  characteristicValue: {
    fontSize: TYPOGRAPHY.body.fontSize,
    color: COLORS.textSecondary,
    marginLeft: SPACING.md,
  },
  priceTableCard: {
    marginBottom: SPACING.lg,
    backgroundColor: '#E3F2FD', // Light blue background as in reference image
  },
  offerSubtext: {
    fontSize: TYPOGRAPHY.caption.fontSize,
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg,
    lineHeight: 16,
  },
  priceTable: {
    borderWidth: 1,
    borderColor: COLORS.disabled,
    borderRadius: BORDER_RADIUS.sm,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.sm,
  },
  tableHeaderText: {
    flex: 1,
    fontSize: TYPOGRAPHY.label.fontSize,
    fontWeight: TYPOGRAPHY.label.fontWeight,
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: COLORS.disabled,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.sm,
  },
  tableCellText: {
    flex: 1,
    fontSize: TYPOGRAPHY.body.fontSize,
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  bottomButtons: {
    paddingTop: SPACING.lg,
  },
  addButton: {
    backgroundColor: COLORS.primary,
  },
});
