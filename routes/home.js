var express = require('express');
var router = express.Router();
var Auth = require('../lib/Authentication');

// Local vars
var extAuthUrl = Auth.getProviderLoginURL();

// Load page for login
router.get('/', function(req, res) {
	output.data.message = JSON.stringify(req.session);

	output.user = req.session.user;

	res.render('pages/home', output);
});

// Load page for login
router.get('/_callback', function(req, res) {
	// Step 1: Authenticate to salesforce
	Auth.loginUser(req, function(err, result) {
		if(!err) {
			// User logged in
			res.redirect('/player');
		} else {
			// Login failed
			console.log(err);
			output.data.message = result;
			res.render('pages/home', output);
		}
	});
});

router.get('/logout', function(req, res) {
	req.session.destroy(function(err) {
		res.redirect('/');
	})
});

var output = {
	meta: {
		title: 'Login',
	},
	data: {
		message: '',
		authURL: extAuthUrl
	},
	user: {}
}

module.exports = router;