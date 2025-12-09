const Ingrediente = require("../models/IngredienteModel")

module.exports = {
    async listar(req, res) {
        const ingredientes = await Ingrediente.listar()
        res.json(ingredientes)
    },

    async criar(req, res) {
        const id = await Ingrediente.criar(req.body)
        res.status(201).json({ mensagem: "Ingrediente criado", id: id[0] })
    }
}
