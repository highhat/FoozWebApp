var express = require('express');
var router = express.Router();
var passbook = require('node-passbook');

// Define pass
var template = passbook('generic', {
	passTypeIdentifier: 'pass.com.foozlander.scorecard',
	organizationName: 'FoozLander',
	logoText: 'Project Foozlander',
	teamIdentifier: '2LN7W9S7LU',
	backgroundColor: 'rgb(135, 129, 189)',
	foregroundColor: "rgb(255, 255, 255)",
    labelColor: "rgb(45, 54, 129)",
	keys: '/Users/dentremont/Projects/Fooz/FoozWebApp/lib/passbook/keys',
	formatVersion: 1,
	webServiceURL: 'https://foozlander-dev.herokuapp.com/passbook/update'
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
	// Create new pass from template
	var pass = template.createPass({
		serialNumber:  req.session.user.userId,
		description: 'Your Foozlander Score'
	});
	console.log(pass);
	pass.structure.primaryFields[0].value = 25;

	pass.images.icon = '/Users/dentremont/Projects/Fooz/FoozWebApp/lib/passbook/images/icon.png';
	pass.images.logo = '/Users/dentremont/Projects/Fooz/FoozWebApp/lib/passbook/images/icon.png';

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