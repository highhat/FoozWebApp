var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var mongoose = require('mongoose');
 
var mongoUri = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://fooz_prvt:1400market@ds049754.mongolab.com:49754/heroku_1vjw0wrr'; 
mongoose.connect(mongoUri);

var userSchema = new mongoose.Schema({
	userId: String,
	email: String,
	name: String,
	avatarURL: String,
	access_token: String,
	score: Number
});

var User = mongoose.model('game_stats', userSchema);

// Load page for login
router.post('/user/:id/update', function(req, res) {
	var score = JSON.stringify(req.body);

	// Update user
	User.update({ 'userId': req.params.id }, { 'score': score }, function (err, docs) {
		if(!err) {
			// Update user
			res.send(err);
		} else {
			res.send('Updated: ' + req.params.id + ' to score: ' + score);
		}
	});
});


module.exports = router;