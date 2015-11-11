var mongoose = require('../lib/Db');

var passSchema = new mongoose.Schema({
	pass_id: String,
	serial_number: String,
	user_id: String
});

var Pass = mongoose.model('apn_passes', passSchema);

Pass.registerPass = function(userId, serialNumber, authToken) {
	// Create pass
	var newPass = new Pass({
		pass_id: authToken,
		serial_number: serialNumber,
		user_id: userId
	});

	// Save pass
	newPass.save(function(err) {
		if(err) {
			console.log('Pass save fail: ' + err);
		}
	})
}

module.exports = Pass;