var express = require('express');
var config = require('./config');
var log = require('./logger.js')(__filename);
var helpers = require('./expressHelpers.js');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var store = require('session-file-store')(session);
var bodyParser = require('body-parser');
var stateHelper = require('./stateHelper.js');
var uuid = require('node-uuid');
var fs = require('fs');

var loggedInRoutes = [ 'launch.html', 'accounts-owable.html', 'disconnect.html', 'pay-now.html'];

var app = express();
app.use(bodyParser.json());
app.use(helpers.logRequests);
app.use(bodyParser.urlencoded({extended: true}))
app.use(cookieParser('arcohesntuahoeunstaho'));
app.use(session({
	resave: true,
	saveUninitialized: false,
	store: new store({ ttl: 60*15*1000, logFn: log.debug,
	 retries: 1, path: "./sessions"
    }),
	cookie: { maxAge: 60*15*1000, secure: false/*not https*/ },
	secret: 'aosnethsantoedusnth'
}));
app.use(stateHelper.isLoggedInMiddleware());
app.use(function(r,res,done){
	for (var l in loggedInRoutes) 
		if (r.url.search(loggedInRoutes[l]) >= 0)
			if (!r.loggedIn) return res.redirect('/start.html');

	done()
})
app.use(express.static('public'));

app.get('/', helpers.redirect("/start.html"));

// sendoff
app.get('/redirect-to-qb-oauth', stateHelper.requestToken);

// return
app.get('/callback', stateHelper.collectToken);

app.get('/generate', function(req, res) { 
	populateVendors();
	res.end('done');
})

app.get('/qbloggedin', stateHelper.checkQbLoggedIn)

app.get('/logout', stateHelper.logout);

app.listen(config.port);
log.info("App started on port", config.port);