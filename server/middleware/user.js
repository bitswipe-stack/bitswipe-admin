// Only let a request through if the session has been authenticated
exports.authenticated = function() {
  return function(req, res, next) {
    if (req.session && (req.session.userId != null)) {
      return next()
    } else {
      console.log('user not logged in')
      return res(false)
    }
  };
};