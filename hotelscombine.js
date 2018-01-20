var rp = require('request-promise');




module.exports.getHotelsByCity = function(city) {
  var options = {
    uri: 'http://sandbox.hotelscombined.com/api/2.0/hotels',
    json: true,
    qs: {
      destination: `place:${city}`,
      apikey: 'C20D58B6-8D33-490D-9A0E-9A87150A5818',
      sessionid: 'testsession1',
      'user agent': '',
      minPrice: 50,
      maxPrice: 50
    }
  }

  return rp(options)
    .catch(err => {
      console.log(err)
    })
}
