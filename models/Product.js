const mongoose = require('mongoose');

const productsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    images: {
        mainImage: String,
        secondaryImages: [String]
    },
    discount: {
        type: Number,
        default: 0,
    },
    cantidad:{
        type:Number,
        require
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId, // Tipo de dato ObjectId para almacenar el ID del usuario
        ref: 'User' // Referencia al modelo de usuario
    }
});

const Product = mongoose.model("Product", productsSchema);

module.exports = Product;