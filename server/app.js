import path from "node:path";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import session from "express-session";
import passport from "passport";

import { fileURLToPath } from "node:url";
import allRoutes from "../api/src/routes/_index.js";
import sessionObj from "../configs/session.config.js";
import configObj from "../configs/env.config.js";
import middlewareObj from "../api/src/middleware/_index.js";
import "../configs/auth.config.js";

const { trackSession, forceSsl } = middlewareObj;
const { environment, port } = configObj;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicPath = path.join(__dirname, "../build");
const isProd = environment === "production";
const app = express();

if (isProd) {
	app.get("*", forceSsl);
}

app.use(express.urlencoded({ "extended": false }));
app.use(express.json());
app.use(express.static(publicPath));

app.use(
	cors({
		"origin": [
			`http://localhost:${port}`,
			"https://stevedoesitall.com",
			"https://stevedoesitall.localhost"
		],
		"credentials": true,
		"methods": ["GET", "POST"]
	})
);

app.use(
	helmet({
		"contentSecurityPolicy": false
	})
);

app.use(morgan(":method _ :url _ :status _ :response-time"));

if (isProd) {
	app.set("trust proxy", 1);
}

app.use(session(sessionObj));
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res, next) => {
	console.log("HOME", req.user);
	next();
});

app.get("*", trackSession);

for (const route in allRoutes) {
	app.use("/" + route, allRoutes[route]);
}

app.get("*", (req, res) => {
	res.sendFile(path.resolve(publicPath, "index.html"));
});

export default app;
