const express = require('express');
const router = express.Router();
const urljoin = require('url-join');
const request = require('request-promise-native').defaults({json: true});

class TMDBResource {
    // Urls are of type String[]. The function is meant to merge all the fragments for the TMDB API url.
    // The following method is just an implementation of the adapter pattern.
    static URLJoin(urls){
        return urljoin(urls);
    }

    static getRequest(url, options = {}){
        return request.get(url, options);
    }


    /*
    The two following methods may seem identical, however the TMDB API's URL is different is you are searching movies
    by attributes(first method) or looking for an specific movie by the ID(second method).
    */
    static getTMDBResourceSearch(){
        return process.env.TMDB_URL_SEARCH;
    }

    static getTMDBResourceID(){
        return process.env.TMDB_URL_ID;
    }

    static getApiKey(){
        return "?api_key=" + process.env.API_KEY_TMDB;
    }

    static languageTMDB(){
        return "&language=es";
    }

    static getMovie(id) {
        const idString = "/" + id;
        const urls = [
            this.getTMDBResourceID(),
            idString,
            this.getApiKey(),
            this.languageTMDB()
        ];
        return this.getRequest(this.URLJoin(urls));
    }

    static searchMovies(searchEntries){
        const urls = [
            this.getTMDBResourceSearch(),
            this.getApiKey(),
            this.languageTMDB(),
            String(searchEntries)
        ];
        console.log(String(searchEntries));
        console.log(this.URLJoin(urls));
        return this.getRequest(this.URLJoin(urls));
    }
}


/*
This class is meant to merge all the filters stored, so the can be included in the url for the TMDB API.
Each element is supposed to have a key and value linked to the former. The keys are supposed to be provided
by the frontend, being the values the ones introduced by the user.
*/
/*class filter{
    constructor(label, value){
        this.label = label;
        this.value = value;
    }

    display(){
        return this.label + "=" + this.value;
    }
}*/

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
    TMDBResource.searchMovies(searchEntries)
        .then((body) => {
            res.send(body);
        }).catch((err) => {
            console.log("Date : " + Date() + "-" + err + "-");
            res.sendStatus(500);
        });
});

router.get('/:_id', (req, res) => {
    console.log(Date() + "\tGet Movie Api");
    TMDBResource.getMovie(req.params._id)
        .then((body) => {
            res.send(body);
        }).catch((err) => {
            console.log("Date : " + Date() + "-" + err + "-");
            res.sendStatus(500);
        });
});

router.get('/discover', (req, res) => {
    /*console.log(Date() + "\tGet Movie Api");
    TMDBResource.getMovie(req.params._id)
        .then((body) => {
            res.send(body);
        }).catch((err) => {
            console.log("Date : " + Date() + "-" + err + "-");
            res.sendStatus(500);
        });*/
});

module.exports = router;