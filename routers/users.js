const { User } = require("../models/user");
const express = require("express");
const router = express.Router();
router.get(`/`, async (req, res) => {
  const userList = await Category.find({});
  if (!userList) return res.status(404).json({ success: false });
  res.send(userList);
});
module.exports = router;
