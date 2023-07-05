import passport from "passport";
import passportGoogle from "passport-google-oauth20";
import configObj from "./env.config.js";
import userService from "../api/src/services/user.service.js";

const { googleId, googleSecret, environment, port } = configObj;
const GoogleStrategy = passportGoogle.Strategy;

let baseUrl = "https://stevedoesitall.com";

if (environment === "development") {
	baseUrl = "http://localhost:" + port;
}

passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
	const user = await userService.getById(id);
	done(null, user);
});

passport.use(
	new GoogleStrategy({
		"clientID": googleId,
		"clientSecret": googleSecret,
		"callbackURL": `${baseUrl}/users/login/redirect`,
		"passReqToCallback": true
	},
		async (req, accessToken, refreshToken, profile, done) => {
			const email = profile["_json"].email;
			const user = await userService.getByEmail(email);
			if (!user) {
				const newUser = await userService.createUser(email);
				done(null, newUser);
			} else {
				done(null, user);
			}
		}
	)
);