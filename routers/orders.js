const { Order } = require("../models/order");
const { OrderItem } = require("../models/order-item");
const { Product } = require("../models/product");
const express = require("express");
const router = express.Router();
router.get(`/`, async (req, res) => {
  const orderList = await Order.find()
    .populate("user", "name")
    .sort({ dateOrdered: -1 });
  if (!orderList) return res.status(404).json({ success: false });
  res.send(orderList);
});
router.get("/:id", async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate("user", "name")
    .populate({
      path: "orderItems",
      populate: {
        path: "product",
        populate: "category",
      },
    });
  if (!order) return res.status(404).json({ success: false });
  res.send(order);
});
router.put("/:id", async (req, res) => {
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    {
      status: req.body.status,
    },
    { new: true }
  );
  if (!order) return res.status(404).json({ success: false });
  res.send(order);
});
router.delete("/:id", async (req, res) => {
  const order = await Order.findByIdAndRemove(req.params.id).then(
    async (order) => {
      if (order) {
        await order.orderItems.map(async (orderItem) => {
          await OrderItem.findByIdAndRemove(orderItem);
        });
        return res.status(200).json({ success: true });
      } else {
        return res.status(404).json({ success: false });
      }
    }
  );
  if (!order) return res.status(404).json({ success: false });
});
router.post("/", async (req, res) => {
  const orderItemsIds = Promise.all(
    req.body.orderItems.map(async (item) => {
      let newOrderItem = new OrderItem({
        quantity: item.quantity,
        product: item.product,
      });
      newOrderItem = await newOrderItem.save();
      return newOrderItem._id;
    })
  );

  const orderItemsIdsResolved = await orderItemsIds;

  const totalPrices = await Promise.all(
    orderItemsIdsResolved.map(async (orderItemId) => {
      const orderItem = await OrderItem.findById(orderItemId).populate(
        "product",
        "price"
      );
      const totalPrice = orderItem.quantity * orderItem.product.price;
      return totalPrice;
    })
  );
  const totalPrice = totalPrices.reduce((a, b) => a + b, 0);
  let order = new Order({
    orderItems: orderItemsIdsResolved,
    shippingAddress1: req.body.shippingAddress1,
    shippingAddress2: req.body.shippingAddress2,
    city: req.body.city,
    zip: req.body.zip,
    country: req.body.country,
    phone: req.body.phone,
    status: req.body.status,
    totalPrice: totalPrice,
    user: req.body.user,
  });
  order = await order.save();
  if (!order) return res.status(400).json({ success: false });
  res.send(order);
});
router.get("/get/totalsales", async (req, res) => {
  const totalSales = await Order.aggregate([
    { $group: { _id: null, totalsales: { $sum: "$totalPrice" } } },
  ]);
  if (!totalSales) return res.status(404).json({ success: false });
  res.send({ totalSales: totalSales.pop().totalsales });
});
router.get("/get/count", async (req, res) => {
  const orderCount = await Order.countDocuments();
  if (!orderCount) return res.status(404).json({ success: false });
  res.send({ orderCount });
});
module.exports = router;
