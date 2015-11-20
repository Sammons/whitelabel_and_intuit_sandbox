var log = require('./logger.js')(__filename);
var QuickBooks = require('node-quickbooks');
var config = require('./config.js');
var request = require('request');
var qs = require('querystring');
// must come after cookie middleware
module.exports.isLoggedInMiddleware = function() {
    return function(req, res, done) {
        log.debug("checking if logged in")
        log.debug("SESSION_ID", req.session.id)
        log.debug("SESSION", req.session)

        if (req.session.qb && req.session.qb.oauth_token) req.loggedIn = true;
        if (req.session.loggedIn) log.debug("IS LOGGED IN")
        done();
    }
}

module.exports.checkQbLoggedIn = function(req, res) {
  return res.json({ loggedIn: true });
}

module.exports.requestToken = function(req, res) {
    log.debug("requesting oauth token")
    var postBody = {
    url: QuickBooks.REQUEST_TOKEN_URL,
    oauth: {
      callback: config.qb_delivery_address,
      consumer_key:    config.key,
      consumer_secret: config.secret
      }
    }
    request.post(postBody, function (e, r, data) {
      var requestToken = qs.parse(data)
      log.debug("request result", "error", e, "data", data);
      log.info("TOKEN:",requestToken)
      log.debug("setting the session token")
      req.session.oauth_request_token_secret = requestToken.oauth_token_secret;
      log.debug("redirecting to ", QuickBooks.APP_CENTER_URL + requestToken.oauth_token);
      req.session.save();
      res.redirect(QuickBooks.APP_CENTER_URL + requestToken.oauth_token)
    })
}

module.exports.collectToken = function(req, res) {
  var postBody = {
    url: QuickBooks.ACCESS_TOKEN_URL,
    oauth: {
      consumer_key:    config.key,
      consumer_secret: config.secret,
      token:           req.query.oauth_token,
      token_secret:    req.session.oauth_request_token_secret,
      verifier:        req.query.oauth_verifier,
      realmId:         req.query.realmId
    }
  }
  request.post(postBody, function (e, r, data) {
    var accessToken = qs.parse(data)
    log.debug("ACCESS TOKEN REQUEST DATA:", data);
    req.session.qb = accessToken;
    req.session.save();
    log.debug("ACCESS_TOKEN:", accessToken);
   res.end('<!DOCTYPE html><html lang="en"><head></head><body><script>window.close();</script></body></html>');
  });

}

module.exports.logout = function(req, res) {
  req.session.qb = {};
  req.loggedIn = false;
  res.redirect('/start.html');
}