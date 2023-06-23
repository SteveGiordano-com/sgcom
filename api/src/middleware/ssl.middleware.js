const forceSsl = (req, res, next) => {
	if ((req.headers["x-forwarded-proto"] !== "https" || req.headers["x-forwarded-host"] !== "stevedoesitall.com")) {
		return res.redirect("https://stevedoesitall.com" + req.url);
	} else {
		return next();
	}
};

export default forceSsl;
