const api = require('../index.js');
const BASE_API_PATH = "/api/v1";
const Movie_Api = "/movies_status";
const supertest = require('supertest');

describe("Hello world test", () => {

    it("Should do a test", () => {
        const a = 3;
        const b = 5;
        const sum = a + b;

        expect(sum).toBe(8);
    });

});

describe("Movies API tests", () => {

    test("Test for the GET /", () => {
        return supertest(api).get('/').expect(200);
    });

    test("Test to movie GET /", () => {
        console.log(BASE_API_PATH + Movie_Api + "/");
        return supertest(api).get(BASE_API_PATH + Movie_Api + "/").expect(200);
    });

});