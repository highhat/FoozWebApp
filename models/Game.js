var mongoose = require('../lib/Db');

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