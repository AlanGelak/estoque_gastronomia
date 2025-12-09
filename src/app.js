//Configura o Express, middlewares e conecta as rotas.
const express = require("express")
const app = express()

app.use(express.json())

app.use("/categorias", require("./routes/categorias"))
app.use("/ingredientes", require("./routes/ingredientes"))
app.use("/estoque", require("./routes/estoque"))
app.use("/pratos", require("./routes/pratos"))
app.use("/receitas", require("./routes/receitas"))
app.use("/requisicoes", require("./routes/requisicoes"))

module.exports = app

const path = require("path")

app.use(express.json())
app.use(express.static(path.join(__dirname, "view")))

