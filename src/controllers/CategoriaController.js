const Categoria = require("../models/CategoriaModel")

module.exports = {
    async listar(req, res) {
        const categorias = await Categoria.listar()
        res.json(categorias)
    },

    async criar(req, res) {
        const id = await Categoria.criar(req.body)
        res.status(201).json({ mensagem: "Categoria criada", id: id[0] })
    }
}
