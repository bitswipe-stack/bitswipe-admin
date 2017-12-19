'use strict';

var config = require('../config.js');

exports.actions = function (req, res, ss) {

  req.use('session');
  req.use('user.authenticated');

  return {

    price: function (data) {
      config.load(function (err, results) {
        if (err) return res(err);
        results.exchanges.settings.commission = data.commission;
        results.exchanges.plugins.current.ticker = data.provider;
        config.saveExchangesConfig(results, res);
      });
    },
    
    wallet: function(data) {
      config.load(function(err, results) {
        if (err) return res(err);

        var provider = data.provider;
        var settings = results.exchanges.plugins.settings[provider];
        results.exchanges.plugins.current.wallet = provider;
        Object.keys(data).forEach(function(key) {
          if (key !== 'provider')
            settings[key] = data[key];
        });

        config.saveExchangesConfig(results, res);
      });
    },

    exchange: function(data) {
      config.load(function(err, results) {
        if (err) return res(err);

        var provider = data.enabled ? data.provider : null;
        results.exchanges.plugins.current.trade = provider;

        if (provider) {
          var settings = results.exchanges.plugins.settings[provider] ||
                         (results.exchanges.plugins.settings[provider] = {});
          Object.keys(data).forEach(function(key) {
            if (key !== 'provider' && key !== 'enabled')
              settings[key] = data[key];
          });          
        }

        config.saveExchangesConfig(results, res);
      });
    },

    currency: function(data) {

      //data example: {type:'USD'}

      //set the data in the database

      //return the object (with symbol) like we would get from get.currency, example: {type:'USD', symbol:'$'}

    },

    compliance: function(data) {
      config.load(function(err, results) {
        if (err) return callback(err);
        // validate elements???
        results.exchanges.settings.compliance = data;
        // res { ok: true }
        config.saveExchangesConfig(results, res);
      });
    }
  };
};
