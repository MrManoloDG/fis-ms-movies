const mongoose = require('mongoose');
const DB_URL = (process.env.MONGO_URL || 'mongodb://localhost:27017');

const dbConnect = function() {
    console.log("Trying to connect: " + DB_URL);
    const db = mongoose.connection;
    mongoose.set('useFindAndModify', false);
    db.on('error', console.error.bind(console, 'connection error: '));
    return mongoose.connect(DB_URL, {useUnifiedTopology: true,useNewUrlParser: true});
}

module.exports = dbConnect;