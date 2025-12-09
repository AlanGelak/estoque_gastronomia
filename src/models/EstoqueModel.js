const db = require("../database/connection")

module.exports = {
    registrarMovimento(dados) {
        return db("estoque").insert(dados)
    },

    listarPorIngrediente(id) {
        return db("estoque").where("codIngrediente", id)
    },

    somarEntradas(id) {
        return db("estoque")
            .where({ codIngrediente: id, tipo: "entrada" })
            .sum({ total: "quantidade" })
    },

    somarSaidas(id) {
        return db("estoque")
            .where({ codIngrediente: id, tipo: "saida" })
            .sum({ total: "quantidade" })
    }
}
