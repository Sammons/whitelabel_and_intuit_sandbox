var config = require('./config.js');
var log = require('./logger.js')(__filename);

module.exports.redirect = function(path) {
	return function(req, res) {
		res.redirect(config.siteBase + path);
	}
}

module.exports.logRequests = function(req, res, done) {
	if (config.accessLogs)
		log.info("METHOD", req.method, "URL", req.url,"HEADERS:", req.headers,"BODY", req.body)
	done();
}