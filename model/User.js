const mongoose = require("mongoose");
const UserSchema = mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  status: String,
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  vcode: Number,
  passwordTrack: [String],
});

const user = mongoose.model("User", UserSchema);
module.exports = user;
