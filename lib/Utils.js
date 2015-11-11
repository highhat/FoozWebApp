var Utils = {};

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

module.exports = Utils;