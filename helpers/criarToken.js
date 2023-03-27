const jwt = require('jsonwebtoken')
const secret = 'AX88GH9H38KG0B0304LG'


const criarToken = async(req, res, usuario) => {

    try {
        
        // Criar token
        const token = jwt.sign({
            id: usuario._id
        }, 
        secret
        )


        // Retornar token
        res.json({
            auth: true,
            token: token,
            usuarioid: usuario._id
        })

    }catch (error) {
        console.log(error)
    }
}

module.exports = criarToken