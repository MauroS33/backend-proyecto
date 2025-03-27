// Conexión al servidor WebSocket
const socket = io();

// Escuchar eventos del servidor
socket.on('updateProducts', (products) => {
  const list = document.getElementById( "productList" )
  list.innerHTML = "";
  console.log('Productos actualizados:', products);

    products.forEach((product) => {
      const li = document.createElement("li");
      li.innerHTML = `${product.title} - $ ${product.price}
      <button onClick= "deleteProduct ('${product._id}')">Eliminar</button>`;
      list.appendChild(li);
    });
  }
);

// Agregar product
const form = document.getElementById( "productForm" );
form.addEventListener("submit", (send) => {
  send.preventDefault();
  const data = Object.fromEntries(new FormData(form));
  data.status = truedata.thumbnails = [];
  socket.emit("addProduct", data);
  form.reset();
})

// Eliminar un producto
function deleteProduct(id) {
  socket.emit("deleteProduct", id);
}

// // *Ejemplo: Agregar un producto usando SweetAlert2
// document.getElementById('add-product-form')?.addEventListener('submit', (e) => {
//   e.preventDefault();

//   // *Obtener datos del formulario
//   const title = document.getElementById('title')?.value;
//   const price = document.getElementById('price')?.value;

//   // *Emitir evento al servidor
//   socket.emit('addProduct', { title, price });

//   // *Mostrar una alerta de éxito
//   Swal.fire({
//     title: 'Producto agregado',
//     text: 'El producto ha sido agregado correctamente.',
//     icon: 'success',
//     confirmButtonText: 'Aceptar'
//   });

//   // *Resetear el formulario
//   document.getElementById('add-product-form')?.reset();
// });