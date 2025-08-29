
// Componente Badge según especificaciones ANEXO E

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING } from '../constants/theme';

interface BadgeProps {
  text: string;
  variant?: 'success' | 'warning' | 'primary' | 'default';
  style?: any;
}

export const Badge: React.FC<BadgeProps> = ({ 
  text, 
  variant = 'default',
  style 
}) => {
  const getBackgroundColor = () => {
    switch (variant) {
      case 'success':
        return COLORS.statusSuccess;
      case 'warning':
        return COLORS.accent;
      case 'primary':
        return COLORS.primary;
      default:
        return COLORS.disabled;
    }
  };

  return (
    <View style={[
      styles.container,
      { backgroundColor: getBackgroundColor() },
      style,
    ]}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
    alignSelf: 'flex-start',
  },
  text: {
    color: COLORS.white,
    fontSize: TYPOGRAPHY.caption.fontSize,
    fontWeight: TYPOGRAPHY.caption.fontWeight,
  },
});
