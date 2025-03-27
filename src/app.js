const express = require('express');
const mongoose = require('mongoose');
const { Server } = require("socket.io");
const handlebars = require('express-handlebars');
const path = require('path');
require('dotenv').config();

// Importar rutas
const productsRouter = require("../routes/products.routes");
const cartsRouter = require("../routes/carts.routes");
const viewsRoutes = require("../src/routes/views.routes");

const Product = require("../src/models/product.model");

const app = express();
const PORT = 8080;

// Configurar Handlebars
const hbs = handlebars.create({
  helpers: {
    ifEquals: (a, b) => a === b
  }
});

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "/src/views"));

// Middleware para archivos estáticos
app.use(express.static(path.join(__dirname, "/src/public")));

// Middleware para parsear JSON
app.use(express.json());
app.use(express.urlencoded({extended: true}));




// Crear la aplicación Express

// Configuración de Handlebars como motor de plantillas
app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Montar las rutas
app.use('/api/products', productsRoutes);
app.use('/api/carts', cartsRoutes);
app.use("/", viewsRoutes);

// Conexión a MongoDB Atlas
const MONGO_URI = process.env.MONGO_URI; // Obtener la cadena de conexión desde .env
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Conexión exitosa a MongoDB Atlas"))
  .catch(err => console.error("Error al conectar:", err));

 // WebSocket con productos en tiempo real
 const io = new Server(server);

 io.on("connection", async (socket) => {
   console.log("🧩 Cliente conectado vía WebSocket");
 
   const products = await Product.find();
   socket.emit("updateProducts", products);
 
   socket.on("addProduct", async (data) => {
     await Product.create(data);
     const updated = await Product.find();
     io.emit("updateProducts", updated);
   });
 
   socket.on("deleteProduct", async (id) => {
     await Product.findByIdAndDelete(id);
     const updated = await Product.find();
     io.emit("updateProducts", updated);
   });
 });
 