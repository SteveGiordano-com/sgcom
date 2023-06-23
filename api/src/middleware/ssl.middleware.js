const forceSsl = (req, res, next) => {
    console.log(req.headers);
	if (req.get("X-Forwarded-Proto") !== "https"  || req.hostname !== "stevedoesitall.com") {
		return res.redirect("https://stevedoesitall.com" + req.url);
	} else {
		return next();
	}
};

export default forceSsl;
