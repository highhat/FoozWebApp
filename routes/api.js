var express = require('express');
var router = express.Router();

// Load page for login
router.post('/user/:id/update', function(req, res) {
	res.send(req.body);
});


module.exports = router;