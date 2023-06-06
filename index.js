import app from "./server/app.js";
import configObj from "./configs/env.config.js";

const { port } = configObj;

app.listen(port, () => {
	console.log(`Listening on port ${port}.`);
});
