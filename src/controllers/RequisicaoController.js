const RequisicaoModel = require("../models/RequisicaoModel")

module.exports = {
    async criar(req, res, next) {
        try {
            const { responsavel, itens } = req.body

            if (!itens || itens.length === 0) {
                return res.status(400).json({
                    erro: "Nenhum item informado na requisição"
                })
            }

            for (const item of itens) {
                await RequisicaoModel.registrarSaida(
                    item,
                    `Requisição interna - ${responsavel}`
                )
            }

            res.status(201).json({
                mensagem: "Requisição registrada e estoque atualizado"
            })
        } catch (erro) {
            next(erro)
        }
    }
}
