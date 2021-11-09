const { User } = require("../models/user");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
router.get(`/`, async (req, res) => {
  const userList = await User.find().select("-passwordHash");
  if (!userList) return res.status(404).json({ success: false });
  res.send(userList);
});
router.get("/:id", async (req, res) => {
  const user = await User.findById(req.params.id).select("-passwordHash");
  if (!user) return res.status(404).json({ success: false });
  res.send(user);
});
router.post("/", async (req, res) => {
  let user = new User({
    name: req.body.name,
    email: req.body.email,
    passwordHash: brcypt.hashSync(req.body.passwordHash, 10),
    phone: req.body.phone,
    street: req.body.street,
    isAdmin: req.body.isAdmin,
    apartment: req.body.apartment,
    zip: req.body.zip,
    city: req.body.city,
    country: req.body.country,
  });
  user = await user.save();
  if (!user) return res.status(400).json({ success: false });
  res.send(user);
});
router.post("/register", async (req, res) => {
  let user = new User({
    name: req.body.name,
    email: req.body.email,
    passwordHash: brcypt.hashSync(req.body.passwordHash, 10),
    phone: req.body.phone,
    street: req.body.street,
    isAdmin: req.body.isAdmin,
    apartment: req.body.apartment,
    zip: req.body.zip,
    city: req.body.city,
    country: req.body.country,
  });
  user = await user.save();
  if (!user) return res.status(400).json({ success: false });
  res.send(user);
});

router.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  const secret = process.env.SECRETE;
  if (!user) {
    return res.status(400).send("The user not found");
  }

  if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
    const token = jwt.sign(
      {
        userId: user.id,
        isAdmin: user.isAdmin,
      },
      secret,
      { expiresIn: "1d" }
    );

    res.status(200).send({ user: user.email, token: token });
  } else {
    res.status(400).send("password is wrong!");
  }
});
router.get("/get/count", async (req, res) => {
  const userCount = await User.countDocuments();
  if (!userCount) return res.status(400).json({ success: false });
  res.send({
    userCount: userCount,
  });
});
router.delete("/:id", async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).json({ success: false });
  res.send(user);
});

module.exports = router;
