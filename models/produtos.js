const mongoose = require('../BD/conn')
const {Schema} = mongoose

const produtos = mongoose.model('produtos',

    new Schema(
    {
        nome: {type: String},
        descricao: {type: String},
        imagens: {type: Array},
        valor: {type: Number},
        available: {type: Boolean},
        usuarios: Object,
        comprador: Object

    }, 
    {timestamps: true},
    )
)
module.exports = produtos;