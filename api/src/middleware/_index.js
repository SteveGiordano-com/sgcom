import trackSession from "./track.middleware.js";
import forceSsl from "./ssl.middleware.js";

const middlewareObj = {
	trackSession,
	forceSsl
};

export default middlewareObj;
