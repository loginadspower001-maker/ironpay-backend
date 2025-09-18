const response = await axios.post(
  "https://api.ironpayapp.com.br/api/public/v1/transactions",
  {
    amount: req.body.amount,
    offer_hash: process.env.OFFER_HASH,
    payment_method: "pix",
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
    installments: req.body.installments || 1,
  },
  {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.API_TOKEN}`, // <<<<< IMPORTANTE
    },
  }
);
