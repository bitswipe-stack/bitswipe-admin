var config = require('../config.js')

var limiter = 0;

setInterval(function () {
  limiter = 0;
}, 60000);

exports.actions = function(req, res, ss) {

  req.use('session')

  return {

    authenticate: function(username, password){
      if (limiter >= 2) {
        var err = new Error('Rate limiting login');
        err.name = 'RateLimitError';
        return res(err);
      }

      config.authenticateUser(username, password, function(err, user){
        if (err){
          return res(err)
        }

        if (user){

          req.session.userId = user.id //session is authenticated when it has a userId
          req.session.save()

          res(null, true)

        }else{
          limiter += 1;
          res(null, false)

        }
      })
    }
  }
}
