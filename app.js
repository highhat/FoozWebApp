// Import dependencies
var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

// Import routes
var home = require('./routes/home');
var user = require('./routes/user');
var passbook = require('./routes/passbook');
var api = require('./routes/api');

// Initialize app
var app = express();

// Set the view engine to ejs
app.set('view engine', 'ejs');

// Define running port
app.set('port', (process.env.PORT || 5000));

// Initialize plugins
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Non defined routes
app.use(function(req, res, next) {
    next();
});

app.use(session({
  secret: 'foozPassTest',
  resave: false,
  saveUninitialized: true,
}));

app.use(function (req, res, next) {
	if(req.session.user === undefined) {
		req.session.user = {
			isAuthenticated: false
		}
	} else {

	}

	next();
});

// Define routes
app.use('/', home); // index
app.use('/player', user); // protected user area
app.use('/passbook', passbook); 
app.use('/api', api); 


// Run app
app.listen(app.get('port'), function() {
  console.log('Fooz is running on port', app.get('port'));
});

module.exports = app;