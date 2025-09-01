/**
 * Servidor proxy simple para solucionar problemas de CORS durante el desarrollo
 * Este servidor se ejecuta localmente y reenvía las solicitudes al servidor BFF
 */

const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

// Crear aplicación Express
const app = express();

// Habilitar CORS para todas las rutas
app.use(cors({
  origin: '*', // Permitir solicitudes desde cualquier origen
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Configurar el proxy para redirigir las solicitudes a la API del servidor BFF
app.use('/api', createProxyMiddleware({
  target: 'http://localhost:3000',
  changeOrigin: true,
  pathRewrite: {
    '^/api': '/api' // Mantener la ruta /api
  },
  onProxyRes: function (proxyRes, req, res) {
    // Agregar encabezados CORS a la respuesta
    proxyRes.headers['Access-Control-Allow-Origin'] = '*';
    proxyRes.headers['Access-Control-Allow-Methods'] = 'GET,POST,PUT,DELETE,OPTIONS';
    proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization';
    console.log(`Proxying ${req.method} ${req.path} -> ${proxyRes.statusCode}`);
  },
  onError: function(err, req, res) {
    console.error('Error en proxy:', err);
    res.status(500).json({
      error: 'Error de conexión con el servidor BFF',
      details: err.message
    });
  }
}));

// Puerto para el servidor proxy local
const PROXY_PORT = 3001;

// Iniciar el servidor
app.listen(PROXY_PORT, () => {
  console.log(`Servidor proxy ejecutándose en http://localhost:${PROXY_PORT}`);
  console.log(`Redirigiendo solicitudes a http://localhost:3000`);
});
