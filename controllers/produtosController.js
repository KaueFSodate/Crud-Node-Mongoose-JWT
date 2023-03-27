const produtos = require('../models/produtos')
const jwt = require('jsonwebtoken')
const secret = 'AX88GH9H38KG0B0304LG'
const bcrypt = require('bcrypt')
const { findById } = require('../models/usuarios')
const usuarios = require('../models/usuarios')

// Helpers
const criarToken = require('../helpers/criarToken')
const pegarToken = require('../helpers/pegarToken')
const pegarUsuarioToken = require('../helpers/pegarUsuarioToken')
const ObjectId = require('mongoose').Types.ObjectId // Verifica se o id na url é valido

module.exports = class usuarioController {

    static cadastrar = async (req, res) => {

        const {nome, descricao, valor} = req.body
        const available = true

        // Validações 

        if(!nome){
            res.json({message:"Insira um nome"})
            return
        }

        if(!descricao){
            res.json({message:"Insira uma descricao"})
            return
        }

        if(!valor){
            res.json({message:"Insira um valor"})
            return
        }

        // Checa se o usuário que está cadastrando o produto existe e pega o usuario
        const token = pegarToken(req)
        const usuario = await pegarUsuarioToken(token)

        const produto = new produtos({
            nome,
            descricao,
            valor,
            available,
            usuarios: {
                _id: usuario._id,
                nome: usuario.nome,
                telefone: usuario.telefone,
            }
        })

        try {

            const novoProduto = await produto.save()
            res.json({message: "Produto cadastrado com sucesso", novoProduto})

        } catch (error) {
            res.json({message: error})
        }

    }

    static minhasCompras = async (req, res) => {

        // Checa se o usuário que está cadastrando o produto existe e pega o usuario
        const token = pegarToken(req)
        const usuario = await pegarUsuarioToken(token)

        const produto = await produtos.find({'comprador._id': usuario._id}).sort('-createdAt') // Pegar todos os produtos solicitados por ordem de cadastro
        res.json({message: produto})

    }

    static listarProdutosVendidos = async (req, res) => {
        const produto = await produtos.find().sort('-createdAt') // Pegar todos os produtos por ordem de cadastro
        res.json({message: produto})

    }

    static listarProdutosCadastrados = async(req, res, next) => {
        const produto = await produtos.find().sort('-createdAt') // Pegar todos os produtos por ordem de cadastro
        res.json({message: produto})

    }

    static listarProdutosCadastradosId = async(req, res, next) => {
        const id = req.params.id

        if(!ObjectId.isValid(id)){
            res.json({message: "Id invalido"})
            return
        }

        const produto = await produtos.findOne({_id: id}) // Pegar todos os produtos por ordem de cadastro

        if(!produto){
            res.json({message: "Produto não encontrado"})
        }

        res.json({message: produto})
    }

    static listarMeusProdutosCadastrados = async(req, res) => {

        // Checa se o usuário que está cadastrando o produto existe e pega o usuario
        const token = pegarToken(req)
        const usuario = await pegarUsuarioToken(token)

        const produto = await produtos.find({'usuarios._id': usuario._id}).sort('-createdAt') // Pegar todos os produtos por ordem de cadastro

        if(!produto){
            res.json({message: "Produto não encontrado"})
            return
        }else{
            res.json({message: "Produto encontrado:", produto})
        }

    }

    static editarPorId = async(req, res) => {
        const id = req.params.id

        const {nome, descricao, valor, available} = req.body

        const produtoAlterado = {}

        // Checa se o produto existe

        const prod = await produtos.findOne({_id: id})

        if(!prod){
            res.json({message: "Produto não está cadastrado"})
        }

        // Checa se o usuário existe e pegar o usuario
        const token = pegarToken(req)
        const usuario = await pegarUsuarioToken(token)

        // Não editar ou deletar produtos de outro usuário
        if(prod.usuarios._id.toString() !== usuario._id.toString()){
            res.json({message: "Houve um problema"})
            return
        }

        // Validações 

        if(!nome){
            res.json({message:"Insira um nome"})
            return
        }
        produtoAlterado.nome = nome

        if(!descricao){
            res.json({message:"Insira uma descricao"})
            return
        }

        produtoAlterado.descricao = descricao

        if(!valor){
            res.json({message:"Insira um valor"})
            return
        }

        produtoAlterado.valor = valor

        try {
            await produtos.findByIdAndUpdate(id, produtoAlterado)
            res.json({message: "Produto alterado com sucesso", produtoAlterado})

        } catch (error) {
            res.json({message: error})
        }
    }

    static deletarProdutoCadastrado = async(req, res) => {
        const id = req.params.id

        // Checa se o produto existe

        const prod = await produtos.findOne({_id: id})

        if(!prod){
            res.json({message: "Produto não está cadastrado"})
        }

        // Checa se o usuário existe e pegar o usuario
        const token = pegarToken(req)
        const usuario = await pegarUsuarioToken(token)

        // Não editar ou deletar produtos de outro usuário
        if(prod.usuarios._id.toString() !== usuario._id.toString()){
            res.json({message: "Houve um problema"})
            return
        }


        await produtos.deleteOne({'usuarios._id': usuario._id})
        res.json({message: "Produto deletado com sucesso!"})
    }

}