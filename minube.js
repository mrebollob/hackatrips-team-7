var rp = require('request-promise');


var options = {
  qs: {
    lang: 'es',
    api_key: 'X5PqCa' // -> uri + '?access_token=xxxxx%20xxxxx'
  },
  headers: {
    'User-Agent': 'Request-Promise'
  },
  json: true // Automatically parses the JSON string in the response
};

function poisToCityIds(pois) {
  return Promise.resolve(pois.map(b => b.city_id))
}

function citiesOfPois(pois) {
  return poisToCityIds(pois)
    .then(getCitiesByIds)
    .then(cities => {
      var citiesList = cities.map(arr => arr[0]);
      citiesList.map(c => {
        c.pois = pois.filter(p => p.city_id === c.city_id);
        return c;
      });
      var citiesWithPois = []
      citiesList.forEach(c => {
        var isInside = citiesWithPois.find(cwp => cwp.city_id === c.city_id)
        if (!isInside) citiesWithPois.push(c)
      })
      return Promise.resolve(citiesWithPois)
    })
    .catch(err => console.log(err))
}

function getBestBeach(isSpain) {
  options.uri = 'http://papi.minube.com/pois';
  options.order_by = 'score'
  options.qs.subcategory_id = '9'
  if (isSpain) options.qs.country_id = '63'
  return rp(options)
    .then(pois => {
      if (!isSpain) return pois.filter(p => p.country_id !== '63')
      return pois
    })
    .catch(function (err) {
      console.log(err)
    });
}

function getBestNaturalParks(isSpain) {
  options.uri = 'http://papi.minube.com/pois';
  options.order_by = 'score'
  options.qs.subcategory_id = '4'
  if (isSpain) options.qs.country_id = '63'
  return rp(options)
    .then(pois => {
      if (!isSpain) return pois.filter(p => p.country_id !== '63')
      return pois
    })
    .catch(function (err) {
      console.log(err)
    });
}

function getBestSports(isSpain) {
  options.uri = 'http://papi.minube.com/pois';
  options.order_by = 'score'
  options.qs.subcategory_id = '87'
  if (isSpain) options.qs.country_id = '63'
  return rp(options)
    .then(pois => {
      if (!isSpain) return pois.filter(p => p.country_id !== '63')
      return pois
    })
    .catch(function (err) {
      console.log(err)
    });
}

function getCityById(id) {
  options.uri = 'http://papi.minube.com/cities';
  options.qs.city_id = id;
  return rp(options)
    .catch(function (err) {
      console.log(err)
    });
}

function getCitiesByIds(ids) {
  return Promise.all(ids.map(id => getCityById(id)))
}

// Get cities by best beach
module.exports.getBestBeachCities = function () {
  return getBestBeach()
    .then(citiesOfPois)
    .then(cities => {
      console.log('getBestBeach', cities.map(c => `${c.city_name} - ${c.country_name}`))
      return cities;
    })
    .catch(err => {
      console.log(err)
    })
}


// Get cities by best Natural Park
module.exports.getBestNaturalParksCities = function () {
  return getBestNaturalParks()
    .then(citiesOfPois)
    .then(cities => {
      console.log('getBestNaturalParks', cities.map(c => `${c.city_name} - ${c.country_name}`))
      return cities;
    })
    .catch(err => {
      console.log(err)
    })
}


// Get cities by best sport interest
module.exports.getBestSportCities = function () {
  return getBestSports()
    .then(citiesOfPois)
    .then(cities => {
      console.log('getBestSports', cities.map(c => `${c.city_name} - ${c.country_name}`))
      return cities;
    })
    .catch(err => {
      console.log(err)
    })
}