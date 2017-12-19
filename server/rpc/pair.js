var config = require('../config.js');
var fingerprint = require('../fingerprint.js');
var ip = require('ip');

exports.actions = function(req, res, ss) {
  req.use('session');
  req.use('user.authenticated');

  return {
    create_pairing_token: function(data) {
      config.createPairingToken(function(err, token) {
        if (err) return res(err);
        res(null, token);
      })
    },
    get_server_address: function(data) {
      res(null, {
        host: ip.address('public'),
        port: 3000,
        fingerprint: fingerprint()
      });
    }
  }
}
