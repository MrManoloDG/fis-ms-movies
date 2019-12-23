const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let movieSchema = Schema({
    id_user: {
        type: String, 
        required:true
    },
    id_movie: {
        type: String, 
        required:true
    },
    status:	{
        type: String, 
        required:true
    },
    status_date: {
        type: Date,
        required: true
    }
});

let movie = mongoose.model('movie', movieSchema);

module.exports = movie