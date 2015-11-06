var express = require('express');
var router = express.Router();
var nForce = require('nforce');
var mongo = require('mongodb');
var monk = require('monk');

var mongoUri = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://fooz_prvt:1400market@ds049754.mongolab.com:49754/heroku_1vjw0wrr'; 
var db = monk(mongoUri);

var org = nForce.createConnection({
	clientId: '3MVG9KI2HHAq33RzooRMk3ptnGF4M7i0avQiHMlb36YRC3RXt61mta0RiHahcw8agz80EcX5jIM0brMQSgH6b',
	clientSecret: '8034561791977016157',
	redirectUri: 'http://localhost:5000/_callback',
	apiVersion: 'v27.0',  // optional, defaults to current salesforce API version
	environment: 'production',  // optional, salesforce 'sandbox' or 'production', production default
	mode: 'multi' // optional, 'single' or 'multi' user mode, multi default
});

// Load page for login
router.get('/', function(req, res) {
	output.data.authURL = org.getAuthUri();
	output.data.message = JSON.stringify(req.session);

	output.user = req.session.user;

	res.render('pages/home', output);
});

// Load page for login
router.get('/_callback', function(req, res) {
	if(req.query.code) {
		console.log('Got code: ' + req.query.code);
		// Authenticate user to salesforce
		org.authenticate({code: req.query.code}, function(err, resp) {
			console.log(err, resp);
			if(!err) {
				console.log('Get Identity');
				// Get user identity
				org.getIdentity({oauth: resp}, function(err, userIdentity) {
					console.log('Identity' + userIdentity);

					var authorization = {
						oauth: resp,
						identity: userIdentity
					}

					// Login user
					dbLoginUser(authorization, function(isSuccess, user) {
						console.log('Login user');

						if(isSuccess) {
							// Assign session
							req.session.user = {
								isAuthenticated: true,
								detail: user
							};

							req.session.save(function(err) {
								console.log('Session save' + err);
								if(!err) {
									res.redirect('/player');
								} else {
									res.redirect('/');
								}
							});
						} else {
							res.redirect('/');
						}
						
					});
				});
			} else {
				output.data.message = 'Authentication failed.';
				res.render('pages/home', output);
			}
		});
	} else {
		res.redirect('/');
	}

	
});

router.get('/logout', function(req, res) {
	req.session.destroy(function(err) {
		res.redirect('/');
	})
});

var dbLoginUser = function(auth, cb) {
	console.log('Get user', auth);

	// Query user record by user id
	var users = db.get('game_stats');
	console.log(db);
	users.find({ userId: auth.identity.user_id }, function (err, docs) {
		if(err) console.log(err);
		var user;

		if(docs === undefined || docs.length == 0) {
			// Insert new user
			user = generateNewUser(auth.identity);

			// Add access token
			user.access_token = auth.oauth.access_token;

			// Save user
			users.insert(user, function(err, docs) {
				if(!err) {
					cb(true, user);
				} else {
					console.log('Error inserting user: ' + err);
					cb(false, err);
				}
			});
		} else {
			// User found, update token
			user = docs[0];

			// Update access token
			user.access_token = auth.oauth.access_token;

			// Update
			users.updateById(user.id, user, function(err, docs) {
				if(!err) {
					cb(true, user);
				} else {
					console.log('Error updating user: ' + err);
					cb(false, err);
				}
			});
		}
	});
	db.close();
}

var generateNewUser = function(identity) {
	return {
		userId: identity.user_id,
		email: identity.email,
		name: identity.display_name,
		avatar: identity.photos.thumbnail
	}
}

var output = {
	meta: {
		title: 'Login',
	},
	data: {
		message: ''
	},
	user: {}
}

module.exports = router;