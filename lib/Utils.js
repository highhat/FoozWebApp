var Utils = {},
	crypto = require('crypto');

Utils.getUserIdFromForceAuth = function(authorization) {
	try {
		// Split URL
		var url_pieces = authorization.id.split('/');

		// User id is the last segment of the url
		return url_pieces[url_pieces.length - 1];
	} catch(exc) {
		return false;
	}
}

Utils.generateToken = function(unique_id) {
	return crypto.pbkdf2Sync(unique_id, 'f00z', 40, 64, 'sha256').toString('hex');
}

module.exports = Utils;