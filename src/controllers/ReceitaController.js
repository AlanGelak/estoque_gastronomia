const Receita = require("../models/ReceitaModel")
const Estoque = require("../models/EstoqueModel")

module.exports = {
    async listar(req, res) {
        const lista = await Receita.listarPorPrato(req.params.idPrato)
        res.json(lista)
    },

    async criar(req, res) {
        const id = await Receita.criar(req.body)
        res.status(201).json({ mensagem: "Item da receita criado", id: id[0] })
    },

    async vender(req, res) {
        const itens = await Receita.listarPorPrato(req.params.idPrato)

        for (let item of itens) {
            await Estoque.registrarMovimento({
                codIngrediente: item.codIngrediente,
                quantidade: item.quantidade,
                tipo: "saida",
                motivo: "Venda do prato"
            })
        }

        res.json({ mensagem: "Venda concluída e estoque atualizado" })
    }
}
