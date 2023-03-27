const pegarToken = require('./pegarToken')
const jwt = require('jsonwebtoken')
const secret = 'AX88GH9H38KG0B0304LG'


const verificarToken = (req, res, next) => {

    if(!req.headers.authorization){
    return res.json({message: "Acesso negado"})
    }

    const pegaToken = pegarToken(req)

    if(!pegaToken){
        res.json({message: "Acesso negado"})
    }

    try {
        const verified = jwt.verify(pegaToken, secret)
        req.usuario = verified
        next()
    } catch (error) {
        res.json({message: error})
    }

}

module.exports = verificarToken