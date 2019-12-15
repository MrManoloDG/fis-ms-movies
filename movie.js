const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let movieSchema = Schema({
    name: String,
    release_date: Date,
    genre: [String]
});

let movie = mongoose.model('movie', movieSchema);

module.exports = movie