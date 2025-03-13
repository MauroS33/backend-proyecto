const usuario = require("../models/usuario");
const mongoose = require("mongoose");

class UsuarioManager {
    async createUser(data) {
        try {
            if (!data) throw new Error("Datos de usuario no proporcionados")
                const usuario = new Usuario(data)
            return usuario.save()
            
        } catch (error) {
            console.error("Error creando usuario", error);
            throw new Error("Error al crear usuario");
        }
    }
//obtener todos los usuarios

async getAllUsers() {
    try {
        const usuarios = await Usuario.find({}, "nombre apellido edad documento categoria")
        return usuarios
    } catch (error) {
        console.error('Error al buscar lista de usuarios: ${error} ');
        throw new Error("Error al obtener usuarios");
    }
}
//obtener usuario por ID
async getUserById(id) {
    try {
        
    } catch (error) {
        console.error("Error obteniendo usuario", error);
        return null;
    }
    //obtener usuario por documento
async getUserByDocumento(documento) {
    try {
        
    } catch (error) {
        console.error("Error obteniendo usuario", error);
        return null;
    }
}
}
