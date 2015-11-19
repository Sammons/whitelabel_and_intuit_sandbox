//shady flat file store
var fs = require('fs');
var log = require('./logger.js')(__filename);
var util = require('util');
var dataFile = 'data.json';

module.exports.initialize = function() {
	fs.writeFileSync(dataFile, '{}');
}

module.exports.save = function(k,v) {
	log.debug("saving", k, ":", v);
	var d = {};
	try{
		d = fs.readFileSync(dataFile);
	} catch (e) {
		log.warn("problem reading the file, reinitializing the file");
		module.exports.initialize();
	}
	d[k] = v;
	fs.writeFileSync(dataFile, util.inspect(d));
}

module.exports.load = function(k) {
	log.debug("loading", k);
	var d = {};
	try{
		d = fs.readFileSync(dataFile);
	} catch (e) {
		log.warn("problem reading the file, reinitializing the file");
		module.exports.initialize();
	}
	return d[k];
}