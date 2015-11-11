var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
	userId: String,
	email: String,
	name: String,
	avatarURL: String,
	access_token: String,
	score: Number
});

var User = mongoose.model('game_stats', userSchema);

module.exports = User;