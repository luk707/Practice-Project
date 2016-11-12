var OAuthStrategy = require('passport-google-oauth').OAuth2Strategy;

module.exports = function(passport){
	passport.use(new OAuthStrategy({
		    clientID: "393285329490-ob6qcn0pq59673v5sjjviks5a9u5sed4.apps.googleusercontent.com",
		    clientSecret: "C1WtekCMjOQleJuN-UY40g2a",
		    callbackURL: "http://localhost:3000/auth/google/callback"
		},
	 
		function(accessToken, refreshToken, profile, done) {
	    	process.nextTick(function(){
    			console.log(profile.id);
    			return done(); 
	    
	    	});
	    }
	));
};