const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

router.use(bodyParser);

class filter{
    constructor(label, value){
        this.label = label;
        this.value = value;
    }

    display(){
        return this.label + "=" + this.value;
    }
}

function getUrl(filters, uri = ""){
    if(filters.length == 1)
        return uri + filters[0].display();

    else
        return getUrl(filters.slice(1), (uri + filters[0].display() + "&"));
}

router.get('/', (req, res) => {
    res.sendStatus(200).send(getUrl(req.body));
});

router.get('/', (req, res) => {
    res.sendStatus(200).send(getUrl(req.body));
});