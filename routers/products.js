const express = require("express");
const { Category } = require("../models/category");
const router = express.Router();
const { Product } = require("../models/product");
const mongoose = require("mongoose");
router.get(`/`, async (req, res) => {
  const productList = await Product.find().populate("category");
  if (!productList) return res.status(404).json({ success: false });
  res.send(productList);
});
router.get(`/specific`, async (req, res) => {
  const productList = await Product.find()
    .select("name image -_id")
    .populate("category");
  if (!productList) return res.status(404).json({ success: false });
  res.send(productList);
});
router.get("/:id", async (req, res) => {
  const product = await Product.findById(req.params.id).populate("category");
  if (!product)
    return res
      .status(404)
      .json({ success: false, message: "No Product Found" });
  res.send(product);
});
router.post(`/`, async (req, res) => {
  const category = await Category.findById(req.body.category);
  if (!category) return res.status(404).send("Invalid Category");
  let product = new Product({
    name: req.body.name,
    description: req.body.description,
    richDescription: req.body.richDescription,
    image: req.body.image,
    brand: req.body.brand,
    price: req.body.price,
    category: req.body.category,
    countInStock: req.body.countInStock,
    rating: req.body.rating,
    numReviews: req.body.numReviews,
    isFeatured: req.body.isFeatured,
  });
  product = await product.save();
  if (!product) return res.status(500).json({ success: false });
  res.send(product);
});
router.put("/:id", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).send("Invalid Id");
  }
  const category = await Category.findById(req.body.category);
  if (!category) return res.status(404).send("Invalid Category");
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      description: req.body.description,
      richDescription: req.body.richDescription,
      image: req.body.image,
      brand: req.body.brand,
      price: req.body.price,
      category: req.body.category,
      countInStock: req.body.countInStock,
      rating: req.body.rating,
      numReviews: req.body.numReviews,
      isFeatured: req.body.isFeatured,
    },
    {
      new: true,
    }
  );
  if (!product) return res.status(500).json({ success: false });
  res.send(product);
});
router.delete("/:id", (req, res) => {
  Product.findByIdAndDelete(req.params.id)
    .then((product) => {
      if (product) {
        return res.status(200).json({ success: true });
      } else {
        return res.status(404).json({ success: false });
      }
    })
    .catch((err) => res.status(500).json({ success: false, message: err }));
});

router.get(`/get/count`, async (req, res) => {
  const productCount = await Product.countDocuments();
  if (!productCount) return res.status(404).json({ success: false });
  res.send({
    productCount: productCount,
  });
});
router.get("/get/featured/:count", async (req, res) => {
  const count = req.params.count ? req.params.count : 0;
  const productList = await Product.find({ isFeatured: true }).limit(+count);
  if (!productList) return res.status(404).json({ success: false });
  res.send(productList);
});
module.exports = router;
