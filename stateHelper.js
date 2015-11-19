var log = require('./logger.js')(__filename);
var QuickBooks = require('node-quickbooks');
var config = require('./config.js');
var request = require('request');
var qs = require('querystring');
// must come after cookie middleware
module.exports.isLoggedInMiddleware = function() {
	return function(req, res, done) {
		log.debug("checking if logged in")
		done();
	}
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
		req.session.oauth_token_secret = requestToken.oauth_token_secret
		log.debug("redirecting to ", QuickBooks.APP_CENTER_URL + requestToken.oauth_token);
		res.redirect(QuickBooks.APP_CENTER_URL + requestToken.oauth_token)
	})
}