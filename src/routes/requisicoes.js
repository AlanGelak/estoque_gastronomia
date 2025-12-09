const express = require("express")
const router = express.Router()
const RequisicaoController = require("../controllers/RequisicaoController")

// criar requisição de retirada
router.post("/", RequisicaoController.criar)

module.exports = router
