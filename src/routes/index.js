const express = require("express");
const router = express.Router();
const productRouter = require("./product.router")
const usersRouter = require("./user.router")

router.use("/products", productRouter)
router.use("/users", usersRouter)

module.exports = router