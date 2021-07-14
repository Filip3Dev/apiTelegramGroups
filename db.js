const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
let isConnected;

module.exports = connectToDatabase = () => {
    if (isConnected) {
        console.log("=> using existing database connection");
        return Promise.resolve();
    }

    console.log("=> using new database connection");
    return mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        connectTimeoutMS: 99999,
        heartbeatFrequencyMS: 99999,
        serverSelectionTimeoutMS: 99999
    }).then(db => {
        isConnected = db.connections[0].readyState;
    });
};