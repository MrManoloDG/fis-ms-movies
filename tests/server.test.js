const api = require('../server.js');
const movie = require('../models/movie');
const BASE_API_PATH = "/api/v1";
const Movie_Api = "/movies_status";
const supertest = require('supertest');
const movie_api_path = BASE_API_PATH + Movie_Api;
const routes = require('../routes/movie_status'); 

let dbFind, dbPost, dbPut, dbDelete;

function compare(query, movie){
    for(key in query){
        if (query[key] != movie[key]){
            return false;
        }
    }

    return true;
}

describe("Movies API tests", () => {
    
    afterAll(async () => {
        await new Promise(resolve => setTimeout(() => resolve(), 500));
    });

    beforeAll((done) => {
        let mockMovies = [
            {"_id": "1", "id_user": "Juanito", "id_movie": "abc2", "status": "Completed", "status_date": new Date()},
            {"_id": "2", "id_user": "Huele", "id_movie": "bc4", "status": "Watching", "status_date": new Date()},
            {"_id": "3", "id_user": "Ana", "id_movie": "killo", "status": "Pending", "status_date": new Date()},
            {"_id": "5e05f9d5748cdf0bf5b311a7", "id_user": "Tomas", "id_movie": "ahu", "status": "Pendiente", "status_date": new Date()}
        ];

        dbFind = jest.spyOn(movie, "find");
        dbFind.mockImplementation((query, callback) => {
            callback(null, mockMovies.filter((movie) => compare(query, movie)));
        });

        dbPost = jest.spyOn(movie, "create");
        dbPost.mockImplementationOnce((query, callback) => {
            callback(false);
        }).mockImplementation((query, callback) => {
            callback(true);
        });

        dbPut = jest.spyOn(movie, "updateOne");
        dbPut.mockImplementation((query, doc, callback) => {
            callback(false, 1);
        });

        dbDelete = jest.spyOn(movie, "deleteOne");
        dbDelete.mockImplementation((query, callback) => {
            callback(false);
        });

        return done();
    });

    describe("Movies API GET Tests", () => {  

        it("Test to movie GET /:_id", () => {
            return supertest(api).get(movie_api_path + "/1").then((response) => {
                expect(response.statusCode).toBe(200);
                expect(response.body).toBeArrayOfSize(1);
                expect(dbFind).toHaveBeenNthCalledWith(1, {_id: "1"}, expect.any(Function));
            });
        });

        it("Test to movie GET /:_id, not ID found", () => {
            return supertest(api).get(movie_api_path + "/5").then((response) => {
                expect(response.statusCode).toBe(200);
                expect(response.body).toBeArrayOfSize(0);
                expect(dbFind).toHaveBeenNthCalledWith(2, {"_id": "5"}, expect.any(Function));
            });
        });

        /*it("Test to movie GET /:_id, not ID found", () => {
            return supertest(api).get(movie_api_path + "/5").then((response) => {
                expect(response.statusCode).toBe(404);
                expect(response.body).toBeArrayOfSize(0);
                expect(dbFind).toHaveBeenNthCalledWith(2, {"_id": "5"}, expect.any(Function));
            });
        });*/

        it("Test to movie GET /user/:id_movie", () => {
            return supertest(api).get(movie_api_path + "/user/Ana").then((response) => {
                expect(response.statusCode).toBe(200);
                expect(response.body).toBeArrayOfSize(1);
                expect(dbFind).toHaveBeenNthCalledWith(3, {"id_user": "Ana"}, expect.any(Function));
            });
        });

        it("Test to movie GET /user/:id_movie, not movie found", () => {
            return supertest(api).get(movie_api_path + "/user/casi").then((response) => {
                expect(response.statusCode).toBe(200);
                expect(response.body).toBeArrayOfSize(0);
                expect(dbFind).toHaveBeenNthCalledWith(4, {"id_user": "casi"}, expect.any(Function));
            });
        });

        /*it("Test to movie GET /user/:id_movie, not movie found", () => {
            return supertest(api).get(movie_api_path + "/user/casi").then((response) => {
                expect(response.statusCode).toBe(404);
                expect(response.body).toBeArrayOfSize(0);
                expect(dbFind).toHaveBeenNthCalledWith(4, {"id_user": "casi"}, expect.any(Function));
            });
        });*/

        it("Test to movie GET /:_id_user/:id_movie", () => {
            return supertest(api).get(movie_api_path + "/Ana/killo").then((response) => {
                expect(response.statusCode).toBe(200);
                expect(dbFind).toHaveBeenNthCalledWith(5, {"id_user": "Ana", "id_movie": "killo"}, expect.any(Function));
                expect(response.body).toBeArrayOfSize(1);
            });
        });

        /*it("Test to movie GET /:_id_user/:id_movie, not a match", () => {
            return supertest(api).get(movie_api_path + "/Ana/killo").then((response) => {
                expect(response.statusCode).toBe(404);
                expect(dbFind).toHaveBeenNthCalledWith(5, {"id_user": "Killo", "id_movie": "killo"}, expect.any(Function));
                expect(response.body).toBeArrayOfSize(0);
            });
        });*/
    });

    describe("Movies API POST tests", () => {

        test("POST / correctly defined", () => {
            return supertest(api).post(movie_api_path + "/")
                .send(
                    {id_user: 'Send', id_movie: "Send2", status: "Stopped"}
                ).then((response) => {
                    expect(response.statusCode).toBe(201);
                });
        });
    
        it("Not JSON included", () => {
            return supertest(api).post(movie_api_path + "/").then((response) => {
                expect(response.statusCode).toBe(500);
            });
        });

        it("Wrong format for the JSON", () => {
            return supertest(api).post(movie_api_path + "/")
            .send({id_user: 'Send', id_movie: "Send2"}).then((response) => {
                expect(response.statusCode).toBe(500);
            });
        });
    });

    describe("Movies API Put tests", () => {
        it("Test on PUT /:_id", () =>{
            let updateMock = { id_movie: "ahu",id_user: 'TomasitoInDaHood', status: "Following"};
            return supertest(api).put(movie_api_path + "/3")
            .send(updateMock)
            .then((response) => {
                expect(response.statusCode).toBe(200);
                expect(dbPut).toHaveBeenNthCalledWith(1, {"_id": "3"},  {$set: { id_movie: "ahu",id_user: 'TomasitoInDaHood', status: "Following", status_date: expect.any(Date)}} , expect.any(Function));
            });
        });

        it("Test on PUT, not completed, should return 200", () => {
            return supertest(api).put(movie_api_path + "/3")
            .send({status: "Following"}).then((response) => {
                expect(response.statusCode).toBe(200);
                expect(dbPut).toHaveBeenNthCalledWith(2, {"_id": "3"}, {$set: {status: "Following", status_date: expect.any(Date)}}, expect.any(Function));
            });
        });

        it("Test on PUT no JSON", () => {
            dbPut.mockImplementationOnce((query, callback) => {
                callback(true);
            });

            return supertest(api).put(movie_api_path + "/4")
            .then((response) => {
                expect(response.statusCode).toBe(500);
                expect(dbPut).toHaveBeenNthCalledWith(3, {"_id": "4"}, {$set: {status_date: expect.any(Date)}}, expect.any(Function));
            });
        });


        /*it("Test on PUT, the operation did not make any changes", () => {
            return supertest(api).put(movie_api_path + "/dasgf")
            .then((response) => {
                expect(response.statusCode).toBe(404);
                expect(dbPut).toHaveBeenNthCalledWith(3, {"_id": "dasgf"}, {$set: {status_date: expect.any(Date)}}, expect.any(Function));
            });
        });*/
    });
    
    describe("Tests on delete", () => {

        it("Test on Delete /:_id", () => {
            return supertest(api).delete(movie_api_path + "/1").then((response) => {
                expect(response.statusCode).toBe(200);
                expect(dbDelete).toHaveBeenNthCalledWith(1, {"_id": "1"}, expect.any(Function));
            });
        });

        it("Test on Delete /:_id, failure", () => {
            dbDelete.mockImplementationOnce((query, callback) => {
                callback(true);
            });
            return supertest(api).delete(movie_api_path + "/1").then((response) => {
                expect(response.statusCode).toBe(500);
                expect(dbDelete).toHaveBeenNthCalledWith(2, {"_id": "1"}, expect.any(Function));
            });
        });

        /*it("Test on Delete /:_id, did not make any changes", () => {
            return supertest(api).delete(movie_api_path + "/dasgf").then((response) => {
                expect(response.statusCode).toBe(404);
                expect(dbDelete).toHaveBeenNthCalledWith(1, {"_id": "dasgf"}, expect.any(Function));
            });
        });*/
    });

});
