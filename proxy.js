const { createProxyMiddleware } = require('http-proxy-middleware');
const express = require('express');
const cors = require('cors');
const app = express();

// Habilitar CORS para todas las rutas
app.use(cors());

// Configurar el proxy para redirigir todas las solicitudes
app.use(
  '/api',
  createProxyMiddleware({
    target: 'http://localhost:3000',
    changeOrigin: true,
    secure: false,
    logLevel: 'debug',
    pathRewrite: undefined, // No reescribir rutas
    onProxyReq: (proxyReq, req, res) => {
      console.log('Proxy request:', req.method, req.path);
    },
    onProxyRes: function (proxyRes, req, res) {
      proxyRes.headers['Access-Control-Allow-Origin'] = '*';
      proxyRes.headers['Access-Control-Allow-Methods'] = 'GET,POST,PUT,DELETE,OPTIONS';
      proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization';
    },
  })
);

// Iniciar el servidor proxy
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Servidor proxy ejecutándose en http://localhost:${PORT}`);
});
