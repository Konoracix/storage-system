const jwt = require('jsonwebtoken')

function authenticateJWT(req, res, next){
	if(checkPublicEndpoints(req.url)){
		next()
		return
	}
	const authHeader = req.headers.authorization;
	
	if (authHeader) {
			const token = authHeader.split(' ')[1];

			jwt.verify(token, "AndrewTateDrinksBubbles", (err, user) => {
					if (err) {
							return res.sendStatus(403);
					}

					req.user = user;
					if(new Date(user.expiration_date) > new Date()){
						next();
						return;
					}
					return res.sendStatus(403)
			});
	} else {
			res.sendStatus(401);
	}
};

function checkPublicEndpoints(url){
	let accessibleRoutes = [
		'/api/auth/login',
		'/api/auth/addUser',
		'/api/auth/addOrganization',
		'/api/auth/logout'
	]
	let isPublic = false;
	accessibleRoutes.forEach((element) => {
		if(url == element){
			isPublic = true;
		}
	}) 
	return isPublic;
}

function notFound(req, res, next){
	const error = new Error(`Not found - ${req.originalUrl}`);
	res.status(404);
	next(error);
}

module.exports = {
	authenticateJWT,
	notFound
}