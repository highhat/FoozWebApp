var mongo = require('mongodb');
var mongoose = require('mongoose');
var mongoUri = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://fooz_prvt:1400market@ds049754.mongolab.com:49754/heroku_1vjw0wrr'; 

if(!mongoose.connection.readyState) mongoose.connect(mongoUri);

module.exports = mongoose;