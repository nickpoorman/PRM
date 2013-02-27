var passport = require("passport");

passport.ensureAuthenicated = function(req, res, next) {
	if(req.isAuthenticated()) {
		return next();
	}
	res.redirect('/login')
}