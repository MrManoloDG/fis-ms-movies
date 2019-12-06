const express = require('express');
const bodyParser = require('body-parser');
const PORT = (process.env.PORT || 8000);
const BASE_API_PATH = "/api/v1";
const app = require('./index.js');
const movieStatus = require('./routes/movie_status');

app.listen(PORT, function () {
    console.log('Example app listening on port '+ PORT + '!');
});