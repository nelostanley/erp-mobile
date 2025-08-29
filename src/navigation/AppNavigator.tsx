
// Navegador principal de la aplicación

import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View, StyleSheet } from 'react-native';

import { PreLoginScreen } from '../screens/PreLoginScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { CartScreen } from '../screens/CartScreen';
import { OrdersScreen } from '../screens/OrdersScreen';
import { ProductDetailScreen } from '../screens/ProductDetailScreen';

import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import { COLORS, TYPOGRAPHY } from '../constants/theme';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Componente para el ícono de tab personalizado
const TabIcon = ({ name, focused }: { name: string; focused: boolean }) => {
  const getIcon = () => {
    switch (name) {
      case 'Home':
        return '🏠';
      case 'Favorites':
        return '❤️';
      case 'Orders':
        return '📦';
      case 'Cart':
        return '🛒';
      default:
        return '📱';
    }
  };

  return (
    <View style={styles.tabIcon}>
      <Text style={[styles.tabIconText, focused && styles.tabIconFocused]}>
        {getIcon()}
      </Text>
    </View>
  );
};

// Navegador de tabs principales
const MainTabs = () => {
  const { getItemCount } = useCartStore();
  const cartCount = getItemCount();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => (
          <TabIcon name={route.name} focused={focused} />
        ),
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="Inicio"
        options={{ 
          tabBarLabel: 'Inicio',
        }}
      >
        {() => (
          <MainStackNavigator />
        )}
      </Tab.Screen>
      
      <Tab.Screen
        name="Favoritos"
        options={{ 
          tabBarLabel: 'Favoritos',
        }}
      >
        {() => (
          <HomeScreen
            onNavigateToProduct={(productId) => {
              // Placeholder navigation for favorites
            }}
            onNavigateToCart={() => {
              // Placeholder navigation for favorites
            }}
          />
        )}
      </Tab.Screen>
      
      <Tab.Screen
        name="Pedidos"
        component={OrdersScreen}
        options={{ 
          tabBarLabel: 'Pedidos',
        }}
      />
      
      <Tab.Screen
        name="Mi carrito"
        options={{ 
          tabBarLabel: 'Mi carrito',
          tabBarBadge: cartCount > 0 ? cartCount : undefined,
        }}
      >
        {() => (
          <CartScreen
            onOrderSuccess={() => {
              // Navigation would be handled here
            }}
          />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

// Stack navigator para la pantalla principal y detalles
const MainStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain">
        {({ navigation }) => (
          <HomeScreen
            onNavigateToProduct={(productId) => {
              navigation.navigate('ProductDetail', { productId });
            }}
            onNavigateToCart={() => {
              navigation.navigate('Cart');
            }}
          />
        )}
      </Stack.Screen>
      
      <Stack.Screen name="ProductDetail">
        {({ route, navigation }) => (
          <ProductDetailScreen
            productId={(route.params as any).productId}
            onNavigateBack={() => navigation.goBack()}
            onNavigateToCart={() => {
              navigation.navigate('Cart');
            }}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

// Navegador principal de la aplicación
export const AppNavigator = () => {
  const { isAuthenticated, isLoading, attemptSilentLogin } = useAuthStore();
  const [preLoginData, setPreLoginData] = React.useState<any>(null);

  useEffect(() => {
    attemptSilentLogin();
  }, []);

  // Mostrar loading screen mientras verifica autenticación
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Cargando...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <>
            <Stack.Screen name="PreLogin">
              {() => (
                <PreLoginScreen
                  onSuccess={(data) => setPreLoginData(data)}
                />
              )}
            </Stack.Screen>
            
            {preLoginData && (
              <Stack.Screen name="Login">
                {() => (
                  <LoginScreen
                    customerData={preLoginData}
                    onSuccess={() => {
                      // La autenticación se maneja en el store
                    }}
                  />
                )}
              </Stack.Screen>
            )}
          </>
        ) : (
          <Stack.Screen name="Main" component={MainTabs} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  loadingText: {
    fontSize: TYPOGRAPHY.body.fontSize,
    color: COLORS.textSecondary,
  },
  tabBar: {
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: COLORS.disabled,
    paddingBottom: 8,
    paddingTop: 8,
    height: 80,
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  tabIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIconText: {
    fontSize: 20,
    opacity: 0.6,
  },
  tabIconFocused: {
    opacity: 1,
  },
});
