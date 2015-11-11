var Auth = {};
var nForce = require('nforce');
var User = require('../models/User');
var Utils = require('./Utils');

var authCallback = process.env.APP_CALLBACK || 'http://localhost:5000/_callback';
var Salesforce = nForce.createConnection({
	clientId: '3MVG9KI2HHAq33RzooRMk3ptnGF4M7i0avQiHMlb36YRC3RXt61mta0RiHahcw8agz80EcX5jIM0brMQSgH6b',
	clientSecret: '8034561791977016157',
	redirectUri: authCallback,
	apiVersion: 'v30.0',  // optional, defaults to current salesforce API version
	environment: 'production',  // optional, salesforce 'sandbox' or 'production', production default
	mode: 'multi' // optional, 'single' or 'multi' user mode, multi default
});

Auth.getProviderLoginURL = function() {
	return Salesforce.getAuthUri();
}

Auth.loginUser = function(req, callback) {
	// Get code
	if(req.query.code) {
		// Step 1: Authenticate to salesforce
		Salesforce.authenticate({ code: req.query.code }, function(err, resp) {			
			console.log('SF Authenticate');
			if(!err) {
				// Auth was successful
				// Retrieve user id
				var userId = Utils.getUserIdFromForceAuth(resp);

				// Step 2: Look for user
				User.getUserRecord(userId, function(err, record) {
					if(!err) {
						// Was record found?
						if(!record) {
							// No user found
							addNewUser(resp, function(err, result) {
								setUserSession(req, result, callback);
							});
						} else {
							// User found, update session
							setUserSession(req, record, callback);
						}						
					} else {
						// error in db retrieval
						callback('Fail: Database connection error.', {})
					}
				});
			} else {
				// Auth failed
				callback('Authentication to Salesforce failed.', {});
			}			
		});
	} else {
		// No code in url
		callback('No authentication code sent from provider.', {});
	}
}

var addNewUser = function(forceResp, callback) {
	console.log('Get identity');

	// Get user identity
	Salesforce.getIdentity({ oauth: forceResp } , function(err, userIdentity) {
		if(!err) {
			// Create user
			User.createNewUser(userIdentity, function(err, user) {
				if(!err) {
					callback(null, user);
				} else {
					// Error saving new user
					console.log(err);
					callback('Error adding new user to database', {});
				}
			});
		} else {
			// Error retriving identity.
			callback('Error retrieving Identity from Salesforce', {});
		}		
	});
}

var setUserSession = function(req, user, callback) {
	console.log('Set session');

	// Assign session
	req.session.user = {
		isAuthenticated: true,
		detail: user
	};

	req.session.save(function(err) {
		if(!err) {
			callback(null, user);
		} else {
			callback(err, {});
		}
	});
}

module.exports = Auth;