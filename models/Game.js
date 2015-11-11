var mongo = require('mongodb');
var mongoose = require('mongoose');
var mongoUri = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://fooz_prvt:1400market@ds049754.mongolab.com:49754/heroku_1vjw0wrr'; 

var gameSchema = new mongoose.Schema({
	game_id: String,
	date: { 
		type: Date, 
		default: Date.now 
	},
	winner: String,
	teams: [
		{
			name: String,
			score: Number,
			members: [
				{
					user_id: String,
					name: String,
					position: String
				}
			]
		}
	]
});

var Game = mongoose.model('games', gameSchema);

module.exports = Game;