var LamassuConfig = require('lamassu-config');
var config = module.exports = new LamassuConfig();

setInterval(function() {
  config.cleanExpiredPairingTokens(function(err) {
    if (err) console.error('Cleaning expired pairing tokens failed: ' + err.message);
  });
}, 60 * 1000); // Our default TTL is 1 hour so let's check every minute.
