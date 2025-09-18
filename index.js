require("dotenv").config();
const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

// 🔑 Debug das variáveis de ambiente
console.log("=====================================");
console.log("🔑 API_TOKEN:", process.env.API_TOKEN ? "OK ✅" : "NÃO ENCONTRADO ❌");
console.log("📦 OFFER_HASH:", process.env.OFFER_HASH || "NÃO ENCONTRADO ❌");
console.log("🛒 PRODUCT_HASH:", process.env.PRODUCT_HASH || "NÃO ENCONTRADO ❌");
console.log("🚪 PORT:", process.env.PORT);
console.log("=====================================");

// Rota para criar uma transação PIX
app.post("/checkout", async (req, res) => {
  try {
    const response = await axios.post(
      "https://api.ironpayapp.com.br/api/public/v1/transactions",
      {
        amount: req.body.amount,
        offer_hash: process.env.OFFER_HASH,
        payment_method: "pix",
        installments: req.body.installments || 1,
        customer: {
          name: req.body.name,
          email: req.body.email,
          phone_number: req.body.phone_number,
          document: req.body.document,
        },
        cart: [
          {
            product_hash: process.env.PRODUCT_HASH,
            title: "Taxa",
            price: req.body.amount,
            quantity: 1,
            operation_type: 1,
            tangible: false,
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.API_TOKEN}`,
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error(error.response?.data || error.message);
    res
      .status(500)
      .json({ error: "Erro ao criar transação", details: error.response?.data });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
