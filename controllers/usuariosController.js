const usuario = require('../models/usuarios')
const jwt = require('jsonwebtoken')
const secret = 'AX88GH9H38KG0B0304LG'
const bcrypt = require('bcrypt')
const { findById } = require('../models/usuarios')
const usuarios = require('../models/usuarios')

// Helpers
const criarToken = require('../helpers/criarToken')
const pegarToken = require('../helpers/pegarToken')
const pegarUsuarioToken = require('../helpers/pegarUsuarioToken')

module.exports = class usuarioController {

    static registrar = async (req, res) => {

        const {nome, email, telefone, senha, confirmSenha} = req.body

        // Validações 

        if(!nome){
            res.json({message:"Insira um nome"})
            return
        }

        if(!email){
            res.json({message:"Insira um email"})
            return
        }

        if(!telefone){
            res.json({message:"Insira um telefone"})
            return
        }

        if(!senha){
            res.json({message:"Insira uma senha"})
            return
        }

        if(!confirmSenha){
            res.json({message:"Senha incorreta"})
            return
        }

        if(senha !== confirmSenha){
            res.json({message:"As senhas precisam ser iguais!"})
            return
        }

        // Checar usuario
        const checarUsuario = await usuario.findOne({email: email})

        if(checarUsuario){
            res.json({message:"Usuario já existe"})
            return
        }


        // Criar senha criptografada
        const salt = await bcrypt.genSalt(12)
        const senhaHash = await bcrypt.hash(senha, salt)

        const usuarios = new usuario({
            nome,
            email,
            telefone,
            senha: senhaHash
        })

        try {

            const novoUsuario = await usuarios.save()

            await criarToken(req, res, novoUsuario)

        } catch (error) {
            res.json({message: error})
        }

    }

    static login = async(req, res) => {
        const {email, senha} = req.body

        if(!email){
            res.json({message:"Insira um email"})
            return
        }

        if(!senha){
            res.json({message:"Insira uma senha"})
            return
        }

        // Checar usuario
        const Usuario = await usuario.findOne({email: email})

        if(!Usuario){
            res.json({message:"Usuario não existe"})
            return
        }

        // Checar senha

        const existeSenha = await bcrypt.compare(senha, Usuario.senha)

        if(!existeSenha){
            res.json({message:"Senha invalida!"})
            return
        }

        await criarToken(req, res, Usuario)

    }

    static checarUsuario = async(req, res, next) => {
        let currentUser

        if(req.headers.authorization){

            const token = pegarToken(req)
            console.log(token)  // Mostra o toke sem o 'bearer'
            const decoded = jwt.verify(token, secret)

            currentUser = await usuario.findById(decoded.id)

            currentUser.senha = undefined // Não aparecer senha

        }else{
            currentUser = null
        }

        res.json({message: currentUser})

    }

    static listarPorId = async(req, res) => {
        const id = req.params.id

        const usuario = await usuarios.findById(id).select('-senha') // Buscar usuário por id sem a senha

        if(!usuario){
            res.json({message: "Usuario não encontrado"})
            return
        }else{
            res.json({message: "Usuario encontrado:", usuario})
        }

    }

    static editarPorId = async(req, res) => {
        const id = req.params.id

        // Checa se o usuário existe e pegar o usuario
        const token = pegarToken(req)
        const usuario = await pegarUsuarioToken(token)

        const {nome, email, telefone, senha, confirmSenha} = req.body

        // Validações 

        const usuarioid = id

        if(!nome){
            res.json({message:"Insira um nome"})
            return
        }

        usuario.nome = nome

        if(!email){
            res.json({message:"Insira um email"})
            return
        }

        // Checa se o usuário existe por email
        const usuarioE = await usuarios.findOne({ email: email }) // Buscar usuário por id
        console.log(usuarioE)

        if(usuario.email !== email && usuarioE){
            res.json({message: "Por favor utilize outro e-mail"})
            return
        }

        usuario.email = email

        if(!telefone){
            res.json({message:"Insira um telefone"})
            return
        }

        usuario.telefone = telefone

        if(!senha){
            res.json({message:"Insira uma senha"})
            return
        }

        if(!confirmSenha){
            res.json({message:"Insira uma senha"})
            return
        }

        if(senha !== confirmSenha){
            res.json({message: "As senhas não conferem"})
            return
        }else if(senha === confirmSenha && senha != null){

            // Criar senha criptografada
            const salt = await bcrypt.genSalt(12)
            const senhaHash = await bcrypt.hash(senha, salt)

            usuario.senha = senhaHash
        }

        try {
            
            await usuarios.findOneAndUpdate(
                {_id: usuarioid},
                {$set: usuario},
                {new: true},
            )
            res.json({message: "Usuario alterado com sucesso!"})
        } catch (error) {
            res.json({message: error})
            return
        }

        console.log(usuario)

    }

}