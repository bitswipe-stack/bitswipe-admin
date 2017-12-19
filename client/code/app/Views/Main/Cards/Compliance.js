

module.exports = Backbone.View.extend({

  className: 'main_compliance main_wrap',

  initialize: function(){

    var self = this

    self.$el.html(ss.tmpl['main-compliance'].render()).appendTo('.dash .main').addClass('animated fadeInUp')

    self.fill_view()

    self.$el.find('input').on('keyup', self.update_settings.bind(self))
    self.$el.find('select').on('change', self.update_settings.bind(self))

  },

  update_settings: function(ev){

    var self = this

    //define settings object
    var compliance_settings = {
      maximum: {
        limit: self.$el.find('#max_limit').val()
      },
      currency: 'USD'
    }

      self.user.set('compliance',  compliance_settings)

      self.user.once('saved:compliance', function (err) {
        var class_ = err ? 'failed-save' : 'successful-save';
        ev.target.classList.add(class_);
        setTimeout(function () {
          ev.target.classList.remove(class_);
        }, 500);
      });

  },

  fill_view: function(){ //fill feilds with current settings

    var self = this

    self.$el.find('#max_limit').val(self.user.get('compliance').maximum.limit)

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
