const { createServer } = require('http');
const { Server } = require('socket.io');
const app = require('./src/app'); // Importa la configuración desde app.js
const PORT = 8080;
const productManager = app.locals.productManager;

// Crear el servidor HTTP y vincularlo con Socket.IO
const httpServer = createServer(app);
const io = new Server(httpServer);

// Configurar Socket.IO
io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado');

  // Lista inicial de productos
  socket.emit('updateProducts', app.locals.productManager.getProducts());

  // Escuchar eventos del cliente
  socket.on('addProduct', async (productData) => {
    await app.locals.productManager.addProduct(productData);
    const updatedProducts = await app.locals.productManager.getProducts();
    io.emit('updateProducts', updatedProducts); // Notificar a todos los clientes
  });

  socket.on('deleteProduct', async (productId) => {
    await app.locals.productManager.deleteProduct(productId);
    const updatedProducts = await app.locals.productManager.getProducts();
    io.emit('updateProducts', updatedProducts); // Notificar a todos los clientes
  });
});

// Iniciar el servidor
httpServer.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});