module.exports = Backbone.View.extend({

  className: 'login',

  initialize: function(){

    var self = this

    self.$el.html(ss.tmpl['login-base'].render()).appendTo('.dash')

    var $logIn = self.$el.find('#log-in');
    var $loggingIn = self.$el.find('#logging-in');
    var $authenticationFailed = self.$el.find('#authentication-failed');
    var $authenticationPaused = self.$el.find('#authentication-paused');

    self.$el.find('input').each(function(index, element){

      var $e = $(element)
      var value = $e.val()

      $e.keyup(function (e) {
        // Only try logging in when Enter is pressed.
        if (e.keyCode !== 13) {
          return;
        }

        var username = self.$el.find('#login_username').val();
        var password = self.$el.find('#login_password').val();

        $logIn.hide();
        $authenticationFailed.hide();
        $authenticationPaused.hide();
        $loggingIn.show();

        self.user.login(username, password, function (err, authenticated) {
          if (err && err.name === 'RateLimitError') {
            $loggingIn.hide();
            $authenticationPaused.show();
            return;
          }

          if (!authenticated) {
            $loggingIn.hide();
            $authenticationFailed.show();
          }
        });
      })

      $e.focus(function(){
        if ($e.val() === value ){
          if (value === 'password')
            $e.prop('type', 'password')
          $e.val('')
        }
      })

      $e.blur(function(){
        if ($e.val() === ''){
          if (value === 'password')
            $e.prop('type', 'text')
          $e.val(value)
        }
      })
    })
  },

  clear: function(){

    var self = this

    self.$el.children().children().removeClass('animated flipInX')
    self.$el.children().children().addClass('animatedQuick fadeOutUp')

    setTimeout(function(){

      self.$el.remove()

    }, 1000)

  }

})
