const { ApplyJob } = require("../models/apply-job-schema");
const { Job } = require("../models/job");
const express = require("express");
const router = express.Router();
router.get(`/`, async (req, res) => {
  const applyJobList = await ApplyJob.find().sort({ dateOrdered: -1 });
  if (!applyJobList) return res.status(404).json({ success: false });
  res.send(applyJobList);
});
router.get("/:id", async (req, res) => {
  const applyJob = await ApplyJob.findById(req.params.id).populate({
    path: "Job",
  });
  if (!applyJob) return res.status(404).json({ success: false });
  res.send(applyJob);
});

router.delete("/:id", async (req, res) => {
  const applyJob = await ApplyJob.findByIdAndRemove(req.params.id);
  if (!applyJob) return res.status(404).json({ success: false });
});

router.get("/get/count", async (req, res) => {
  const applyJobLists = await ApplyJob.countDocuments();
  if (!applyJobLists) return res.status(404).json({ success: false });
  res.send({ applyJobLists });
});
module.exports = router;
