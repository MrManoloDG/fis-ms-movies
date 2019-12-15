const mongoose = require('mongoose');
const DB_URL = (process.env.MONGO_URL || 'mongodb://mongo:27017/');
const DB_FILENAME = __dirname + "Database/";

const dbConnect = function() {
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function() {
        console.log("Conectado");
    });
    return mongoose.connect(DB_URL, {useNewUrlParser: true});
}

module.exports = dbConnect;