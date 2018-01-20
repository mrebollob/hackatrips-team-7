var express = require('express');
var path = require('path');
var app = express();
var bodyParser = require('body-parser')

var minube = require('./minube');

app.use(bodyParser.json())

app.use(express.static(path.join(__dirname, 'public')));
app.use('/node_modules/impress', express.static(__dirname + '/node_modules/impress.js'));

app.get('/presentation',function(req,res){
  res.sendFile(path.join(__dirname+'/public/presentation.html'));
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