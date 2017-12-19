'use strict';

var ss = require('socketstream');

var _config = require('../config');
var _currency = null;
var _tickers = ['bitpay', 'bitstamp', 'coindesk', 'bitcoinaverage', 'coinapult'];
var _tickerModules = _tickers.map(function (ticker) {
  return require('lamassu-' + ticker).ticker.factory();
});
var _cache = {};

_config.load(function(err, config) {
  if (err) return;
  _currency = config.exchanges.settings.currency;
  setInterval(pollTickers, 60000);
  setInterval(updateRates, 1000);
  pollTickers();
});

_config.on('configUpdate', function () {
  _config.load(function(err, config) {
    if (err) return;
    _currency = config.exchanges.settings.currency;
    pollTickers();
  });  
});

function pollTickers() {
  console.log('DEBUG in pollTickers');
  if (!_currency) return;
  _tickers.forEach(function (ticker, index) {
    var tickerModule = _tickerModules[index];
    tickerModule.ticker([_currency], function (err, rates) {
      if (err) return console.log(err.message);
      var rateRec = rates[_currency];
      console.dir(rates);
      console.log(_currency);
      var rate = rateRec ?
        Math.round(parseFloat(rateRec.rate) * 100) :
        null;
      _cache[ticker] = rate;
    });
  });  
}

function updateRates() {
  _tickers.forEach(function (ticker) {
    var rate = _cache[ticker];
    ss.api.publish.all('latest_price:' + ticker, {rate: rate, currency: _currency});
  });  
}
