const Movie = require('../models/movie');
const mongoose = require('mongoose');
const dbConnect = require('../db');

describe('MongoDB integration tests', () => {
    beforeAll(() => {
        return dbConnect();
    });

    beforeEach((done) => {
        movie.deleteMany({}, (err) => {
            done();
        });
    });

    it("Writes a movie in DB", (done) => {
        const movie = new Movie({});
        done();
    });

    afterAll((done) => {
        mongoose.connection.db.dropDatabase(() => {
            mongoose.connection.close(done);
        });
    });
});