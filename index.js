// Dependencias
const express = require('express')
const usuarios = require('./routes/usuariosRoutes')
const produtos = require('./routes/produtosRoutes')
const port = 8080
const app = express()

const conn = require('./BD/conn')


// Usar json
app.use(express.json())

// Pegar as informações do body
app.use(express.urlencoded({
    extended: true

    })
)

// Rotas

app.use('/usuarios', usuarios)
app.use('/produtos', produtos)



app.listen(port, () => {
    console.log(`Server rodando na porta ${port}`)
})
