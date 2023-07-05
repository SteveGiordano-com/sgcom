import { tweetsRouter } from "./tweet.route.js";
import { userRouter } from "./user.route.js";

const allRoutes = {
	"tweets": tweetsRouter,
	"users": userRouter
};

export default allRoutes;
