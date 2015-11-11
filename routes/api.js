var express = require('express');
var router = express.Router();
var User = require('../models/User');
var Game = require('../models/Game');

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

function isAuthenticated() {
	return true;
}

module.exports = router;