// Servidor proxy mejorado para comunicación con BFF
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3001;
const BFF_SERVER = 'http://localhost:3000';

// Configuración avanzada para el servidor proxy
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parsear JSON en el body de las solicitudes
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware para registro detallado de solicitudes
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  if (req.body && Object.keys(req.body).length > 0) {
    // Mostrar el cuerpo de la solicitud pero ocultar las contraseñas
    const sanitizedBody = { ...req.body };
    if (sanitizedBody.password) {
      sanitizedBody.password = '********';
    }
    console.log('Body:', JSON.stringify(sanitizedBody, null, 2));
  }
  next();
});

// Ruta de verificación de salud
app.get('/health', (req, res) => {
  res.status(200).send({ status: 'ok', timestamp: new Date().toISOString() });
});

// Manejador específico para pre-login
app.post('/api/auth/mobile/pre-login', async (req, res) => {
  try {
    console.log('Recibida solicitud de pre-login:', req.body);
    
    // Usuario de prueba para depuración
    if (req.body.email === 'test@example.com') {
      console.log('Usuario de prueba detectado, devolviendo respuesta simulada');
      return res.json({
        customer: {
          id: '12345',
          code: 'TEST001',
          name: 'Usuario de Prueba',
          address: 'Calle Test 123',
          phone: '555-1234',
          email: 'test@example.com',
          customerTypeId: '1',
          isActive: true
        },
        message: 'Usuario encontrado con éxito'
      });
    }
    
    // Reenviar la solicitud al servidor BFF
    console.log(`Reenviando solicitud a ${BFF_SERVER}/api/auth/mobile/pre-login`);
    const response = await axios.post(`${BFF_SERVER}/api/auth/mobile/pre-login`, req.body, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });
    
    console.log('Respuesta recibida del servidor BFF:', response.data);
    res.json(response.data);
  } catch (error) {
    console.error('Error al procesar la solicitud de pre-login:', error.message);
    
    // Proporcionar respuesta de error detallada
    if (error.response) {
      // Error de respuesta del servidor
      console.error('Error de respuesta del servidor:', error.response.status, error.response.data);
      res.status(error.response.status).json({
        error: true,
        message: `Error del servidor: ${error.response.status}`,
        details: error.response.data
      });
    } else if (error.request) {
      // Error de solicitud - no se recibió respuesta
      console.error('Error de solicitud - sin respuesta');
      res.status(503).json({
        error: true,
        message: 'No se pudo conectar al servidor BFF',
        details: 'El servidor no respondió a la solicitud'
      });
    } else {
      // Error de configuración
      console.error('Error de configuración:', error.message);
      res.status(500).json({
        error: true,
        message: 'Error interno del servidor proxy',
        details: error.message
      });
    }
  }
});

// Manejador específico para login
app.post('/api/auth/mobile/login', async (req, res) => {
  try {
    console.log('Recibida solicitud de login');
    
    // Usuario de prueba para depuración
    if (req.body.email === 'test@example.com' && req.body.password === 'password') {
      console.log('Usuario de prueba detectado, devolviendo respuesta simulada de login');
      return res.json({
        tokens: {
          accessToken: 'test-access-token-123456',
          refreshToken: 'test-refresh-token-123456'
        },
        customer: {
          id: '12345',
          code: 'TEST001',
          name: 'Usuario de Prueba',
          address: 'Calle Test 123',
          phone: '555-1234',
          email: 'test@example.com',
          customerTypeId: '1',
          isActive: true
        },
        sucursal: {
          id: req.body.sucursalId || '1',
          name: 'Sucursal Prueba',
          code: 'SUC001',
          address: 'Dirección sucursal de prueba'
        },
        warehouse: {
          id: req.body.almacenId || '1',
          name: 'Almacén Prueba',
          code: 'ALM001',
          address: 'Dirección almacén de prueba',
          sucursalId: req.body.sucursalId || '1'
        }
      });
    }
    
    // Reenviar la solicitud al servidor BFF
    console.log(`Reenviando solicitud a ${BFF_SERVER}/api/auth/mobile/login`);
    const response = await axios.post(`${BFF_SERVER}/api/auth/mobile/login`, req.body, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });
    
    console.log('Login exitoso:', response.data);
    res.json(response.data);
  } catch (error) {
    console.error('Error al procesar la solicitud de login:', error.message);
    
    // Proporcionar respuesta de error detallada
    if (error.response) {
      // Error de respuesta del servidor
      console.error('Error de respuesta del servidor:', error.response.status, error.response.data);
      res.status(error.response.status).json({
        error: true,
        message: `Error del servidor: ${error.response.status}`,
        details: error.response.data
      });
    } else if (error.request) {
      // Error de solicitud - no se recibió respuesta
      console.error('Error de solicitud - sin respuesta');
      res.status(503).json({
        error: true,
        message: 'No se pudo conectar al servidor BFF',
        details: 'El servidor no respondió a la solicitud'
      });
    } else {
      // Error de configuración
      console.error('Error de configuración:', error.message);
      res.status(500).json({
        error: true,
        message: 'Error interno del servidor proxy',
        details: error.message
      });
    }
  }
});

