const mongoose = require("mongoose");
const OrderSchema = new mongoose.Schema({
  id: {
    type: String
  },
  title: {
    type: String
  },
  type: {
    type: String
  },
  chat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teste',
    required: true
  },
}, { timestamps: true });
module.exports = mongoose.model("Monitor", OrderSchema);