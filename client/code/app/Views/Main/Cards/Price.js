'use strict';

module.exports = Backbone.View.extend({

  className: 'main_price main_wrap',

  initialize: function(){

    var self = this;

    self.$el.html(ss.tmpl['main-price'].render()).appendTo('.dash .main').addClass('animated fadeInUp');

    self.fill_view();

    self.update_prices();

    self.$el.find('input').on('keyup', self.update_settings.bind(self));
    self.$el.find('select').on('change', self.update_settings.bind(self));

    self.user.price_data.on('change', self.update_prices.bind(self));
    self.$el.find('input').on('keyup', self.update_prices.bind(self));
    self.$el.find('select').on('change', self.update_prices.bind(self));

  },

  update_prices: function(){

    //pull in current price from selected soruce

    var self = this;

    var selected_source = self.$el.find('#price_provider').val();
    var priceRec = self.user.price_data.get(selected_source);
    if (!priceRec) return;

    var price = priceRec.rate;
    var currency = priceRec.currency;
    var current = Math.round(price) / 100 ;

    // Since this doesn't work well on older FF, add currency manually
    var formattedPrice = current.toLocaleString('en-US', {
      useGrouping: true,
      maximumFractionDigits: 2,
      minimumFractionDigits: 2
    }) + ' <span class="currency">' + currency + '</span>';

    var commission = (0.01 * self.$el.find('#price_commission').val()) + 1;
    var display = Math.round(price * commission) / 100;
    var formattedDisplay = display.toLocaleString('en-US', {
      useGrouping: true,
      maximumFractionDigits: 2,
      minimumFractionDigits: 2
    }) + ' <span class="currency">' + currency + '</span>';

    if(!price) {
      self.$el.find('.current_price .value').html('---.--');
    }else{
      self.$el.find('.current_price .value').html(formattedPrice);
    }

    if(!price) {
      self.$el.find('.price_overview .value').html('---.--');
    }else{
      self.$el.find('.price_overview .value').html(formattedDisplay);
    }

  },
  update_settings: function(ev){

    var self = this;
    
    //define settings object
    var price_settings = {
      provider: self.$el.find('#price_provider').val(), 
      custom_url: self.$el.find('#price_custom_url').val(),
      commission: (0.01 * self.$el.find('#price_commission').val()) + 1
    };

    self.user.set('price',  price_settings);

    self.user.once('saved:price', function (err) {
      var class_ = err ? 'failed-save' : 'successful-save';
      ev.target.classList.add(class_);
      setTimeout(function () {
        ev.target.classList.remove(class_);
      }, 500);
    });

  },

  fill_view: function(){ //fill feilds with current settings

    var self = this;

    var price_settings = {
      provider: 'bitstamp', 
      custom_url: '',
      commission: 3
    };

    var price = self.user.get('price') || price_settings;

    self.$el.find('#price_provider').val(price.provider);
    self.$el.find('#price_custom_url').val(price.custom_url);

    var per = ((price.commission - 1) * 100).toFixed(2);

    self.$el.find('#price_commission').val(per);

  },

  clear: function(){

    var self = this;

    self.$el.removeClass('animated fadeInUp');
    self.$el.addClass('animatedQuick fadeOutUp');

    setTimeout(function(){

      self.$el.remove();

    }, 500);

  }

});