// Manejador específico para refresh token
app.post('/api/auth/mobile/refresh', async (req, res) => {
  try {
    console.log('Recibida solicitud de refresh token');
    
    // Token de prueba
    if (req.body.refreshToken === 'test-refresh-token-123456') {
      console.log('Token de prueba detectado, devolviendo nuevos tokens simulados');
      return res.json({
        accessToken: 'test-access-token-new',
        refreshToken: 'test-refresh-token-new'
      });
    }
    
    // Reenviar la solicitud al servidor BFF
    console.log(`Reenviando solicitud a ${BFF_SERVER}/api/auth/mobile/refresh`);
    const response = await axios.post(`${BFF_SERVER}/api/auth/mobile/refresh`, req.body, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });
    
    console.log('Token refrescado exitosamente');
    res.json(response.data);
  } catch (error) {
    console.error('Error al procesar la solicitud de refresh token:', error.message);
    
    if (error.response) {
      console.error('Error de respuesta del servidor:', error.response.status, error.response.data);
      res.status(error.response.status).json({
        error: true,
        message: `Error del servidor: ${error.response.status}`,
        details: error.response.data
      });
    } else {
      res.status(500).json({
        error: true,
        message: 'Error interno del servidor proxy',
        details: error.message
      });
    }
  }
});

// Manejador genérico para todas las demás rutas
app.use('/*', async (req, res) => {
  try {
    const method = req.method.toLowerCase();
    const url = `${BFF_SERVER}${req.url}`;
    
    console.log(`⏳ Reenviando solicitud ${method.toUpperCase()} a ${url}`);
    
    // Configurar opciones de la solicitud con valores predeterminados y reintentos
    const options = {
      method,
      url,
      data: method !== 'get' ? req.body : undefined,
      headers: {
        'Content-Type': 'application/json',
        ...req.headers,
        host: undefined,
        origin: undefined,
        referer: undefined
      },
      timeout: 15000,
      validateStatus: status => true // Permitir cualquier código de estado para manejar errores manualmente
    };
    
    const response = await axios(options);
    
    console.log(`✅ Respuesta de ${url}: [${response.status}]`);
    
    // Devolver la respuesta tal cual la recibimos del servidor BFF
    res.status(response.status);
    
    // Copiar los headers de la respuesta
    Object.entries(response.headers).forEach(([key, value]) => {
      // Excluir headers problemáticos
      if (!['transfer-encoding', 'connection'].includes(key.toLowerCase())) {
        res.setHeader(key, value);
      }
    });
    
    res.send(response.data);
  } catch (error) {
    console.error(`❌ Error en proxy genérico:`, error.message);
    
    if (error.response) {
      // Error con respuesta del servidor
      console.error(`  Status: ${error.response.status}`);
      console.error(`  Data:`, error.response.data);
      res.status(error.response.status).send(error.response.data);
    } else if (error.request) {
      // No se recibió respuesta
      console.error('  No se recibió respuesta del servidor BFF');
      res.status(504).json({
        error: true,
        message: 'Tiempo de espera agotado al conectar con el servidor',
        details: 'No se recibió respuesta del servidor BFF'
      });
    } else {
      // Error en la configuración de la solicitud
      res.status(500).json({
        error: true,
        message: 'Error en el servidor proxy',
        details: error.message
      });
    }
  }
});

// Iniciar el servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`⚡️ Servidor proxy simple ejecutándose en http://localhost:${PORT}`);
  console.log(`⚡️ Reenviando solicitudes a ${BFF_SERVER}`);
  console.log(`⚡️ Usuario de prueba disponible: test@example.com`);
});
