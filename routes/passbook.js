var express = require('express'),
	router = express.Router(),
	passbook = require('node-passbook'),
	path = require('path'),
	fs = require('fs');
//'/Users/dentremont/Projects/Fooz/FoozWebApp/lib/passbook/keys',
var libPath = fs.realpathSync('./lib/passbook');

// Define pass
var template = passbook('generic', {
	passTypeIdentifier: 'pass.com.foozlander.scorecard',
	organizationName: 'FoozLander',
	logoText: 'Project Foozlander',
	teamIdentifier: '2LN7W9S7LU',
	backgroundColor: 'rgb(135, 129, 189)',
	foregroundColor: "rgb(255, 255, 255)",
    labelColor: "rgb(45, 54, 129)",
	keys: libPath + '/keys',
	formatVersion: 1,
	webServiceURL: 'https://foozlander-dev.herokuapp.com/passbook/update',
	generic: {
		primaryFields: [
			{
				key: 'currentScore',
				label: 'Score',
				value: 0
			}
		],
		secondaryFields: [
			{
				key: 'lastGameDateTime',
				label: 'Last Game',
				value: 'November 10, 2015'
			}
		]
	}
});

router.get('/download', isAuthenticated, function(req, res) {
	// Extract use
	var user = req.session.user.detail;

	// Create new pass from template
	var pass = template.createPass({
		serialNumber:  user.user_id,
		description: 'Your Foozlander Score'
	});
	console.log(pass);
	pass.structure.primaryFields[0].value = user.score;

	pass.images.icon = libPath + '/images/icon.png';
	pass.images.logo = libPath + '/images/icon.png';

	pass.render(res, function(error) {
		if (error) {
			console.log(error);
			process.exit(1);
		}
	});
});

router.get('/update', function(req, res) {
	res.send('{}');
})

function isAuthenticated(req, res, next) {
    // do any checks you want to in here

    // CHECK THE USER STORED IN SESSION FOR A CUSTOM VARIABLE
    // you can do this however you want with whatever variables you set up
    //console.log(req.session);
    if (req.session.user.isAuthenticated) return next();

    // IF A USER ISN'T LOGGED IN, THEN REDIRECT THEM SOMEWHERE
    res.redirect('/player');
}

module.exports = router;