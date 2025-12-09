const db = require("../database/connection")

module.exports = {
    listarPorPrato(id) {
        return db("receita")
            .leftJoin("ingrediente", "receita.codIngrediente", "ingrediente.id")
            .select("receita.*", "ingrediente.nome AS ingrediente")
            .where("codPrato", id)
    },

    criar(dados) {
        return db("receita").insert(dados)
    }
}
