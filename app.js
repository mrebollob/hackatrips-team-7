var express = require('express');
var app = express();
var bodyParser = require('body-parser')

var minube = require('./minube');

app.use(bodyParser.json())

app.get('/', function (req, res) {
  res.send('Hello World!');
});


app.post('/api/cities', function (req, res) {
  var isSpain = req.body.result.parameters.isSpain === 'España'
  var type = req.body.result.parameters.tipoCiudad
  
  var functionName = 'getBestCities';
  if (type.indexOf('ciudad') > -1) functionName = 'getBestCities'
  if (type.indexOf('playa') > -1) functionName = 'getBestBeachCities'
  if (type.indexOf('montaña') > -1) functionName = 'getBestMountainCities'
  if (type.indexOf('rural') > -1) functionName = 'getBestRuralCities'
  
  console.log(req.body.result.parameters)

  return minube[functionName](isSpain)
    .then(cities => res.json(cities))
    .catch(err => res.json(err));
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
