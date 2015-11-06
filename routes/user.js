var express = require('express');
var router = express.Router();
var nForce = require('nforce');

// Load page for login
router.get('/', isAuthenticated, function(req, res) {
	// Add user detail to output
	output.user = req.session.user;

	res.render('pages/user', output);
});

function isAuthenticated(req, res, next) {
    // do any checks you want to in here

    // CHECK THE USER STORED IN SESSION FOR A CUSTOM VARIABLE
    // you can do this however you want with whatever variables you set up
    //console.log(req.session);
    if (req.session.user.isAuthenticated) return next();

    // IF A USER ISN'T LOGGED IN, THEN REDIRECT THEM SOMEWHERE
    res.redirect('/');
}

var output = {
	meta: {
		title: 'Manage'
	},
	data: {
		message: '',
	},
	user: {
		isAuthenticated: false,
	}
}

module.exports = router;