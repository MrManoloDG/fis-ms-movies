const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let movieSchema = Schema({
    id_user: String,
    id_movie: String,
    status:	String,
    release_date: Date,
    genre: [String]
});

let movie = mongoose.model('movie', movieSchema);

module.exports = movie