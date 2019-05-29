
const {user: userErrors} = require("../errors/codes");

function auth_isLogged(req, res, next) {
	// if user is authenticated in the session, carry on
	if (req.isAuthenticated()){
				return next();
	}


	// if they aren't redirect them to the home page
		res.status(400).send(userErrors.userNotLogged);
}

function auth_isNotLogged(req, res, next) {
	// if user is not authenticated in the session, carry on
	if (!req.isAuthenticated()){
				return next();
	}

	// if they aren't redirect them to the home page
		res.status(400).send(userErrors.userAlreadyLogged);
}

module.exports = {
	auth_isLogged,
	auth_isNotLogged
};
