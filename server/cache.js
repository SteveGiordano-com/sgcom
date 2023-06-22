import redis from "redis";
import configObj from "../configs/env.config.js";

const { redisUrl } = configObj;

const redisClient = redis.createClient({
	"url": redisUrl,
	"socket": {
	  "tls": true,
	  "rejectUnauthorized": false,
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
