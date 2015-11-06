var mongo = require('mongodb').MongoClient;
var monk = require('monk');

var mongoUri = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://fooz_prvt:1400market@ds049754.mongolab.com:49754/heroku_1vjw0wrr'; 
var db = monk(mongoUri);

var users = db.get('game_stats');

var u = {
	name: 'David'
};


// Use connect method to connect to the Server
mongo.connect(mongoUri, function(err, db) {
  console.log(err, db);
  console.log("Connected correctly to server");
});