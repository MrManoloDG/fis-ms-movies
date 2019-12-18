const api = require('../server.js');
const BASE_API_PATH = "/api/v1";
const Movie_Api = "/movies_status";
const supertest = require('supertest');

describe("Movies API tests", () => {

    test("Test for the GET /", () => {
        return supertest(api).get('/').expect(200);
    });
}).afterAll(async () => {await new Promise(resolve => setTimeout(() => resolve(), 500));});