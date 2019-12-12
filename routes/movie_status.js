'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const mongoose = require('mongoose');
const DB_FILENAME = __dirname + "Database/";
const Schema = mongoose.Schema;


router.use(bodyParser);

//let db = new DataStore({filename: DB_FILENAME + "movie_status", autoload:true});
mongoose.connect('mongodb://mongo:27017/', {useNewUrlParser: true});

let db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function() {
    console.log("We\'re connected!");
});



let movieSchema = Schema({
    name: String,
    release_date: Date,
    genre: [String]
});



let movie = mongoose.model('movie', movieSchema);

router.get('/', (req,res) => {
    console.log(Date() + " - GET /movie_status");
    movie.find({},(err,moviesStatus) => {
        if(err) {
            console.log(Date() + " - " + err);
            res.sendStatus(500);
        } else {
            console.log("Llego a conectar");
            res.status(200).send(moviesStatus);
        }
    });
});

router.post('/', (req,res) => {
    console.log(Date() + " - POST /movie_status");
    let movieStatus = req.body;
    db.insert(movieStatus, (err) => {
        if(err) {
            console.log(Date() + " - " + err);
            res.sendStatus(500);
        } else {
            res.sendStatus(201);
        }
    });
});

router.delete('/', (req,res) => {
    console.log(Date() + " - DELETE /movie_status");
    db.remove({},{multi:true}, (err,nrem) => {
        if(err) {
            console.log(Date() + " - " + err);
            res.sendStatus(500);
        } else {
            res.status(200).send({
                msg: nrem + ' Movies Status deleted!'
            });
        }
    })
});

router.get('/:_id', (req,res) => {
    console.log(Date() + " - GET /movie_status/:_id");
    let id = req.params._id;
    db.find({_id: id}, (err,movieStatus) => {
        if(err) {
            console.log(Date() + " - " + err);
            res.sendStatus(500);
        } else if(movieStatus === null){
            res.sendStatus(404);
        } else {
            res.status(200).send(movieStatus);
        }
    })
});

router.put('/:_id', (req,res) => {
    console.log(Date() + " - PUT /movie_status/:_id");
    let id = req.params._id;
    let movieStatus = req.body;
    db.update({_id: id}, movieStatus, (err, nrep) => {
        if(err) {
            console.log(Date() + " - " + err);
            res.sendStatus(500);
        } else if(nrep === 0){
            res.sendStatus(404);
        } else {
            res.status(200).send({
                msg: 'Movie Status updated!'
            })
        }
    });
});

router.delete('/:_id', (req,res) => {
    console.log(Date() + " - DELETE /movie_status/:_id");
    let id = req.params._id;
    db.remove({},{multi:true}, (err,nrem) => {
        if(err) {
            console.log(Date() + " - " + err);
            res.sendStatus(500);
        } else if(nrem === 0){
            res.sendStatus(404);
        } else {
            res.status(200).send({
                msg: 'Movie Status deleted!'
            })
        }
    })
});

router.get('/user/:_id', (req,res) => {
    console.log(Date() + " - GET /movie_status/user/:_id");
    let id = req.params._id;
    db.find({id_user: id}, (err,moviesStatus) => {
        if(err) {
            console.log(Date() + " - " + err);
            res.sendStatus(500);
        } else if(moviesStatus === null){
            res.sendStatus(404);
        } else {
            res.status(200).send(moviesStatus);
        }
    })
});

router.get('/:_id_user/:_id_movie', (req,res) => {
    console.log(Date() + " - GET /movie_status/:_id_user/:_id_movie");
    let user = req.params._id_user;
    let movie = req.params._id_movie;
    db.find({id_user: user, id_movie: movie}, (err,movieStatus) => {
        if(err) {
            console.log(Date() + " - " + err);
            res.sendStatus(500);
        } else if(movieStatus === null){
            res.sendStatus(404);
        } else {
            res.status(200).send(movieStatus);
        }
    })
});


module.exports = router