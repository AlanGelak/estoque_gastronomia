//Define as rotas da API e direciona cada endpoint para sua respectiva Controller.

const express = require("express")
const router = express.Router()
const conn = require("../database/connection")

// LISTAR
router.get("/", (req, res, next) => {
    conn("categoria")
        .then(resultado => res.json(resultado))
        .catch(next)
})

// CRIAR
router.post("/", (req, res, next) => {
    conn("categoria")
        .insert(req.body)
        .then(resultado => res.json({ id: resultado[0], mensagem: "Categoria criada" }))
        .catch(next)
})

// EDITAR
router.put("/:idCategoria", (req, res, next) => {
    conn("categoria")
        .where("id", req.params.idCategoria)
        .update(req.body)
        .then(() => res.json({ mensagem: "Categoria atualizada" }))
        .catch(next)
})

// DELETAR
router.delete("/:idCategoria", (req, res, next) => {
    conn("categoria")
        .where("id", req.params.idCategoria)
        .delete()
        .then(() => res.json({ mensagem: "Categoria removida" }))
        .catch(next)
})

module.exports = router
