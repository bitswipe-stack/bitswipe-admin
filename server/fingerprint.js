var exec = require('child_process').exec;
var fs = require('fs');

var cert = '/root/lamassu-server.crt';

var fingerprint = null;


function generateFingerprint(cert) {
  exec('openssl x509 -fingerprint -sha1 -noout -in ' + cert + ' | sed \'s/SHA1 Fingerprint=//\'', function (err, stdout) {
    if (err) throw err;
    // Should we throw if there's anything in `stderr`? Are there any unusual
    // warnings that would cause this to crash?

    fingerprint = stdout.trim();
  });
};

// Generate fingerprint from what users already have in `/root/lamassu-server.crt`
fs.exists(cert, function(exists) {
  if(exists) generateFingerprint(cert);
});


module.exports = function() {
  return fingerprint;
};

module.exports.setCertificate = function setCertificate(certificate) {
  cert = certificate;
  generateFingerprint(cert);
};