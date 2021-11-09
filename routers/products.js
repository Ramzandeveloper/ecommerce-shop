const express = require("express");
const { Category } = require("../models/category");
const router = express.Router();
const { Product } = require("../models/product");
const mongoose = require("mongoose");
const multer = require("multer");
const FILE_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValid = FILE_TYPE_MAP[file.mimetype];
    let uploadError = new Error("Invalid Image Type");
    if (isValid) {
      uploadError = null;
    }
    cb(uploadError, "public/uploads");
  },
  filename: function (req, file, cb) {
    // const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileName = file.originalname.split(" ").join("-");
    // cb(null, file.fieldname + "-" + uniqueSuffix);
    const extension = FILE_TYPE_MAP[file.mimetype];
    cb(null, `${fileName}-${Date.now()}.${extension}`);
  },
});

const uploadOtpions = multer({ storage: storage });
router.get(`/`, async (req, res) => {
  let filter;
  if (req.query.category) {
    filter = { category: req.query.category };
  }
  const productList = await Product.find(filter).populate("category");
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
router.post(`/`, uploadOtpions.single("image"), async (req, res) => {
  const category = await Category.findById(req.body.category);
  if (!category) return res.status(404).send("Invalid Category");
  const file = req.file;
  if (!file) return res.status(404).send("No Image Upload");
  const fileName = req.file.filename;
  const basePath = `${req.protocol}://${req.get("host")}/public/upload/`;
  let product = new Product({
    name: req.body.name,
    description: req.body.description,
    richDescription: req.body.richDescription,
    image: `${basePath}${fileName}`,
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
router.put(
  "/images-gallery/:id",
  uploadOtpions.array("images", 10),
  async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send("Invalid Id");
    }
    let files = req.files;
    let imagesPath = [];
    const basePath = `${req.protocol}://${req.get("host")}/public/upload/`;
    if (files) {
      files.map((file) => {
        imagesPath.push(`${basePath}${file.filename}`);
      });
    }
    const product = await Product.findByIdAndUpdate(req.params.id, {
      images: req.files.map((file) => {
        return `${req.protocol}://${req.get("host")}/public/uploads/${
          file.filename
        }`;
      }),
    });
    if (!product) return res.status(404).send("Invalid Product");
    res.send(product);
  }
);
module.exports = router;
