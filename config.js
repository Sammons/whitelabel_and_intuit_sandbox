var credentials = require('./credentials.js');

module.exports = {
	"siteBase" : "http://localhost:3000",
	"port" : "3000",
	"debug" : true,
	"accessLogs": true,
	"key": credentials.key,
	"secret": credentials.secret,
	"app_token": credentials.app_token,
	"qb_delivery_address": 'http://localhost:3000/callback/'
}