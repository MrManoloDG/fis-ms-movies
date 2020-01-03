const Movie = require('../models/movie');
const mongoose = require('mongoose');
const dbConnect = require('../db');

describe('MongoDB integration tests', () => {
    beforeAll(() => {
        return dbConnect();
    });

    beforeEach((done) => {
        Movie.deleteMany({}, (err) => {
            done();
        });
    });

    it("Checks the database is empty", (done) => {
        Movie.find({}, (err, movies) => {
            expect(movies).toBeArrayOfSize(0);
            done();
        });
    });

    it("Writes a movie in DB", (done) => {
        const movie = new Movie(
            {
                "id_user": "Juanito",
                "id_movie": "abc2",
                "status": "Completed",
                "status_date": new Date(),
                "genre": ["Action", "Adventure"]
            }
        );

        Movie.create(movie, (err) => {
            expect(err).toBeNull();
            Movie.find({}, (err, movies) => {
                expect(movies).toBeArrayOfSize(1);
                done();
            });
        });
    });

    it("Checking update works", (done) => {
        movie = new Movie(
            {
                "id_user": "Juanito",
                "id_movie": "abc2",
                "status": "Completed",
                "status_date": new Date()
                //"genre": ["Action", "Adventure"]
            }
        );

        Movie.create(movie, (err) => {
            expect(err).toBeNull();            
            Movie.updateOne({_id: movie._id}, {status: "Pending"}, (err, nrep) => {
                expect(err).toBeNull();
                expect(nrep).toStrictEqual({"n": 1, "nModified": 1, "ok": 1});
                done();
            });
        });
    });

    it("Checks the database is empty at the end of the tests, proving the delete works", (done) => {
        Movie.find({}, (err, movies) => {
            expect(movies).toBeArrayOfSize(0);
            done();
        });
    });

    afterAll((done) => {
        mongoose.connection.db.dropDatabase(() => {
            mongoose.connection.close(done);
        });
    });
});