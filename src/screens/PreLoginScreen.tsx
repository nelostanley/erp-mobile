
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
  onSuccess: (customerData: any) => void;
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
      const response = await apiService.preLogin(email);
      onSuccess(response);
    } catch (error: any) {
      if (error.status === 404) {
        Alert.alert('Error', 'Email no registrado');
      } else {
        Alert.alert('Error', error.message || 'Error en la verificación');
      }
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
