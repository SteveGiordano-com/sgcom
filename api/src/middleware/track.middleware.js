import allRoutes from "../routes/_index.js";

const trackSession = (req, res, next) => {
	const apiRoutes = Object.keys(allRoutes);
	let trackUrl = true;

	for (const route of apiRoutes) {
		if (req.path.includes(route)) {
			trackUrl = false;
		}
	}

	if (trackUrl) {
		if (!req.session.views) {
			req.session.views = 0;
		}

		req.session.views++;
	}

	next();
};

export default trackSession;
