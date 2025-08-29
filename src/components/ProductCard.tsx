
// Tarjeta de producto según las imágenes de referencia

import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { ProductListItem } from '../types';
import { COLORS, TYPOGRAPHY, BORDER_RADIUS, SPACING } from '../constants/theme';
import { Badge } from './Badge';
import { Button } from './Button';

interface ProductCardProps {
  product: ProductListItem;
  onPress: () => void;
  onAddToCart: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onPress,
  onAddToCart,
}) => {
  const formatPrice = (price: number) => {
    return `Bs. ${price.toFixed(2)}`;
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri: product.imageUrl || 'https://i.ytimg.com/vi/N1R1xeCCz2k/sddefault.jpg'
          }}
          style={styles.image}
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
        <Text style={styles.productName} numberOfLines={2}>
          {product.name}
        </Text>

        <Text style={styles.productCode}>
          {product.sku} • {product.category.name}
        </Text>

        <View style={styles.priceContainer}>
          <Text style={styles.price}>
            {formatPrice(product.priceInfo.finalPrice)}
          </Text>
          <Text style={styles.unit}>
            {product.unitOfMeasure.name}
          </Text>
        </View>

        <Text style={styles.pricePerUnit}>
          Bs. {(product.priceInfo.finalPrice / 6).toFixed(2)} c/u
        </Text>

        <View style={styles.buttonContainer}>
          <Button
            title="Agregar"
            onPress={onAddToCart}
            style={styles.addButton}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.lg,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,
    elevation: 2,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    height: 150,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  badgeContainer: {
    position: 'absolute',
    top: SPACING.sm,
    left: SPACING.sm,
  },
  content: {
    padding: SPACING.lg,
  },
  productName: {
    fontSize: TYPOGRAPHY.h3.fontSize,
    fontWeight: TYPOGRAPHY.h3.fontWeight,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  productCode: {
    fontSize: TYPOGRAPHY.caption.fontSize,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: SPACING.xs,
  },
  price: {
    fontSize: TYPOGRAPHY.h1.fontSize,
    fontWeight: TYPOGRAPHY.h1.fontWeight,
    color: COLORS.textPrimary,
    marginRight: SPACING.xs,
  },
  unit: {
    fontSize: TYPOGRAPHY.caption.fontSize,
    color: COLORS.textSecondary,
  },
  pricePerUnit: {
    fontSize: TYPOGRAPHY.caption.fontSize,
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg,
  },
  buttonContainer: {
    alignItems: 'center',
  },
  addButton: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.xl,
    minHeight: 40,
    alignSelf: 'stretch',
  },
});
