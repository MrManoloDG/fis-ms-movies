'use strict';

const express = require('express');
const router = express.Router();
const DataStore = require('nedb');
const DB_FILENAME = __dirname + "Database/";

let db = new DataStore({filename: DB_FILENAME + "movie_status", autoload:true});

router.get('/', (req,res) => {
    console.log(Date() + " - GET /movie_status");
    db.find({},(err,moviesStatus) => {
        if(err) {
            console.log(Date() + " - " + err);
            res.sendStatus(500);
        } else {
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


module.exports = router