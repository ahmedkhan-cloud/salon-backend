const mongoose = require("mongoose");

const slotSchema = mongoose.Schema({
  date: { type: String, required: true },
  startTime: { type: String, required: true },
  serviceRequired: { type: String, required: true },
  bookedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  createdAt: { type: Date, default: new Date(Date.now()) },
});

module.exports = mongoose.model("Slots", slotSchema);
