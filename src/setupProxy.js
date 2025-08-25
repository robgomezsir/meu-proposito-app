// Configuração de proxy para desenvolvimento
// Este arquivo é usado apenas em desenvolvimento

const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // Proxy para APIs externas se necessário
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:3000',
      changeOrigin: true,
    })
  );
};
