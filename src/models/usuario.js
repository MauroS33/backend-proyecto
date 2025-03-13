const mongoose = require("mongoose");

//definir schema
const usuarioSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
    },
    apellido: {
        type: String,
        required: true,
    },
    edad: {
        type: Number,
        required: true,
    },
    documento: {
        type: String,
        required: true,
    },
    categoria: {
        type: String,
        required: true,
    },

});

module.exports = mongoose.model("usuario", usuarioSchema)
//module.exports = usuario

/*
Usuario.deleteMany()
Usuario.deleteOne()
Usuario.find()
Usuario.findById()
Usuario.findByIdAndDelete()
Usuario.findByIdAndRemove()
Usuario.findByIdAndUpdate()
Usuario.findOne()
Usuario.findOneAndDelete()
Usuario.findOneAndReplace()
Usuario.findOneAndUpdate()
Usuario.replaceOne()
Usuario.updateMany()
Usuario.updateOne()
*/

