const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
let isConnected;

module.exports = connectToDatabase = () => {
    if (isConnected) {
        console.log('=> sing existing connection');
        return Promise.resolve();
    }
    console.log('=> sing existing connection');
    return mongoose.connection(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        connectTimeout: 99999,
    }).then(db => {
        isConnected = db.connections[0].readyState;
    })
}