
// Pantalla de Pre-Login según ANEXO C - Paso 1: Verificación de Identidad

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
import { apiService } from '../services/api';
import { COLORS, TYPOGRAPHY, SPACING } from '../constants/theme';

interface PreLoginScreenProps {
  onSuccess: (customerData: any, email: string) => void;
}

export const PreLoginScreen: React.FC<PreLoginScreenProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleContinue = async () => {
    if (!email.trim()) {
      setError('Por favor ingrese su email');
      return;
    }

    if (!email.includes('@')) {
      setError('Por favor ingrese un email válido');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log(`Pre-login: Iniciando con email ${email} en plataforma ${Platform.OS}`);
      
      // Si no es el usuario de prueba, intentar la solicitud normal
      const response = await apiService.preLogin(email);
      console.log('Pre-login exitoso:', response);
      onSuccess(response, email);
    } catch (error: any) {
      console.error('Error en pre-login:', error);
      
      let errorMessage = 'Error de conexión con el servidor';
      
      if (error.response) {
        // Error del servidor con respuesta
        console.error('Servidor respondió con error:', error.response.status);
        if (error.response.status === 404) {
          errorMessage = 'Email no registrado en el sistema';
        } else {
          errorMessage = `Error ${error.response.status}: Por favor contacte al administrador`;
        }
      } else if (error.request) {
        // No se recibió respuesta del servidor
        console.error('Sin respuesta del servidor');
        errorMessage = 'No se pudo conectar al servidor. Verifique su conexión de red.';
      } else {
        // Error de configuración
        console.error('Error de configuración:', error.message);
        errorMessage = `Error de conexión: ${error.message}`;
      }
      
      Alert.alert(
        'Error', 
        errorMessage,
        [{ text: 'Aceptar' }]
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>¡Bienvenido!</Text>
          <Text style={styles.subtitle}>
            Ingrese su email para continuar
          </Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="ejemplo@empresa.com"
            keyboardType="email-address"
            error={error}
          />

          <Button
            title="Continuar"
            onPress={handleContinue}
            loading={loading}
            disabled={!email.trim()}
          />
        </View>

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
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xxl * 2,
  },
  title: {
    fontSize: TYPOGRAPHY.h1.fontSize,
    fontWeight: TYPOGRAPHY.h1.fontWeight,
    color: COLORS.primary,
    marginBottom: SPACING.md,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.body.fontSize,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  form: {
    marginBottom: SPACING.xxl,
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: TYPOGRAPHY.caption.fontSize,
    color: COLORS.textSecondary,
  },
});
