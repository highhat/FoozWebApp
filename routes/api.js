var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var monk = require('monk');

var mongoUri = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://fooz_prvt:1400market@ds049754.mongolab.com:49754/heroku_1vjw0wrr'; 
var db = monk(mongoUri);

// Load page for login
router.post('/user/:id/update', function(req, res) {
	
	// Query user record by user id
	var users = db.get('game_stats');
	users.find({ userId: req.params.id }, function (err, docs) {
		res.send('Done' + err + docs);
	});
});


module.exports = router;