import path from "node:path";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import session from "express-session";

import { fileURLToPath } from "node:url";
import allRoutes from "../api/src/routes/_index.js";
import sessionConfig from "../configs/session.config.js";
import configObj from "../configs/env.config.js";
import trackSession from "../api/src/middleware/track.middleware.js";

const { environment } = configObj;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicPath = path.join(__dirname, "../build");
const app = express();

app.use(express.urlencoded({ "extended": false }));
app.use(express.json());
app.use(express.static(publicPath));

app.use(
	cors({
		"origin": ["https://stevegiordano.com", "https://stevegiordano.localhost"],
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

if (environment === "production") {
	app.set("trust proxy", 1);
}

app.use(session(sessionConfig));

for (const route in allRoutes) {
	app.use("/" + route, allRoutes[route]);
}

app.get("*", trackSession, (req, res, next) => next());

app.get("*", (req, res) => {
	res.sendFile(path.resolve(publicPath, "index.html"));
});

export default app;
