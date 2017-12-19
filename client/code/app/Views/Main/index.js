Cards = require('./Cards')

module.exports = Backbone.View.extend({

  className: 'main',

  initialize: function(){

    var self = this

    self.$el.html(ss.tmpl['main-base'].render()).appendTo('.dash').addClass('animated fadeIn')

    //trigger menu show, menu should have its own view
    $('.menu').show().addClass('animated fadeInUp')

    $('.display').show().addClass('animated fadeInUp')

    $('.menu .items li').on('click', function(e){
      var index = $(this).index()
      self.swap(index)
    })

    self.swap(2) // will be 0, first screen will be first menu item

  },

  swap: function(index){

    var self = this

    if(index === self.current_index) return

    var select_card = function(new_card){
      if(self.current != null){self.current.clear()}
      self.current = new_card
      self.current_index = index
      $('.menu .items li').removeClass('selected')
      $('.menu .items li').eq(index).addClass('selected')
    }

    switch (index) {
      case 0:
        select_card(new Cards.Dashboard())
        break
      case 1:
        select_card(new Cards.Notifications())
        break
      case 2:
        select_card(new Cards.Price())
        break
      case 3:
        select_card(new Cards.Wallet())
        break
      case 4:
        select_card(new Cards.Trading())
        break
      case 5:
        select_card(new Cards.Compliance())
        break
      case 6:
        select_card(new Cards.Pairing())
        break
      case 7:
        select_card(new Cards.Limits())
        break
      case 8:
        select_card(new Cards.Languages())
        break
      case 9:
        select_card(new Cards.System())
        break
    }

  },

  clear: function(){

    var self = this
    self.$el.remove()
    
  }

})


