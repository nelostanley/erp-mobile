// Pantalla de Login para pruebas en entorno de desarrollo sin servidor

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useAuthStore } from '../store/authStore';
import { COLORS, TYPOGRAPHY, SPACING } from '../constants/theme';
import { LoginMockResponse } from '../types';

interface LoginScreenProps {
  customerData: any;
  onSuccess: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ 
  customerData, 
  onSuccess 
}) => {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuthStore();

  const handleLogin = async () => {
    if (!password) {
      setError('Por favor ingrese su contraseña');
      return;
    }

    setLoading(true);
    setError('');

    // Para pruebas, aceptar cualquier contraseña
    try {
      console.log('Iniciando sesión con usuario de prueba...');
      
      // Simulamos un login exitoso
      setTimeout(() => {
        // Datos simulados para login
        const loginData: LoginMockResponse = {
          customer: customerData.customer,
          tokens: {
            accessToken: 'test-access-token-12345',
            refreshToken: 'test-refresh-token-12345'
          },
          sucursal: {
            id: 'suc-001',
            nombre: 'Sucursal Principal'
          },
          warehouse: {
            id: 'alm-001',
            name: 'Almacén Principal',
            code: 'ALM001',
            address: 'Av Principal 123',
            sucursalId: 'suc-001'
          }
        };

        // Guardar datos en el store
        login(loginData);
        setLoading(false);
        onSuccess();
      }, 1000);
    } catch (error: any) {
      setLoading(false);
      setError('Error de autenticación: ' + (error.message || 'Desconocido'));
      Alert.alert('Error', 'No se pudo iniciar sesión. Intente nuevamente.');
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Iniciar Sesión</Text>
          <Text style={styles.subtitle}>
            Complete la información para acceder
          </Text>
        </View>

        <Card style={styles.card}>
          <View style={styles.userInfoContainer}>
            <Text style={styles.infoLabel}>Cliente:</Text>
            <Text style={styles.infoValue}>{customerData.customer.name}</Text>
            
            <Text style={styles.infoLabel}>Email:</Text>
            <Text style={styles.infoValue}>{customerData.customer.email}</Text>
          </View>

          <View style={styles.inputContainer}>
            <Input
              label="Contraseña"
              placeholder="Ingrese su contraseña"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              error={error}
            />

            <Button
              title="Iniciar Sesión"
              onPress={handleLogin}
              loading={loading}
              disabled={!password}
            />
            
            <Text style={styles.devNote}>
              Modo de prueba: Ingrese cualquier contraseña
            </Text>
          </View>
        </Card>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Sistema ERP B2B Móvil
          </Text>
        </View>
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
    justifyContent: 'center',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.xxl,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  title: {
    fontSize: TYPOGRAPHY.h1.fontSize,
    fontWeight: TYPOGRAPHY.h1.fontWeight,
    color: COLORS.primary,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.body.fontSize,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  card: {
    padding: SPACING.lg,
    marginBottom: SPACING.xxl,
  },
  userInfoContainer: {
    marginBottom: SPACING.xl,
  },
  infoLabel: {
    fontSize: TYPOGRAPHY.caption.fontSize,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  infoValue: {
    fontSize: TYPOGRAPHY.body.fontSize,
    fontWeight: 'bold',
    marginBottom: SPACING.md,
  },
  inputContainer: {
    gap: SPACING.md,
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: TYPOGRAPHY.caption.fontSize,
    color: COLORS.textSecondary,
  },
  devNote: {
    fontSize: TYPOGRAPHY.caption.fontSize,
    color: COLORS.primary,
    textAlign: 'center',
    marginTop: SPACING.md,
    fontStyle: 'italic',
  }
});
