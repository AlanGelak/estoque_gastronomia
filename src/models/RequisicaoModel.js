const conn = require("../database/connection")

module.exports = {
    registrarSaida(item, motivo) {
        return conn("estoque").insert({
            codIngrediente: item.codIngrediente,
            quantidade: item.quantidade,
            tipo: "saida",
            motivo
        })
    }
}
