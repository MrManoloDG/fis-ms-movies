const express = require('express');
const bodyParser = require('body-parser');
const PORT = (process.env.PORT || 8000);
const BASE_API_PATH = "/api/v1";
const app = express();
const movieStatus = require('./routes/movie_status');

app.use(bodyParser.json());

/* Routes */
app.use(BASE_API_PATH + '/movies_status',movieStatus);

app.get('/', function (req, res) {
  res.send('Hello World!');
});

module.exports = app
