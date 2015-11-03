var express = require('express');
var router = express.Router();

// Load page for login
router.get('/', function(req, res) {
	res.render('pages/home', output);
});

// Handle form post login
router.post('/', function(req, res) {
	// Process form
	output.data.message = 'You are now authorized';
	res.render('pages/home', output);
});

var output = {
	meta: {
		title: 'Login'
	},
	data: {
		message: ''
	}
}

module.exports = router;