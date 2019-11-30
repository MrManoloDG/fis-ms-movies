const express = require('express');
const bodyParser = require('body-parser');
const PORT = 8000 || process.env.PORT;
const app = express();
//const movieStatus = require('./routes/movie_status');



app.use(bodyParser.json());


/* Routes */
//app.use('/movie_status',movieStatus);


app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.listen(PORT, function () {
  console.log('Example app listening on port '+ PORT + '!');
});

