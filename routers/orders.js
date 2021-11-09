const { Order } = require("../models/order");
const { OrderItem } = require("../models/order-item");
const express = require("express");
const router = express.Router();
router.get(`/`, async (req, res) => {
  const orderList = await Order.find();
  if (!orderList) return res.status(404).json({ success: false });
  res.send(orderList);
});
router.post("/", async (req, res) => {
  // const orderItemsIds = Promise.all(
  //   req.body.orderItems.map(async (item) => {
  //     let newOrderItem = new OrderItem({
  //       quantity: item.quantity,
  //       product: item.product,
  //     });
  //     newOrderItem = await newOrderItem.save();
  //     return newOrderItem._id;
  //   })
  // );
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
  console.log(orderItemsIdsResolved);
  let order = new Order({
    orderItems: orderItemsIdsResolved,
    shippingAddress1: req.body.shippingAddress1,
    shippingAddress2: req.body.shippingAddress2,
    city: req.body.city,
    zip: req.body.zip,
    country: req.body.country,
    phone: req.body.phone,
    status: req.body.status,
    totalPrice: req.body.totalPrice,
    user: req.body.user,
  });
  order = await order.save();
  if (!order) return res.status(400).json({ success: false });
  res.send(order);
});
module.exports = router;
