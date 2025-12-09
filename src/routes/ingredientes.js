const express = require("express")
const router = express.Router()
const conn = require("../database/connection")

router.get("/", (req, res, next) => {
    conn("ingrediente")
        .then(resultado => res.json(resultado))
        .catch(next)
})

router.post("/", (req, res, next) => {
    conn("ingrediente")
        .insert(req.body)
        .then(resultado => res.json({ id: resultado[0], mensagem: "Ingrediente criado" }))
        .catch(next)
})

router.put("/:idIngrediente", (req, res, next) => {
    conn("ingrediente")
        .where("id", req.params.idIngrediente)
        .update(req.body)
        .then(() => res.json({ mensagem: "Ingrediente atualizado" }))
        .catch(next)
})

router.delete("/:idIngrediente", (req, res, next) => {
    conn("ingrediente")
        .where("id", req.params.idIngrediente)
        .delete()
        .then(() => res.json({ mensagem: "Ingrediente removido" }))
        .catch(next)
})

module.exports = router
