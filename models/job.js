const mongoose = require("mongoose");

const jobSchema = mongoose.Schema({
  company: { type: String, required: true },
  image: {
    type: String,
  },
  new: {
    type: Boolean,
    default: false,
  },
  featured: {
    type: Boolean,
    default: false,
  },
  position: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  level: {
    type: String,
    required: true,
  },
  postedAt: {
    type: Date,
    default: Date.now,
  },
  contract: {
    type: String,
  },
  location: {
    type: String,
    required: true,
  },
  languages: [
    {
      type: String,
      required: true,
    },
  ],
  tools: [
    {
      type: String,
      required: true,
    },
  ],
});
jobSchema.virtual("id").get(function () {
  return this._id.toHexString();
});
jobSchema.set("toJSON", {
  virtuals: true,
});
exports.Job = mongoose.model("Job", jobSchema);
