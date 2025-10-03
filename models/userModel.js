const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phoneNumber: { type: String, required: true, unique: true },
  emailAddress: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  gender: { type: String, required: true },
  role: { type: String, default:'user' },
  slotsBooked: [{ type: mongoose.Schema.Types.ObjectId, ref: "Slots" }],
});

module.exports = mongoose.model("Users", userSchema);
   