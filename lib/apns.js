var notify = {},
	models = require('../models/APN'),
	apn = require('apn');

notify.notifyClient = function() {

}

/*
After installing a pass, the iOS device registers with your server, asking to receive updates. Your server saves the device’s library ID and its push token.

The device sends the following pieces of information:

Device library identifier (in the URL)
Push token (in JSON payload)
Pass type ID (in the URL)
Serial number (in the URL)
Authentication token (in the header)
To handle the device registration, do the following:

Verify that the authentication token is correct. If it doesn’t match, immediately return the HTTP status 401 Unauthorized and disregard the request.
Store the mapping between the device library identifier and the push token in the devices table.
Store the mapping between the pass (by pass type identifier and serial number) and the device library identifier in the registrations table.
*/
notify.registerDevice = function(lib_id, push_token, pass_type_id, serial_num, auth_token) {
	console.log(models.Device);
}

notify.scheduleNotification = function() {

}

module.exports = notify;