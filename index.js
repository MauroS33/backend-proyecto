const { createServer } = require('http');
const { Server } = require('socket.io');
const app = require('./src/app');
const PORT = 8080;

// Obtener el productManager desde los controladores
const { getAllProducts, addProduct, deleteProduct } = require('./src/controllers/product.controller');

// Crear el servidor HTTP y vincularlo con Socket.IO
const httpServer = createServer(app);
const io = new Server(httpServer);

// Configurar Socket.IO
io.on('connection', async (socket) => {
  console.log('Nuevo cliente conectado');

  // Lista inicial de productos
  const initialProducts = await getAllProducts();
  socket.emit('updateProducts', initialProducts);

  // Escuchar eventos del cliente
  socket.on('addProduct', async (productData) => {
    await addProduct(productData);
    const updatedProducts = await getAllProducts();
    io.emit('updateProducts', updatedProducts); // Notificar a todos los clientes
  });

  socket.on('deleteProduct', async (productId) => {
    await deleteProduct(productId);
    const updatedProducts = await getAllProducts();
    io.emit('updateProducts', updatedProducts); // Notificar a todos los clientes
  });
});

// Iniciar el servidor
httpServer.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});