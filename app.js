// Import dependencies
var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var router = express.Router();

// Initialize app
var app = express();

// Define running port
app.set('port', (process.env.PORT || 5000));

// Initialize plugins
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

router.get('/', function(req, res) {
	res.send('Get your Foozalnder pass');
});

// Run app
app.listen(app.get('port'), function() {
  console.log('Fooz is running on port', app.get('port'));
});

module.exports = app;