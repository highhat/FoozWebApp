var mongoose = require('../lib/Db');

var passSchema = new mongoose.Schema({
	pass_id: String,
	serial_number: String,
	user_id: String,
	device_id: String,
	push_token: String
});

var Pass = mongoose.model('apn_passes', passSchema);

Pass.registerPass = function(userId, serialNumber, authToken) {
	// Create pass
	var newPass = new Pass({
		pass_id: authToken,
		serial_number: serialNumber,
		user_id: userId,
	});

	// Save pass
	newPass.save(function(err) {
		if(err) {
			console.log('Pass save fail: ' + err);
		}
	})
}

Pass.validate = function(serialNumber, authToken, callback) {
	// Look for pass
	Pass.findOne({ 'pass_id': authToken, 'serial_number': serialNumber }, function(err, result) {
		if(!err || result != null) {
			callback(null, result.user_id);
		} else {
			callback(err, null);
		}
	})
}

Pass.registerDevice = function(authToken, deviceId, pushToken, callback) {
	// Look for pass
	Pass.findOne({ 'pass_id': authToken }, function(err, result) {
		if(!err || result != null) {
			// Update device object
			result.device_id = deviceId;
			result.push_token = pushToken;

			result.save(function(err) {
				console.log('Did update');
				if(!err) {
					callback(null, result);
				} else {
					callback(err, {});
				}
			})
		} else {
			callback(err, {});
		}
	})
}

module.exports = Pass;