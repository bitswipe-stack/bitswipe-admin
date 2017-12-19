module.exports = Backbone.View.extend({

  className: 'main_trading main_wrap',

  initialize: function(){

    var self = this

    self.$el.html(ss.tmpl['main-trading'].render()).appendTo('.dash .main').addClass('animated fadeInUp')

    self.fill_view()

    self.$el.find('input').on('keyup', self.update_settings.bind(self))
    self.$el.find('select').on('change', self.update_settings.bind(self))

    self.enabled = self.user.get('exchange') !== null

    if(self.enabled){
      self.$el.find('.toggle .active').css({'display':'block'})
    }else{
      self.$el.find('.toggle .inactive').css({'display':'block'})
      self.$el.find('.settings').addClass('disabled')
    }

    self.$el.find('.toggle').on('click', function(){

      self.set_toggle.apply(self)

      self.update_settings.apply(self)

    })


  },

  update_settings: function(){

    var self = this
    
    //define settings object
    var exchange_settings = {
      enabled: self.enabled,
      provider: self.$el.find('#exchange_provider').val(),
      key: self.$el.find('#exchange_api_key').val(),
      clientId: self.$el.find('#exchange_id').val(),
      secret: self.$el.find('#exchange_secret').val()
    }

    self.user.set('exchanges',  exchange_settings)

  },

  set_toggle: function(){

    var self = this

    if(self.enabled){

      self.enabled = false

      self.$el.find('.settings').addClass('disabled')


    }else{

      self.enabled = true

      self.$el.find('.settings').removeClass('disabled')

    }

    if(self.enabled){
      self.$el.find('.toggle .inactive').css({'display':'none'})
      self.$el.find('.toggle .active').css({'display':'block'})
    }else{
      self.$el.find('.toggle .inactive').css({'display':'block'})
      self.$el.find('.toggle .active').css({'display':'none'})
    }

  },

  fill_view: function(){ //fill feilds with current settings

    var self = this
    
    var exchanges = {
      provider: 'exchange_provider',
      key: 'exchange_api_key',
      clientId: 'clientId',
      secret: 'exchange_secret'
    }

    var exchange_settings = {
      provider: 'bitstamp',
      key: 'none',
      clientId: 'none',
      secret: 'none'
    }

    var exchange = self.user.get('exchanges') || exchange_settings

    self.$el.find('#exchange_provider').val(exchange.provider)
    self.$el.find('#exchange_api_key').val(exchange.key)
    self.$el.find('#exchange_id').val(exchange.clientId)
    self.$el.find('#exchange_secret').val(exchange.secret)

  },

  clear: function(){

    var self = this

    self.$el.removeClass('animated fadeInUp')
    self.$el.addClass('animatedQuick fadeOutUp')

    setTimeout(function(){

      self.$el.remove()

    }, 500)

  }

})
