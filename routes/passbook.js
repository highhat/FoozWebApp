var express = require('express'),
	router = express.Router(),
	passbook = require('node-passbook'),
	path = require('path'),
	fs = require('fs'),
	Utils = require('../lib/Utils'),
	Pass = require('../models/Pass');
var libPath = path.dirname(require.main.filename) + '/lib/passbook';

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
	var serialNumber = user.user_id;
	var authToken = Utils.generateToken(serialNumber);

	// Create new pass from template
	var pass = template.createPass({
		serialNumber:  serialNumber,
		description: 'Your Foozlander Score',
		authenticationToken: authToken
	});
	console.log(pass);
	//pass.structure.primaryFields[0].value = user.score;
	pass.loadImagesFrom(libPath + '/images/');

	Pass.registerPass(user.user_id, serialNumber, authToken);

	pass.render(res, function(error) {
		if(error) {
			console.log(error);
			process.exit(1);
		} else {
			
		}
	});
});

router.get('/update', function(req, res) {
	console.log('Register Requested (GET)');
	console.log(req);
	res.send('{}');
});

router.post('/update', function(req, res) {
	console.log('Register Requested (POST)');
	console.log(req);
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