const ProductManager = require("../managers/product.manager")

const getProductById = async (req,res) => {};

const getAllProducts = async (req,res) => {
    try {
        const products = await ProductManager.allProducts();
        res.json(products);

    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

module.exports = {
    getProductById,
    getAllProducts,
}