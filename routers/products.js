const express = require("express");
const router = express.Router();
const { Product } = require("../models/product");
router.get(`/`, async (req, res) => {
  const productList = await Product.find();
  if (!productList) return res.status(404).json({ success: false });
  res.send(productList);
});
router.post(`/`, (req, res) => {
  const product = new Product({
    name: req.body.name,
    image: req.body.image,
    countInStock: req.body.countInStock,
  });
  product
    .save()
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((err) => {
      error: err;
      success: false;
    });
});
module.exports = router;
