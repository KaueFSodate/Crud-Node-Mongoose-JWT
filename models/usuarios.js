const mongoose = require('../BD/conn')
const {Schema} = mongoose

const usuarios = mongoose.model('usuarios',

    new Schema(
    {
        nome: {type: String},
        email: {type: String},
        telefone: {type: String},
        senha: {type: String}

    }, 
    {timestamps: true},
    )
)
module.exports = usuarios;