const { Order } = require("../models/order");
const express = require("express");
const router = express.Router();
router.get(`/`, async (req, res) => {
  const orderList = await Category.find({});
  if (!orderList) return res.status(404).json({ success: false });
  res.send(orderList);
});
module.exports = router;
