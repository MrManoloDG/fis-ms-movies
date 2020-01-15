const urljoin = require('url-join');
const request = require('request-promise-native').defaults({json: true});

const NodeCache = require('node-cache');

var CommandsFactory = require('hystrixjs').commandFactory;
var serviceCommand = CommandsFactory.getOrCreate("TMDB")
    .run(request)
    .build();

const tmdb_cache = new NodeCache({ checkperiod: 120, clone: false });

function hystrix(url, options){
    var promise = serviceCommand.execute(url, options);
    return promise; 
}

function cacheUpdate(url, options) {
    return hystrix(url, options).then((body) => {
        console.log("Actualizando cache");
        tmdb_cache.set(url, body);
        return body;
    });
}

function requestTMDB(url, options){
    return new Promise(function (resolve){
        var cached_response = tmdb_cache.get(url);
        console.log("Entrando a cache");
        resolve (cached_response != undefined ? cached_response : cacheUpdate(url, options))
    });
}

class TMDBResource {
    // Urls are of type String[]. The function is meant to merge all the fragments for the TMDB API url.
    // The following method is just an implementation of the adapter pattern.
    static URLJoin(urls){
        return urljoin(urls);
    }

    static getRequest(url, options = {}){
        return requestTMDB(url, options);
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

    static getTMDBResourceDiscover(){
        return process.env.TMDB_URL_DISCOVER;
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
            TMDBResource.getTMDBResourceID(),
            idString,
            TMDBResource.getApiKey(),
            TMDBResource.languageTMDB()
        ];
        return TMDBResource.getRequest(TMDBResource.URLJoin(urls));
    }

    static searchMovies(searchEntries){
        const urls = [
            TMDBResource.getTMDBResourceSearch(),
            TMDBResource.getApiKey(),
            TMDBResource.languageTMDB(),
            String(searchEntries)
        ];
        return TMDBResource.getRequest(TMDBResource.URLJoin(urls));
    }

    static discoverMovies(searchEntries){
        const urls = [
            TMDBResource.getTMDBResourceDiscover(),
            TMDBResource.getApiKey(),
            TMDBResource.languageTMDB(),
            String(searchEntries)
        ];
        return TMDBResource.getRequest(TMDBResource.URLJoin(urls));
    }
}

module.exports = TMDBResource;