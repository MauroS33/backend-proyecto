// Conexión al servidor WebSocket
const socket = io();

// Escuchar eventos del servidor
socket.on('updateProducts', (products) => {
  console.log('Productos actualizados:', products);

  // Actualizar la lista de productos en la interfaz de usuario
  const productList = document.querySelector('.product-list');
  if (productList) {
    productList.innerHTML = ''; // Limpiar la lista
    products.forEach((product) => {
      const li = document.createElement('li');
      li.textContent = `${product.title} - $${product.price}`;
      productList.appendChild(li);
    });
  }
});

// Ejemplo: Agregar un producto usando SweetAlert2
document.getElementById('add-product-form')?.addEventListener('submit', (e) => {
  e.preventDefault();

  // Obtener datos del formulario
  const title = document.getElementById('title')?.value;
  const price = document.getElementById('price')?.value;

  // Emitir evento al servidor
  socket.emit('addProduct', { title, price });

  // Mostrar una alerta de éxito
  Swal.fire({
    title: 'Producto agregado',
    text: 'El producto ha sido agregado correctamente.',
    icon: 'success',
    confirmButtonText: 'Aceptar'
  });

  // Resetear el formulario
  document.getElementById('add-product-form')?.reset();
});