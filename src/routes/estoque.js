const express = require("express")
const router = express.Router()
const conn = require("../database/connection")

// REGISTRAR ENTRADA OU SAÍDA
router.post("/", (req, res, next) => {
    conn("estoque")
        .insert(req.body)
        .then(resultado => res.json({ id: resultado[0], mensagem: "Movimento registrado" }))
        .catch(next)
})

// LISTAR MOVIMENTOS POR INGREDIENTE
router.get("/ingrediente/:idIngrediente", (req, res, next) => {
    conn("estoque")
        .where("codIngrediente", req.params.idIngrediente)
        .then(resultado => res.json(resultado))
        .catch(next)
})

// CONSULTAR SALDO
router.get("/saldo/:idIngrediente", async (req, res, next) => {
    const id = req.params.idIngrediente

    try {
        const entradas = await conn("estoque")
            .where({ codIngrediente: id, tipo: "entrada" })
            .sum({ total: "quantidade" })

        const saidas = await conn("estoque")
            .where({ codIngrediente: id, tipo: "saida" })
            .sum({ total: "quantidade" })

        const saldo = (entradas[0].total || 0) - (saidas[0].total || 0)

        res.json({ idIngrediente: id, saldo })
    } catch (erro) {
        next(erro)
    }
})

// DELETE MOVIMENTO
router.delete("/:idMovimento", (req, res, next) => {
    conn("estoque")
        .where("id", req.params.idMovimento)
        .delete()
        .then(() => res.json({ mensagem: "Movimento removido" }))
        .catch(next)
})

module.exports = router
