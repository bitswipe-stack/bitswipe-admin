var assert = require('assert');
var ss = require('socketstream').start();

var bitgo = {
  provider: 'bitgo',
  token: '283d1ce6c346fb82d2bdaf343b0bef77c54817ce675b296ff3d0ebb42daaa639',
  walletId: '31uEbMgunupShBVTewXjtqbBv5MndwfXhb',
  passphrase: 'correct horse battery stapler'
};

var compliance =  {
  base: {
    limit: 100,
    verify_type: 'drivers_license'
  },
  extended: {
    limit: 400,
    verify_type: 'smartphone'
  },
  maximum: {
    limit: 1000
  },
  verification: {
    service: 'idology',
    username: 'default_user',
    password: '********'
  }
};

describe('lamassu-admin/rpc/set', function() {
  it('should set correct price settings', function(done) {
    ss.rpc('set.price', {
      provider: 'bitpay',
      commission: 1.5
    }, function(setResult) {
      assert(!setResult[0], 'setting commission should succeed');

      ss.rpc('get.price', function(getResult) {
        assert(!getResult[0], 'getting price after setting should succeed');

        assert.equal(getResult[1].commission, 1.5, 'commission should be set properly');
        done();
      });
    });
  });

  it('should set correct wallet settings', function(done) {
    ss.rpc('set.wallet', bitgo, function(setResult) {
      assert(!setResult[0], 'setting commission should succeed');

      ss.rpc('get.wallet', function(getResult) {
        assert(!getResult[0], 'getting wallet after setting should succeed');

        assert.equal(getResult[1].token, bitgo.token, 'token should be set correctly');
        assert.equal(getResult[1].walletId, bitgo.walletId, 'walletId should be set correctly');
        assert.equal(getResult[1].walletPassphrase, bitgo.walletPassphrase, 'walletPassphrase should be set correctly');
        done();
      });
    });
  });

  it('should set correct exchange settings', function(done) {
    ss.rpc('set.exchange', bitgo, function(setResult) {
      assert(!setResult[0], 'setting commission should succeed');

      ss.rpc('get.exchange', function(getResult) {
        assert(!getResult[0], 'getting exchange after setting should succeed');

        assert.equal(getResult[1].token, bitgo.token, 'token should be set correctly');
        assert.equal(getResult[1].walletId, bitgo.walletId, 'walletId should be set correctly');
        assert.equal(getResult[1].walletPassphrase, bitgo.walletPassphrase, 'walletPassphrase should be set correctly');
        done();
      });
    });
  });

  it('should set correct compliance settings', function(done) {
    ss.rpc('set.compliance', compliance, function(setResult) {
      assert(!setResult[0], 'setting compliance should succeed');

      ss.rpc('get.compliance', function(getResult) {
        assert(!getResult[0], 'getting compliance after setting should succeed');

        assert(getResult[1].base, 'get base limit');
        assert.equal(getResult[1].base.verify_type, 'drivers_license');
        assert(getResult[1].extended, 'get extended limit');
        assert.equal(getResult[1].extended.verify_type, 'smartphone');
        assert.equal(getResult[1].base.limit < getResult[1].extended.limit, true, 'base limit should be smaller than extended limit');
        assert(getResult[1].maximum);
        assert(getResult[1].verification);
        assert.equal(getResult[1].verification.service, 'idology', 'verification service must be idology');
        assert(getResult[1].verification.username);
        assert(getResult[1].verification.password);


        done();
      });
    });
  });
});
