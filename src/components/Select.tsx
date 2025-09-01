// Componente Select optimizado para móvil nativo usando react-native-picker-select

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { COLORS, TYPOGRAPHY, BORDER_RADIUS, SPACING } from '../constants/theme';

interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps {
  label?: string;
  value: string;
  onValueChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
}

export const Select: React.FC<SelectProps> = ({
  label,
  value,
  onValueChange,
  options,
  placeholder = "Seleccione una opción",
  disabled = false,
}) => {
  // Convertir opciones al formato requerido por react-native-picker-select
  const pickerItems = options.map(option => ({
    label: option.label,
    value: option.value,
  }));

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[
        styles.pickerContainer,
        disabled && styles.pickerDisabled
      ]}>
        <RNPickerSelect
          onValueChange={(itemValue) => {
            console.log('RNPickerSelect onValueChange:', itemValue);
            if (itemValue) {
              onValueChange(itemValue);
            }
          }}
          items={pickerItems}
          value={value}
          placeholder={{
            label: placeholder,
            value: null,
            color: COLORS.textSecondary,
          }}
          disabled={disabled}
          style={{
            inputIOS: styles.pickerInput,
            inputAndroid: styles.pickerInput,
            placeholder: {
              color: COLORS.textSecondary,
              fontSize: TYPOGRAPHY.body.fontSize,
            },
          }}
          useNativeAndroidPickerStyle={false}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.lg,
  },
  label: {
    fontSize: TYPOGRAPHY.label.fontSize,
    fontWeight: TYPOGRAPHY.label.fontWeight,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: COLORS.disabled,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: COLORS.background,
    minHeight: 50,
    justifyContent: 'center',
  },
  pickerDisabled: {
    backgroundColor: COLORS.surface,
    opacity: 0.6,
  },
  pickerInput: {
    fontSize: TYPOGRAPHY.body.fontSize,
    color: COLORS.textPrimary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    minHeight: 50,
  },
});
