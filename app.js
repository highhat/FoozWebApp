// Import dependencies
var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// Import routes
var home = require('./routes/home');
//var user = require('./routes/user');

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

// Define routes
app.use('/', home); // index
//app.use('/player', user); // protected user area

// Non defined routes
app.use(function(req, res, next) {
    err.status = 404;
    next(err);
});

// Run app
app.listen(app.get('port'), function() {
  console.log('Fooz is running on port', app.get('port'));
});

module.exports = app;