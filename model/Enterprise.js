const mongoose = require("mongoose");
const InterpretorSchema = mongoose.Schema({
  email: String,
  password: String,
  status: String,
  name: String,
  vcode:Number,
  passwordTrack: [String],
});

const Interpretor = mongoose.model("Interpretor", InterpretorSchema);
module.exports = Interpretor;
