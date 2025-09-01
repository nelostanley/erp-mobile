// Universal proxy server para desarrollo
// Este servidor permite:
// 1. Desarrollo web local (resuelve problemas de CORS)
// 2. Acceso desde dispositivos móviles reales en la misma red

const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
const PORT = 3001;

// IP del servidor BFF
const BFF_SERVER = 'http://192.168.68.200:3000';

// Configuración CORS para permitir cualquier origen
app.use(cors({
  origin: '*', // Permite cualquier origen
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware para loguear las solicitudes
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Configuración del proxy
const apiProxy = createProxyMiddleware({
  target: BFF_SERVER,
  changeOrigin: true,
  pathRewrite: {
    '^/api': '',  // Elimina el prefijo '/api' antes de reenviar la solicitud
  },
  onProxyReq: (proxyReq, req, res) => {
    // Modificar headers si es necesario
    proxyReq.setHeader('x-forwarded-for', req.ip);
  },
  onError: (err, req, res) => {
    console.error('Proxy error:', err);
    res.status(500).send({ error: 'Proxy error', message: err.message });
  },
  logLevel: 'debug'
});

// Rutas para probar la conexión
app.get('/health', (req, res) => {
  res.status(200).send({ status: 'ok', message: 'Proxy server running' });
});

// Configurar todas las rutas /api/* para usar el proxy
app.use('/api', apiProxy);

// Iniciar el servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor proxy ejecutándose en http://localhost:${PORT}`);
  console.log(`Todas las peticiones a /api/* serán redirigidas a ${BFF_SERVER}`);
  console.log(`Para acceder desde dispositivos móviles, usa la IP local de este equipo`);
});
