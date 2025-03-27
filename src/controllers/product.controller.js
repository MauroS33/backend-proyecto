// const Product = require('../models/product.model'); // Importar el modelo de Producto

// // Obtener todos los productos
// exports.getAllProducts = async () => {
//   try {
//     const products = await Product.find(); // Consulta todos los productos en MongoDB
//     return JSON.parse(JSON.stringify(products));
//   } catch (error) {
//     console.error("Error al obtener productos:", error);
//     throw error;
//   }
// };

// // Obtener un producto por ID
// exports.getProductById = async (id) => {
//   try {
//     const product = await Product.findById(id); // Busca un producto por su ID
//     if (!product) {
//       throw new Error("Producto no encontrado");
//     }
//     return product;
//   } catch (error) {
//     console.error("Error al obtener producto por ID:", error);
//     throw error;
//   }
// };

// // Agregar un nuevo producto
// exports.addProduct = async (productData) => {
//   try {
//     const newProduct = new Product(productData); // Crea una nueva instancia del modelo Product
//     await newProduct.save(); // Guarda el producto en MongoDB
//     return newProduct;
//   } catch (error) {
//     console.error("Error al agregar producto:", error);
//     throw error;
//   }
// };

// // Actualizar un producto existente
// exports.updateProduct = async (id, updatedFields) => {
//   try {
//     const updatedProduct = await Product.findByIdAndUpdate(
//       id,
//       { $set: updatedFields }, // Actualiza solo los campos proporcionados
//       { new: true } // Devuelve el documento actualizado
//     );
//     if (!updatedProduct) {
//       throw new Error("Producto no encontrado");
//     }
//     return updatedProduct;
//   } catch (error) {
//     console.error("Error al actualizar producto:", error);
//     throw error;
//   }
// };

// // Eliminar un producto
// exports.deleteProduct = async (id) => {
//   try {
//     const deletedProduct = await Product.findByIdAndDelete(id); // Elimina un producto por su ID
//     if (!deletedProduct) {
//       throw new Error("Producto no encontrado");
//     }
//     return deletedProduct;
//   } catch (error) {
//     console.error("Error al eliminar producto:", error);
//     throw error;
//   }
// };