const ProductManager = require('../managers/ProductManager');
const path = require('path');
const productsFilePath = path.join(__dirname, '../data/products.json');
const productManager = new ProductManager(productsFilePath);

// Obtener todos los productos
const getAllProducts = async () => {
  return await productManager.getProducts();
};

// Obtener un producto por ID
const getProductById = async (id) => {
  return await productManager.getProductById(id);
};

// Agregar un nuevo producto
const addProduct = async (productData) => {
  return await productManager.addProduct(productData);
};

// Actualizar un producto existente
const updateProduct = async (id, updatedFields) => {
  return await productManager.updateProduct(id, updatedFields);
};

// Eliminar un producto
const deleteProduct = async (id) => {
  return await productManager.deleteProduct(id);
};

module.exports = {
  getAllProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
};