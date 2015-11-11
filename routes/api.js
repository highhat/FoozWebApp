var express = require('express'),
	router = express.Router(),
	User = require('../models/User'),
	Game = require('../models/Game'),
	apns = require('../lib/apns');

router.post('/user/:id/update', isAuthenticated, function(req, res) {
	var score = req.body.score;
	var userId = req.params.id;

	// Update user score
	User.updateScore(userId, score, function(err, result) {
		if(!err) {
			res.send('Complete');
		} else {
			res.send('Failed: ' + err);
		}
	});
});

router.post('/game/add', isAuthenticated, function(req, res) {
	res.send('Under Construction');
});

router.post('/device/register', function(req, res) {
	console.log(req);
	res.send(200);
});

function isAuthenticated() {
	return true;
}

module.exports = router;