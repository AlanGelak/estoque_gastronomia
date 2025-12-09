const db = require("../database/connection")

module.exports = {
    listar() {
        return db("categoria")
    },

    criar(dados) {
        return db("categoria").insert(dados)
    }
}
