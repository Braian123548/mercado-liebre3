const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    nombreApellido: {
        type: String,
        required: true
    },
    nombreUsuario: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    fechaNacimiento: {
        type: String,
        required: true
    },
    domicilio: {
        type: String,
        required: true
    },
    perfil:{
        type:String,
        require:true
    },
    intereses: {
        type: [String] // Cambia [String] al tipo de dato adecuado para los intereses
    }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
