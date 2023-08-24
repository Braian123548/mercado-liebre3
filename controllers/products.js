const Product = require("../models/Product");
const path = require('path');
const fs = require('fs');


const products = {
    get: async (req, res) => {
        try {
            const productos = await Product.find();
            const productosDelVendedor = productos.filter(producto => producto.createdBy.toString() === req.session.vendedor._id.toString());
            res.render('vendedor', { productos: productosDelVendedor });

        } catch (error) {
            console.error(error);
            res.render('error');
        }
    }

};

const detalle = {
    get: async (req, res) => {
        try {
            const productId = req.params.id;
            const productos = await Product.findById(productId);
            res.render('detail', { producto: productos });
        } catch (error) {
            console.error(error);
            res.render('error');
        }
    }
};

const buscar = {
    get: async (req, res) => {
        try {
            const searchTerm = req.query.search;
            // console.log(searchTerm);

            const producto = await Product.find({ name: { $regex: searchTerm, $options: 'i' } });

            // console.log(producto);

            if (!producto || producto.length === 0) {
                return res.status(404).send('Producto no encontrados');
            }

            res.render('buscar', { producto });
        } catch (error) {
            console.error('Error al obtener detalles de los productos:', error);
            res.status(500).send('Error al obtener detalles de los productos');
        }
    }
};

const carrito = {
    get: (req, res) => {
        res.render("carrito")
    },
    post: async (req, res) => {
    }

}

const agregar = {
    get: (req, res) => {
        res.render('agregar');
    },


    post: async (req, res) => {
        try {
            const { name, description, price, discount, count } = req.body;
            const mainImage = req.files['Image'][0].filename;
            const secondaryImages = req.files['secondaryImages'].map(file => file.filename);

            // Obtén el ID del usuario que creó el producto desde la sesión
            const createdBy = req.session.vendedor._id;

            // Crea el objeto de producto, incluyendo el ID del usuario
            const product = new Product({
                name,
                description,
                price,
                images: {
                    mainImage: mainImage,
                    secondaryImages: [...secondaryImages],
                },
                discount: discount,
                cantidad: count,
                createdBy: createdBy, // Asigna el ID del usuario que creó el producto
            });

            // Guarda el producto en la base de datos
            await product.save();
            res.redirect('/')

        } catch (error) {
            console.error('Error al agregar el producto:', error);
            res.status(500).send('Error al agregar el producto');
        }
    }
}


const editar = {
    get: async (req, res) => {
        try {
            const productoId = req.params.id;
            const Producto = await Product.findById(productoId);
            console.log(productoId + " Desde get editar");
            res.render("editar", { producto: Producto });
        
        } catch (error) {
            console.error(error);
        }
    },

    put: async (req, res) => {
        try {
            const { name, description, discount, price, mainImage ,cantidad, secondaryImages, } = req.body;
            console.log(name, description, discount, price, mainImage, secondaryImages, cantidad);
            const productoId = req.params.id;

            
            await Product.findByIdAndUpdate(productoId, {
                name,
                description,
                discount,
                price,
                mainImage,
                secondaryImages,
                cantidad
            });

            
            res.redirect(`/products/editar/${req.params.id}`);
        } catch (error) {
            console.error(error);
            res.status(500).render('error');
        }
    }
};


const eliminar = {
    delete: async (req, res) => {
     try {
       const productoId = req.params.id;
       console.log(productoId);
       
       // Encuentra el producto antes de eliminarlo
       const producto = await Product.findById(productoId);
 
       if (!producto) {
         // Producto no encontrado
         return res.status(404).send('Producto no encontrado');
       }
 
       // Elimina la imagen principal
       const mainImagePath = path.join(__dirname, '../public/images/products/', producto.images.mainImage);
 
       if (fs.existsSync(mainImagePath)) {
         fs.unlinkSync(mainImagePath);
       } else {
         console.log('Archivo no encontrado:', mainImagePath);
       }
 
       // Elimina las imágenes secundarias (ajusta esto según tu estructura)
       producto.images.secondaryImages.forEach((imageName) => {
         const secondaryImagePath = path.join(__dirname, '../public/images/products/', imageName);
         if (fs.existsSync(secondaryImagePath)) {
           fs.unlinkSync(secondaryImagePath);
         } else {
           console.log('Archivo no encontrado:', secondaryImagePath);
         }
       });
 
       // Elimina el producto de la base de datos
       await Product.findByIdAndRemove(productoId);
       
       res.redirect('/products/vender'); // Redirige a la página de lista de productos o a donde prefieras
     } catch (error) {
       console.error(error);
       res.status(500).render('error');
     }
   }
 };
 



module.exports = {
    products,
    detalle,
    buscar,
    carrito,
    agregar,
    editar,
    eliminar
}