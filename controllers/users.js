const User = require("../models/User");
const dotenv = require('dotenv');
dotenv.config();
const bcrypt = require('bcrypt')
const saltRounds = 10; 


const register = {
    get: (req, res) => {
        res.render('register');
    },
    post: async (req, res) => {

        const { nombreApellido, userName, emailUsuario, fechaUsuario, domicilioUsuario, interes, password, perfil } = req.body
        // console.log(nombreApellido, userName, fechaUsuario, domicilioUsuario, interes, password, perfil);

        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // console.log(password);
         
        const usuario = new User({
            nombreApellido: nombreApellido,
            nombreUsuario: userName,
            password: hashedPassword,
            email: emailUsuario,
            fechaNacimiento: fechaUsuario,
            perfil: perfil,
            domicilio: domicilioUsuario,
            intereses: interes
        })

        await usuario.save()
        res.redirect('/users/register')
    }
}


const login = {
    get: (req, res) => {
        res.render("login");
    },
    post: async (req, res) => {
        let { nombreUsuario, password , recordame} = req.body;
        try {


            if (req.session.vendedor) {
                delete req.session.vendedor;
            }
            else if (req.session.comprador) {
                delete req.session.comprador;
            }


            const usuario = await User.findOne({ nombreUsuario });
            if (usuario) {
                const passwordMatch = await bcrypt.compareSync(password, usuario.password);
                if (passwordMatch) {
                    if (usuario.perfil === "vendedor") {
                        req.session.vendedor = usuario;
                    } else if (usuario.perfil === "comprador") {
                        req.session.comprador = usuario;
                    }
                }
            }
            
            console.log(recordame);
            if (recordame) {
                res.cookie("recordame", usuario.nombreUsuario);
            }

            res.redirect("/");
        } catch (error) {
            console.error("Error al autenticar el usuario:", error);
            res.redirect("/users/login");
        }
    }    

};



const logout = {
    get: (req, res) => {

        res.clearCookie('recordame');

        req.session.destroy((err) => {
            if (err) {
                console.error('Error al cerrar la sesión:', err);
            }
            res.redirect('/');
        });
    },
};



module.exports = {
    register,
    login,
    logout
}