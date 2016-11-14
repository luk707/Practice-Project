var express = require('express');
var router = express.Router();

module.exports = function(passport) {

	router.get('/google',
  		passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }));

	router.get('/google/callback', 
		passport.authenticate('google', { failureRedirect: '/' }),
		function(req, res) {
			res.redirect('/');
		});

	return router;
};