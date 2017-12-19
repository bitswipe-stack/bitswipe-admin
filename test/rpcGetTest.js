var assert = require('assert');
var ss = require('socketstream').start();

describe('lamassu-admin/rpc/get', function() {
  it('should return correct price settings', function(done) {
    ss.rpc('get.price', function(params) {
      assert(!params[0]);

      assert.equal(params[1].commission, 1.5); // TODO: reseed this from set
      assert.equal(params[2].provider, 'bitpay' || 'kraken');
      assert.equal(params[1].custom_url, null);

      done();
    });
  });

  it('should return correct wallet settings', function(done) {
    ss.rpc('get.wallet', function(params) {
      assert(!params[0]);

      assert.equal(params[1].provider, 'bitgo');
      assert(params[1].token);
      assert(params[1].walletId);
      assert(params[1].walletPassphrase);

      done();
    });
  });

  it('should return correct exchange settings', function(done) {
    ss.rpc('get.exchange', function(params) {
      assert(!params[0]);

      if (!params[1]) {
        // No trade exchange configured, skip this (TODO: until we resolve
        // https://github.com/lamassu/lamassu-admin/issues/3 and can change
        // the config in tests).
        return done();
      }
      assert.equal(params[1].provider, 'bitstamp');
      assert(params[1].key);
      assert(params[1].secret);
      assert(params[1].clientId);

      done();
    });
  });

  it('should return correct compliance settings', function(done) {
    ss.rpc('get.compliance', function(params) {
      assert(!params[0]);

      assert(params[1]);
      assert(params[1].base);
      assert.equal(params[1].base.verify_type, 'drivers_license');
      assert(params[1].extended);
      assert.equal(params[1].extended.verify_type, 'smartphone');
      assert.equal(params[1].base.limit < params[1].extended.limit, true);
      assert(params[1].maximum);
      assert(params[1].verification);
      assert.equal(params[1].verification.service, 'idology', 'verification service must be idology');
      assert(params[1].verification.username);
      assert(params[1].verification.password);

      done();
    });
  });
});
