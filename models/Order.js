const mongoose = require("mongoose");
const OrderSchema = new mongoose.Schema({
    uuid: {
        type: String,
        required: true
    },
    hash: {
        type: String,
        required: true
    },
    action: {
        type: String,
        required: true
    },
    odds: {
        type: Number,
        required: true
    },
    market: {
        type: String,
        required: true
    },
    teams: {
        type: String,
        required: true
    },
    bet: {
        type: Number,
        required: true
    },
    returned: {
        type: Number,
        required: true
    }
}, { timestamps: true });
module.exports = mongoose.model("Orders", OrderSchema);