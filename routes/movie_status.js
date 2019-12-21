'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const mongoose = require('mongoose');
const dbConnect = require('../db');
const movie = require('../movie');

router.get('/', (req,res) => {
    console.log(Date() + " - GET /movie_status");
    movie.find({},(err,moviesStatus) => {
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
    movie.create(movieStatus, (err) => {
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
    movie.delete({},{multi:true}, (err,nrem) => {
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
    movie.find({_id: id}, (err,movieStatus) => {
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
    movie.update({_id: id}, movieStatus, (err, nrep) => {
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
    movie.delete({},{multi:true}, (err,nrem) => {
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
    movie.find({id_user: id}, (err,moviesStatus) => {
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
    let user_param = req.params._id_user;
    let movie_param = req.params._id_movie;
    movie.find({id_user: user_param, id_movie: movie_param}, (err,movieStatus) => {
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