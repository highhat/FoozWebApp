var mongo = require('mongodb');
var mongoose = require('mongoose');
var mongoUri = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://fooz_prvt:1400market@ds049754.mongolab.com:49754/heroku_1vjw0wrr'; 

var deviceSchema = mongoose.Schema({
	token: String,
	notifications: Number,
	lite: Boolean,
	sandbox: Boolean,
	expired: { type:Boolean, default: false }
})

var notificationSchema = mongoose.Schema({
	created: { type: Date, default: Date.now() },
	title: String,
	deliveryTime: Number,
	delivered: Boolean,
	deviceID: mongoose.Schema.ObjectId,
	sandbox: { default: false, type: Boolean },
	lite: { type: Boolean, required: true }
});

exports.Device = mongoose.model('Device', deviceSchema);
exports.Notification = mongoose.model('Notification', notificationSchema);