var rp = require('request-promise');

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

function getBestCitiesByPoiId(isSpain, poiId) {
  var options = {
    uri: 'http://papi.minube.com/pois',
    json: true,
    qs: {
      lang: 'es',
      api_key: 'X5PqCa',
      order_by: 'score',
      subcategory_id: poiId
    }
  }
  if (isSpain) options.qs.country_id = '63'

  return rp(options)
    .then(pois => {
      if (!isSpain) return pois.filter(p => p.country_id !== '63')
      return pois
    })
    .then(citiesOfPois)
    .then(cities => {
      console.log('getBestBeach', cities.map(c => `${c.city_name} - ${c.country_name}`))
      return cities;
    })
    .catch(err => {
      console.log(err)
    })
}

function getCityById(id) {
  var options = {
    uri: 'http://papi.minube.com/cities',
    json: true,
    qs: {
      lang: 'es',
      api_key: 'X5PqCa',
      city_id: id
    }
  }
  return rp(options)
    .catch(function (err) {
      console.log(err)
    });
}

function getCitiesByIds(ids) {
  return Promise.all(ids.map(id => getCityById(id)))
}




// Get cities by best Natural Park
module.exports.getBestNaturalParksCities = function (isSpain) {
  return getBestCitiesByPoiId(isSpain, '4')
    .catch(err => {
      console.log(err)
    })
}


// Get cities by best sport interest
module.exports.getBestSportCities = function (isSpain) {
  return getBestCitiesByPoiId(isSpain, '87')
    .catch(err => {
      console.log(err)
    })
}


// Get cities by best sport interest
module.exports.getBestMountainCities = function (isSpain) {
  return getBestCitiesByPoiId(isSpain, '53')
    .catch(err => {
      console.log(err)
    })
}


/**
 * TYPE
 */

// BEACH
module.exports.getBestBeachCities = function (isSpain) {
  return getBestCitiesByPoiId(isSpain, '9')
    .catch(err => {
      console.log(err)
    })
}
// CITIES
module.exports.getBestCities = function (isSpain) {
  return getBestCitiesByPoiId(isSpain, '115')
    .catch(err => {
      console.log(err)
    })
}
// MOUNTAIN
module.exports.getBestMountainCities = function (isSpain) {
  return getBestCitiesByPoiId(isSpain, '53')
    .catch(err => {
      console.log(err)
    })
}
// RURAL
module.exports.getBestRuralCities = function (isSpain) {
  return getBestCitiesByPoiId(isSpain, '69')
    .catch(err => {
      console.log(err)
    })
}