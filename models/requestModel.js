const mongoose = require("mongoose");

const requestSchema = mongoose.Schema({
  slot: { type: mongoose.Schema.Types.ObjectId, ref: "Slots" },
  request: String,
  additionalInfo: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
  },
  requestAt: { type: Date, default: new Date(Date.now()) },
});

module.exports = mongoose.model("Requests", requestSchema);
