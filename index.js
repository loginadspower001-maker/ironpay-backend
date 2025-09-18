require("dotenv").config();
const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

// Rota para criar uma transação PIX
app.post("/checkout", async (req, res) => {
  try {
    const response = await axios.post(
      `https://api.ironpayapp.com.br/api/public/v1/transactions?api_token=${process.env.API_TOKEN}`,
      {
        amount: req.body.amount, // valor enviado pelo Postman
        offer_hash: process.env.OFFER_HASH,
        payment_method: "pix",
        installments: req.body.installments || 1, // 👈 campo obrigatório (mínimo 1 parcela)
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
            price: req.body.amount, // mesmo valor do amount
            quantity: 1,
            operation_type: 1,
            tangible: false,
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: error.response?.data || "Erro ao criar transação" });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
