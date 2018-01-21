var express = require('express');
var path = require('path');
var app = express();
var bodyParser = require('body-parser')

var minube = require('./minube');
var dialogflow = require('./dialogflow');
var hotelscombine = require('./hotelscombine');
var bbva = require('./bbva');

app.use(bodyParser.json())

app.use(express.static(path.join(__dirname, 'public')));
app.use('/node_modules/impress', express.static(__dirname + '/node_modules/impress.js'));

app.get('/presentation',function(req,res){
  res.sendFile(path.join(__dirname+'/public/presentation.html'));
});

app.get('/api/cities', function (req, res) {
  var isSpain = req.query.isSpain === 'true'
  var type = req.query.type

  var functionName = 'getBestCities';
  switch(type) {
    case 'city':
      functionName = 'getBestCities';
    case 'beach':
      functionName = 'getBestBeachCities';
    case 'mountain':
      functionName = 'getBestMountainCities';
    case 'rural':
      functionName = 'getBestRuralCities'
  }

  return minube[functionName](isSpain)
    .then(cities => res.json(cities.slice(0, 3)))
    .catch(err => res.json(err));
})

app.get('/api/hotels', function (req, res) {
  return bbva.getUserSpend()
    .then(amount => {
      var fromPrice = amount * 0.05
      var toPrice = amount * 0.10
      return hotelscombine.getHotelsByCity(req.query.city, fromPrice, toPrice)
    })
    .then(hotels => res.json(hotels))
    .catch(err => res.json(err))
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});