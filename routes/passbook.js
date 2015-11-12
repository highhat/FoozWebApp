var express = require('express'),
	router = express.Router(),
	passbook = require('node-passbook'),
	path = require('path'),
	fs = require('fs'),
	Utils = require('../lib/Utils'),
	User = require('../models/User'),
	Pass = require('../models/Pass');
var libPath = path.dirname(require.main.filename) + '/lib/passbook';

// Define pass
var template = passbook('generic', {
	passTypeIdentifier: 'pass.com.foozlander.scorecard',
	organizationName: 'FoozLander',
	logoText: 'Foozlander',
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
				key: 'lastGameDateTime',
				label: 'Last Game',
				value: 'November 10, 2015'
			}
		],
		headerFields: [
			{
				key: 'currentScore',
				label: 'Points',
				value: 0
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

	pass.structure.headerFields[0].value = user.score;
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

router.get('/update/v1/passes/pass.com.foozlander.scorecard/:serialNumber', function(req, res) {
	// Get update
	var sn = req.params.serialNumber;
	var authToken = req.get('Authorization');
	authToken = authToken.split('ApplePass ')[1];

	Pass.validate(sn, authToken, function(err, userId) {
		if(!err) {
			updatePassScore(sn, authToken, userId, res);
		} else {
			res.send(401);
		}
	});	
});

function updatePassScore(sn, authToken, userId, res) {
	User.getUserRecord(userId, function(err, result) {
		if(!err) {
			// Create pass update
			// Create new pass from template
			var pass = template.createPass({
				serialNumber:  sn,
				description: 'Foozlander',
				authenticationToken: authToken
			});
			pass.loadImagesFrom(libPath + '/images/');
			pass.structure.headerFields[0].value = result.score;

			createTempararyPass(name, pass, function(err, result) {
				if(!err) {
					res.send(result);
				} else {
					res.send(501);
				}
			});
		} else {
			res.send(501);
		}
	});
}

function createTempararyPass(name, pass, callback) {
	var dir = path.dirname(require.main.filename) + '/tmp/temppass-' + name + '.pkpass';
	var file = fs.createWriteStream(dir);
	pass.on('error', function(error) {
	  	callback(err, {});
	});
	pass.on('end', function(err, result) {
		// Get file
		fs.readFile(dir, function (err, data) {
			if(!err) {
				callback(null, data);
			} else {
				callback(err, {});
			}
		});
	});
	pass.pipe(file);
}

router.post('/update/v1/devices/:deviceId/registrations/pass.com.foozlander.scorecard/:serialNumber', function(req, res) {
	// Get URL pieces
	var serialNumber = req.params.serialNumber;
	var deviceId = req.params.deviceId;
	var authToken = req.get('Authorization');
	authToken = authToken.split('ApplePass ')[1];
	var pushToken = req.body.pushToken;

	Pass.registerDevice(authToken, deviceId, pushToken, function(err, result) {
		//console.log(err, result);
		if(!err) {
			res.send(200);
		} else {
			res.send(501);
		}
	});

	
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