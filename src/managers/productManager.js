const fs = require('fs');
const path = require('path');

class ProductManager {
  constructor(filePath) {
    this.path = filePath;
  }

  async getProducts() {
    try {
      const data = await fs.promises.readFile(this.path, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  async getProductById(id) {
    const products = await this.getProducts();
    return products.find(product => product.id === id);
  }

  async addProduct(productData) {
    const products = await this.getProducts();
    const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    const newProduct = { id: newId, ...productData };
    products.push(newProduct);
    await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
    return newProduct;
  }

  async updateProduct(id, updatedFields) {
    const products = await this.getProducts();
    const index = products.findIndex(product => product.id === id);
    if (index !== -1) {
      products[index] = { ...products[index], ...updatedFields };
      await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
      return products[index];
    }
    return null;
  }

  async deleteProduct(id) {
    const products = await this.getProducts();
    const filteredProducts = products.filter(product => product.id !== id);
    await fs.promises.writeFile(this.path, JSON.stringify(filteredProducts, null, 2));
    return filteredProducts;
  }
}

module.exports = productManager;