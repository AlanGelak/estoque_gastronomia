const db = require("../database/connection")

module.exports = {
    listar() {
        return db("ingrediente")
    },

    criar(dados) {
        return db("ingrediente").insert(dados)
    }
}
