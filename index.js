var express = require('express');
var config = require('./config');
var log = require('./logger.js')(__filename);
var helpers = require('./expressHelpers.js');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var stateHelper = require('./stateHelper.js');

var app = express();
app.use(bodyParser.json());
app.use(helpers.logRequests);
app.use(bodyParser.urlencoded({extended: true}))
app.use(cookieParser('arcohesntuahoeunstaho'));
app.use(session({resave: false, saveUninitialized: false, secret: 'ssatnoehuhaostneuhs'}));
app.use(stateHelper.isLoggedInMiddleware());
app.use(express.static('public'));

app.get('/', helpers.redirect("/start.html"));

app.get('/redirect-to-qb-oauth', stateHelper.requestToken);

app.get('/generate', function(req, res) { 
	populateVendors();
	res.end('done');
})

app.listen(config.port);
log.info("App started on port", config.port);