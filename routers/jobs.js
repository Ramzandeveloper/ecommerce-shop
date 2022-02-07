const express = require("express");
const router = express.Router();
const { Job } = require("../models/job");
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
  const jobList = await Job.find();
  if (!jobList) return res.status(404).json({ success: false });
  res.send(jobList);
});
router.get(`/specific`, async (req, res) => {
  const jobList = await Job.find();
  if (!jobList) return res.status(404).json({ success: false });
  res.send(jobList);
});
router.get("/:id", async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job)
    return res.status(404).json({ success: false, message: "No Job Found" });
  res.send(job);
});
router.post(`/`, uploadOtpions.single("image"), async (req, res) => {
  const file = req.file;
  if (!file) return res.status(404).send("No Image Upload");
  const fileName = req.file.filename;
  const basePath = `${req.protocol}://${req.get("host")}/public/upload/`;
  console.log("images", basePath, fileName);
  let job = new Job({
    company: req.body.company,
    image: `${basePath}${fileName}`,
    new: req.body.new,
    featured: req.body.featured,
    position: req.body.position,
    role: req.body.role,
    level: req.body.level,
    contract: req.body.contract,
    location: req.body.location,
    languages: req.body.languages,
    tools: req.body.tools,
  });
  job = await job.save();
  if (!job)
    return res.status(500).json({ success: false, message: "Some Error" });
  res.send(job);
});
router.put("/:id", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).send("Invalid Id");
  }
  const job = await Job.findByIdAndUpdate(
    req.params.id,
    {
      company: req.body.company,
      image: `${basePath}${fileName}`,
      new: req.body.new,
      featured: req.body.featured,
      position: req.body.position,
      role: req.body.role,
      level: req.body.level,
      postedAt: req.body.postedAt,
      contract: req.body.contract,
      location: req.body.location,
      languages: req.body.languages,
      tools: req.body.tools,
    },
    {
      new: true,
    }
  );
  if (!job) return res.status(500).json({ success: false });
  res.send(job);
});
router.delete("/:id", (req, res) => {
  Job.findByIdAndDelete(req.params.id)
    .then((job) => {
      if (job) {
        return res.status(200).json({ success: true });
      } else {
        return res.status(404).json({ success: false });
      }
    })
    .catch((err) => res.status(500).json({ success: false, message: err }));
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
    const job = await Job.findByIdAndUpdate(req.params.id, {
      images: req.files.map((file) => {
        return `${req.protocol}://${req.get("host")}/public/uploads/${
          file.filename
        }`;
      }),
    });
    if (!job) return res.status(404).send("Invalid Job");
    res.send(job);
  }
);
module.exports = router;
