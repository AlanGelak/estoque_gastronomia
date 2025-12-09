const express = require("express")
const router = express.Router()
const conn = require("../database/connection")

router.get("/", (req, res, next) => {
    conn("prato")
        .then(resultado => res.json(resultado))
        .catch(next)
})

router.post("/", (req, res, next) => {
    conn("prato")
        .insert(req.body)
        .then(resultado => res.json({ id: resultado[0], mensagem: "Prato criado" }))
        .catch(next)
})

router.put("/:idPrato", (req, res, next) => {
    conn("prato")
        .where("id", req.params.idPrato)
        .update(req.body)
        .then(() => res.json({ mensagem: "Prato atualizado" }))
        .catch(next)
})

router.delete("/:idPrato", (req, res, next) => {
    conn("prato")
        .where("id", req.params.idPrato)
        .delete()
        .then(() => res.json({ mensagem: "Prato removido" }))
        .catch(next)
})

module.exports = router
