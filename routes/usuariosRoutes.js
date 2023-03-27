const express = require('express')
const usuarioControl = require('../controllers/usuariosController')
const router = express.Router()

//Middleware
const verificarToken = require('../helpers/verificarToken')

router.get('/checarUsuario/:id', usuarioControl.listarPorId)
router.get('/checarUsuario', usuarioControl.checarUsuario)
router.post('/registrar', usuarioControl.registrar)
router.post('/login', usuarioControl.login)
router.patch('/editar/:id', verificarToken, usuarioControl.editarPorId)
//router.put('/deletar', usuarioControl.deletar)


module.exports = router