const db = require("../database/connection")

module.exports = {
    listar() {
        return db("prato")
    },

    criar(dados) {
        return db("prato").insert(dados)
    }
}
