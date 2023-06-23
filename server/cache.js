import redis from "redis";
import configObj from "../configs/env.config.js";

const { redisUrl, environment } = configObj;
const isProd = environment === "production";

const redisClient = redis.createClient({
	"url": redisUrl,
	"socket": {
	  "tls": isProd,
	  "rejectUnauthorized": !isProd,
	}
});

redisClient.on("error", (error) => {
	console.error(`Redis: ${error} using ${redisUrl}`);
});

try {
	await redisClient.connect();
} catch (error) {
	console.log(error);
}

export default redisClient;
