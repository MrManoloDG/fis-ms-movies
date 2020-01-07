const express = require('express');
const router = express.Router();
const TMDBResource = require('../models/TMDB_Class')

/*
*   This method is the one that merges all the query parameters options choosed or filled by the user.
*/
function getUrl(query){
    let url = "";
    for(key in query){
        url += "&" + key + "=" + query[key];
    }
    return url;
}

router.get('/', (req, res) => {
    console.log(Date() + "\tGet Movies Filter");
    const query_params = req.query;
    const searchEntries = getUrl(query_params).replace(" ", "+");

    if(searchEntries.search(/query\=/) === -1){
        res.status(422).send(
            "This method needs a query attribute to operate. In case you do not have name, use the discovery operator."
        );
    }
    
    else{
        TMDBResource.searchMovies(searchEntries)
        .then((body) => {
            res.status(200).send(body);
        }).catch((err) => {
            console.log("Date : " + Date() + "-" + err + "-");
            res.status(500).send(err);
        });
    }
});

router.get('/discover', (req, res) => {
    console.log(Date() + "\tGet Movie Api Discover");
    const query_params = req.query;
    const searchEntries = getUrl(query_params).replace(" ", "+");
    TMDBResource.discoverMovies(searchEntries)
        .then((body) => {
            res.status(200).send(body);
        }).catch((err) => {
            console.log("Date : " + Date() + "-" + err + "-");
            res.status(500).send(err);
        });
});

router.get('/:_id', (req, res) => {
    console.log(Date() + "\tGet Movie Api");
    TMDBResource.getMovie(req.params._id)
        .then((body) => {
            res.status(200).send(body);
        }).catch((err) => {
            console.log("Date : " + Date() + "-" + err + "-");
            res.status(500).send(err);
        });
});

module.exports = router;