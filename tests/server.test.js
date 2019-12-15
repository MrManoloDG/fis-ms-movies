const api = require('../index.js');
const db = require('../db.js');
const BASE_API_PATH = "/api/v1";
const Movie_Api = "/movies_status";
const supertest = require('supertest');
const movie_api_path = BASE_API_PATH + Movie_Api;


const routes = require('../routes/movie_status'); 


describe("Movies API tests", () => {
    
    describe("Movies API GET Tests", () => {
        
        beforeAll(() => {
            var mockMovies = [
                {name: 'MovieMock1', release_date: new Date(), genre: ['Action', 'Adventure']},
                {name: 'MovieMock2', release_date: new Date(), genre: ['Drama']},
                {name: 'MovieMock3', release_date: new Date(), genre: ['Comedy']},
                {name: 'MovieMock4', release_date: new Date(), genre: ['Adventure']}
            ];
    
            let dbFind = jest.spyOn(db, "find");
            dbFind.mockImplementation((query, callback) => {
                callback(null, mockMovies);
            });
        });
    
        it("Test to movie GET /", () => {
            console.log(movie_api_path);
            return supertest(api).get(movie_api_path + "/").then((response) => {
                expect(response.statusCode).toBe(200);
                //expect(response.body).toBeArrayOfSize(0);

                //expect(dbFind).toBeCalledWith({}, expect.any(Function));
            });
        });
    
        it("Test to movie GET /:id", () => {
            console.log(movie_api_path);
            return supertest(api).get(movie_api_path + "/:1").then((response) => {
                expect(response.statusCode).toBe(200);
                expect(response.body).toBeArrayOfSize(1);

                //expect(dbFind).toBeCalledWith({}, expect.any(Function));
            });
        });

        it("Test to movie GET /user/:id_movie", () => {
            return supertest(api).get(movie_api_path + "/user/:id_movie").then((response) => {
                expect(response.statusCode).toBe(200);
                expect(response.body).toBeArrayOfSize(0);
            });
        });

        it("Test to movie GET /:_id_user/:id_movie", () => {
            return supertest(api).get(movie_api_path + "/:_id_user/:id_movie").then((response) => {
                expect(response.statusCode).toBe(200);
                expect(response.body).toBeArrayOfSize(1);
            });
        });
    });

    describe("Movies API POST tests", () => {

        test("POST / correctly defined", () => {
            return supertest(api).post(movie_api_path + "/")
                .send({name: 'MovieMock4', release_date: new Date(), genre: ['Adventure']}).then((response) => {
                    expect(response.statusCode).toBe(201);
                    done();
                });
        });
    
        it("Not JSON included", () => {
            return supertest(api).post(movie_api_path + "/").then((response) => {
                expect(response.statusCode).toBe(500);
            });
        });

        it("Wrong format for the JSON", () => {
            return supertest(api).post(movie_api_path + "/").then((response) => {
                expect(response.statusCode).toBe(500);
            });
        });
    });

    describe("Movies API Put tests", () => {

        it("Test on PUT /:id_movie", () =>{
            return supertest(api).put(movie_api_path + "/:_id")
            .send({name: 'MovieMock4', release_date: new Date(), genre: ['Magic']}).then((response) => {
                expect(response.statusCode).toBe(200);
            });
        });

        it("Test on PUT no JSON", () => {
            return supertest(api).put(movie_api_path + "/:_id")
            .then((response) => {
                expect(response.statusCode).toBe(500);
            });
        });

        it("Test on PUT wrong format", () => {
            return supertest(api).put(movie_api_path + "/:_id")
            .send({genre: ['Magic']}).then((response) => {
                expect(response.statusCode).toBe(500);
            });
        });

    });
    
    describe("Tests on delete", () => {

        it("Test on Delete /:_id", () => {
            return supertest(api).put(movie_api_path + "/:_id").then((response) => {
                expect(response.statusCode).toBe(200);
            });
        });
        
    });

});

