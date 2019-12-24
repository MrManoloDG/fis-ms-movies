const express = require('express');
const router = express.Router();
const urljoin = require('url-join');
const request = require('request-promise').defaults({json: true});

class TMDBResource {
    
    static TMDBResource(url) {
        const tmdbServer = process.env.TMDB_URL;
        return urljoin(tmdbServer, url);
    }

    static requestHeaders(){
        const tmdb_key = process.env.API_KEY_TMDB;
        return {
            api_key : tmdb_key
        }
    }

    static getRequest(urlPartToAdd){
        const url = TMDBResource.TMDBResource(urlPartToAdd);
        const options = {
            headers: TMDBResource.request()
        }

        return request.get(url, options);
    }

    static getMovie(id) {
        return this.getRequest("/" + id + "/" + "?language=es");
    }

    static searchMovies(filterOptions){
        return this.getRequest("?language=es" + filterOptions);
    }
}


//This class is meant to merge all the filters stored, so the can be included in the url for the TMDB API.
//Each element is supposed to have a key and value linked to the former. The keys are supposed to be provided
//by the frontend, being the values the ones introduced by the user.
class filter{
    constructor(label, value){
        this.label = label;
        this.value = value;
    }

    display(){
        return this.label + "=" + this.value;
    }
}

/*
*   This method is the one that merges all the filters options choosed or filled by the user.
*/

function getUrl(filters, uri = "&"){
    if(filters.length == 1)
        return uri + filters[0].display();

    else
        return getUrl(filters.slice(1), (uri + filters[0].display() + "&"));
}

router.get('/', (req, res) => {
    console.log(Date() + "\tGet Movies Filter");
    const filters = req.body;
    TMDBResource.searchMovies(getUrl(filters))
        .then((body) => {
            res.send(body);
        }).catch((err) => {
            console.log("Date : " + Date() + "-" + err + "-");
            res.sendStatus(500);
        });
});

router.get('/:_id', (req, res) => {
    console.log(Date() + "\tGet Movie Api");
    TMDBResource.getMovie(req.param._id)
        .then((body) => {
            res.send(body);
        }).catch((err) => {
            console.log("Date : " + Date() + "-" + err + "-");
            res.sendStatus(500);
        });
});

module.exports = router;