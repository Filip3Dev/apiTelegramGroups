const mongoose = require("mongoose");
const OrderSchema = new mongoose.Schema({
  message_id: {
    type: Number
  },
  sender_chat: {
    type: Number
  },
  chat_title: {
    type: String
  },
  date: {
    type: Date
  },
  chat_id: {
    type: Number
  },
  chat_type: {
    type: String
  },
  photo_id: {
    type: String
  },
  caption: {
    type: String
  },
  text: {
    type: String
  },
  id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Monitor',
    required: true
  },
}, { timestamps: true, collection: 'messages' });
module.exports = mongoose.model("Messages", OrderSchema);