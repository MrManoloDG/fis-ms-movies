const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let movieSchema = Schema({
    _id: String,
    id_user: String,
    id_movie: String,
    status:	String
});

let movie = mongoose.model('movie', movieSchema);

module.exports = movie