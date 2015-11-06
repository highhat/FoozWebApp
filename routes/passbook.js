var express = require('express');
var router = express.Router();
var passbook = require('node-passbook');

// Define pass
var template = passbook('generic', {
	passTypeIdentifier: 'pass.com.foozlander.walletpass',
	organizationName: 'FoozLander',
	logoText: 'Fooz!',
	teamIdentifier: 'foozlander',
	backgroundColor: 'rgb(255,255,255)',
	keys: '/Users/dentremont/Projects/Fooz/FoozWebApp/lib/passbook/keys',
});



router.get('/download', function(req, res) {
	// Create new pass from template
	var pass = template.createPass({
		serialNumber:  "123456",
		description:   "20% off"
	});
	pass.images.icon = '/Users/dentremont/Projects/Fooz/FoozWebApp/lib/passbook/images/icon.png';
	pass.images.logo = '/Users/dentremont/Projects/Fooz/FoozWebApp/lib/passbook/images/logo.png';

	pass.render(res, function(error) {
		if (error)
		console.error(error);
	});
});

module.exports = router;