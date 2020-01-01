const api = require('../server');
const BASE_API_PATH = "/api/v1";
const Search_Api = "/search_api";
const full_path = BASE_API_PATH + Search_Api;
const supertest = require('supertest');
const TMDB = require('../models/TMDB_Class');

describe("Tests for the TMDB API: ", () => {
    
    afterAll(async () => {
        await new Promise(resolve => setTimeout(() => resolve(), 500));
    });

    it("Test for GET Movie by query, query not included", () => {
        return supertest(api).get(full_path + "?query=Star Wars&release_date=100").then((response) => {
            expect(response.statusCode).toBe(200);
            expect(response.body).not.toHaveProperty("msg");
        });
    });

    it("Test for GET Movie by query, query not included", () => {
        return supertest(api).get(full_path + '?release_date=100').then((response) => {
            expect(response.statusCode).toBe(422);
            expect(response.body).toHaveProperty("msg");
        });
    });

    /*it("Test for GET Movie by query, query not included", () => {
        return supertest(api).get(full_path + '?query=Star Wars&release_date=').then((response) => {
            expect(response.statusCode).toBe(500);
            expect(response.body).toHaveProperty("msg");
        });
    });*/

    it("Test for GET Movie by ID", () => {
        return supertest(api).get(full_path + '/343611').then((response) => {
            expect(response.statusCode).toBe(200);
        });
    });

    it("Test for GET Movie by unexistent ID", () => {
        return supertest(api).get(full_path + '/1').then((response) => {
            expect(response.statusCode).toBe(500);
        });
    });

    it("Test for GET Movie by discovering", () => {
        return supertest(api).get(full_path + '/discover?primary_release_date.gte=2014-09-15&primary_release_date.lte=2014-10-22')
        .then((response) => {
            expect(response.statusCode).toBe(200);
        });
    });
});