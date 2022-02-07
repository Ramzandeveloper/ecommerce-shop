const mongoose = require("mongoose");
const applyJobSchema = mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    required: true,
  },
  city: {
    type: String,
    required: true,
  },

  country: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  dateOrdered: {
    type: Date,
    default: Date.now,
  },
});
applyJobSchema.virtual("id").get(function () {
  return this._id.toHexString();
});
applyJobSchema.set("toJSON", {
  virtuals: true,
});
exports.ApplyJob = mongoose.model("ApplyJob", applyJobSchema);
