var Login = require('./Login') //login view
var Main = require('./Main') //main dashboard view

var App = Backbone.View.extend({

  el: 'body',

  initialize: function() {

    var self = this

    var scrollDiv, scrollbarWidth
    scrollDiv = document.createElement("div")
    scrollDiv.className = "scrollbar-measure"
    document.body.appendChild(scrollDiv)
    scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth
    $('<style>.scroller { margin-right: '+ -scrollbarWidth+'px}</style>').appendTo('head')
    document.body.removeChild(scrollDiv)

    self.user.on('change:authenticated', self.authenticated.bind(self))

  },

  set_display: function(){

    var self = this

    var price_source = self.user.get('price').provider
    var priceRec = self.user.price_data.get(price_source)
    if (!priceRec) return;
    var price = priceRec.rate;
    var currency = priceRec.currency;
    var display = Math.round(price * self.user.get('price').commission) / 100 

    // Since this doesn't work well on older FF, add currency manually
    var formattedDisplay = display.toLocaleString('en-US', {
      useGrouping: true,
      maximumFractionDigits: 2,
      minimumFractionDigits: 2
    }) + ' <span class="currency">' + currency + '</span>';

    if(!price) {
      $('.display .price .number').html('---.--')
    }else{
      $('.display .price .number').html(formattedDisplay);
    }
  },

  authenticated: function(model, authenticated, options) {

    var self = this

    if(self.current != null){ 
      self.current.clear() 
    }

    if (authenticated === true) {
      self.current = new Main()
      self.user.price_data.on('change', self.set_display.bind(self))
      self.user.on('change', self.set_display.bind(self))
    } else {
      self.current = new Login()
    }

  }

})

module.exports = App

