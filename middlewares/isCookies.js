const User = require('../models/User');

const isCookie = async (req, res, next) => {
    try {
        if (req.cookies.recordame) {
            const usuario = await User.findOne({ nombreUsuario: req.cookies.recordame });
            console.log(usuario.perfil);
            if (usuario.perfil === "vendedor") {
                req.session.vendedor = usuario
                console.log(req.session.vendedor);
            }else if ((usuario.perfil === "comprador")){
                req.session.comprador = usuario
                console.log(req.session.comprador);
            }
        }
        next();
    } catch (error) {
        console.error("Error al buscar el usuario en la base de datos:", error);
        next(error);
    }
}

module.exports = {
    isCookie
};
