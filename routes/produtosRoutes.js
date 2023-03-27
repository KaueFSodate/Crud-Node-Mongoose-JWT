const express = require('express')
const produtosController = require('../controllers/produtosController')
const router = express.Router()

//Middleware
const verificarToken = require('../helpers/verificarToken')

// Produtos cadastrados
router.post('/cadastrar', verificarToken, produtosController.cadastrar)
router.get('/MeusProdutosCadastrados', verificarToken, produtosController.listarMeusProdutosCadastrados)
router.get('/ProdutosCadastrados', produtosController.listarProdutosCadastrados)
router.get('/ProdutosCadastrados/:id', produtosController.listarProdutosCadastradosId)

// Produtos vendidos
router.get('/minhasCompras', verificarToken, produtosController.minhasCompras)
router.get('/ProdutosVendidos', verificarToken, produtosController.listarProdutosVendidos)

router.patch('/editar/:id', verificarToken, produtosController.editarPorId)
router.delete('/deletar/:id', verificarToken, produtosController.deletarProdutoCadastrado)


module.exports = router