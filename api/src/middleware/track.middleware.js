const trackSession = (req, res, next) => {
	const pathsToTrack = ["/tweet/", "/date/"];

	for (const path of pathsToTrack) {
		if (req.path.includes(path)) {
			if (!req.session.views) {
				req.session.views = 0;
			}

			req.session.views++;
		}
	}
	next();
};

export default trackSession;
