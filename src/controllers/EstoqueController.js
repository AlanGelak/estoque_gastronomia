const knex = require("../database/connection");

module.exports = {
    listarTodos: async (req, res) => {
        try {
            const movimentos = await knex("estoque");
            res.json(movimentos);
        } catch (erro) {
            res.status(500).json({ erro: erro.message });
        }
    },

    listarPorIngrediente: async (req, res) => {
        const { idIngrediente } = req.params;

        try {
            const movimentos = await knex("estoque")
                .where("codIngrediente", idIngrediente);

            res.json(movimentos);
        } catch (erro) {
            res.status(500).json({ erro: erro.message });
        }
    },

    saldo: async (req, res) => {
        const { idIngrediente } = req.params;

        try {
            const entradas = await knex("estoque")
                .where({ codIngrediente: idIngrediente, tipo: "entrada" })
                .sum({ total: "quantidade" });

            const saidas = await knex("estoque")
                .where({ codIngrediente: idIngrediente, tipo: "saida" })
                .sum({ total: "quantidade" });

            const saldo = (entradas[0].total || 0) - (saidas[0].total || 0);

            res.json({ idIngrediente, saldo });
        } catch (erro) {
            res.status(500).json({ erro: erro.message });
        }
    },

    registrarMovimento: async (req, res) => {
        try {
            const resultado = await knex("estoque").insert(req.body);
            res.status(201).json({ id: resultado[0] });
        } catch (erro) {
            res.status(500).json({ erro: erro.message });
        }
    }
};
