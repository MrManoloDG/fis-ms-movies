const app = require('./server.js');
const dbConnect = require('./db');

var port = (process.env.PORT || 8000);

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


