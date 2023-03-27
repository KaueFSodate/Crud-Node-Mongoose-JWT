const jwt = require('jsonwebtoken')
const usuario = require('../models/usuarios')
const secret = 'AX88GH9H38KG0B0304LG'

// Pegar usuário por token

const pegarUsuarioToken = async(token) => {
    
    if(!token){
        res.json({message: "Acesso negado"})
    }


    const decoded = jwt.verify(token, secret)
    const usuarioid = decoded.id

    const Usuario = await usuario.findOne({_id: usuarioid})

    return Usuario

}

module.exports = pegarUsuarioToken