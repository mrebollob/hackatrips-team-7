var express = require('express');
var app = express();
var bodyParser = require('body-parser')

var minube = require('./minube');

app.use(bodyParser.json())

app.get('/', function (req, res) {
  res.send('Hello World!');
});


app.post('/cities', function (req, res) {
  var isSpain = false
  
  var functionName = 'getBestBeachCities'
  // var functionName = 'getBestNaturalParksCities'
  // var functionName = 'getBestSportCities'

  return minube[functionName](isSpain)
    .then(cities => res.json(cities))
    .catch(err => res.json(err));
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
