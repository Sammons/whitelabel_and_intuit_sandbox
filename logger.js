var util = require('util');
var config = require('./config.js');

module.exports = function(filename) {
	var logger = {};

	function prep(ob) {
		if (typeof(ob) == typeof([]) || typeof(ob) == typeof({}))
			return util.inspect(ob);
		if (typeof(ob) == typeof(undefined) || ob == null)
			return "None"
		return ob+'';
	}

	logger.debug = function() {
		var args = [];
		if (!config.debug) return;
		for (var k in arguments) {
			args.push(prep(arguments[k]));	
		}
		args = ["DEBUG", filename].concat(args);
		util.log(args.join(' ').replace(/\n/gm,''))
	}


	logger.warn = function() {
		var args = [];
		for (var k in arguments) {
			args.push(prep(arguments[k]));	
		}
		args = ["WARN", filename].concat(args);
		util.log(args.join(' ').replace(/\n/gm,''))
	}

	logger.info = function() {
		var args = [];
		for (var k in arguments) {
			args.push(prep(arguments[k]));	
		}
		args = ["INFO", filename].concat(args);
		util.log(args.join(' ').replace(/\n/gm,''));
	}

	return logger;
}