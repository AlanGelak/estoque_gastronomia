const express = require("express")
const router = express.Router()
const conn = require("../database/connection")

router.get("/:idPrato", (req, res, next) => {
    conn("receita")
        .leftJoin("ingrediente", "receita.codIngrediente", "ingrediente.id")
        .select("receita.*", "ingrediente.nome AS ingrediente")
        .where("receita.codPrato", req.params.idPrato)
        .then(resultado => res.json(resultado))
        .catch(next)
})

router.post("/", (req, res, next) => {
    conn("receita")
        .insert(req.body)
        .then(resultado => res.json({ id: resultado[0], mensagem: "Ingrediente adicionado à receita" }))
        .catch(next)
})

router.put("/:idReceita", (req, res, next) => {
    conn("receita")
        .where("id", req.params.idReceita)
        .update(req.body)
        .then(() => res.json({ mensagem: "Receita atualizada" }))
        .catch(next)
})

router.delete("/:idReceita", (req, res, next) => {
    conn("receita")
        .where("id", req.params.idReceita)
        .delete()
        .then(() => res.json({ mensagem: "Item removido da receita" }))
        .catch(next)
})

module.exports = router
