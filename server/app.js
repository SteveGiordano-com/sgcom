import path from "node:path";
import express from "express";
import { fileURLToPath } from "node:url";
import allRoutes from "../api/src/routes/_index.js";

// Note: Add and store logs

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicPath = path.join(__dirname, "../build");
const app = express();

app.use(express.urlencoded({ "extended": false }));
app.use(express.json());
app.use(express.static(publicPath));

for (const route in allRoutes) {
	app.use("/" + route, allRoutes[route]);
}

app.get("*", (req, res) => {
	res.sendFile(path.resolve(publicPath, "index.html"));
});

export default app;
