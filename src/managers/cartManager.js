const fs = require('fs');
const path = require('path');

class CartManager {
  constructor(filePath) {
    this.path = filePath;
  }

  async getCarts() {
    try {
      const data = await fs.promises.readFile(this.path, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  async createCart() {
    const carts = await this.getCarts();
    const newId = carts.length > 0 ? Math.max(...carts.map(c => c.id)) + 1 : 1;
    const newCart = { id: newId, products: [] };
    carts.push(newCart);
    await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2));
    return newCart;
  }

  async getCartById(id) {
    const carts = await this.getCarts();
    return carts.find(cart => cart.id === id);
  }

  async addProductToCart(cartId, productId) {
    const carts = await this.getCarts();
    const cartIndex = carts.findIndex(cart => cart.id === cartId);
    if (cartIndex !== -1) {
      const productIndex = carts[cartIndex].products.findIndex(p => p.product === productId);
      if (productIndex !== -1) {
        carts[cartIndex].products[productIndex].quantity += 1;
      } else {
        carts[cartIndex].products.push({ product: productId, quantity: 1 });
      }
      await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2));
      return carts[cartIndex];
    }
    return null;
  }
}

module.exports = CartManager;