var mongo = require('mongodb');
var mongoose = require('mongoose');
var mongoUri = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://fooz_prvt:1400market@ds049754.mongolab.com:49754/heroku_1vjw0wrr'; 

mongoose.connect(mongoUri);

var userSchema = new mongoose.Schema({
	user_id: String,
	email: String,
	name: String,
	avatar_url: String,
	access_token: String,
	score: Number
});

var User = mongoose.model('users', userSchema);

User.getUserRecord = function(userId, callback) {

	// Find a user by the id
	User.findOne({ 'user_id': userId }, function (err, record) {
		if(!err) {
			// Return user record
			callback(null, record);
		} else {
			callback(err, {});
		}
	});
}

User.createNewUser = function(identity, callback) {
	// Create user object
	var newUser = new User({
		user_id: identity.user_id,
		email: identity.email,
		name: identity.first_name,
		avatar_url: identity.photos.thumbnail,
		score: 0
	});

	// Save
	newUser.save(function(err) {
		if(!err) {
			// Saved
			callback(null, newUser);
		} else {
			callback(err, {});
		}
	});
}

User.updateScore = function(userId, score, callback) {
	// Update user
	User.update({ 'user_id': userId }, { 'score': score }, function (err, docs) {
		if(!err) {
			// Complete
			callback(null, User);
		} else {
			callback(err, {});
		}
	});
}

module.exports = User;