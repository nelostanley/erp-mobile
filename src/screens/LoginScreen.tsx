
// Pantalla de Login según ANEXO C - Pasos 2 y 3: Configuración y Login Final

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { apiService } from '../services/api';
import { useAuthStore } from '../store/authStore';
import { COLORS, TYPOGRAPHY, SPACING } from '../constants/theme';
import { Sucursal, Warehouse } from '../types';

interface LoginScreenProps {
  customerData: any;
  onSuccess: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ 
  customerData, 
  onSuccess 
}) => {
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [almacenes, setAlmacenes] = useState<Warehouse[]>([]);
  const [selectedSucursal, setSelectedSucursal] = useState<string>('');
  const [selectedAlmacen, setSelectedAlmacen] = useState<string>('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingSucursales, setLoadingSucursales] = useState(false);
  const [loadingAlmacenes, setLoadingAlmacenes] = useState(false);

  const { login } = useAuthStore();

  // Cargar sucursales al montar el componente
  useEffect(() => {
    loadSucursales();
  }, []);

  // Cargar almacenes cuando se selecciona una sucursal
  useEffect(() => {
    if (selectedSucursal) {
      loadAlmacenes(selectedSucursal);
      setSelectedAlmacen(''); // Reset almacén selection
    }
  }, [selectedSucursal]);

  const loadSucursales = async () => {
    setLoadingSucursales(true);
    try {
      const data = await apiService.getSucursales();
      setSucursales(data);
    } catch (error: any) {
      Alert.alert('Error', 'No se pudieron cargar las sucursales');
    } finally {
      setLoadingSucursales(false);
    }
  };

  const loadAlmacenes = async (sucursalId: string) => {
    setLoadingAlmacenes(true);
    try {
      const data = await apiService.getAlmacenes(sucursalId);
      setAlmacenes(data);
    } catch (error: any) {
      Alert.alert('Error', 'No se pudieron cargar los almacenes');
    } finally {
      setLoadingAlmacenes(false);
    }
  };

  const handleLogin = async () => {
    if (!selectedSucursal || !selectedAlmacen || !password.trim()) {
      Alert.alert('Error', 'Por favor complete todos los campos');
      return;
    }

    setLoading(true);

    try {
      const loginData = {
        email: customerData.customer.email,
        password: password,
        sucursalId: selectedSucursal,
        almacenId: selectedAlmacen,
      };

      const response = await apiService.login(loginData);
      await login(response);
      onSuccess();
    } catch (error: any) {
      if (error.status === 401) {
        Alert.alert('Error', 'Contraseña incorrecta');
      } else {
        Alert.alert('Error', error.message || 'Error en el inicio de sesión');
      }
    } finally {
      setLoading(false);
    }
  };

  const isLoginEnabled = selectedSucursal && selectedAlmacen && password.trim();

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Configuración</Text>
          <Text style={styles.subtitle}>
            Configure su entorno de trabajo
          </Text>
        </View>

        {/* Información del Cliente */}
        <Card style={styles.customerInfo}>
          <Text style={styles.cardTitle}>Datos del Cliente</Text>
          <Text style={styles.customerName}>{customerData.customer.name}</Text>
          <Text style={styles.customerDetails}>
            {customerData.customer.address}
          </Text>
          <Text style={styles.customerDetails}>
            {customerData.customer.email}
          </Text>
        </Card>

        {/* Selección de Sucursal */}
        <Card>
          <Text style={styles.cardTitle}>Seleccionar Sucursal</Text>
          {loadingSucursales ? (
            <Text style={styles.loadingText}>Cargando sucursales...</Text>
          ) : (
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedSucursal}
                onValueChange={setSelectedSucursal}
                style={styles.picker}
              >
                <Picker.Item label="Seleccione una sucursal" value="" />
                {sucursales.map((sucursal) => (
                  <Picker.Item
                    key={sucursal.id}
                    label={sucursal.name}
                    value={sucursal.id}
                  />
                ))}
              </Picker>
            </View>
          )}
        </Card>

        {/* Selección de Almacén */}
        <Card>
          <Text style={styles.cardTitle}>Seleccionar Almacén</Text>
          {loadingAlmacenes ? (
            <Text style={styles.loadingText}>Cargando almacenes...</Text>
          ) : (
            <View style={[
              styles.pickerContainer,
              !selectedSucursal && styles.pickerDisabled
            ]}>
              <Picker
                selectedValue={selectedAlmacen}
                onValueChange={setSelectedAlmacen}
                enabled={!!selectedSucursal && !loadingAlmacenes}
                style={styles.picker}
              >
                <Picker.Item label="Seleccione un almacén" value="" />
                {almacenes.map((almacen) => (
                  <Picker.Item
                    key={almacen.id}
                    label={almacen.name}
                    value={almacen.id}
                  />
                ))}
              </Picker>
            </View>
          )}
        </Card>

        {/* Campo de Contraseña */}
        <View style={styles.passwordSection}>
          <Input
            label="Contraseña (Número de Teléfono)"
            value={password}
            onChangeText={setPassword}
            placeholder="Ingrese su número de teléfono"
            secureTextEntry={true}
            keyboardType="phone-pad"
            disabled={!selectedSucursal || !selectedAlmacen}
          />
        </View>

        <Button
          title="Iniciar Sesión"
          onPress={handleLogin}
          loading={loading}
          disabled={!isLoginEnabled}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  title: {
    fontSize: TYPOGRAPHY.h2.fontSize,
    fontWeight: TYPOGRAPHY.h2.fontWeight,
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.body.fontSize,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  customerInfo: {
    marginBottom: SPACING.lg,
  },
  cardTitle: {
    fontSize: TYPOGRAPHY.h3.fontSize,
    fontWeight: TYPOGRAPHY.h3.fontWeight,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  customerName: {
    fontSize: TYPOGRAPHY.body.fontSize,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  customerDetails: {
    fontSize: TYPOGRAPHY.label.fontSize,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: COLORS.disabled,
    borderRadius: 8,
    backgroundColor: COLORS.background,
  },
  pickerDisabled: {
    backgroundColor: COLORS.surface,
    opacity: 0.6,
  },
  picker: {
    height: 50,
    color: COLORS.textPrimary,
  },
  loadingText: {
    fontSize: TYPOGRAPHY.body.fontSize,
    color: COLORS.textSecondary,
    textAlign: 'center',
    paddingVertical: SPACING.lg,
  },
  passwordSection: {
    marginTop: SPACING.lg,
    marginBottom: SPACING.lg,
  },
});
