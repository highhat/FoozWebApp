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
	backgroundColor: 'rgb(39, 40, 34)',
	foregroundColor: "rgb(255, 255, 255)",
    labelColor: "rgb(255, 255, 255)",
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

	pass.structure.primaryFields[0].value = user.score;
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

router.get('/update/*', function(req, res) {
	res.send(200);
});

router.post('/update/v1/*', function(req, res) {
	// Get URL pieces
	// /passbook/update/v1/devices/7031ad705317095e9a01d2bcb7f3dd5c/registrations/pass.com.foozlander.scorecard/00561000000aK64AAE
	console.log('Auth: ' + req.get('Authorization'));
	console.log('Token: ' + req.body.pushToken);

	res.send(200);
	var segs = req.path.split('/');
	var serialNumber = segs[segs.length - 1];
	var opType = segs[segs.length - 3];
	var deviceId = segs[segs.length - 4];
	var authToken = req.get('Authorization');
	authToken = authToken.split('ApplePass ')[1];
	var pushToken = req.body.pushToken;

	console.log('Serial: ' + serialNumber);
	console.log('DeviceId: ' + deviceId);
	console.log('AuthToken: ' + authToken);
	console.log('PushToken: ' + pushToken);

	if(opType == 'registrations') {
		// Register device
		Pass.registerDevice(authToken, deviceId, pushToken, function(err, result) {
			//console.log(err, result);
			res.send(200);
		});
	} else {
		res.send(404);
	}

	
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