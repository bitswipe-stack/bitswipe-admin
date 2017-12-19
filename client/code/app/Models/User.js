var PriceData = Backbone.Model.extend({ //this model keeps a current record of price data from various sources

  initialize: function() {

    var self = this

    self.sources = ['bitstamp', 'bitpay', 'coindesk', 'bitcoinaverage', 'coinapult', 'kraken']

    self.sources.forEach(function(source){
      var price_update = 'latest_price:' + source;
      ss.event.on(price_update, function(price){
        self.set(source, price)
      });
    })
  },
  current_price: function(){}

})



module.exports = Backbone.Model.extend({

  initialize: function() {

    var self = this

    self.price_data = new PriceData()

    ss.rpc('get.user', this.authenticate.bind(this));

    ['price', 'wallet', 'exchange', 'compliance'].forEach(function (key) {
      self.on('change:' + key, function () {
        ss.rpc('set.' + key, self.get(key), function (err, res) {
          // If setting was successfully saved, emit `'saved:' + key` to
          // let the frontend know about it. This is quite racy, but since
          // it's based on `set` method, there's no way to get a callback
          // for this save. `Model#save` would probably be more appropriate.
          self.trigger('saved:' + key, err);
        });
      });
    });
  },


  login: function(username, password, callback){

    var self = this

    //login and return user
    ss.rpc('user.authenticate', username, password, function(err, authd, user){

      //make auth return user in the future

      if(authd){
        ss.rpc('get.user', self.authenticate.bind(self))
      }

      callback(err, authd);

    })


  },

  authenticate: function(err, user){

    var self = this

    if (err)
      //should  be handled differently in the future
      alert('Error returned from user.get: \n\n' + JSON.stringify(err, null, '  '))

    if (user != null) {

      self.set(user, {silent: true})
      self.set({authenticated: true})

    } else {
      
      self.set({authenticated: false})

    }
  },

  create_pairing_token: function(callback){
    ss.rpc('pair.create_pairing_token', callback)
  },

  get_server_address: function(callback){
    ss.rpc('pair.get_server_address', callback)
  }
})


