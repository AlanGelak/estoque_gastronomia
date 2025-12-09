const Prato = require("../models/PratoModel")

module.exports = {
    async listar(req, res) {
        const pratos = await Prato.listar()
        res.json(pratos)
    },

    async criar(req, res) {
        const id = await Prato.criar(req.body)
        res.status(201).json({ mensagem: "Prato criado", id: id[0] })
    }
}
