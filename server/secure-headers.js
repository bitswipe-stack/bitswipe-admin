module.exports = function(options) {
  return function(req, res, next) {
    var frameOptions = 'SAMEORIGIN';

    res.setHeader('X-Frame-Options', frameOptions);
    res.setHeader('Frame-Options', frameOptions);
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('X-Content-Type-Options', 'nosniff');

    if (options.https) {
      res.setHeader('Strict-Transport-Security', 'max-age=16070400; includeSubDomains');
    }

    next();
  };
};
