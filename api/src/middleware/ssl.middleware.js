const forceSsl = (req, res, next) => {
	if (
		req.get("x-forwarded-proto") !== "https" ||
		req.hostname !== "stevedoesitall.com"
	) {
		return res.redirect("https://stevedoesitall.com" + req.url);
	} else {
		return next();
	}
};

export default forceSsl;
