const Producto = require('../models/Product')

const index={
    get:async(req,res)=>{
        const alertMessage = req.session.alertMessage;
        req.session.alertMessage = null; 
        const productos = await Producto.find(); 
        res.render('home', {productos:productos,alertMessage});
    }
}

module.exports={
    index
}