const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/designer',
    createProxyMiddleware({
      // target: 'http://localhost',
      target: 'http://52.66.185.131',
      changeOrigin: true,
    })
  );
  app.use(
    '/flipbook',
    createProxyMiddleware({
      target: 'https://bookalooza.com',
      changeOrigin: true,
    })
  );
};