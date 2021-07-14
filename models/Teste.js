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
  username: {
    type: String
  },
}, { timestamps: true, strict: false, collection: 'teste' });
module.exports = mongoose.model("Teste", OrderSchema);