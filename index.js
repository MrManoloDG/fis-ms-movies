const app = require('./server.js');
const dbConnect = require('./db');
require('dotenv').config();

var port = (process.env.PORT || 3000);

console.log("Starting API server at "+port);

dbConnect().then(
    () => {
        app.listen(port);
        console.log("Server ready!");
    },
    err => {
        console.log("Connection error: "+err);
    }
)


