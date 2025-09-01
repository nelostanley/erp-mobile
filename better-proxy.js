// Servidor proxy mejorado para comunicación con BFF
const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3001;
const BFF_SERVER = 'http://localhost:3000';

// Configuración CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parsear JSON en el body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware para logging de solicitudes
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  if (req.body && Object.keys(req.body).length > 0) {
    // Sanitizar cuerpo para no mostrar contraseñas
    const sanitizedBody = { ...req.body };
    if (sanitizedBody.password) {
      sanitizedBody.password = '********';
    }
    console.log('Body:', JSON.stringify(sanitizedBody));
  }
  next();
});

// Ruta de verificación de salud
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Endpoint específico para pre-login (para depuración)
app.post('/api/auth/mobile/pre-login', async (req, res, next) => {
  console.log('Pre-login interceptado:', req.body);
  
  // Si es el usuario de prueba Alexander Godoy, simular respuesta
  if (req.body.email === 'alexander.godoy@example.com') {
    console.log('Generando respuesta simulada para Alexander Godoy');
    return res.status(200).json({
      success: true,
      data: {
        name: "ALEXANDER GODOY CASTELLON",
        address: "Av. Comercial 789, Ciudad",
        phone: "70123456",
        nit: ""
      }
    });
  }
  
  // Si no es el usuario de prueba, pasar al proxy genérico
  next();
});

// Proxy para todas las demás rutas a /api
app.use('/', createProxyMiddleware({
  target: BFF_SERVER,
  changeOrigin: true,
  pathRewrite: {
    '^/api': '/api' // Mantener la ruta /api intacta
  },
  logLevel: 'debug',
  onProxyReq: (proxyReq, req, res) => {
    // Si hay un cuerpo en la solicitud y no es GET, configurarlo correctamente
    if (req.body && Object.keys(req.body).length > 0 && req.method !== 'GET') {
      const bodyData = JSON.stringify(req.body);
      proxyReq.setHeader('Content-Type', 'application/json');
      proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
      proxyReq.write(bodyData);
    }
  },
  onProxyRes: (proxyRes, req, res) => {
    console.log(`✅ Respuesta del proxy ${proxyRes.statusCode} para ${req.method} ${req.url}`);
    
    // Agregar encabezados CORS a la respuesta
    proxyRes.headers['Access-Control-Allow-Origin'] = '*';
    proxyRes.headers['Access-Control-Allow-Methods'] = 'GET,POST,PUT,DELETE,OPTIONS';
    proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization';
  },
  onError: (err, req, res) => {
    console.error(`❌ Error de proxy para ${req.method} ${req.url}:`, err.message);
    res.status(500).json({
      error: true,
      message: 'Error al conectar con el servidor BFF',
      details: err.message
    });
  }
}));

// Manejador de errores global
app.use((err, req, res, next) => {
  console.error('Error global:', err);
  res.status(500).json({
    error: true,
    message: 'Error interno del servidor proxy',
    details: err.message
  });
});

// Iniciar el servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor proxy ejecutándose en http://localhost:${PORT}`);
  console.log(`🔄 Redirigiendo solicitudes a ${BFF_SERVER}`);
  console.log(`💡 Verifica la conexión con: http://localhost:${PORT}/health`);
});
